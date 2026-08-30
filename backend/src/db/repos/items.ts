import { getDb } from '../index';
import { round2 } from '../../lib/money';

export interface ItemRow {
  id: number;
  reference: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  cost_price: number;
  sale_price: number;
  emoji: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  featured: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface ItemInput {
  reference: string;
  name: string;
  category: string;
  description?: string;
  unit?: string;
  cost_price?: number;
  sale_price?: number;
  emoji?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  featured?: number;
  active?: number;
}

function toRow(row: unknown): ItemRow {
  const r = row as Record<string, unknown>;
  return {
    id: Number(r.id),
    reference: String(r.reference ?? ''),
    name: String(r.name ?? ''),
    category: String(r.category ?? 'General'),
    description: String(r.description ?? ''),
    unit: String(r.unit ?? 'unidad'),
    cost_price: Number(r.cost_price ?? 0),
    sale_price: Number(r.sale_price ?? 0),
    emoji: String(r.emoji ?? '🩺'),
    image_1: String(r.image_1 ?? ''),
    image_2: String(r.image_2 ?? ''),
    image_3: String(r.image_3 ?? ''),
    image_4: String(r.image_4 ?? ''),
    image_5: String(r.image_5 ?? ''),
    featured: Number(r.featured ?? 0),
    active: Number(r.active ?? 1),
    created_at: String(r.created_at ?? ''),
    updated_at: String(r.updated_at ?? ''),
  };
}

export function listItems(opts: { activeOnly?: boolean } = {}): ItemRow[] {
  const sql = opts.activeOnly
    ? 'SELECT * FROM items WHERE active = 1 ORDER BY category, reference'
    : 'SELECT * FROM items ORDER BY category, reference';
  return (getDb().prepare(sql).all() as unknown[]).map(toRow);
}

export function findItemById(id: number): ItemRow | undefined {
  const row = getDb().prepare('SELECT * FROM items WHERE id = ?').get(id);
  return row ? toRow(row) : undefined;
}

export function findItemByReference(reference: string): ItemRow | undefined {
  const row = getDb()
    .prepare('SELECT * FROM items WHERE reference = ?')
    .get(reference);
  return row ? toRow(row) : undefined;
}

export function createItem(input: ItemInput): number {
  const db = getDb();
  const now = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO items
        (reference, name, category, description, unit, cost_price, sale_price, emoji, image_1, image_2, image_3, image_4, image_5, featured, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    )
    .run(
      input.reference.trim(),
      input.name.trim(),
      (input.category || 'General').trim(),
      (input.description ?? '').trim(),
      (input.unit || 'unidad').trim(),
      round2(Number(input.cost_price ?? 0)),
      round2(Number(input.sale_price ?? 0)),
      input.emoji || '🩺',
      input.image_1?.trim() ?? '', input.image_2?.trim() ?? '', input.image_3?.trim() ?? '',
      input.image_4?.trim() ?? '', input.image_5?.trim() ?? '',
      input.featured ?? 0,
      input.active ?? 1,
      now,
      now,
    );
  return Number(info.lastInsertRowid);
}

export function updateItem(id: number, input: ItemInput): void {
  const db = getDb();
  const current = findItemById(id);
  if (!current) return;
  db.prepare(
    `UPDATE items SET
       reference = ?, name = ?, category = ?, description = ?, unit = ?,
       cost_price = ?, sale_price = ?, emoji = ?, image_1 = ?, image_2 = ?, image_3 = ?, image_4 = ?, image_5 = ?, featured = ?, active = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    (input.reference ?? current.reference).trim(),
    (input.name ?? current.name).trim(),
    (input.category ?? current.category).trim(),
    (input.description ?? current.description).trim(),
    (input.unit ?? current.unit).trim(),
    round2(Number(input.cost_price ?? current.cost_price)),
    round2(Number(input.sale_price ?? current.sale_price)),
    input.emoji ?? current.emoji,
    input.image_1 ?? current.image_1, input.image_2 ?? current.image_2, input.image_3 ?? current.image_3,
    input.image_4 ?? current.image_4, input.image_5 ?? current.image_5,
    input.featured ?? current.featured,
    input.active ?? current.active,
    new Date().toISOString(),
    id,
  );
}

export function deleteItem(id: number): void {
  getDb().prepare('DELETE FROM items WHERE id = ?').run(id);
}

export function countItems(): number {
  const row = getDb()
    .prepare('SELECT COUNT(*) AS n FROM items')
    .get() as { n: number };
  return Number(row.n);
}
