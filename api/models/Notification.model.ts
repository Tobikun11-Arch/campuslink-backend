import mongoose, { Schema, Types } from 'mongoose';

export interface NotificationDocument extends mongoose.Document {
  type: string;
  targetAudience: string;
  delivery: string;
  senderId: Types.ObjectId;
  isRead: boolean;
  timestamp: Date;
  recipientIds: Types.ObjectId[];
  pendingPush: boolean;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    type: { type: String, required: true },
    targetAudience: { type: String, required: true },
    delivery: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    recipientIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pendingPush: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', NotificationSchema);
