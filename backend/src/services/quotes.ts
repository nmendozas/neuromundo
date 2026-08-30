import { getDb } from '../db';
import {
  getParameter,
  getParameterFloat,
  getParameterInt,
} from '../db/repos/parameters';
import { round2 } from '../lib/money';

/** Genera el siguiente número de cotización: NM-2026-0001 (secuencial por año). */
export function nextQuoteNumber(): string {
  const db = getDb();
  const prefix = getParameter('quote.prefix', 'NM');
  const year = new Date().getFullYear();

  const seq = db.transaction(() => {
    const row = db
      .prepare("SELECT value FROM parameters WHERE key = 'quote.last_number'")
      .get() as { value: string } | undefined;
    const next = (Number.parseInt(row?.value ?? '0', 10) || 0) + 1;
    db.prepare(
      `INSERT INTO parameters (key, value) VALUES ('quote.last_number', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run(String(next));
    return next;
  })();

  return `${prefix}-${year}-${String(seq).padStart(4, '0')}`;
}

export type DiscountMode = 'percent' | 'amount';

export interface Totals {
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
}

/**
 * Calcula subtotal, descuento, IVA y total.
 * Descuento en % del subtotal o en monto fijo (según discountMode).
 */
export function computeTotals(
  items: Array<{ quantity: number; unit_price: number }>,
  discount: number,
  discountMode: DiscountMode,
  ivaPct: number,
): Totals {
  const subtotal = round2(
    items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0),
  );
  const discountValue =
    discountMode === 'amount'
      ? round2(discount)
      : round2((subtotal * discount) / 100);
  const base = round2(subtotal - discountValue);
  const iva = round2((base * ivaPct) / 100);
  const total = round2(base + iva);
  return { subtotal, discount: discountValue, iva, total };
}

/** Valores por defecto de cotización tomados de los parámetros. */
export function quoteDefaults() {
  return {
    ivaPct: getParameterFloat('quote.iva', 19),
    validDays: getParameterInt('quote.valid_days', 30),
    discountMode: (getParameter('quote.discount_mode', 'percent') ||
      'percent') as DiscountMode,
    currency: getParameter('quote.currency', 'COP'),
    prefix: getParameter('quote.prefix', 'NM'),
    footerNote: getParameter('quote.footer_note', ''),
  };
}
