import { Request, Response, NextFunction } from 'express';
import { redisService } from '../../infrastructure/redis/redis.service.js';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Local in-memory store for fallback when Redis is unconfigured or offline.
 */
class InMemorySlidingWindowStore {
  private hits = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 60 * 1000) {
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

const memoryStore = new InMemorySlidingWindowStore();

/**
 * Distributed Redis Sliding Window Store
 */
async function incrementRedisStore(
  key: string,
  windowMs: number
): Promise<{ count: number; ttlMs: number } | null> {
  const client = redisService.getClient();
  if (!client || !redisService.isAvailable()) {
    return null;
  }

  try {
    const now = Date.now();
    const clearBefore = now - windowMs;
    const redisKey = `ratelimit:${key}`;
    const member = `${now}:${Math.random().toString(36).substring(2, 8)}`;

    const pipeline = client.pipeline();
    pipeline.zremrangebyscore(redisKey, 0, clearBefore);
    pipeline.zadd(redisKey, now, member);
    pipeline.zcard(redisKey);
    pipeline.pexpire(redisKey, windowMs);

    const results = await pipeline.exec();
    if (!results || !results[2]) {
      return null;
    }

    const count = (results[2][1] as number) || 1;
    return {
      count,
      ttlMs: windowMs,
    };
  } catch (err: any) {
    console.warn('[RateLimiter] Redis store error, using in-memory fallback:', err.message);
    return null;
  }
}

/**
 * Express Middleware Factory for Distributed & Stateless Sliding Window Rate Limiting
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests from this IP or account. Please try again later.',
    keyGenerator,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userId = user?.userId ? `user_${user.userId}` : '';
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
    const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);

    const defaultKey = userId ? `${userId}:${req.baseUrl || ''}${req.path}` : `${ip}:${req.baseUrl || ''}${req.path}`;
    const key = keyGenerator ? keyGenerator(req) : defaultKey;

    let result = await incrementRedisStore(key, windowMs);
    if (!result) {
      result = memoryStore.increment(key, windowMs);
    }

    const { count, ttlMs } = result;

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
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

/**
 * Strict Rate Limiter for AI / Cost-Intensive Endpoints
 */
export const aiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many AI evaluation requests. Please wait a few minutes before trying again.',
});

/**
 * General Public API Rate Limiter
 */
export const publicApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Rate limit exceeded. Please slow down your requests.',
});
