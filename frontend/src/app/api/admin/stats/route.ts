import { NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { Stats } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<Stats>('/api/stats');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
