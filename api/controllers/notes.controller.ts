import { Request, Response, NextFunction } from 'express';
import { notesService } from '../services/notes.service';

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
  }
};
