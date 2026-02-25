import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';

export const profileController = {
  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      await profileService.follow(req.user!.userId, req.params.id);
      res.status(200).json({ message: 'Followed' });
    } catch (error) {
      next(error);
    }
  },

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      await profileService.unfollow(req.user!.userId, req.params.id);
      res.status(200).json({ message: 'Unfollowed' });
    } catch (error) {
      next(error);
    }
  }
};
