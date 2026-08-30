import { NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse, clearAuthToken } from '@/server/api';

export async function POST() {
  try {
    await apiFetch<void>('/api/auth/logout', { method: 'POST' });
  } catch {
    /* la sesión puede ya no existir en la API; igual limpiamos la cookie */
  }
  clearAuthToken();
  return NextResponse.json({ ok: true });
}
