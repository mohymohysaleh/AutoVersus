import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { runWithCorrelationContext, CorrelationContext } from '../../infrastructure/logger/correlation.context.js';
import { LoggerService } from '../../infrastructure/logger/logger.service.js';

/**
 * Express Middleware for Request Correlation ID Injection & HTTP Metrics Logging
 * Attaches a unique correlation ID to incoming requests, sets response headers, and initializes AsyncLocalStorage context.
 */
export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const existingId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string | undefined;
  const correlationId = existingId && existingId.trim().length > 0 ? existingId.trim() : randomUUID();

  // Set outgoing headers for client & log tracing
  res.setHeader('X-Request-ID', correlationId);
  res.setHeader('X-Correlation-ID', correlationId);

  const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);

  const context: CorrelationContext = {
    correlationId,
    route: req.originalUrl || req.path,
    clientIp,
  };

  const startTime = Date.now();

  // Log HTTP completion metrics when response finishes
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Attach user ID to context if authenticated
    const user = (req as any).user;
    if (user?.userId) {
      context.userId = String(user.userId);
    }

    LoggerService.http(`HTTP ${req.method} ${req.originalUrl || req.path} ${statusCode} - ${durationMs}ms`, {
      method: req.method,
      url: req.originalUrl || req.path,
      statusCode,
      durationMs,
      clientIp,
      userAgent: req.headers['user-agent'] || 'unknown',
    });
  });

  // Run the rest of the middleware chain inside AsyncLocalStorage context
  runWithCorrelationContext(context, () => {
    next();
  });
};
