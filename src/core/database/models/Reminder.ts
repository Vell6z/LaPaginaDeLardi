import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  time: string;
  type: string; // 'Recordatorio', 'Entrega', 'Parcial', 'Estudio'
  isCompleted: boolean;
  createdAt: Date;
}

const ReminderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, default: 'Recordatorio' },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);
