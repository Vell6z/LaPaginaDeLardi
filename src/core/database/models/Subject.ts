import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  professor?: string;
  semester: number;
  colorId: string;
  iconId: string;
  isFavorite: boolean;
  isArchived: boolean;
  driveFolderId?: string;
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  professor: { type: String },
  semester: { type: String, required: true }, // Changed to String to match frontend "4to Semestre"
  colorId: { type: String, default: 'bg-moss-500' }, 
  iconId: { type: String, default: 'math' },
  isFavorite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  driveFolderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
