import mongoose, { Schema, Types } from 'mongoose';

export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  campus: string;
  course?: string;
  yearLevel?: string;
  bio?: string;
  interests?: string[];
  role: 'NORMAL' | 'OFFICER' | 'PRESIDENT' | 'ADMIN';
  roleProofFileId?: string;
  roleProofUrl?: string;
  roleStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationCode?: string;
  verificationExpiry?: Date;
  isVerified: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  contributionScore: number;
  globalRank: number;
  reputationScore: number;
  tradeCount: number;
  badges: string[];
}

const UserSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    campus: { type: String, required: true },
    course: { type: String },
    yearLevel: { type: String },
    bio: { type: String, default: '' },
    interests: [{ type: String }],
    role: { type: String, default: 'NORMAL' },
    roleProofFileId: { type: String },
    roleProofUrl: { type: String },
    roleStatus: { type: String, default: 'PENDING' },
    verificationCode: { type: String },
    verificationExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    contributionScore: { type: Number, default: 0 },
    globalRank: { type: Number, default: 0 },
    reputationScore: { type: Number, default: 0 },
    tradeCount: { type: Number, default: 0 },
    badges: [{ type: String }]
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
