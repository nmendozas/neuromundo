import Link from 'next/link';
import { apiFetch } from '@/server/api';
import type { Stats } from '@/types';
import { formatCOP, formatDate } from '@/types';
import { QUOTE_STATUS_LABELS } from '@/config/site';
import { Badge, Card } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats: Stats | null = null;
  let error: string | null = null;
  try {
    stats = await apiFetch<Stats>('/api/stats');
  } catch (err) {
    error = err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas.';
  }

  const cards = [
    { label: 'Ítems en catálogo', value: stats?.items ?? 0, emoji: '🧩' },
    { label: 'Cotizaciones', value: stats?.quotes ?? 0, emoji: '📄' },
    { label: 'Mensajes sin leer', value: stats?.messagesUnread ?? 0, emoji: '📬' },
    ...Object.entries(stats?.quotesByStatus ?? {}).map(([status, count]) => ({
      label: QUOTE_STATUS_LABELS[status] ?? status,
      value: count,
      emoji: '🏷️',
    })),
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Dashboard</h1>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl">{card.emoji}</p>
            <p className="mt-2 font-display text-3xl font-bold text-navy-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <Card title="Cotizaciones recientes">
        {!stats || stats.recentQuotes.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Aún no hay cotizaciones.{' '}
            <Link href="/admin/cotizaciones/nueva" className="font-semibold text-clinical-600 hover:underline">
              Crear la primera →
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-4">Número</th>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">
                      <Link href={`/admin/cotizaciones/${quote.id}`} className="font-mono text-xs font-semibold text-navy-900 hover:text-clinical-600">
                        {quote.number}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 font-medium">{quote.client_name}</td>
                    <td className="py-2.5 pr-4 text-slate-500">{formatDate(quote.created_at)}</td>
                    <td className="py-2.5 pr-4">
                      <Badge className="bg-slate-100 text-slate-600">{QUOTE_STATUS_LABELS[quote.status] ?? quote.status}</Badge>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{formatCOP(quote.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
