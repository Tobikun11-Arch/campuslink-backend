import { ApiError } from '../utils/errors';
import { userRepository } from '../repositories/user.repository';

export const profileService = {
  async follow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new ApiError(400, 'SELF_FOLLOW', 'You cannot follow yourself');
    }

    await userRepository.addFollowing(userId, targetId);
    await userRepository.addFollower(targetId, userId);
  },

  async unfollow(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new ApiError(400, 'SELF_FOLLOW', 'You cannot unfollow yourself');
    }

    await userRepository.removeFollowing(userId, targetId);
    await userRepository.removeFollower(targetId, userId);
  }
};
