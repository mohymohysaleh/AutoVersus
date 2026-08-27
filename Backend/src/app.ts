import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/infrastructure/swagger/swagger.config.js';
import { errorHandler } from './shared/presentation/middlewares/error-handler.middleware.js';
import catalogRouter from './modules/catalog/presentation/catalog.routes.js';
import authRouter from './modules/identity/presentation/auth.routes.js';
import newsRouter from './modules/news/presentation/news.routes.js';
import pricingRouter from './modules/pricing/presentation/pricing.routes.js';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI inline scripts
  }));
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      app: 'AutoVersus API',
      architecture: 'Modular Monolith',
      docs: '/docs',
    });
  });

  // Swagger OpenAPI Documentation UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Module Routes
  app.use('/api/v1/catalog', catalogRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/news', newsRouter);
  app.use('/api/v1/pricing', pricingRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
