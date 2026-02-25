import mongoose, { Schema, Types } from 'mongoose';

export interface AuditLogDocument extends mongoose.Document {
  actorId: Types.ObjectId;
  action: string;
  targetId?: Types.ObjectId;
  details?: Record<string, unknown>;
  timestamp: Date;
}

const AuditLogSchema = new Schema<AuditLogDocument>({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLogModel = mongoose.model<AuditLogDocument>('AuditLog', AuditLogSchema);
