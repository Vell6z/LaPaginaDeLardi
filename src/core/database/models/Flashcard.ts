import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  sessionId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  nextReviewDate: Date;
  masteryLevel: number;
}

const FlashcardSchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  nextReviewDate: { type: Date, default: Date.now },
  masteryLevel: { type: Number, default: 0 }, 
});

export const Flashcard = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);
