import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getContentMap, updateContent } from '../db/repos/content';
import { getParametersMap } from '../db/repos/parameters';

export const contentRouter = Router();

// GET /api/content (público) → contenido del sitio + parámetros públicos de la empresa
contentRouter.get('/', (_req, res) => {
  const params = getParametersMap();
  const publicParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key.startsWith('company.') || key === 'quote.currency') {
      publicParams[key] = value;
    }
  }
  res.json({ content: getContentMap(), parameters: publicParams });
});

// PUT /api/content (admin) → edita historia, misión, visión, hero, contacto…
contentRouter.put(
  '/',
  requireAuth,
  validate(z.object({ content: z.record(z.string()) })),
  (req, res) => {
    updateContent(req.body.content);
    res.json({ ok: true, content: getContentMap() });
  },
);
