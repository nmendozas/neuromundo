import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import {
  createMessage,
  listMessages,
  markMessageRead,
  deleteMessage,
} from '../db/repos/messages';
import { isSmtpConfigured, sendContactNotification } from '../services/email';

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  message: { error: 'Demasiados mensajes enviados. Intenta más tarde.' },
});

const contactSchema = z.object({
  name: z.string().min(1, 'Nombre obligatorio'),
  email: z.string().email('Correo inválido'),
  phone: z.string().optional().default(''),
  service: z.string().optional().default(''),
  message: z.string().min(1, 'Mensaje obligatorio'),
});

const readSchema = z.object({ is_read: z.coerce.number().int().min(0).max(1) });

export const contactRouter = Router();

// POST /api/contact (público) → guarda el mensaje y notifica por correo
contactRouter.post('/', contactLimiter, validate(contactSchema), async (req, res) => {
  const id = createMessage(req.body);
  let emailStatus = 'smtp_no_configurado';
  if (isSmtpConfigured()) {
    try {
      await sendContactNotification(req.body);
      emailStatus = 'enviado';
    } catch {
      emailStatus = 'error';
    }
  }
  res.status(201).json({ ok: true, id, emailStatus });
});

// GET /api/contact/messages (admin) → bandeja de mensajes
contactRouter.get('/messages', requireAuth, (_req, res) => {
  res.json(listMessages());
});

// PATCH /api/contact/messages/:id (admin) → marcar leído/no leído
contactRouter.patch('/messages/:id', requireAuth, validate(readSchema), (req, res) => {
  markMessageRead(Number(req.params.id), req.body.is_read);
  res.json({ ok: true });
});

// DELETE /api/contact/messages/:id (admin)
contactRouter.delete('/messages/:id', requireAuth, (req, res) => {
  deleteMessage(Number(req.params.id));
  res.status(204).end();
});
