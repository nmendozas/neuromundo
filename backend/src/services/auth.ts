import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { findUserByUsername, type UserRow } from '../db/repos/users';
import {
  createSession,
  deleteSession,
  findSession,
} from '../db/repos/sessions';

export interface PublicUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

function toPublic(user: UserRow): PublicUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
}

/** Valida credenciales y crea una sesión. Devuelve null si son inválidas. */
export function login(
  username: string,
  password: string,
): { token: string; user: PublicUser } | null {
  const user = findUserByUsername(username.trim());
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  const token = createSession(user.id, env.TOKEN_TTL_DAYS);
  return { token, user: toPublic(user) };
}

export function logout(token: string): void {
  deleteSession(token);
}

/** Valida un token de sesión. Devuelve null si es inválido o expiró. */
export function getUserByToken(token: string): PublicUser | null {
  const session = findSession(token);
  return session ? session.user : null;
}
