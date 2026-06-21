import { Router, Response } from 'express';
import { Reminder } from '../../../core/database/models/Reminder.js';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
router.use(limiter);
router.use(protect);

// GET: Recordatorios por mes
router.get('/calendar', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      res.status(400).json({ message: 'Se requiere año (year) y mes (month)' });
      return;
    }

    const y = parseInt(year as string);
    const m = parseInt(month as string) - 1;

    const startDate = new Date(y, m, 1);
    const endDate = new Date(y, m + 1, 1);

    const reminders = await Reminder.find({
      userId: req.userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 }).lean();

    res.json(reminders);
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    res.status(500).json({ message: 'Error al obtener recordatorios' });
  }
});

// POST: Crear recordatorio
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, time, type, subjectId } = req.body;

    if (!title || !date || !time) {
      res.status(400).json({ message: 'Título, fecha y hora son obligatorios' });
      return;
    }

    // Validar que subjectId sea válido si se proporciona
    if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) {
      res.status(400).json({ message: 'ID de materia inválido' });
      return;
    }

    const reminder = await Reminder.create({
      userId: req.userId,
      subjectId: subjectId || undefined,
      title,
      description,
      date: new Date(date),
      time,
      type: type || 'Recordatorio'
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error al crear recordatorio:', error);
    res.status(500).json({ message: 'Error al crear recordatorio' });
  }
});

// PUT: Marcar como completado / actualizar
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.time !== undefined) updateData.time = req.body.time;
    if (req.body.type !== undefined) updateData.type = req.body.type;
    if (req.body.isCompleted !== undefined) updateData.isCompleted = req.body.isCompleted;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updateData },
      { new: true }
    );

    if (!reminder) {
      res.status(404).json({ message: 'Recordatorio no encontrado' });
      return;
    }

    res.json(reminder);
  } catch (error) {
    console.error('Error al actualizar recordatorio:', error);
    res.status(500).json({ message: 'Error al actualizar recordatorio' });
  }
});

// DELETE: Eliminar recordatorio
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const reminder = await Reminder.findOneAndDelete({ _id: id, userId: req.userId });

    if (!reminder) {
      res.status(404).json({ message: 'Recordatorio no encontrado' });
      return;
    }

    res.json({ message: 'Recordatorio eliminado' });
  } catch (error) {
    console.error('Error al eliminar recordatorio:', error);
    res.status(500).json({ message: 'Error al eliminar recordatorio' });
  }
});

export default router;
