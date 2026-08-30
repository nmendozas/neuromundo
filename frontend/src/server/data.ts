import { DEFAULT_CONTENT, DEFAULT_PARAMETERS } from '@/config/site';
import type { Item, SiteInfo } from '@/types';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

/**
 * Obtiene el contenido del sitio desde la API (renderizado en servidor).
 * Si la API no responde (build, caída temporal), usa los defaults locales.
 */
export async function fetchSiteInfo(): Promise<SiteInfo> {
  try {
    const res = await fetch(`${API_URL}/api/content`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { content?: Record<string, string>; parameters?: Record<string, string> };
    return {
      content: { ...DEFAULT_CONTENT, ...(data.content ?? {}) },
      parameters: { ...DEFAULT_PARAMETERS, ...(data.parameters ?? {}) },
    };
  } catch {
    return { content: DEFAULT_CONTENT, parameters: DEFAULT_PARAMETERS };
  }
}

/** Obtiene los ítems activos del catálogo (público). Vacío si la API falla. */
export async function fetchCatalogItems(): Promise<Item[]> {
  try {
    const res = await fetch(`${API_URL}/api/items`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Item[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
