import { Redis } from 'ioredis';

/**
 * Shared Resilient Redis Connection Manager
 * Manages connection lifecycle and status for distributed caching, rate-limiting, and token blacklisting.
 */
export class RedisService {
  private static instance: RedisService;
  private client: Redis | null = null;
  private isConnected = false;

  private constructor() {
    this.initClient();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private initClient() {
    const redisUrl = process.env.REDIS_URL;
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    try {
      if (redisUrl) {
        this.client = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 100, 2000),
        });
      } else {
        this.client = new Redis({
          host,
          port,
          password,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 100, 2000),
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('[RedisService] Connected to Redis cluster/instance successfully.');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        if (this.isConnected) {
          console.warn('[RedisService] Redis connection error:', err.message);
        }
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    } catch (err: any) {
      console.warn('[RedisService] Initialization failed:', err.message);
      this.client = null;
      this.isConnected = false;
    }
  }

  public async connect(): Promise<boolean> {
    if (!this.client) return false;
    if (this.isConnected) return true;
    try {
      await this.client.connect();
      this.isConnected = true;
      return true;
    } catch (err: any) {
      console.warn('[RedisService] Could not connect to Redis (falling back to in-memory mode):', err.message);
      this.isConnected = false;
      return false;
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public isAvailable(): boolean {
    return this.isConnected && this.client !== null && this.client.status === 'ready';
  }

  public async ping(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      const res = await this.client.ping();
      return res === 'PONG';
    } catch {
      return false;
    }
  }

  public async quit(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

export const redisService = RedisService.getInstance();
