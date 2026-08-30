import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { notFound, errorHandler } from './middleware/error';
import { authRouter } from './routes/auth';
import { itemsRouter } from './routes/items';
import { quotesRouter } from './routes/quotes';
import { contentRouter } from './routes/content';
import { parametersRouter } from './routes/parameters';
import { contactRouter } from './routes/contact';
import { healthRouter } from './routes/health';
import { statsRouter } from './routes/stats';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

  const origin = env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',');
  app.use(cors({ origin, credentials: false }));

  app.use(express.json({ limit: '2mb' }));

  app.use('/healthz', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/items', itemsRouter);
  app.use('/api/quotes', quotesRouter);
  app.use('/api/content', contentRouter);
  app.use('/api/parameters', parametersRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/stats', statsRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
