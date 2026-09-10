import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

class InMemorySlidingWindowStore {
  private hits = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 60 * 1000) {
    // Periodic garbage collection for expired IP/Account entries
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  public increment(key: string, windowMs: number): { count: number; ttlMs: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.hits.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.hits.set(key, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
    record.timestamps.push(now);

    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    const ttlMs = Math.max(0, resetTime - now);

    return {
      count: record.timestamps.length,
      ttlMs,
    };
  }

  private cleanup() {
    const now = Date.now();
    const maxWindow = 60 * 60 * 1000;
    for (const [key, record] of this.hits.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (record.timestamps.length === 0) {
        this.hits.delete(key);
      }
    }
  }
}

const store = new InMemorySlidingWindowStore();

/**
 * Express Middleware Factory for Sliding Window Rate Limiting per IP and Account ID
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests from this IP or account. Please try again later.',
    keyGenerator,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userId = user?.userId ? `user_${user.userId}` : '';
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
    const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);

    const defaultKey = userId ? `${userId}:${req.baseUrl || ''}${req.path}` : `${ip}:${req.baseUrl || ''}${req.path}`;
    const key = keyGenerator ? keyGenerator(req) : defaultKey;

    const { count, ttlMs } = store.increment(key, windowMs);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + ttlMs) / 1000));

    if (count > max) {
      res.setHeader('Retry-After', Math.ceil(ttlMs / 1000));
      return res.status(429).json({
        success: false,
        error: {
          message,
          statusCode: 429,
          retryAfterSeconds: Math.ceil(ttlMs / 1000),
        },
      });
    }

    next();
  };
};

/**
 * Strict Rate Limiter for Authentication Endpoints (Login, Register, Refresh, OAuth)
 * Threshold: 5 requests per 15 minutes per IP/Account
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

/**
 * Strict Rate Limiter for AI / Cost-Intensive Endpoints
 * Threshold: 10 requests per 15 minutes per IP/Account
 */
export const aiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many AI evaluation requests. Please wait a few minutes before trying again.',
});

/**
 * General Public API Rate Limiter
 * Threshold: 100 requests per 15 minutes per IP/Account
 */
export const publicApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Rate limit exceeded. Please slow down your requests.',
});
