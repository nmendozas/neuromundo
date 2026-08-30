import { Router } from 'express';
import { getDb } from '../db';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  getDb().prepare('SELECT 1 AS ok').get();
  res.json({
    status: 'ok',
    service: 'neuromundo-api',
    time: new Date().toISOString(),
  });
});
