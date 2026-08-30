import { NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { ContactMessage } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<ContactMessage[]>('/api/contact/messages');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
