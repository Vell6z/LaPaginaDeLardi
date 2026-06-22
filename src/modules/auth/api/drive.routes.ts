import { Router, Response } from 'express';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';
import { User } from '../../../core/database/models/User.js';
import { GoogleDriveService } from '../../../core/services/googledrive.service.js';

const router = Router();

router.use(protect);

router.post('/link', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ message: 'Authorization code es requerido' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Intercambiar código por tokens
    const tokens = await GoogleDriveService.exchangeCodeForTokens(code);
    
    user.googleDriveInfo = {
      accessToken: tokens.access_token || '',
      refreshToken: tokens.refresh_token || '',
      isLinked: true,
      linkedAt: new Date()
    };
    await user.save(); // Save tokens first to get auth client

    // Inicializar carpeta raíz
    const authClient = await GoogleDriveService.getAuthClient(user._id as string);
    const rootFolderId = await GoogleDriveService.initializeRootFolder(authClient);
    
    user.googleDriveInfo.rootFolderId = rootFolderId;
    await user.save();

    res.json({ message: 'Google Drive vinculado exitosamente', rootFolderId });
  } catch (error: any) {
    console.error('Error al vincular Drive:', error);
    res.status(500).json({ message: 'Error al vincular con Google Drive' });
  }
});

router.post('/unlink', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Optionally revoke tokens here, but simple unlink is enough for now
    user.googleDriveInfo = {
      isLinked: false
    };
    await user.save();

    res.json({ message: 'Google Drive desvinculado exitosamente' });
  } catch (error) {
    console.error('Error al desvincular Drive:', error);
    res.status(500).json({ message: 'Error al desvincular Google Drive' });
  }
});

router.get('/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (!user.googleDriveInfo?.isLinked) {
      res.json({ isLinked: false });
      return;
    }

    const authClient = await GoogleDriveService.getAuthClient(user._id as string);
    const quota = await GoogleDriveService.getStorageQuota(authClient);

    res.json({
      isLinked: true,
      linkedAt: user.googleDriveInfo.linkedAt,
      storage: quota
    });
  } catch (error: any) {
    console.error('Error al obtener status de Drive:', error);
    if (error.message === 'invalid_grant' || error.response?.status === 401) {
       // Token revocado u obsoleto
       res.json({ isLinked: false, error: 'invalid_grant' });
    } else {
       res.status(500).json({ message: 'Error al obtener estado de Drive' });
    }
  }
});

router.get('/check/:fileId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.googleDriveInfo?.isLinked) {
       res.status(403).json({ exists: false });
       return;
    }
    const authClient = await GoogleDriveService.getAuthClient(user._id as string);
    const exists = await GoogleDriveService.checkFileExists(authClient, req.params.fileId);
    
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar archivo' });
  }
});

export default router;
