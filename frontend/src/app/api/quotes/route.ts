import { NextRequest, NextResponse } from 'next/server';
import { apiFetch, apiErrorResponse } from '@/server/api';
import type { Quote, QuoteDetail } from '@/types';

export async function GET() {
  try {
    const data = await apiFetch<Quote[]>('/api/quotes');
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await apiFetch<QuoteDetail>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
