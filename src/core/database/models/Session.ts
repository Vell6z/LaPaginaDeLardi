import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  subjectId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  status: string;
  isHighlighted: boolean;
  media: {
    pdfOrImagesUrls: string[];
    audioUrl?: string;
    videoUrl?: string;
    rawText?: string;
  };
  aiContent: {
    transcript?: string;
    summary?: string;
    smartHighlights: string[];
  };
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: '0h 00m' },
  type: { type: String, default: 'Clase' },
  status: { type: String, default: 'Pendiente de Repaso' },
  isHighlighted: { type: Boolean, default: false },
  media: {
    pdfOrImagesUrls: [{ type: String }],
    audioUrl: { type: String },
    videoUrl: { type: String },
    rawText: { type: String }
  },
  aiContent: {
    transcript: { type: String },
    summary: { type: String },
    smartHighlights: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
