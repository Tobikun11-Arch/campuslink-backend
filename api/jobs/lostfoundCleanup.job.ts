// I remove expired lost and found posts after badge updates are recorded
import { LostFoundModel } from '../models/LostFound.model';

// I remove expired lost and found posts after badge updates are recorded
export async function cleanupExpiredLostFound() {
  const now = new Date();
  await LostFoundModel.deleteMany({ expiryDate: { $lte: now } }).exec();
}
