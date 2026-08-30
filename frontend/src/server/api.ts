import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { User } from '@/types';

export const TOKEN_COOKIE = 'nm_token';
export const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Convierte un error de API en una NextResponse JSON (para BFF). */
export function apiErrorResponse(error: unknown): NextResponse {
  const err =
    error instanceof ApiError
      ? error
      : new ApiError(500, error instanceof Error ? error.message : 'Error interno del servidor');
  return NextResponse.json({ error: err.message }, { status: err.status });
}

/**
 * Cliente de servidor hacia la API Express.
 * Inyecta el token de la cookie httpOnly como Bearer.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  const headers: Record<string, string> = {};
  if (init.body && !(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      message = data.error ?? message;
    } catch {
      /* sin cuerpo JSON */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Descarga de archivos (PDF/Excel) reenviando el Content-Disposition. */
export async function apiDownload(path: string): Promise<Response> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
    cache: 'no-store',
  });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      message = data.error ?? message;
    } catch {
      /* sin cuerpo JSON */
    }
    throw new ApiError(res.status, message);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const disposition = res.headers.get('content-disposition') ?? '';
  return new Response(new Uint8Array(buf), {
    headers: { 'Content-Type': contentType, 'Content-Disposition': disposition },
  });
}

export function setAuthToken(token: string): void {
  cookies().set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthToken(): void {
  cookies().delete(TOKEN_COOKIE);
}

/** Usuario de la sesión actual o null si no está autenticado. */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const data = await apiFetch<{ user: User }>('/api/auth/me');
    return data.user;
  } catch {
    return null;
  }
}
