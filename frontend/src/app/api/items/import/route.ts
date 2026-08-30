import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL, TOKEN_COOKIE, ApiError } from '@/server/api';

/** Reenvía el archivo (multipart) de importación hacia la API Express. */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const token = cookies().get(TOKEN_COOKIE)?.value;
    const res = await fetch(`${API_URL}/api/items/import`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) throw new ApiError(res.status, data?.error ?? 'Error al importar');
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno al importar' }, { status: 500 });
  }
}
