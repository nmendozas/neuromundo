import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

/** Valida req.body contra un esquema zod y deja el resultado tipado en req.body. */
export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Datos inválidos', details: parsed.error.issues });
      return;
    }
    req.body = parsed.data;
    next();
  };
}
