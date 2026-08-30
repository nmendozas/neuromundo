import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import {
  createQuote,
  getQuoteWithItems,
  listQuotes,
  updateQuoteHeader,
  replaceQuoteItems,
  deleteQuote,
  setQuoteStatus,
} from '../db/repos/quotes';
import { nextQuoteNumber, computeTotals, quoteDefaults } from '../services/quotes';
import { buildQuotePdf, buildQuoteExcel } from '../services/export';
import { sendQuoteEmail, isSmtpConfigured } from '../services/email';
import { getParametersMap } from '../db/repos/parameters';

const itemLineSchema = z.object({
  item_id: z.number().int().nullable().optional(),
  reference: z.string().min(1, 'Referencia obligatoria'),
  name: z.string().min(1, 'Nombre obligatorio'),
  unit: z.string().optional().default('unidad'),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
  unit_price: z.coerce.number().nonnegative(),
});

const quoteSchema = z.object({
  client_name: z.string().min(1, 'Nombre del cliente obligatorio'),
  client_company: z.string().optional().default(''),
  client_email: z
    .union([z.string().email('Correo inválido'), z.literal('')])
    .optional()
    .default(''),
  client_phone: z.string().optional().default(''),
  client_nit: z.string().optional().default(''),
  items: z.array(itemLineSchema).min(1, 'Agrega al menos un ítem'),
  discount: z.coerce.number().nonnegative().optional().default(0),
  discount_mode: z.enum(['percent', 'amount']).optional(),
  iva_pct: z.coerce.number().nonnegative().optional(),
  valid_days: z.coerce.number().int().positive().optional(),
  notes: z.string().optional().default(''),
  status: z.enum(['borrador', 'enviada', 'aceptada', 'rechazada']).optional().default('borrador'),
});

const statusSchema = z.object({
  status: z.enum(['borrador', 'enviada', 'aceptada', 'rechazada']),
});

const sendSchema = z.object({ to: z.string().email('Correo inválido').optional().default('') });

export const quotesRouter = Router();

// GET /api/quotes → listar cotizaciones
quotesRouter.get('/', requireAuth, (_req, res) => {
  res.json(listQuotes());
});

// POST /api/quotes → crear (calcula totales y asigna numeración)
quotesRouter.post('/', requireAuth, validate(quoteSchema), (req, res) => {
  const body = req.body;
  const defaults = quoteDefaults();
  const ivaPct = body.iva_pct ?? defaults.ivaPct;
  const discountMode = body.discount_mode ?? defaults.discountMode;
  const totals = computeTotals(body.items, body.discount, discountMode, ivaPct);

  const id = createQuote({
    number: nextQuoteNumber(),
    client_name: body.client_name,
    client_company: body.client_company,
    client_email: body.client_email,
    client_phone: body.client_phone,
    client_nit: body.client_nit,
    status: body.status,
    subtotal: totals.subtotal,
    discount: totals.discount,
    iva: totals.iva,
    total: totals.total,
    currency: defaults.currency,
    valid_days: body.valid_days ?? defaults.validDays,
    notes: body.notes,
    items: body.items,
  });
  res.status(201).json(getQuoteWithItems(id));
});

// GET /api/quotes/:id → detalle con ítems
quotesRouter.get('/:id', requireAuth, (req, res) => {
  const quote = getQuoteWithItems(Number(req.params.id));
  if (!quote) {
    res.status(404).json({ error: 'Cotización no encontrada' });
    return;
  }
  res.json(quote);
});

// PUT /api/quotes/:id → editar (recalcula totales y reemplaza ítems)
quotesRouter.put('/:id', requireAuth, validate(quoteSchema.omit({ status: true })), (req, res) => {
  const id = Number(req.params.id);
  const existing = getQuoteWithItems(id);
  if (!existing) {
    res.status(404).json({ error: 'Cotización no encontrada' });
    return;
  }
  const body = req.body;
  const defaults = quoteDefaults();
  const ivaPct = body.iva_pct ?? defaults.ivaPct;
  const discountMode = body.discount_mode ?? defaults.discountMode;
  const totals = computeTotals(body.items, body.discount, discountMode, ivaPct);

  updateQuoteHeader(id, {
    client_name: body.client_name,
    client_company: body.client_company,
    client_email: body.client_email,
    client_phone: body.client_phone,
    client_nit: body.client_nit,
    subtotal: totals.subtotal,
    discount: totals.discount,
    iva: totals.iva,
    total: totals.total,
    valid_days: body.valid_days ?? defaults.validDays,
    notes: body.notes,
  });
  replaceQuoteItems(id, body.items);
  res.json(getQuoteWithItems(id));
});

// PATCH /api/quotes/:id/status → cambiar estado
quotesRouter.patch('/:id/status', requireAuth, validate(statusSchema), (req, res) => {
  setQuoteStatus(Number(req.params.id), req.body.status);
  res.json({ ok: true });
});

// DELETE /api/quotes/:id
quotesRouter.delete('/:id', requireAuth, (req, res) => {
  deleteQuote(Number(req.params.id));
  res.status(204).end();
});

// GET /api/quotes/:id/pdf
quotesRouter.get(
  '/:id/pdf',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = getQuoteWithItems(Number(req.params.id));
    if (!q) {
      res.status(404).json({ error: 'Cotización no encontrada' });
      return;
    }
    const pdf = await buildQuotePdf(q.quote, q.items, getParametersMap());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${q.quote.number}.pdf"`);
    res.send(pdf);
  }),
);

// GET /api/quotes/:id/excel
quotesRouter.get(
  '/:id/excel',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = getQuoteWithItems(Number(req.params.id));
    if (!q) {
      res.status(404).json({ error: 'Cotización no encontrada' });
      return;
    }
    const excel = await buildQuoteExcel(q.quote, q.items, getParametersMap());
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${q.quote.number}.xlsx"`);
    res.send(excel);
  }),
);

// POST /api/quotes/:id/send → envía correo con el PDF adjunto
quotesRouter.post(
  '/:id/send',
  requireAuth,
  validate(sendSchema),
  asyncHandler(async (req, res) => {
    const q = getQuoteWithItems(Number(req.params.id));
    if (!q) {
      res.status(404).json({ error: 'Cotización no encontrada' });
      return;
    }
    const to = req.body.to || q.quote.client_email;
    if (!to) {
      res.status(400).json({ error: 'La cotización no tiene correo del cliente. Indica un destinatario.' });
      return;
    }
    if (!isSmtpConfigured()) {
      res.status(400).json({ error: 'SMTP no configurado. Define las variables SMTP_HOST, SMTP_USER y SMTP_PASS.' });
      return;
    }
    const pdf = await buildQuotePdf(q.quote, q.items, getParametersMap());
    await sendQuoteEmail(to, q.quote, pdf);
    setQuoteStatus(q.quote.id, 'enviada');
    res.json({ ok: true, emailStatus: 'enviado', to });
  }),
);

