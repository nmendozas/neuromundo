import type { NextFunction, Request, Response } from 'express';
import { getUserByToken, type PublicUser } from '../services/auth';

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
      token?: string;
    }
  }
}

/** Protege rutas: exige cabecera `Authorization: Bearer <token>`. */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
    return;
  }

  req.user = user;
  req.token = token;
  next();
}
