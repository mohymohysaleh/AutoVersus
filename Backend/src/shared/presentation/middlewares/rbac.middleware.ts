import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { Role } from '@prisma/client';

export const requireRoles = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User authentication required.',
          statusCode: 401,
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Forbidden: Requires one of roles [${allowedRoles.join(', ')}]. User has role '${req.user.role}'.`,
          statusCode: 403,
        },
      });
    }

    next();
  };
};
