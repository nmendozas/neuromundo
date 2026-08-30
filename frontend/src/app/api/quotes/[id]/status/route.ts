import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean }>(`/api/quotes/${ctx.params.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
