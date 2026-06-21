import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  preferences: {
    transcriptionEnabled: boolean;
    smartHighlight: boolean;
    summaryMode: 'Corto' | 'Medio' | 'Largo';
    aiTone: 'Académico' | 'Sencillo' | 'Técnico';
    themeMode: string;
    accentColor: string;
  };
  googleDriveInfo?: {
    accessToken?: string;
    refreshToken?: string;
  };
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  unverifiedExpiresAt?: Date; // For 24h TTL auto-delete
  resetPasswordCode?: string;
  resetPasswordExpiresAt?: Date;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    transcriptionEnabled: { type: Boolean, default: true },
    smartHighlight: { type: Boolean, default: true },
    summaryMode: { type: String, enum: ['Corto', 'Medio', 'Largo'], default: 'Largo' },
    aiTone: { type: String, enum: ['Académico', 'Sencillo', 'Técnico'], default: 'Académico' },
    themeMode: { type: String, default: 'Sistema' },
    accentColor: { type: String, default: 'moss' }
  },
  googleDriveInfo: {
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpiresAt: { type: Date },
  unverifiedExpiresAt: { type: Date, expires: 0 }, // MongoDB TTL Index
  resetPasswordCode: { type: String },
  resetPasswordExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
