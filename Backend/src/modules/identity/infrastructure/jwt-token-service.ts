import jwt from 'jsonwebtoken';
import { ITokenService, JwtPayload } from '../application/ports/token-service.interface.js';
import { AuthTokensDto } from '../application/dtos/auth.dtos.js';

export class JwtTokenService implements ITokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'autoversus_jwt_secret_key_2026';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'autoversus_jwt_refresh_secret_key_2026';
  private readonly accessTokenExpiry = 15 * 60; // 15 minutes in seconds

  generateTokens(payload: JwtPayload): AuthTokensDto {
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email, role: payload.role },
      this.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: payload.userId, email: payload.email, role: payload.role },
      this.refreshSecret,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
    };
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}
