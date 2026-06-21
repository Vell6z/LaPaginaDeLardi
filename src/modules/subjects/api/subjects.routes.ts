import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { Subject } from '../../../core/database/models/Subject.js';
import { Session } from '../../../core/database/models/Session.js';
import { Reminder } from '../../../core/database/models/Reminder.js';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';
import sessionsRoutes from './sessions.routes.js';
import fs from 'fs';
import path from 'path';

const router = Router();

// Límite de peticiones para evitar DoS y saturación
const subjectsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP en esta ruta
  message: { message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
});

// Proteger todas las rutas de este router
router.use(protect);
router.use(subjectsLimiter);

// Montar rutas de sesiones (interior de la materia)
router.use('/:subjectId/sessions', sessionsRoutes);

import { Session } from '../../../core/database/models/Session.js';

// Obtener todas las materias del usuario
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const subjects = await Subject.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    
    // Adjuntar el conteo de sesiones/clases a cada materia
    const subjectsWithCount = await Promise.all(subjects.map(async (subject) => {
      const count = await Session.countDocuments({ subjectId: subject._id });
      return { ...subject, sessionsCount: count };
    }));

    res.json(subjectsWithCount);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ message: 'Error al obtener materias' });
  }
});

// Obtener una materia específica por su ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de materia inválido' });
      return;
    }
    const subject = await Subject.findOne({ _id: id, userId: req.userId });
    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada' });
      return;
    }
    res.json(subject);
  } catch (error) {
    console.error('Error al obtener materia:', error);
    res.status(500).json({ message: 'Error al obtener materia' });
  }
});

// Crear una nueva materia
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, professor, semester, colorId, iconId } = req.body;

    if (!name || !semester) {
      res.status(400).json({ message: 'Nombre y semestre son obligatorios' });
      return;
    }

    if (name.length > 50) {
      res.status(400).json({ message: 'El nombre de la materia no puede exceder 50 caracteres' });
      return;
    }

    if (professor && professor.length > 50) {
      res.status(400).json({ message: 'El nombre del profesor no puede exceder 50 caracteres' });
      return;
    }

    const newSubject = new Subject({
      userId: req.userId,
      name,
      professor,
      semester,
      colorId,
      iconId
    });

    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error('Error al crear materia:', error);
    res.status(500).json({ message: 'Error al crear la materia' });
  }
});

// Actualizar una materia existente (incluye marcar como favorita/archivada)
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de materia inválido' });
      return;
    }

    if (updateData.name && updateData.name.length > 50) {
      res.status(400).json({ message: 'El nombre de la materia no puede exceder 50 caracteres' });
      return;
    }

    if (updateData.professor && updateData.professor.length > 50) {
      res.status(400).json({ message: 'El nombre del profesor no puede exceder 50 caracteres' });
      return;
    }

    // Asegurarse de que la materia pertenece al usuario
    const subject = await Subject.findOne({ _id: id, userId: req.userId });

    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada o no autorizada' });
      return;
    }

    // Actualizar campos
    if (updateData.name !== undefined) subject.name = updateData.name;
    if (updateData.professor !== undefined) subject.professor = updateData.professor;
    if (updateData.semester !== undefined) subject.semester = updateData.semester;
    if (updateData.colorId !== undefined) subject.colorId = updateData.colorId;
    if (updateData.iconId !== undefined) subject.iconId = updateData.iconId;
    if (updateData.isFavorite !== undefined) subject.isFavorite = updateData.isFavorite;
    if (updateData.isArchived !== undefined) subject.isArchived = updateData.isArchived;

    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error('Error al actualizar materia:', error);
    res.status(500).json({ message: 'Error al actualizar la materia' });
  }
});

// Eliminar una materia
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID de materia inválido' });
      return;
    }

    const subject = await Subject.findOne({ _id: id, userId: req.userId });

    if (!subject) {
      res.status(404).json({ message: 'Materia no encontrada o no autorizada' });
      return;
    }

    // Buscar todas las sesiones asociadas
    const sessions = await Session.find({ subjectId: id });
    const filesToDelete: string[] = [];

    // Recopilar todos los archivos físicos de cada sesión
    sessions.forEach(session => {
      if (session.media?.audioUrl) filesToDelete.push(session.media.audioUrl);
      if (session.media?.videoUrl) filesToDelete.push(session.media.videoUrl);
      if (session.media?.pdfOrImagesUrls) filesToDelete.push(...session.media.pdfOrImagesUrls);
    });

    // Borrar archivos físicos
    filesToDelete.forEach(fileUrl => {
      try {
        const filePath = path.join(process.cwd(), 'public', fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error al borrar archivo físico de sesión:', e);
      }
    });

    // Borrar dependencias en base de datos
    await Reminder.deleteMany({ subjectId: id });
    await Session.deleteMany({ subjectId: id });

    // Borrar la materia
    await subject.deleteOne();

    res.json({ message: 'Materia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar materia:', error);
    res.status(500).json({ message: 'Error al eliminar la materia' });
  }
});

export default router;
