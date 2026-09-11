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
  portfolio_title: 'Portafolio de Servicios',
  portfolio_subtitle:
    'Suministro médico especializado, tercerización de facturación y radicación ante ADRES, SOAT, ARL y EPS, y asesoría integral para instituciones de salud en Colombia.',
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
  'company.contact_name': 'Ramiro José Conde Hernández',
  'company.contact_role': 'Gerente · Abogado',
  'quote.prefix': 'NM',
  'quote.iva': '19',
  'quote.valid_days': '30',
  'quote.discount_mode': 'percent',
  'quote.currency': 'COP',
  'quote.footer_note':
    'Los precios incluyen IVA. Cotización sujeta a disponibilidad de inventario y a condiciones comerciales pactadas.',
};

export interface DefaultItem {
  reference: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  cost_price: number;
  sale_price: number;
  emoji: string;
  featured: number;
}

/** Ítems médicos y suministros por defecto para el catálogo inicial. */
export const DEFAULT_ITEMS: DefaultItem[] = [
  {
    reference: 'MAOS-01',
    name: 'Placas de Osteosíntesis Bloqueadas LCP',
    category: 'Osteosíntesis y Prótesis',
    description: 'Sistema anatómico de titanio grado médico para reducción y fijación de fracturas complejas en miembros superiores e inferiores.',
    unit: 'unidad',
    cost_price: 320000,
    sale_price: 490000,
    emoji: '🦴',
    featured: 1,
  },
  {
    reference: 'MAOS-02',
    name: 'Tornillos Canulados de Titanio Grado Médico',
    category: 'Osteosíntesis y Prótesis',
    description: 'Tornillos canulados autorroscantes para compresión interfragmentaria guiada de alta precisión.',
    unit: 'unidad',
    cost_price: 85000,
    sale_price: 135000,
    emoji: '🔩',
    featured: 1,
  },
  {
    reference: 'UCI-01',
    name: 'Circuito de Ventilación Mecánica Adulto/Pediátrico',
    category: 'UCI y Hospitalización',
    description: 'Circuito corrugado doble rama con trampa de agua, línea de monitoreo y filtro bacteriano HMEF integrado.',
    unit: 'set',
    cost_price: 45000,
    sale_price: 78000,
    emoji: '🫁',
    featured: 1,
  },
  {
    reference: 'UCI-02',
    name: 'Catéter Venoso Central Trilumen 7 Fr x 20 cm',
    category: 'UCI y Hospitalización',
    description: 'Kit estéril completo para acceso vascular central guiado por técnica Seldinger en cuidados intensivos.',
    unit: 'kit',
    cost_price: 65000,
    sale_price: 110000,
    emoji: '💉',
    featured: 1,
  },
  {
    reference: 'NEURO-01',
    name: 'Sistema de Fijación y Craneoplastia de Titanio',
    category: 'Neurocirugía',
    description: 'Mallas conformables y miniplacas de bajo perfil para reconstrucción craneofacial y cierre de craneotomías.',
    unit: 'unidad',
    cost_price: 450000,
    sale_price: 680000,
    emoji: '🧠',
    featured: 1,
  },
  {
    reference: 'ORTO-01',
    name: 'Prótesis Total de Cadera Modular',
    category: 'Ortopedia y Artroplastia',
    description: 'Vástago femoral de titanio poroso y cotiloilo acetabular de alta resistencia con recubrimiento de hidroxiapatita.',
    unit: 'sistema',
    cost_price: 2800000,
    sale_price: 3950000,
    emoji: '🦿',
    featured: 0,
  },
  {
    reference: 'UCI-03',
    name: 'Tubo Endotraqueal con Aspiración Subglótica',
    category: 'UCI y Hospitalización',
    description: 'Tubo de PVC grado médico con balón de baja presión y canal auxiliar para prevención de neumonía asociada a ventilador.',
    unit: 'unidad',
    cost_price: 28000,
    sale_price: 48000,
    emoji: '🩺',
    featured: 0,
  },
  {
    reference: 'CIR-01',
    name: 'Set Instrumental Quirúrgico de Laparoscopia HD',
    category: 'Cirugía e Instrumental',
    description: 'Disectores, pinzas Maryland, tijeras metzenbaum y trocares con aislamiento reforzado para cirugía mínimamente invasiva.',
    unit: 'set',
    cost_price: 1200000,
    sale_price: 1750000,
    emoji: '🔬',
    featured: 0,
  },
  {
    reference: 'DIAG-01',
    name: 'Monitor de Signos Vitales Multiparámetro',
    category: 'Equipos Médicos',
    description: 'Monitoreo simultáneo de ECG de 5 derivadas, SpO2, PNI, frecuencia respiratoria, temperatura dual y capnografía.',
    unit: 'equipo',
    cost_price: 3500000,
    sale_price: 4800000,
    emoji: '📊',
    featured: 0,
  },
  {
    reference: 'INF-01',
    name: 'Bomba de Infusión Volumétrica Peristáltica',
    category: 'Equipos Médicos',
    description: 'Bomba digital de alta precisión para infusión continua de soluciones y anestésicos con sistema antilibro y alarmas.',
    unit: 'equipo',
    cost_price: 2100000,
    sale_price: 2950000,
    emoji: '⚡',
    featured: 0,
  },
  {
    reference: 'CIR-02',
    name: 'Suturas Quirúrgicas Sintéticas Absorbibles',
    category: 'Cirugía e Instrumental',
    description: 'Poliglactina 910 y polidioxanona con aguja atraumática de acero inoxidable serie 300 para aproximación de tejidos.',
    unit: 'caja x 24',
    cost_price: 95000,
    sale_price: 145000,
    emoji: '🧵',
    featured: 0,
  },
  {
    reference: 'ANEST-01',
    name: 'Sensor de Oximetría SpO2 Reutilizable',
    category: 'UCI y Hospitalización',
    description: 'Sensor digital de pulso compatible con monitores de grado clínico para pacientes adultos y pediátricos.',
    unit: 'unidad',
    cost_price: 75000,
    sale_price: 125000,
    emoji: '🩻',
    featured: 0,
  },
];

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
      image_1 TEXT NOT NULL DEFAULT '',
      image_2 TEXT NOT NULL DEFAULT '',
      image_3 TEXT NOT NULL DEFAULT '',
      image_4 TEXT NOT NULL DEFAULT '',
      image_5 TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
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

  // Compatibilidad con bases de datos creadas antes de la galería de imágenes.
  for (const column of ['image_1', 'image_2', 'image_3', 'image_4', 'image_5']) {
    try {
      db.exec(`ALTER TABLE items ADD COLUMN ${column} TEXT NOT NULL DEFAULT ''`);
    } catch {
      // La columna ya existe; no hay nada que migrar.
    }
  }
  try {
    db.exec('ALTER TABLE items ADD COLUMN featured INTEGER NOT NULL DEFAULT 0');
  } catch {
    // La columna ya existe; no hay nada que migrar.
  }

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

  // ─── Seed: catálogo de ítems inicial (si la tabla está vacía) ───
  const countRow = db.prepare('SELECT count(*) as c FROM items').get() as { c: number };
  if (countRow.c === 0) {
    const insertItem = db.prepare(`
      INSERT INTO items (reference, name, category, description, unit, cost_price, sale_price, emoji, featured, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const item of DEFAULT_ITEMS) {
      insertItem.run(
        item.reference,
        item.name,
        item.category,
        item.description,
        item.unit,
        item.cost_price,
        item.sale_price,
        item.emoji,
        item.featured,
      );
    }
  }
}
