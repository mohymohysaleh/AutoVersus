import { redisService } from './redis.service.js';

export class TokenBlacklistService {
  private static instance: TokenBlacklistService;
  private memoryBlacklist = new Set<string>();

  private constructor() {}

  public static getInstance(): TokenBlacklistService {
    if (!TokenBlacklistService.instance) {
      TokenBlacklistService.instance = new TokenBlacklistService();
    }
    return TokenBlacklistService.instance;
  }

  /**
   * Blacklist an access or refresh token until its expiration (default 24h)
   */
  public async blacklistToken(token: string, ttlSeconds: number = 86400): Promise<boolean> {
    if (!token) return false;
    const client = redisService.getClient();
    const redisKey = `blacklist:token:${token}`;

    if (client && redisService.isAvailable()) {
      try {
        await client.set(redisKey, 'revoked', 'EX', ttlSeconds);
        return true;
      } catch (err: any) {
        console.warn('[TokenBlacklistService] Redis error blacklisting token, falling back to local memory:', err.message);
      }
    }

    this.memoryBlacklist.add(token);
    return true;
  }

  /**
   * Check if a token has been revoked/blacklisted across any backend node
   */
  public async isBlacklisted(token: string): Promise<boolean> {
    if (!token) return false;
    const client = redisService.getClient();
    const redisKey = `blacklist:token:${token}`;

    if (client && redisService.isAvailable()) {
      try {
        const result = await client.get(redisKey);
        return result === 'revoked';
      } catch (err: any) {
        console.warn('[TokenBlacklistService] Redis error checking blacklist, using local memory fallback:', err.message);
      }
    }

    return this.memoryBlacklist.has(token);
  }
}

export const tokenBlacklistService = TokenBlacklistService.getInstance();
