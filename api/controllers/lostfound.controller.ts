import { Request, Response, NextFunction } from 'express';
import { lostFoundService } from '../services/lostfound.service';

export const lostFoundController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lostFoundService.create({
        itemTitle: req.body.itemTitle,
        description: req.body.description,
        location: req.body.location,
        finderId: req.user!.userId,
        file: req.file
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
