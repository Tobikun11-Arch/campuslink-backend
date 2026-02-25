import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verify(req.body.email, req.body.code);
      res.status(200).json({ message: 'Verified' });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await authService.login(req.body.email, req.body.password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }
};
