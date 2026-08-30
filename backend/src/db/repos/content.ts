import { getDb } from '../index';

/** Devuelve todo el contenido del sitio como mapa key → value. */
export function getContentMap(): Record<string, string> {
  const rows = getDb().prepare('SELECT key, value FROM site_content').all() as {
    key: string;
    value: string;
  }[];
  const out: Record<string, string> = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}

export function setContent(key: string, value: string): void {
  getDb()
    .prepare(
      `INSERT INTO site_content (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(key, value);
}

export function updateContent(entries: Record<string, string>): void {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO site_content (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
  db.transaction(() => {
    for (const [key, value] of Object.entries(entries)) {
      stmt.run(key, value);
    }
  })();
}
