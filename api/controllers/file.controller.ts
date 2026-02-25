import { Request, Response, NextFunction } from 'express';
import { validateFile } from '../utils/fileValidation';
import { uploadToAppwrite } from '../services/appwrite.service';

export const fileController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      validateFile(
        req.file,
        ['image/jpeg', 'image/png', 'application/pdf'],
        10 * 1024 * 1024,
        ['.jpg', '.jpeg', '.png', '.pdf']
      );
      const result = await uploadToAppwrite(req.file!);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
