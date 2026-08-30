import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse, setAuthToken } from '@/server/api';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(data.token);
    return NextResponse.json({ user: data.user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
