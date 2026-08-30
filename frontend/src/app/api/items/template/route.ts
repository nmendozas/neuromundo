import { apiDownload, apiErrorResponse } from '@/server/api';

export async function GET() {
  try {
    return await apiDownload('/api/items/template');
  } catch (error) {
    return apiErrorResponse(error);
  }
}
