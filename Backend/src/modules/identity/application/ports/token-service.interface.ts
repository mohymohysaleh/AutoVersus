import { Role } from '@prisma/client';
import { AuthTokensDto } from '../dtos/auth.dtos.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface ITokenService {
  generateTokens(payload: JwtPayload): AuthTokensDto;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
}
