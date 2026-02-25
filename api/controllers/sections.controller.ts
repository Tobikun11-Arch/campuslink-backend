import { Request, Response, NextFunction } from 'express';
import { sectionService } from '../services/section.service';

export const sectionsController = {
  async createInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sectionService.createInvite(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async join(req: Request, res: Response, next: NextFunction) {
    try {
      await sectionService.join(req.params.id, req.user!.userId, req.body.token);
      res.status(200).json({ message: 'Joined' });
    } catch (error) {
      next(error);
    }
  }
};
