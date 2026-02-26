import mongoose, { Schema, Types } from 'mongoose';

export interface NoteDocument extends mongoose.Document {
  title: string;
  description: string;
  fileId: string;
  fileUrl: string;
  campus: string;
  authorId: Types.ObjectId;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  downloads: number;
  views: number;
}

const NoteSchema = new Schema<NoteDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileId: { type: String, required: true },
    fileUrl: { type: String, required: true },
    campus: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'PENDING' },
    rejectionReason: { type: String },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const NoteModel = mongoose.model<NoteDocument>('Note', NoteSchema);
