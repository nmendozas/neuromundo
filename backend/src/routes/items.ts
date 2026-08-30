import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/error';
import {
  listItems,
  findItemById,
  findItemByReference,
  createItem,
  updateItem,
  deleteItem,
} from '../db/repos/items';
import { parseItemsSpreadsheet, importRows } from '../services/items';
import { buildItemsExcel, buildItemsTemplate } from '../services/export';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const itemSchema = z.object({
  reference: z.string().trim().min(1, 'Referencia obligatoria'),
  name: z.string().trim().min(1, 'Nombre obligatorio'),
  category: z.string().trim().min(1, 'Categoría obligatoria').default('General'),
  description: z.string().optional().default(''),
  unit: z.string().optional().default('unidad'),
  cost_price: z.coerce.number().nonnegative().optional().default(0),
  sale_price: z.coerce.number().nonnegative().optional().default(0),
  emoji: z.string().optional().default('🩺'),
  active: z.coerce.number().int().min(0).max(1).optional().default(1),
});

export const itemsRouter = Router();

// GET /api/items → público: solo activos · autenticado: todos
itemsRouter.get('/', (req, res) => {
  res.json(listItems({ activeOnly: !req.user }));
});

// GET /api/items/export → Excel del catálogo
itemsRouter.get(
  '/export',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const buffer = await buildItemsExcel(listItems());
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="catalogo-neuromundo.xlsx"');
    res.send(buffer);
  }),
);

// GET /api/items/template → plantilla para importar ítems
itemsRouter.get(
  '/template',
  requireAuth,
  asyncHandler(async (_req, res) => {
    const buffer = await buildItemsTemplate();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="plantilla-importar-items.xlsx"');
    res.send(buffer);
  }),
);

// POST /api/items/import → sube .xlsx/.csv y valida fila por fila
itemsRouter.post('/import', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Adjunta un archivo .xlsx o .csv' });
    return;
  }
  const { rows, errors } = parseItemsSpreadsheet(req.file.buffer);
  const result = importRows(rows);
  res.json({ ...result, validRows: rows.length, errors });
});

// POST /api/items → crear
itemsRouter.post('/', requireAuth, validate(itemSchema), (req, res) => {
  const dup = findItemByReference(req.body.reference.trim());
  if (dup) {
    res.status(409).json({ error: `Ya existe un ítem con la referencia "${dup.reference}"` });
    return;
  }
  const id = createItem(req.body);
  res.status(201).json(findItemById(id));
});

// GET /api/items/:id
itemsRouter.get('/:id', (req, res) => {
  const item = findItemById(Number(req.params.id));
  if (!item) {
    res.status(404).json({ error: 'Ítem no encontrado' });
    return;
  }
  res.json(item);
});

// PUT /api/items/:id → editar
itemsRouter.put('/:id', requireAuth, validate(itemSchema.partial()), (req, res) => {
  const id = Number(req.params.id);
  const existing = findItemById(id);
  if (!existing) {
    res.status(404).json({ error: 'Ítem no encontrado' });
    return;
  }
  if (req.body.reference) {
    const dup = findItemByReference(req.body.reference.trim());
    if (dup && dup.id !== id) {
      res.status(409).json({ error: 'Esa referencia ya está en uso por otro ítem' });
      return;
    }
  }
  updateItem(id, req.body);
  res.json(findItemById(id));
});

// DELETE /api/items/:id
itemsRouter.delete('/:id', requireAuth, (req, res) => {
  deleteItem(Number(req.params.id));
  res.status(204).end();
});
