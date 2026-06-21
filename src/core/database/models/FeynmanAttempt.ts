import mongoose, { Schema, Document } from 'mongoose';

export interface IFeynmanAttempt extends Document {
  flashcardId: mongoose.Types.ObjectId;
  userExplanation: string;
  aiFeedback?: string;
  score?: number;
  createdAt: Date;
}

const FeynmanAttemptSchema: Schema = new Schema({
  flashcardId: { type: Schema.Types.ObjectId, ref: 'Flashcard', required: true },
  userExplanation: { type: String, required: true },
  aiFeedback: { type: String },
  score: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export const FeynmanAttempt = mongoose.model<IFeynmanAttempt>('FeynmanAttempt', FeynmanAttemptSchema);
