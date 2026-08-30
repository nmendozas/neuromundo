'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { clientFetch } from '@/lib/client-api';
import type { Quote } from '@/types';
import { formatCOP, formatDate } from '@/types';
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_TONES } from '@/config/site';
import { Alert, Badge, Button, Card, Select, Spinner } from '@/components/admin/ui';

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'borrador', label: 'Borradores' },
  { value: 'enviada', label: 'Enviadas' },
  { value: 'aceptada', label: 'Aceptadas' },
  { value: 'rechazada', label: 'Rechazadas' },
];

export function QuoteList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setQuotes(await clientFetch<Quote[]>('/api/quotes'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las cotizaciones.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <Card
      title="Cotizaciones"
      actions={
        <div className="flex items-center gap-3">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-auto">
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </Select>
          <Link href="/admin/cotizaciones/nueva">
            <Button>+ Nueva cotización</Button>
          </Link>
        </div>
      }
    >
      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4">Número</th>
                <th className="py-3 pr-4">Cliente</th>
                <th className="py-3 pr-4">Fecha</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3 pr-4 text-right">Total</th>
                <th className="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => (
                <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-navy-900">{quote.number}</td>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-navy-900">{quote.client_name}</p>
                    <p className="text-xs text-slate-400">{quote.client_company || quote.client_email || ''}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{formatDate(quote.created_at)}</td>
                  <td className="py-3 pr-4">
                    <Badge className={QUOTE_STATUS_TONES[quote.status] ?? 'bg-slate-100 text-slate-600'}>
                      {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold text-navy-900">{formatCOP(quote.total)} {quote.currency}</td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/cotizaciones/${quote.id}`} className="inline-flex items-center rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-800">
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    No hay cotizaciones con este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
