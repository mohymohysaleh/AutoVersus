import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../infrastructure/logger/logger.service.js';

/**
 * Global Express Error Handler
 * Logs detailed internal stack traces on the server while returning sanitized, generic error responses to clients in production.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log detailed error trace internally for server diagnostics
  LoggerService.error(`Unhandled Exception on ${req.method} ${req.path}`, {
    message: err.message,
    stack: err.stack,
    name: err.name,
    statusCode: err.statusCode,
  });

  const statusCode = err.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Sanitize 500 Internal Server Errors in production to avoid leaking internal implementation details
  const clientMessage =
    isProduction && statusCode >= 500
      ? 'Internal Server Error'
      : err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      message: clientMessage,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};
