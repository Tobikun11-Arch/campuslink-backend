import {Request, Response, NextFunction} from 'express';
import {eventsService} from '../services/events.service';

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
      const event = await eventsService.create({
        ...req.body,
        organizerId: req.user!.userId
      });
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  },
  async rsvp(req: Request, res: Response, next: NextFunction) {
    try {
      await eventsService.rsvp(req.params.id, req.user!.userId);
      res.status(200).json({message: 'RSVP confirmed'});
    } catch (error) {
      next(error);
    }
  },
  async unrsvp(req: Request, res: Response, next: NextFunction) {
    try {
      await eventsService.unrsvp(req.params.id, req.user!.userId);
      res.status(200).json({message: 'RSVP removed'});
    } catch (error) {
      next(error);
    }
  }
};
