// I clean up expired invite links so users cannot join with old tokens
import { SectionGroupModel } from '../models/SectionGroup.model';

// I clean up expired invite links so users cannot join with old tokens
export async function cleanupExpiredInvites() {
  const now = new Date();
  await SectionGroupModel.updateMany(
    { inviteExpiry: { $lte: now } },
    { inviteToken: '', inviteExpiry: now }
  ).exec();
}
