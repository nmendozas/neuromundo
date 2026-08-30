import { NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';

export async function POST() {
  try {
    const data = await apiFetch<{ ok: boolean; message?: string }>('/api/parameters/smtp-test', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
