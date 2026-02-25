import mongoose, { Schema, Types } from 'mongoose';

export interface SectionGroupDocument extends mongoose.Document {
  sectionName: string;
  presidentId: Types.ObjectId;
  members: Types.ObjectId[];
  inviteToken: string;
  inviteExpiry: Date;
}

const SectionGroupSchema = new Schema<SectionGroupDocument>(
  {
    sectionName: { type: String, required: true },
    presidentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    inviteToken: { type: String, required: true },
    inviteExpiry: { type: Date, required: true }
  },
  { timestamps: true }
);

export const SectionGroupModel = mongoose.model<SectionGroupDocument>('SectionGroup', SectionGroupSchema);
