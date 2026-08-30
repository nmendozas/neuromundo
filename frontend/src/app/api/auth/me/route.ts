import { NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { User } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<{ user: User }>('/api/auth/me');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
