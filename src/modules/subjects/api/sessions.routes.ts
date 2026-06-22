import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { Session } from '../../../core/database/models/Session.js';
import { Subject } from '../../../core/database/models/Subject.js';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';
import { requireDrive } from '../../../core/middlewares/drive.middleware.js';
import { upload } from '../../../core/middlewares/upload.middleware.js';
import { Reminder } from '../../../core/database/models/Reminder.js';
import { GoogleDriveService } from '../../../core/services/googledrive.service.js';

// Usar mergeParams para acceder a :subjectId desde la ruta principal
const router = Router({ mergeParams: true });

const sessionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
});

router.use(protect);
router.use(requireDrive);
router.use(sessionsLimiter);

// Middleware para verificar que la materia pertenece al usuario
const verifySubjectOwnership = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { subjectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      res.status(400).json({ message: 'ID de materia inválido' });
      return;
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.userId });
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada o no autorizada' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar la materia' });
  }
};

router.use(verifySubjectOwnership);

// GET: Obtener todas las sesiones de la materia
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const sessions = await Session.find({ subjectId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    res.status(500).json({ message: 'Error al obtener sesiones' });
  }
});

// GET: Obtener una sesión específica
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de sesión inválido' });
      return;
    }
    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }
    res.json(session);
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    res.status(500).json({ message: 'Error al obtener sesión' });
  }
});

// POST: Crear una nueva sesión
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const { title, date, time, type } = req.body;

    if (!title || !date || !time) {
      res.status(400).json({ message: 'Título, fecha y hora son obligatorios' });
      return;
    }

    if (title.length > 80) {
      res.status(400).json({ message: 'El título no puede exceder 80 caracteres' });
      return;
    }

    const newSession = new Session({
      subjectId,
      title,
      date: new Date(date),
      time,
      type: type || 'Clase',
      status: 'Pendiente de Repaso',
      duration: '0h 00m',
      isHighlighted: false,
      media: {
        materials: [],
        audios: [],
        pdfOrImagesUrls: [],
        driveFileIds: {}
      }
    });

    // Create Drive folder
    try {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.userId });
      if (subject?.driveFolderId) {
        const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
        const folderName = `${type || 'Clase'} - ${title}`;
        const driveFolderId = await GoogleDriveService.createFolder(authClient, folderName, subject.driveFolderId);
        newSession.driveFolderId = driveFolderId;
      }
    } catch (e) {
      console.error('Error creating session drive folder:', e);
    }

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error al crear sesión:', error);
    res.status(500).json({ message: 'Error al crear la sesión' });
  }
});

// PUT: Actualizar una sesión existente
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de sesión inválido' });
      return;
    }

    if (updateData.title && updateData.title.length > 80) {
      res.status(400).json({ message: 'El título no puede exceder 80 caracteres' });
      return;
    }

    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    // Actualizar campos
    if (updateData.title !== undefined || updateData.type !== undefined) {
      const newTitle = updateData.title !== undefined ? updateData.title : session.title;
      const newType = updateData.type !== undefined ? updateData.type : session.type;
      
      if ((newTitle !== session.title || newType !== session.type) && session.driveFolderId) {
        try {
          const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
          const folderName = `${newType} - ${newTitle}`;
          await GoogleDriveService.renameFile(authClient, session.driveFolderId, folderName);
        } catch (e) {
          console.error('Error renaming session drive folder:', e);
        }
      }
      
      if (updateData.title !== undefined) session.title = updateData.title;
      if (updateData.type !== undefined) session.type = updateData.type;
    }
    if (updateData.date !== undefined) session.date = new Date(updateData.date);
    if (updateData.time !== undefined) session.time = updateData.time;
    if (updateData.duration !== undefined) session.duration = updateData.duration;
    if (updateData.status !== undefined) session.status = updateData.status;
    if (updateData.isHighlighted !== undefined) session.isHighlighted = updateData.isHighlighted;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Error al actualizar sesión:', error);
    res.status(500).json({ message: 'Error al actualizar la sesión' });
  }
});

// DELETE: Eliminar una sesión
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de sesión inválido' });
      return;
    }

    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    // Borrar carpeta en Drive
    if (session.driveFolderId) {
      try {
        const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
        await GoogleDriveService.deleteFile(authClient, session.driveFolderId);
      } catch (e) {
        console.error('Error al borrar carpeta de sesión en Drive:', e);
      }
    }

    // Borrar recordatorios asociados
    await Reminder.deleteMany({ sessionId: id });

    // Borrar la sesión
    await session.deleteOne();

    res.json({ message: 'Sesión eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sesión:', error);
    res.status(500).json({ message: 'Error al eliminar la sesión' });
  }
});

// POST: Subir Audio a una sesión
router.post('/:id/media/audio', upload.single('audio'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    
    if (!req.file) {
      res.status(400).json({ message: 'No se subió ningún archivo de audio' });
      return;
    }

    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    if (!session.driveFolderId) {
      res.status(400).json({ message: 'La sesión no tiene carpeta de Drive asociada' });
      return;
    }

    const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
    const { id: fileId, webViewLink } = await GoogleDriveService.uploadFile(
      authClient,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      session.driveFolderId
    );

    if (!session.media.audios) session.media.audios = [];
    session.media.audios.push({
      name: req.file.originalname,
      url: webViewLink,
      fileId: fileId
    });
    
    // Maintain legacy for backwards compatibility briefly
    session.media.audioUrl = webViewLink;
    if (!session.media.driveFileIds) session.media.driveFileIds = {};
    session.media.driveFileIds[req.file.originalname] = fileId;
    
    await session.save();

    res.json({ message: 'Audio subido exitosamente', url: webViewLink });
  } catch (error) {
    console.error('Error al subir audio:', error);
    res.status(500).json({ message: 'Error al procesar el audio' });
  }
});

// POST: Subir Video a una sesión
router.post('/:id/media/video', upload.single('video'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    
    if (!req.file) {
      res.status(400).json({ message: 'No se subió ningún archivo de video' });
      return;
    }

    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    if (!session.driveFolderId) {
      res.status(400).json({ message: 'La sesión no tiene carpeta de Drive asociada' });
      return;
    }

    const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
    const { id: fileId, webViewLink } = await GoogleDriveService.uploadFile(
      authClient,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      session.driveFolderId
    );

    session.media.videoUrl = webViewLink;
    if (!session.media.driveFileIds) session.media.driveFileIds = {};
    session.media.driveFileIds[req.file.originalname] = fileId;
    
    await session.save();

    res.json({ message: 'Video subido exitosamente', url: webViewLink });
  } catch (error) {
    console.error('Error al subir video:', error);
    res.status(500).json({ message: 'Error al procesar el video' });
  }
});

// POST: Subir Materiales (PDFs/Imágenes) a una sesión
router.post('/:id/media/documents', upload.array('documents', 10), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ message: 'No se subieron archivos' });
      return;
    }

    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    if (!session.driveFolderId) {
      res.status(400).json({ message: 'La sesión no tiene carpeta de Drive asociada' });
      return;
    }

    const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
    const fileUrls: string[] = [];
    if (!session.media.driveFileIds) session.media.driveFileIds = {};

    for (const file of req.files as Express.Multer.File[]) {
      const { id: fileId, webViewLink } = await GoogleDriveService.uploadFile(
        authClient,
        file.buffer,
        file.originalname,
        file.mimetype,
        session.driveFolderId
      );
      fileUrls.push(webViewLink);
      session.media.driveFileIds[file.originalname] = fileId;
      
      if (!session.media.materials) session.media.materials = [];
      session.media.materials.push({
        name: file.originalname,
        url: webViewLink,
        fileId: fileId,
        mimeType: file.mimetype
      });
    }
    
    // Concatenar con los existentes legacy
    session.media.pdfOrImagesUrls = [...(session.media.pdfOrImagesUrls || []), ...fileUrls];
    await session.save();

    res.json({ message: 'Documentos subidos exitosamente', urls: fileUrls });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ message: 'Error al procesar los documentos' });
  }
});

// DELETE: Eliminar un archivo específico (audio o material)
router.delete('/:id/media/:fileId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id, fileId } = req.params;
    
    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    // Borrar de Google Drive
    try {
      const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
      await GoogleDriveService.deleteFile(authClient, fileId);
    } catch (e) {
      console.error('Error al borrar archivo en Drive:', e);
      // Continuamos para asegurar que se borre de la DB aunque falle en Drive
    }

    // Borrar de la base de datos
    let deleted = false;
    
    if (session.media.audios) {
      const initialLength = session.media.audios.length;
      session.media.audios = session.media.audios.filter(a => a.fileId !== fileId) as any;
      if (session.media.audios.length !== initialLength) deleted = true;
    }
    
    if (session.media.materials) {
      const initialLength = session.media.materials.length;
      session.media.materials = session.media.materials.filter(m => m.fileId !== fileId) as any;
      if (session.media.materials.length !== initialLength) deleted = true;
    }

    if (deleted) {
      await session.save();
      res.json({ message: 'Archivo eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Archivo no encontrado en la sesión' });
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ message: 'Error al eliminar el archivo' });
  }
});

// PUT: Guardar notas (rawText)
router.put('/:id/media/text', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, id } = req.params;
    const { rawText } = req.body;
    
    const session = await Session.findOne({ _id: id, subjectId });
    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    session.media.rawText = rawText;
    await session.save();

    res.json({ message: 'Notas guardadas exitosamente' });
  } catch (error) {
    console.error('Error al guardar notas:', error);
    res.status(500).json({ message: 'Error al guardar las notas' });
  }
});

// GET: Obtener el contenido de texto de un archivo de Drive
router.get('/:id/media/:fileId/text', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;
    const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
    const content = await GoogleDriveService.getFileTextContent(authClient, fileId);
    res.send(content);
  } catch (error) {
    console.error('Error al obtener contenido del archivo de texto:', error);
    res.status(500).json({ message: 'Error al obtener el contenido' });
  }
});

// PUT: Actualizar el contenido de texto de un archivo de Drive
router.put('/:id/media/:fileId/text', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;
    const authClient = await GoogleDriveService.getAuthClient(req.userId as string);
    await GoogleDriveService.updateFileTextContent(authClient, fileId, content);
    res.json({ message: 'Archivo de texto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar archivo de texto:', error);
    res.status(500).json({ message: 'Error al actualizar el contenido' });
  }
});

export default router;
