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
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
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
  image_1: ['imagen_1', 'image_1', 'foto_1', 'photo_1', 'imagen_principal'],
  image_2: ['imagen_2', 'image_2', 'foto_2', 'photo_2'],
  image_3: ['imagen_3', 'image_3', 'foto_3', 'photo_3'],
  image_4: ['imagen_4', 'image_4', 'foto_4', 'photo_4'],
  image_5: ['imagen_5', 'image_5', 'foto_5', 'photo_5'],
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
  image_1: z.string().url().or(z.literal('')).default(''),
  image_2: z.string().url().or(z.literal('')).default(''),
  image_3: z.string().url().or(z.literal('')).default(''),
  image_4: z.string().url().or(z.literal('')).default(''),
  image_5: z.string().url().or(z.literal('')).default(''),
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
      image_1: row.image_1 ?? '', image_2: row.image_2 ?? '', image_3: row.image_3 ?? '',
      image_4: row.image_4 ?? '', image_5: row.image_5 ?? '',
    });
    imported += 1;
  }
  return { imported, skipped: duplicates.length, duplicates };
}
