import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request de Express para incluir el userId
export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Extraer el token de las cookies HttpOnly
  if (req.cookies && req.cookies.lardi_token) {
    token = req.cookies.lardi_token;
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lardi_super_secret_key_2026') as { id: string };
    
    // Adjuntar el ID del usuario a la request
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};
