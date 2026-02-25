import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request', result.error.flatten()));
  }

  next();
};
