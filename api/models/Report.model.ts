import mongoose, { Schema, Types } from 'mongoose';

export interface ReportDocument extends mongoose.Document {
  reporterId: Types.ObjectId;
  targetId: Types.ObjectId;
  reportedUserId?: Types.ObjectId;
  reason: string;
  status: 'OPEN' | 'RESOLVED';
}

const ReportSchema = new Schema<ReportDocument>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reportedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
    status: { type: String, default: 'OPEN' }
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<ReportDocument>('Report', ReportSchema);
