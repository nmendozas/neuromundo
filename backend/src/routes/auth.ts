import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { login, logout } from '../services/auth';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  message: { error: 'Demasiados intentos fallidos. Espera unos minutos.' },
});

const loginSchema = z.object({
  username: z.string().min(1, 'Usuario obligatorio'),
  password: z.string().min(1, 'Contraseña obligatoria'),
});

export const authRouter = Router();

authRouter.post('/login', loginLimiter, validate(loginSchema), (req, res) => {
  const result = login(req.body.username, req.body.password);
  if (!result) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }
  res.json(result);
});

authRouter.post('/logout', requireAuth, (req, res) => {
  if (req.token) logout(req.token);
  res.status(204).end();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
