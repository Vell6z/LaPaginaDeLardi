import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { User } from '../database/models/User.js';

export const requireDrive = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleDriveInfo?.isLinked) {
      res.status(403).json({ 
        message: 'Acceso denegado: Se requiere vincular Google Drive para usar esta función',
        requiresDrive: true 
      });
      return;
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar vinculación de Google Drive' });
  }
};
