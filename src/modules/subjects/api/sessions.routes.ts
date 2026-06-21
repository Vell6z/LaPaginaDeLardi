import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { Session } from '../../../core/database/models/Session.js';
import { Subject } from '../../../core/database/models/Subject.js';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';
import { upload } from '../../../core/middlewares/upload.middleware.js';
import { Reminder } from '../../../core/database/models/Reminder.js';
import fs from 'fs';
import path from 'path';

// Usar mergeParams para acceder a :subjectId desde la ruta principal
const router = Router({ mergeParams: true });

const sessionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
});

router.use(protect);
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
      isHighlighted: false
    });

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
    if (updateData.title !== undefined) session.title = updateData.title;
    if (updateData.type !== undefined) session.type = updateData.type;
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

    // Borrar archivos físicos
    const filesToDelete: string[] = [];
    if (session.media?.audioUrl) filesToDelete.push(session.media.audioUrl);
    if (session.media?.videoUrl) filesToDelete.push(session.media.videoUrl);
    if (session.media?.pdfOrImagesUrls) filesToDelete.push(...session.media.pdfOrImagesUrls);

    filesToDelete.forEach(fileUrl => {
      try {
        const filePath = path.join(process.cwd(), 'public', fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error al borrar archivo físico:', e);
      }
    });

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

    const fileUrl = `/uploads/audio/${req.file.filename}`;
    session.media.audioUrl = fileUrl;
    await session.save();

    res.json({ message: 'Audio subido exitosamente', url: fileUrl });
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

    const fileUrl = `/uploads/video/${req.file.filename}`;
    session.media.videoUrl = fileUrl;
    await session.save();

    res.json({ message: 'Video subido exitosamente', url: fileUrl });
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

    const fileUrls = (req.files as Express.Multer.File[]).map(file => `/uploads/documents/${file.filename}`);
    
    // Concatenar con los existentes
    session.media.pdfOrImagesUrls = [...(session.media.pdfOrImagesUrls || []), ...fileUrls];
    await session.save();

    res.json({ message: 'Documentos subidos exitosamente', urls: fileUrls });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ message: 'Error al procesar los documentos' });
  }
});

export default router;
