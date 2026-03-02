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
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await lostFoundService.list(req.query);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await lostFoundService.getById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },

  async markRetrieved(req: Request, res: Response, next: NextFunction) {
    try {
      const retrievedBy = req.body.retrievedBy ?? req.user!.userId;
      await lostFoundService.markRetrieved(req.params.id, retrievedBy);
      res.status(200).json({ message: 'Retrieved' });
    } catch (error) {
      next(error);
    }
  }
};
