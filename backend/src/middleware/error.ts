import type { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response): void {
  res
    .status(404)
    .json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // eslint-disable-next-line no-console
  console.error('❌ Error no controlado:', err);
  if (res.headersSent) return;
  const message =
    err instanceof Error ? err.message : 'Error interno del servidor';
  res.status(500).json({ error: message });
}

/** Envuelve handlers async para que sus errores lleguen a errorHandler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
