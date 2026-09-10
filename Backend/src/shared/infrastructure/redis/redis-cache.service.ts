import { redisService } from './redis.service.js';

export class RedisCacheService {
  private defaultTtlSeconds: number;

  constructor(defaultTtlSeconds = 300) {
    this.defaultTtlSeconds = defaultTtlSeconds;
  }

  public async get<T>(key: string): Promise<T | null> {
    const client = redisService.getClient();
    if (!client || !redisService.isAvailable()) {
      return null;
    }
    try {
      const val = await client.get(key);
      if (!val) return null;
      return JSON.parse(val) as T;
    } catch (err: any) {
      console.warn(`[RedisCacheService] GET error for key ${key}:`, err.message);
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    const client = redisService.getClient();
    if (!client || !redisService.isAvailable()) {
      return false;
    }
    try {
      const serialized = JSON.stringify(value);
      const ttl = ttlSeconds ?? this.defaultTtlSeconds;
      await client.set(key, serialized, 'EX', ttl);
      return true;
    } catch (err: any) {
      console.warn(`[RedisCacheService] SET error for key ${key}:`, err.message);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    const client = redisService.getClient();
    if (!client || !redisService.isAvailable()) {
      return false;
    }
    try {
      await client.del(key);
      return true;
    } catch (err: any) {
      console.warn(`[RedisCacheService] DEL error for key ${key}:`, err.message);
      return false;
    }
  }

  public async delPattern(pattern: string): Promise<number> {
    const client = redisService.getClient();
    if (!client || !redisService.isAvailable()) {
      return 0;
    }
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        return await client.del(...keys);
      }
      return 0;
    } catch (err: any) {
      console.warn(`[RedisCacheService] DEL pattern error for ${pattern}:`, err.message);
      return 0;
    }
  }
}

export const redisCacheService = new RedisCacheService(300);
