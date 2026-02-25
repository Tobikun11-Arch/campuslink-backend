import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/Notification.model';

export const notificationsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationModel.find({ recipientIds: req.user!.userId })
        .sort({ timestamp: -1 })
        .limit(50)
        .exec();
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  }
};
