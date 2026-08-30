import { getDb } from '../index';

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

export function findUserByUsername(username: string): UserRow | undefined {
  return getDb()
    .prepare('SELECT * FROM users WHERE username = ?')
    .get(username) as UserRow | undefined;
}

export function findUserById(id: number): UserRow | undefined {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as
    | UserRow
    | undefined;
}

export function createUser(
  username: string,
  passwordHash: string,
  name = '',
  role = 'admin',
): number {
  const info = getDb()
    .prepare(
      'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
    )
    .run(username, passwordHash, name, role);
  return Number(info.lastInsertRowid);
}
