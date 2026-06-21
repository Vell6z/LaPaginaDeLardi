import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  professor?: string;
  semester: number;
  colorId: string;
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  professor: { type: String },
  semester: { type: Number, required: true },
  colorId: { type: String, default: 'moss' }, 
  createdAt: { type: Date, default: Date.now }
});

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
