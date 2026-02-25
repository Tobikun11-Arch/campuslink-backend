import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { logger } from '../logging/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details
    });
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Unexpected error occurred'
  });
}
