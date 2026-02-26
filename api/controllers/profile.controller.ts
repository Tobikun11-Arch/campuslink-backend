import {Request, Response, NextFunction} from 'express';
import {profileService} from '../services/profile.service';

export const profileController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getMe(req.user!.userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      await profileService.updateMe(req.user!.userId, {
        course: req.body.course,
        yearLevel: req.body.yearLevel,
        bio: req.body.bio,
        interests: req.body.interests
      });
      res.status(200).json({message: 'Profile updated'});
    } catch (error) {
      next(error);
    }
  },

  async listFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const followers = await profileService.listFollowers(req.params.id, req.query);
      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  async listFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const following = await profileService.listFollowing(req.params.id, req.query);
      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      await profileService.follow(req.user!.userId, req.params.id);
      res.status(200).json({message: 'Followed'});
    } catch (error) {
      next(error);
    }
  },

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      await profileService.unfollow(req.user!.userId, req.params.id);
      res.status(200).json({message: 'Unfollowed'});
    } catch (error) {
      next(error);
    }
  }
};
