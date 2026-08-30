import { randomBytes } from 'node:crypto';
import { getDb } from '../index';

export interface SessionWithUser {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    role: string;
  };
}

export function createSession(userId: number, ttlDays: number): string {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(
    Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  getDb()
    .prepare(
      'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
    )
    .run(token, userId, expiresAt);
  return token;
}

export function findSession(token: string): SessionWithUser | null {
  const row = getDb()
    .prepare(
      `SELECT s.token, s.expires_at, u.id AS user_id, u.username, u.name, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`,
    )
    .get(token) as
    | {
        token: string;
        expires_at: string;
        user_id: number;
        username: string;
        name: string;
        role: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    deleteSession(token);
    return null;
  }
  return {
    token: row.token,
    user: {
      id: row.user_id,
      username: row.username,
      name: row.name,
      role: row.role,
    },
  };
}

export function deleteSession(token: string): void {
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function deleteExpiredSessions(): void {
  getDb().prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString());
}
