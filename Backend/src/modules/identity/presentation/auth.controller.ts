import { Request, Response, NextFunction } from 'express';
import { PrismaUserRepository } from '../infrastructure/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../infrastructure/bcrypt-password-hasher.js';
import { JwtTokenService } from '../infrastructure/jwt-token-service.js';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case.js';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case.js';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile.use-case.js';
import { UserEntity } from '../domain/entities/user.entity.js';
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
        data: {
          ...result,
          user: {
            ...result.user,
            authProvider: 'LOCAL',
          },
        },
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
        data: {
          ...result,
          user: {
            ...result.user,
            authProvider: 'LOCAL',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatarUrl } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Google authentication requires an email address.',
            statusCode: 400,
          },
        });
      }

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        const dummyPassword = await this.passwordHasher.hash('GoogleOAuthSecretKey2026!');
        const newUserEntity = UserEntity.create({
          email,
          passwordHash: dummyPassword,
          name: name || 'Google User',
          avatarUrl: avatarUrl || null,
          role: 'USER' as any,
          country: 'EG',
          preferredCurrency: 'EGP',
          preferredLang: 'EN' as any,
          measurementSystem: 'METRIC' as any,
        });
        user = await this.userRepo.save(newUserEntity);
      }

      const tokens = this.tokenService.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name || name || 'Google User',
            role: user.role,
            country: user.country,
            preferredCurrency: user.preferredCurrency,
            preferredLang: user.preferredLang,
            measurementSystem: user.measurementSystem,
            authProvider: 'GOOGLE',
            createdAt: user.props.createdAt ? user.props.createdAt.toISOString() : new Date().toISOString(),
            updatedAt: user.props.updatedAt ? user.props.updatedAt.toISOString() : new Date().toISOString(),
          },
          tokens,
        },
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
