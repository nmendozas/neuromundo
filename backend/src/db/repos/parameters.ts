import { getDb } from '../index';

export function getParametersMap(): Record<string, string> {
  const rows = getDb()
    .prepare('SELECT key, value FROM parameters')
    .all() as { key: string; value: string }[];
  const out: Record<string, string> = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}

export function getParameter(key: string, fallback = ''): string {
  const row = getDb()
    .prepare('SELECT value FROM parameters WHERE key = ?')
    .get(key) as { value: string } | undefined;
  return row?.value ?? fallback;
}

export function getParameterFloat(key: string, fallback = 0): number {
  const value = Number.parseFloat(getParameter(key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

export function getParameterInt(key: string, fallback = 0): number {
  const value = Number.parseInt(getParameter(key, String(fallback)), 10);
  return Number.isFinite(value) ? value : fallback;
}

export function updateParameters(entries: Record<string, string>): void {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO parameters (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
  db.transaction(() => {
    for (const [key, value] of Object.entries(entries)) {
      stmt.run(key, String(value ?? ''));
    }
  })();
}
