import mongoose, { Schema, Types } from 'mongoose';

export interface LostFoundDocument extends mongoose.Document {
  itemTitle: string;
  photoFileId?: string;
  photoUrl?: string;
  description: string;
  location: string;
  finderId: Types.ObjectId;
  status: 'ACTIVE' | 'RETRIEVED';
  retrievedBy?: Types.ObjectId;
  datePosted: Date;
  expiryDate: Date;
}

const LostFoundSchema = new Schema<LostFoundDocument>(
  {
    itemTitle: { type: String, required: true },
    photoFileId: { type: String },
    photoUrl: { type: String },
    description: { type: String, required: true },
    location: { type: String, required: true },
    finderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'ACTIVE' },
    retrievedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    datePosted: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true }
  },
  { timestamps: true }
);

LostFoundSchema.index({ status: 1, expiryDate: 1 });

export const LostFoundModel = mongoose.model<LostFoundDocument>('LostFound', LostFoundSchema);
