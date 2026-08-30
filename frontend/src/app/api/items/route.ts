import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { Item } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<Item[]>('/api/items');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<Item>('/api/items', { method: 'POST', body: JSON.stringify(body) });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
