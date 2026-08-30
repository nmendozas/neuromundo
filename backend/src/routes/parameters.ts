import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getParametersMap, updateParameters } from '../db/repos/parameters';
import { isSmtpConfigured, testSmtpConnection } from '../services/email';

export const parametersRouter = Router();

// GET /api/parameters (admin) → todos los parámetros + estado SMTP
parametersRouter.get('/', requireAuth, (_req, res) => {
  res.json({ parameters: getParametersMap(), smtp_configured: isSmtpConfigured() });
});

// PUT /api/parameters (admin) → actualiza empresa, IVA, validez, prefijo, notas…
parametersRouter.put(
  '/',
  requireAuth,
  validate(z.object({ parameters: z.record(z.string()) })),
  (req, res) => {
    updateParameters(req.body.parameters);
    res.json({ ok: true, parameters: getParametersMap() });
  },
);

// POST /api/parameters/smtp-test (admin) → prueba la conexión SMTP
parametersRouter.post('/smtp-test', requireAuth, async (_req, res) => {
  try {
    await testSmtpConnection();
    res.json({ ok: true, message: 'Conexión SMTP exitosa ✅' });
  } catch (err) {
    res.status(400).json({
      error: `Conexión SMTP fallida: ${err instanceof Error ? err.message : 'error desconocido'}`,
    });
  }
});
