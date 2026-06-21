import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, code: string, name: string) => {
  const mailOptions = {
    from: `"LardIA" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Tu código de autenticación - La Página de Lardi',
    html: `
      <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 40px; background-color: #F9F6F0; color: #112613; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4A6342; margin-bottom: 5px;">¡Hola, ${name}!</h1>
          <p style="font-size: 16px; color: #6D5B4D;">Bienvenido a La Página de Lardi</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #D5C2A5; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <p style="font-size: 16px; margin-bottom: 20px;">Tu código de verificación de 6 dígitos es:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #4A6342; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #8A7361; margin-top: 20px;">
            Este código expirará en 15 minutos.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #8A7361;">
          <p>Si no fuiste tú quien solicitó este código, puedes ignorar este correo.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
};

export const sendPasswordResetEmail = async (to: string, code: string, name: string) => {
  const mailOptions = {
    from: `"LardIA" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña - La Página de Lardi',
    html: `
      <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 40px; background-color: #F9F6F0; color: #112613; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4A6342; margin-bottom: 5px;">¡Hola, ${name}!</h1>
          <p style="font-size: 16px; color: #6D5B4D;">Recibimos una solicitud para restablecer tu contraseña.</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #D5C2A5; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <p style="font-size: 16px; margin-bottom: 20px;">Tu código de recuperación de 6 dígitos es:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #4A6342; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #8A7361; margin-top: 20px;">
            Este código expirará en 15 minutos.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #8A7361;">
          <p>Si no solicitaste este cambio, por favor ignora este correo y asegúrate de que tu cuenta esté protegida.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('No se pudo enviar el correo de recuperación');
  }
};
