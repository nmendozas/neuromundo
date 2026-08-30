import { apiDownload, apiErrorResponse } from '@/server/api';

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    return await apiDownload(`/api/quotes/${ctx.params.id}/pdf`);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
