import { Request, Response, NextFunction } from 'express';
import { PrismaUserRepository } from '../infrastructure/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../infrastructure/bcrypt-password-hasher.js';
import { JwtTokenService } from '../infrastructure/jwt-token-service.js';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case.js';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case.js';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile.use-case.js';
import { AuthenticatedRequest } from '../../../shared/presentation/middlewares/auth.middleware.js';

export class AuthController {
  private userRepo = new PrismaUserRepository();
  private passwordHasher = new BcryptPasswordHasher();
  private tokenService = new JwtTokenService();

  private registerUseCase = new RegisterUserUseCase(this.userRepo, this.passwordHasher, this.tokenService);
  private loginUseCase = new LoginUserUseCase(this.userRepo, this.passwordHasher, this.tokenService);
  private getProfileUseCase = new GetUserProfileUseCase(this.userRepo);

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, country, preferredCurrency, preferredLang, measurementSystem } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email and password are required.',
            statusCode: 400,
          },
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Please provide a valid email address format.',
            statusCode: 400,
          },
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Password must be at least 8 characters long.',
            statusCode: 400,
          },
        });
      }

      const result = await this.registerUseCase.execute({
        email,
        password,
        name,
        country,
        preferredCurrency,
        preferredLang,
        measurementSystem,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email and password are required.',
            statusCode: 400,
          },
        });
      }

      const result = await this.loginUseCase.execute({ email, password });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Refresh token is required.',
            statusCode: 400,
          },
        });
      }

      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid or expired refresh token.',
            statusCode: 401,
          },
        });
      }

      const tokens = this.tokenService.generateTokens(payload);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const profile = await this.getProfileUseCase.execute(userId);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { preferredCurrency, preferredLang, measurementSystem } = req.body;

      const updated = await this.userRepo.updatePreferences(userId, {
        preferredCurrency,
        preferredLang,
        measurementSystem,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}
