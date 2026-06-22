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
  driveFolderId?: string;
  media: {
    materials: { name: string; url: string; fileId: string; mimeType: string }[];
    audios: { name: string; url: string; fileId: string }[];
    videoUrl?: string;
    rawText?: string;
    // Legacy fields
    pdfOrImagesUrls?: string[];
    audioUrl?: string;
    driveFileIds?: { [fileName: string]: string };
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
  driveFolderId: { type: String },
  media: {
    materials: [{
      name: { type: String },
      url: { type: String },
      fileId: { type: String },
      mimeType: { type: String }
    }],
    audios: [{
      name: { type: String },
      url: { type: String },
      fileId: { type: String }
    }],
    videoUrl: { type: String },
    rawText: { type: String },
    pdfOrImagesUrls: [{ type: String }],
    audioUrl: { type: String },
    driveFileIds: { type: Map, of: String }
  },
  aiContent: {
    transcript: { type: String },
    summary: { type: String },
    smartHighlights: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
