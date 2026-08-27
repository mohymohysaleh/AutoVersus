import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'AutoVersus API', architecture: 'Modular Monolith' });
  });

  return app;
};
