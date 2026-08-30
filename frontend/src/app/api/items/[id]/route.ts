import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { Item } from '@/types';

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const data = await apiFetch<Item>(`/api/items/${ctx.params.id}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = await apiFetch<Item>(`/api/items/${ctx.params.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    await apiFetch<void>(`/api/items/${ctx.params.id}`, { method: 'DELETE' });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
