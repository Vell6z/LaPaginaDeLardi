import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  subjectId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  noteType?: string;
  media: {
    pdfOrImagesUrls: string[];
    audioUrl?: string;
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
  noteType: { type: String },
  media: {
    pdfOrImagesUrls: [{ type: String }],
    audioUrl: { type: String },
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
