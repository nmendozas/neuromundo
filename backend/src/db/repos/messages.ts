import { getDb } from '../index';

export interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export function createMessage(input: ContactMessageInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO contact_messages (name, email, phone, service, message)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.email,
      input.phone ?? '',
      input.service ?? '',
      input.message,
    );
  return Number(info.lastInsertRowid);
}

export function listMessages(): ContactMessageRow[] {
  return getDb()
    .prepare('SELECT * FROM contact_messages ORDER BY is_read ASC, id DESC')
    .all() as unknown as ContactMessageRow[];
}

export function markMessageRead(id: number, isRead: number): void {
  getDb()
    .prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?')
    .run(isRead, id);
}

export function deleteMessage(id: number): void {
  getDb().prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
}

export function countUnreadMessages(): number {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) AS n FROM contact_messages WHERE is_read = 0",
    )
    .get() as { n: number };
  return Number(row.n);
}
