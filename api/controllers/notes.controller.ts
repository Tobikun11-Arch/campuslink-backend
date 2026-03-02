import {Request, Response, NextFunction} from 'express';
import {notesService} from '../services/notes.service';

export const notesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notes = await notesService.list(req.query);
      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const note = await notesService.create({
        title: req.body.title,
        description: req.body.description,
        campus: req.body.campus,
        authorId: req.user!.userId,
        file: req.file!
      });
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      await notesService.approve(req.params.id);
      res.status(200).json({message: 'Approved'});
    } catch (error) {
      next(error);
    }
  },

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      await notesService.reject(req.params.id, req.body.reason);
      res.status(200).json({message: 'Rejected'});
    } catch (error) {
      next(error);
    }
  },

  async trackView(req: Request, res: Response, next: NextFunction) {
    try {
      await notesService.trackView(req.params.id);
      res.status(200).json({message: 'View tracked'});
    } catch (error) {
      next(error);
    }
  },

  async trackDownload(req: Request, res: Response, next: NextFunction) {
    try {
      await notesService.trackDownload(req.params.id);
      res.status(200).json({message: 'Download tracked'});
    } catch (error) {
      next(error);
    }
  }
};
