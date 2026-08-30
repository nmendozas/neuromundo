import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { runMigrations } from './migrate';

let db: Database.Database | null = null;

/** Conexión singleton a SQLite (un solo archivo, persistente). */
export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(path.dirname(env.DB_PATH), { recursive: true });
    db = new Database(env.DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }
  return db;
}
