import { ApiError } from '../utils/errors';
import { userRepository } from '../repositories/user.repository';

export const profileService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    return {
      id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      campus: user.campus,
      course: user.course ?? '',
      yearLevel: user.yearLevel ?? '',
      bio: user.bio ?? '',
      interests: user.interests ?? [],
      followers: user.followers ?? [],
      following: user.following ?? [],
      badges: user.badges ?? [],
      contributionScore: user.contributionScore ?? 0,
      globalRank: user.globalRank ?? 0,
      reputationScore: user.reputationScore ?? 0
    };
  },

  async updateMe(
    userId: string,
    data: { course?: string; yearLevel?: string; bio?: string; interests?: string[] }
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    await userRepository.updateProfile(userId, {
      course: data.course,
      yearLevel: data.yearLevel,
      bio: data.bio,
      interests: data.interests
    });
  },

  async listFollowers(userId: string, query: { limit?: string; page?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    const followers = await userRepository.listByIds(
      (user.followers ?? []).map((id) => String(id)),
      { limit, skip }
    );

    return followers.map((follower) => ({
      id: String(follower._id),
      firstName: follower.firstName,
      lastName: follower.lastName,
      campus: follower.campus,
      course: follower.course ?? '',
      yearLevel: follower.yearLevel ?? '',
      bio: follower.bio ?? '',
      badges: follower.badges ?? [],
      contributionScore: follower.contributionScore ?? 0,
      globalRank: follower.globalRank ?? 0,
      reputationScore: follower.reputationScore ?? 0
    }));
  },

  async listFollowing(userId: string, query: { limit?: string; page?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    const following = await userRepository.listByIds(
      (user.following ?? []).map((id) => String(id)),
      { limit, skip }
    );

    return following.map((followed) => ({
      id: String(followed._id),
      firstName: followed.firstName,
      lastName: followed.lastName,
      campus: followed.campus,
      course: followed.course ?? '',
      yearLevel: followed.yearLevel ?? '',
      bio: followed.bio ?? '',
      badges: followed.badges ?? [],
      contributionScore: followed.contributionScore ?? 0,
      globalRank: followed.globalRank ?? 0,
      reputationScore: followed.reputationScore ?? 0
    }));
  },

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
