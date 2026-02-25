import mongoose, { Schema, Types } from 'mongoose';

export interface ActivityDocument extends mongoose.Document {
  type: string;
  referenceId: Types.ObjectId;
  userId: Types.ObjectId;
  timestamp: Date;
  action: string;
}

const ActivitySchema = new Schema<ActivityDocument>(
  {
    type: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true }
  },
  { timestamps: true }
);

export const ActivityModel = mongoose.model<ActivityDocument>('Activity', ActivitySchema);
