import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Session } from '../../../core/database/models/Session.js';
import { Subject } from '../../../core/database/models/Subject.js';
import { protect, AuthRequest } from '../../../core/middlewares/auth.middleware.js';

const router = Router();

// Límite de peticiones para rutas globales (ej. Dashboard)
const globalSessionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de 200 peticiones por IP
  message: { message: 'Demasiadas recargas en el dashboard. Intenta de nuevo más tarde.' }
});

router.use(protect);
router.use(globalSessionsLimiter);

// Obtener todas las sesiones recientes del usuario (de cualquier materia)
router.get('/recent', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userSubjects = await Subject.find({ userId: req.userId }).select('_id name');
    const subjectIds = userSubjects.map(s => s._id);

    const recentSessions = await Session.find({ subjectId: { $in: subjectIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(recentSessions);
  } catch (error) {
    console.error('Error al obtener sesiones recientes:', error);
    res.status(500).json({ message: 'Error al obtener sesiones recientes' });
  }
});

// Obtener sesiones para un mes en particular
router.get('/calendar', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      res.status(400).json({ message: 'Se requiere año (year) y mes (month)' });
      return;
    }

    const y = parseInt(year as string);
    const m = parseInt(month as string) - 1; // 0-indexed para JS Date

    const startDate = new Date(y, m, 1);
    const endDate = new Date(y, m + 1, 1);

    const userSubjects = await Subject.find({ userId: req.userId }).select('_id name colorId iconId');
    const subjectIds = userSubjects.map(s => s._id);

    const sessions = await Session.find({
      subjectId: { $in: subjectIds },
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 }).lean();

    res.json(sessions);
  } catch (error) {
    console.error('Error al obtener sesiones de calendario:', error);
    res.status(500).json({ message: 'Error al obtener calendario' });
  }
});

export default router;
