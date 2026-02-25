import mongoose, { Schema, Types } from 'mongoose';

export interface MarketplaceDocument extends mongoose.Document {
  itemTitle: string;
  description: string;
  price?: number;
  sellerId: Types.ObjectId;
  imageFileIds: string[];
  imageUrls: string[];
  campusZoneReminder: string;
  status: 'ACTIVE' | 'REPORTED' | 'BLOCKED';
  reports: Types.ObjectId[];
  adminAction?: string;
  moderatedBy?: Types.ObjectId;
}

const MarketplaceSchema = new Schema<MarketplaceDocument>(
  {
    itemTitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageFileIds: [{ type: String }],
    imageUrls: [{ type: String }],
    campusZoneReminder: { type: String, default: 'Please transact within campus zones only.' },
    status: { type: String, default: 'ACTIVE' },
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    adminAction: { type: String },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const MarketplaceModel = mongoose.model<MarketplaceDocument>('Marketplace', MarketplaceSchema);
