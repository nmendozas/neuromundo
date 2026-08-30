import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

/** Contenido por defecto del sitio (editable desde /admin/contenido). */
export const DEFAULT_CONTENT: Record<string, string> = {
  hero_eyebrow: '¡Un mundo de soluciones!',
  hero_title_1: 'Salud, tecnología y',
  hero_title_highlight: 'soluciones',
  hero_title_2: 'para tu IPS',
  hero_subtitle:
    'Suministro médico especializado, tercerización de facturación y radicación ante ADRES, SOAT, ARL y EPS, y asesoría integral para instituciones de salud en Colombia.',
  history_title: 'Nuestra historia',
  history_text:
    'NeuroMundo S.A.S nació con un propósito claro: acercar a las instituciones de salud colombianas un portafolio integral que combine insumos médicos de la más alta calidad con soluciones administrativas que optimicen su gestión financiera. Hoy somos el aliado estratégico de IPS, clínicas y hospitales que buscan tecnología importada, continuidad de suministro y resultados medibles.',
  mission_title: 'Misión',
  mission_text:
    'Proveer a las instituciones de salud insumos médicos y soluciones administrativas que optimicen su operación y sostenibilidad financiera, con estándares internacionales de calidad y seguridad clínica.',
  vision_title: 'Visión',
  vision_text:
    'Ser en 2028 el aliado estratégico líder del sector salud en Colombia, reconocido por la excelencia en el suministro, la innovación tecnológica y la recuperación eficiente de cartera.',
  values_title: 'Nuestros valores',
  values_text:
    'Confianza, calidad, oportunidad, transparencia y compromiso con la vida.',
  contact_title: 'Un mundo de soluciones para tu IPS',
  contact_text:
    'Cuéntanos qué línea de servicio necesitas — suministro, facturación, radicación, capacitación o asesoría — y diseñamos una propuesta a la medida de tu institución.',
};

/** Parámetros por defecto (empresa + cotización). */
export const DEFAULT_PARAMETERS: Record<string, string> = {
  'company.name': 'NeuroMundo S.A.S',
  'company.slogan': '¡Un mundo de soluciones!',
  'company.nit': '',
  'company.address': '',
  'company.city': 'Colombia',
  'company.phone': '+57 300 800 6572',
  'company.whatsapp': '573052743878',
  'company.email': 'gerencianeuromundo@gmail.com',
  'company.email2': 'conderamirojose@gmail.com',
  'quote.prefix': 'NM',
  'quote.iva': '19',
  'quote.valid_days': '30',
  'quote.discount_mode': 'percent',
  'quote.currency': 'COP',
  'quote.footer_note':
    'Los precios incluyen IVA. Cotización sujeta a disponibilidad de inventario y a condiciones comerciales pactadas.',
};

/**
 * Crea las tablas (si no existen) y siembra el usuario admin,
 * el contenido y los parámetros por defecto.
 */
export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS parameters (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      description TEXT NOT NULL DEFAULT '',
      unit TEXT NOT NULL DEFAULT 'unidad',
      cost_price REAL NOT NULL DEFAULT 0,
      sale_price REAL NOT NULL DEFAULT 0,
      emoji TEXT NOT NULL DEFAULT '🩺',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL UNIQUE,
      client_name TEXT NOT NULL,
      client_company TEXT NOT NULL DEFAULT '',
      client_email TEXT NOT NULL DEFAULT '',
      client_phone TEXT NOT NULL DEFAULT '',
      client_nit TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'borrador',
      subtotal REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      iva REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'COP',
      valid_days INTEGER NOT NULL DEFAULT 30,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quote_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
      reference TEXT NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'unidad',
      quantity REAL NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      service TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);
    CREATE INDEX IF NOT EXISTS idx_items_active ON items(active);
    CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
  `);

  // ─── Seed: usuario administrador inicial ───
  const admin = db
    .prepare('SELECT id FROM users WHERE username = ?')
    .get(env.ADMIN_USERNAME) as { id: number } | undefined;
  if (!admin) {
    const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, 10);
    db.prepare(
      'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
    ).run(env.ADMIN_USERNAME, hash, 'Administrador', 'admin');
  }

  // ─── Seed: contenido y parámetros por defecto (no sobreescribe ediciones) ───
  const upsert = db.prepare(
    'INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)',
  );
  for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
    upsert.run(key, value);
  }

  const upsertParam = db.prepare(
    'INSERT OR IGNORE INTO parameters (key, value) VALUES (?, ?)',
  );
  for (const [key, value] of Object.entries(DEFAULT_PARAMETERS)) {
    upsertParam.run(key, value);
  }
}



