import mongoose, { Schema, Types } from 'mongoose';

export interface EventDocument extends mongoose.Document {
  title: string;
  description: string;
  dateTime: Date;
  campus: string;
  type?: string;
  organizerId: Types.ObjectId;
  capacity?: number;
  attendingCount: number;
  participants: Types.ObjectId[];
}

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    campus: { type: String, required: true },
    type: { type: String },
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    capacity: { type: Number },
    attendingCount: { type: Number, default: 0 },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

EventSchema.index({ campus: 1, dateTime: 1, type: 1 });

export const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
