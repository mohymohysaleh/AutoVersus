import { getCorrelationContext } from './correlation.context.js';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'HTTP';

export interface StructuredLogPayload {
  timestamp: string;
  level: LogLevel;
  correlationId?: string;
  service: string;
  environment: string;
  message: string;
  context?: {
    userId?: string;
    route?: string;
    clientIp?: string;
  };
  meta?: any;
  stack?: string;
}

export class LoggerService {
  private static serviceName = 'autoversus-backend';

  private static formatLog(level: LogLevel, message: string, meta?: any, errorObj?: any): string {
    const context = getCorrelationContext();
    const isProduction = process.env.NODE_ENV === 'production';

    const payload: StructuredLogPayload = {
      timestamp: new Date().toISOString(),
      level,
      correlationId: context?.correlationId || 'N/A',
      service: LoggerService.serviceName,
      environment: process.env.NODE_ENV || 'development',
      message,
    };

    if (context && (context.userId || context.route || context.clientIp)) {
      payload.context = {
        userId: context.userId,
        route: context.route,
        clientIp: context.clientIp,
      };
    }

    if (errorObj) {
      if (errorObj instanceof Error) {
        payload.meta = {
          ...(meta && typeof meta === 'object' ? meta : {}),
          errorName: errorObj.name,
          errorMessage: errorObj.message,
        };
        payload.stack = errorObj.stack;
      } else {
        payload.meta = errorObj;
      }
    } else if (meta !== undefined) {
      if (meta instanceof Error) {
        payload.meta = {
          errorName: meta.name,
          errorMessage: meta.message,
        };
        payload.stack = meta.stack;
      } else {
        payload.meta = meta;
      }
    }

    return JSON.stringify(payload);
  }

  public static info(message: string, meta?: any): void {
    console.log(LoggerService.formatLog('INFO', message, meta));
  }

  public static warn(message: string, meta?: any): void {
    console.warn(LoggerService.formatLog('WARN', message, meta));
  }

  public static error(message: string, error?: any, meta?: any): void {
    console.error(LoggerService.formatLog('ERROR', message, meta, error));
  }

  public static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(LoggerService.formatLog('DEBUG', message, meta));
    }
  }

  public static http(message: string, meta?: any): void {
    console.log(LoggerService.formatLog('HTTP', message, meta));
  }
}
