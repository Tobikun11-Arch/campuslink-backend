import { ApiError } from '../utils/errors';
import { generateToken } from '../utils/tokenGenerator';
import { sectionRepository } from '../repositories/section.repository';

export const sectionService = {
  async createInvite(sectionId: string) {
    const group = await sectionRepository.findById(sectionId);
    if (!group) {
      throw new ApiError(404, 'SECTION_NOT_FOUND', 'Section not found');
    }

    const inviteToken = generateToken(16);
    const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await sectionRepository.updateInvite(sectionId, inviteToken, inviteExpiry);

    return { inviteToken, inviteExpiry };
  },

  async join(sectionId: string, userId: string, token: string) {
    const group = await sectionRepository.findById(sectionId);
    if (!group) {
      throw new ApiError(404, 'SECTION_NOT_FOUND', 'Section not found');
    }

    if (group.inviteToken !== token || group.inviteExpiry < new Date()) {
      throw new ApiError(400, 'INVITE_EXPIRED', 'Invite token is invalid or expired');
    }

    await sectionRepository.addMember(sectionId, userId);
  }
};
