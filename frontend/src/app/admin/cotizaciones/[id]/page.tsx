import { QuoteView } from '@/components/admin/QuoteView';

export const dynamic = 'force-dynamic';

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  return <QuoteView id={params.id} />;
}
