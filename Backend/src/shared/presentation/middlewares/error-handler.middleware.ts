import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../infrastructure/logger/logger.service.js';
import { getCorrelationId } from '../../infrastructure/logger/correlation.context.js';

/**
 * Global Express Error Handler
 * Logs detailed structured JSON stack traces on the server while returning sanitized error responses with correlation requestId to clients.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const correlationId = getCorrelationId() || (res.getHeader('X-Request-ID') as string) || 'N/A';

  // Log detailed error trace internally with correlation ID for log aggregators (Datadog/CloudWatch/ELK)
  LoggerService.error(`Unhandled Exception on ${req.method} ${req.path}`, err, {
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
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
      requestId: correlationId,
      timestamp: new Date().toISOString(),
      path: req.path,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};
