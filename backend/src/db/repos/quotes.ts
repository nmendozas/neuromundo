import { getDb } from '../index';
import { round2 } from '../../lib/money';

export interface QuoteRow {
  id: number;
  number: string;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_nit: string;
  status: string;
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  currency: string;
  valid_days: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItemRow {
  id: number;
  quote_id: number;
  item_id: number | null;
  reference: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface QuoteItemInput {
  item_id?: number | null;
  reference: string;
  name: string;
  unit?: string;
  quantity: number;
  unit_price: number;
}

export interface NewQuoteInput {
  number: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  client_nit?: string;
  status?: string;
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  currency?: string;
  valid_days?: number;
  notes?: string;
  items: QuoteItemInput[];
}

function toQuote(row: unknown): QuoteRow {
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    number: String(r.number),
    client_name: String(r.client_name ?? ''),
    client_company: String(r.client_company ?? ''),
    client_email: String(r.client_email ?? ''),
    client_phone: String(r.client_phone ?? ''),
    client_nit: String(r.client_nit ?? ''),
    status: String(r.status ?? 'borrador'),
    subtotal: Number(r.subtotal ?? 0),
    discount: Number(r.discount ?? 0),
    iva: Number(r.iva ?? 0),
    total: Number(r.total ?? 0),
    currency: String(r.currency ?? 'COP'),
    valid_days: Number(r.valid_days ?? 30),
    notes: String(r.notes ?? ''),
    created_at: String(r.created_at ?? ''),
    updated_at: String(r.updated_at ?? ''),
  };
}

function toQuoteItem(row: unknown): QuoteItemRow {
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    quote_id: Number(r.quote_id),
    item_id: r.item_id == null ? null : Number(r.item_id),
    reference: String(r.reference ?? ''),
    name: String(r.name ?? ''),
    unit: String(r.unit ?? 'unidad'),
    quantity: Number(r.quantity ?? 0),
    unit_price: Number(r.unit_price ?? 0),
    total: Number(r.total ?? 0),
  };
}

export function createQuote(input: NewQuoteInput): number {
  const db = getDb();
  const insertHeader = db.prepare(
    `INSERT INTO quotes
      (number, client_name, client_company, client_email, client_phone, client_nit,
       status, subtotal, discount, iva, total, currency, valid_days, notes)
     VALUES (@number, @client_name, @client_company, @client_email, @client_phone, @client_nit,
       @status, @subtotal, @discount, @iva, @total, @currency, @valid_days, @notes)`,
  );
  const insertItem = db.prepare(
    `INSERT INTO quote_items
      (quote_id, item_id, reference, name, unit, quantity, unit_price, total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  return db.transaction(() => {
    const info = insertHeader.run({
      number: input.number,
      client_name: input.client_name,
      client_company: input.client_company ?? '',
      client_email: input.client_email ?? '',
      client_phone: input.client_phone ?? '',
      client_nit: input.client_nit ?? '',
      status: input.status ?? 'borrador',
      subtotal: input.subtotal,
      discount: input.discount,
      iva: input.iva,
      total: input.total,
      currency: input.currency ?? 'COP',
      valid_days: input.valid_days ?? 30,
      notes: input.notes ?? '',
    });
    const quoteId = Number(info.lastInsertRowid);
    for (const it of input.items) {
      insertItem.run(
        quoteId,
        it.item_id ?? null,
        it.reference,
        it.name,
        it.unit ?? 'unidad',
        it.quantity,
        it.unit_price,
        round2(it.quantity * it.unit_price),
      );
    }
    return quoteId;
  })();
}

export function getQuoteWithItems(
  id: number,
): { quote: QuoteRow; items: QuoteItemRow[] } | null {
  const row = getDb().prepare('SELECT * FROM quotes WHERE id = ?').get(id);
  if (!row) return null;
  const items = getDb()
    .prepare('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY id ASC')
    .all(id) as unknown[];
  return { quote: toQuote(row), items: items.map(toQuoteItem) };
}

export function listQuotes(): QuoteRow[] {
  return (getDb()
    .prepare('SELECT * FROM quotes ORDER BY id DESC')
    .all() as unknown[]).map(toQuote);
}

export function updateQuoteHeader(
  id: number,
  data: {
    client_name: string;
    client_company?: string;
    client_email?: string;
    client_phone?: string;
    client_nit?: string;
    subtotal: number;
    discount: number;
    iva: number;
    total: number;
    valid_days?: number;
    notes?: string;
  },
): void {
  getDb()
    .prepare(
      `UPDATE quotes SET
         client_name = ?, client_company = ?, client_email = ?, client_phone = ?, client_nit = ?,
         subtotal = ?, discount = ?, iva = ?, total = ?, valid_days = ?, notes = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(
      data.client_name,
      data.client_company ?? '',
      data.client_email ?? '',
      data.client_phone ?? '',
      data.client_nit ?? '',
      data.subtotal,
      data.discount,
      data.iva,
      data.total,
      data.valid_days ?? 30,
      data.notes ?? '',
      new Date().toISOString(),
      id,
    );
}

export function replaceQuoteItems(
  quoteId: number,
  items: QuoteItemInput[],
): void {
  const db = getDb();
  db.transaction(() => {
    db.prepare('DELETE FROM quote_items WHERE quote_id = ?').run(quoteId);
    const insertItem = db.prepare(
      `INSERT INTO quote_items
        (quote_id, item_id, reference, name, unit, quantity, unit_price, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const it of items) {
      insertItem.run(
        quoteId,
        it.item_id ?? null,
        it.reference,
        it.name,
        it.unit ?? 'unidad',
        it.quantity,
        it.unit_price,
        round2(it.quantity * it.unit_price),
      );
    }
  })();
}

export function setQuoteStatus(id: number, status: string): void {
  getDb()
    .prepare('UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?')
    .run(status, new Date().toISOString(), id);
}

export function deleteQuote(id: number): void {
  getDb().prepare('DELETE FROM quotes WHERE id = ?').run(id);
}

export function countQuotes(): number {
  const row = getDb()
    .prepare('SELECT COUNT(*) AS n FROM quotes')
    .get() as { n: number };
  return Number(row.n);
}

export function countQuotesByStatus(): Record<string, number> {
  const rows = getDb()
    .prepare('SELECT status, COUNT(*) AS n FROM quotes GROUP BY status')
    .all() as { status: string; n: number }[];
  const out: Record<string, number> = {};
  for (const row of rows) out[row.status] = Number(row.n);
  return out;
}

export function recentQuotes(limit = 5): QuoteRow[] {
  return (getDb()
    .prepare('SELECT * FROM quotes ORDER BY id DESC LIMIT ?')
    .all(limit) as unknown[]).map(toQuote);
}

