import { Request, Response, NextFunction } from 'express';
import { marketplaceService } from '../services/marketplace.service';

export const marketplaceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await marketplaceService.list(req.query);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await marketplaceService.create({
        itemTitle: req.body.itemTitle,
        description: req.body.description,
        price: req.body.price ? Number(req.body.price) : undefined,
        sellerId: req.user!.userId,
        files: (req.files as Express.Multer.File[]) ?? []
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async report(req: Request, res: Response, next: NextFunction) {
    try {
      await marketplaceService.report({
        itemId: req.params.id,
        reporterId: req.user!.userId,
        reason: req.body.reason
      });
      res.status(200).json({ message: 'Reported' });
    } catch (error) {
      next(error);
    }
  }
};
