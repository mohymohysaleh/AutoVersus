import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/infrastructure/swagger/swagger.config.js';
import { errorHandler } from './shared/presentation/middlewares/error-handler.middleware.js';
import { publicApiRateLimiter } from './shared/presentation/middlewares/rate-limiter.middleware.js';
import catalogRouter from './modules/catalog/presentation/catalog.routes.js';
import authRouter from './modules/identity/presentation/auth.routes.js';
import newsRouter from './modules/news/presentation/news.routes.js';
import pricingRouter from './modules/pricing/presentation/pricing.routes.js';
import recommendationRouter from './modules/recommendation/presentation/recommendation.routes.js';
import mediaRouter from './modules/media/presentation/media.routes.js';
import { prisma } from './shared/infrastructure/database/prisma.service.js';
import { redisService } from './shared/infrastructure/redis/redis.service.js';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI inline scripts
  }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint with live database & Redis stateless connectivity check
  app.get('/health', async (req: Request, res: Response) => {
    let dbStatus = 'disconnected';
    let redisStatus = 'disconnected';

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    try {
      const isRedisOk = await redisService.ping();
      redisStatus = isRedisOk ? 'connected' : 'unconfigured_or_offline';
    } catch {
      redisStatus = 'error';
    }

    res.json({
      status: 'ok',
      stateless: true,
      app: 'AutoVersus API',
      architecture: 'Stateless Modular Monolith',
      services: {
        database: dbStatus,
        redis: redisStatus,
        objectStorage: process.env.AWS_S3_BUCKET ? 'configured' : 'mock_fallback',
      },
      docs: '/docs',
    });
  });

  // Swagger OpenAPI Documentation UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Global Rate Limiting for API routes
  app.use('/api', publicApiRateLimiter);

  // Module Routes
  app.use('/api/v1/catalog', catalogRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/news', newsRouter);
  app.use('/api/v1/pricing', pricingRouter);
  app.use('/api/v1/recommendation', recommendationRouter);
  app.use('/api/v1/media', mediaRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
