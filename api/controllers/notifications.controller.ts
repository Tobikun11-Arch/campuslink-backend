import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/Notification.model';
import { notificationService } from '../services/notification.service';

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
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.createNotification({
        type: req.body.type,
        targetAudience: req.body.targetAudience,
        delivery: req.body.delivery,
        senderId: req.user!.userId,
        recipientIds: req.body.recipientIds ?? [],
        title: req.body.title,
        body: req.body.body
      });
      res.status(201).json({ message: 'Notification queued' });
    } catch (error) {
      next(error);
    }
  }
};
