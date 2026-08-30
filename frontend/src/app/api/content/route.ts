import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { SiteInfo } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<SiteInfo>('/api/content');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean }>('/api/content', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
