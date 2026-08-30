import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

/** Formulario público de contacto: guarda el mensaje y notifica por correo. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean; id: number; emailStatus: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
