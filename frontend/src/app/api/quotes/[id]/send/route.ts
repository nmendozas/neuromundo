import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean; emailStatus: string; to?: string }>(
      `/api/quotes/${ctx.params.id}/send`,
      { method: 'POST', body: JSON.stringify(body) },
    );
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
