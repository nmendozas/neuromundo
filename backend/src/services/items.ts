import * as XLSX from 'xlsx';
import { z } from 'zod';
import { createItem, findItemByReference } from '../db/repos/items';

export interface ImportRow {
  reference: string;
  name: string;
  category: string;
  description?: string;
  unit?: string;
  cost_price?: number;
  sale_price?: number;
  emoji?: string;
}

export interface ImportError {
  row: number;
  reference: string;
  errors: string[];
}

/** Alias aceptados para cada columna (el usuario puede nombrarlas distinto). */
const FIELD_ALIASES: Record<keyof ImportRow, string[]> = {
  reference: ['referencia', 'reference', 'codigo', 'código', 'ref'],
  name: ['nombre', 'name', 'producto', 'articulo', 'artículo'],
  category: ['categoria', 'categoría', 'category'],
  description: ['descripcion', 'descripción', 'description', 'detalle'],
  unit: ['unidad', 'unit', 'unidad_medida'],
  cost_price: ['costo', 'costo_unitario', 'cost', 'cost_price'],
  sale_price: ['precio', 'precio_venta', 'venta', 'price', 'sale_price'],
  emoji: ['emoji', 'icon', 'icono'],
};

function normalizeHeader(header: string): string {
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
}

const rowSchema = z.object({
  reference: z.string().trim().min(1, 'Referencia obligatoria'),
  name: z.string().trim().min(1, 'Nombre obligatorio'),
  category: z.string().trim().min(1, 'Categoría obligatoria').default('General'),
  description: z.string().default(''),
  unit: z.string().default('unidad'),
  cost_price: z.coerce.number().nonnegative().default(0),
  sale_price: z.coerce.number().nonnegative().default(0),
  emoji: z.string().default('🩺'),
});

/**
 * Lee un archivo .xlsx/.xls/.csv y valida cada fila.
 * Devuelve las filas válidas y los errores (con número de fila).
 */
export function parseItemsSpreadsheet(
  buffer: Buffer,
): { rows: ImportRow[]; errors: ImportError[] } {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) {
    return {
      rows: [],
      errors: [{ row: 1, reference: '', errors: ['El archivo no contiene hojas de cálculo'] }],
    };
  }

  const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    wb.Sheets[sheetName],
    { defval: '' },
  );

  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];

  records.forEach((record, idx) => {
    const mapped: Record<string, unknown> = {};
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      for (const key of Object.keys(record)) {
        if (aliases.includes(normalizeHeader(key))) {
          mapped[field] = record[key];
          break;
        }
      }
    }

    const parsed = rowSchema.safeParse(mapped);
    if (parsed.success) {
      rows.push(parsed.data);
    } else {
      errors.push({
        row: idx + 2, // fila real de la hoja (1 = encabezado)
        reference: String(mapped.reference ?? ''),
        errors: parsed.error.issues.map((issue) => issue.message),
      });
    }
  });

  return { rows, errors };
}

/** Inserta las filas válidas; omite referencias duplicadas. */
export function importRows(rows: ImportRow[]): {
  imported: number;
  skipped: number;
  duplicates: string[];
} {
  const duplicates: string[] = [];
  let imported = 0;
  for (const row of rows) {
    if (findItemByReference(row.reference)) {
      duplicates.push(row.reference);
      continue;
    }
    createItem({
      reference: row.reference,
      name: row.name,
      category: row.category || 'General',
      description: row.description ?? '',
      unit: row.unit ?? 'unidad',
      cost_price: row.cost_price ?? 0,
      sale_price: row.sale_price ?? 0,
      emoji: row.emoji || '🩺',
    });
    imported += 1;
  }
  return { imported, skipped: duplicates.length, duplicates };
}
