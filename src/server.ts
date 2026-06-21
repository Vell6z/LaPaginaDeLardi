import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { connectDB } from './core/database/connection.js';
import authRoutes from './modules/auth/api/auth.routes.js';
import subjectsRoutes from './modules/subjects/api/subjects.routes.js';
import globalSessionsRoutes from './modules/subjects/api/globalSessions.routes.js';
import remindersRoutes from './modules/calendar/api/reminders.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Servir archivos subidos de manera estática
app.use('/uploads', express.static('public/uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/sessions', globalSessionsRoutes);
app.use('/api/reminders', remindersRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
