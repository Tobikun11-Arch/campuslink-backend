import { Request, Response, NextFunction } from 'express';
import { eventsService } from '../services/events.service';

export const eventsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventsService.list(req.query);
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventsService.create({ ...req.body, organizerId: req.user!.userId });
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }
};