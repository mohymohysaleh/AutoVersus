import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../../modules/identity/infrastructure/jwt-token-service.js';
import { JwtPayload } from '../../../modules/identity/application/ports/token-service.interface.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const tokenService = new JwtTokenService();

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication token required. Provide header Authorization: Bearer <token>.',
        statusCode: 401,
      },
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = tokenService.verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired access token.',
        statusCode: 401,
      },
    });
  }

  req.user = payload;
  next();
};
