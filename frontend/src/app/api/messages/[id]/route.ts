import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean }>(`/api/contact/messages/${ctx.params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    await apiFetch<void>(`/api/contact/messages/${ctx.params.id}`, { method: 'DELETE' });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
