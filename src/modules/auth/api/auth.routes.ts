import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { User } from '../../../core/database/models/User.js';
import { sendVerificationEmail } from '../../../core/services/email.service.js';

const router = Router();

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for auth routes
  message: { message: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde.' }
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs for sending emails
  message: { message: 'Has excedido el límite de correos. Intenta más tarde.' }
});

// Utility functions for validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getPasswordStrength = (password: string) => {
  if (!password || password.length === 0) return 0;
  if (password.length < 5) return 1;
  if (password.length < 8) return 2;
  if (password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/)) return 4;
  return 3;
};

// Secure code generation
const generateCode = () => crypto.randomInt(100000, 1000000).toString();

// Endpoint de Registro
router.post('/register', emailLimiter, async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ message: 'Formato de correo inválido' });
      return;
    }

    if (getPasswordStrength(password) < 2) {
      res.status(400).json({ message: 'La contraseña es demasiado débil' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        res.status(400).json({ message: 'El correo ya está registrado y verificado' });
        return;
      } else {
        // If unverified, we could overwrite or resend, but let's just delete the old unverified one to start fresh
        await User.deleteOne({ email });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const unverifiedExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = new User({
      name,
      email,
      passwordHash,
      isVerified: false,
      verificationCode: code,
      verificationCodeExpiresAt: expiresAt,
      unverifiedExpiresAt: unverifiedExpires
    });

    await newUser.save();
    await sendVerificationEmail(email, code, name);

    res.status(201).json({
      message: 'Código de verificación enviado al correo',
      email: newUser.email
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error del servidor al registrar' });
  }
});

// Endpoint de Verificación
router.post('/verify-email', async (req, res): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'El usuario ya está verificado' });
      return;
    }

    if (user.verificationCode !== code) {
      res.status(400).json({ message: 'Código incorrecto' });
      return;
    }

    if (user.verificationCodeExpiresAt && Date.now() > user.verificationCodeExpiresAt.getTime()) {
      res.status(400).json({ message: 'El código ha expirado' });
      return;
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    user.unverifiedExpiresAt = undefined; // Quitar el TTL de 24 horas

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'lardi_super_secret_key_2026',
      { expiresIn: '7d' }
    );

    // Enviar JWT en Cookie HttpOnly
    res.cookie('lardi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Cuenta verificada exitosamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ message: 'Error del servidor en verificación' });
  }
});

// Endpoint Reenviar Código
router.post('/resend-code', emailLimiter, async (req, res): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'El usuario ya está verificado' });
      return;
    }

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, code, user.name);

    res.json({ message: 'Código reenviado exitosamente' });
  } catch (error) {
    console.error('Error reenviando código:', error);
    res.status(500).json({ message: 'Error del servidor al reenviar' });
  }
});

// Endpoint de Login
router.post('/login', authLimiter, async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: 'Debes verificar tu correo antes de iniciar sesión', requiresVerification: true });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'lardi_super_secret_key_2026',
      { expiresIn: '7d' }
    );

    // Enviar JWT en Cookie HttpOnly
    res.cookie('lardi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error del servidor al iniciar sesión' });
  }
});

// Endpoint Forgot Password (Olvidaste tu llave)
router.post('/forgot-password', emailLimiter, async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'El correo es obligatorio' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Devuelve 200 en vez de 400 para prevenir enumeración de usuarios
      res.status(200).json({ message: 'Si el correo existe, te enviaremos un código de recuperación' });
      return;
    }

    const code = generateCode();
    user.resetPasswordCode = code;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const { sendPasswordResetEmail } = await import('../../../core/services/email.service.js');
    await sendPasswordResetEmail(user.email, code, user.name);

    res.json({ message: 'Si el correo existe, te enviaremos un código de recuperación' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ message: 'Error del servidor al solicitar recuperación' });
  }
});

// Endpoint Reset Password
router.post('/reset-password', authLimiter, async (req, res): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    if (getPasswordStrength(newPassword) < 2) {
      res.status(400).json({ message: 'La contraseña es demasiado débil' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (user.resetPasswordCode !== code) {
      res.status(400).json({ message: 'Código incorrecto' });
      return;
    }

    if (user.resetPasswordExpiresAt && Date.now() > user.resetPasswordExpiresAt.getTime()) {
      res.status(400).json({ message: 'El código ha expirado' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ message: 'Error del servidor al restablecer contraseña' });
  }
});

// Endpoint Logout
router.post('/logout', (req, res): void => {
  res.clearCookie('lardi_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Endpoint Me (Verificar Sesión)
router.get('/me', async (req, res): Promise<void> => {
  try {
    const token = req.cookies.lardi_token;
    if (!token) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lardi_super_secret_key_2026') as { id: string };
    const user = await User.findById(decoded.id).select('-passwordHash -verificationCode -resetPasswordCode');
    
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
});

export default router;
