/** Utilidades de dinero y formato (COP es_CO). */

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Formato de moneda colombiana sin decimales. */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

/** Formato de cantidad: quita ".00" y ".5" -> "0.5". */
export function formatQty(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

/** Fecha legible en es-CO. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
