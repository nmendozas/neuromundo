import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

export async function GET() {
  try {
    const data = await apiFetch<{ parameters: Record<string, string>; smtp_configured: boolean }>(
      '/api/parameters',
    );
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ ok: boolean }>('/api/parameters', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
