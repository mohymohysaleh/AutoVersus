import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../infrastructure/logger/logger.service.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  LoggerService.error(`Unhandled error on ${req.method} ${req.path}`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};
