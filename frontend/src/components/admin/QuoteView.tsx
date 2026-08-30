'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';
import type { QuoteDetail } from '@/types';
import { formatCOP, formatDate } from '@/types';
import { QUOTE_STATUS_LABELS, QUOTE_STATUS_TONES } from '@/config/site';
import { Alert, Badge, Button, Card, Input, Spinner } from '@/components/admin/ui';

export function QuoteView({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const detail = await clientFetch<QuoteDetail>(`/api/quotes/${id}`);
      setData(detail);
      setEmailTo(detail.quote.client_email || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la cotización.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (status: string) => {
    try {
      await clientFetch(`/api/quotes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setMessage(`Estado actualizado a "${QUOTE_STATUS_LABELS[status] ?? status}".`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado.');
    }
  };

  const sendEmail = async () => {
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const result = await clientFetch<{ ok: boolean; emailStatus: string; to: string }>(`/api/quotes/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo }),
      });
      setMessage(`Correo enviado a ${result.to} con el PDF adjunto ✅`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta cotización? Esta acción no se puede deshacer.')) return;
    await clientFetch(`/api/quotes/${id}`, { method: 'DELETE' });
    router.push('/admin/cotizaciones');
  };

  if (loading) return <Spinner />;
  if (error || !data) return <Alert tone="error">{error ?? 'Cotización no encontrada'}</Alert>;

  const { quote, items } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/cotizaciones" className="text-sm font-semibold text-slate-500 hover:text-navy-900">← Volver</Link>
          <h1 className="font-display text-2xl font-bold text-navy-900">{quote.number}</h1>
          <Badge className={QUOTE_STATUS_TONES[quote.status] ?? 'bg-slate-100 text-slate-600'}>
            {QUOTE_STATUS_LABELS[quote.status] ?? quote.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href={`/api/quotes/${id}/pdf`} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500">⬇️ PDF</a>
          <a href={`/api/quotes/${id}/excel`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">⬇️ Excel</a>
          <Button onClick={() => setShowEmail((v) => !v)}>{showEmail ? 'Ocultar correo' : '✉️ Enviar por correo'}</Button>
          <Button variant="danger" onClick={handleDelete}>🗑 Eliminar</Button>
        </div>
      </div>

      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {showEmail && (
        <Card title="Enviar cotización por correo">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[280px] flex-1">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Correo del destinatario</span>
              <Input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="cliente@ips.co" />
            </div>
            <Button onClick={sendEmail} disabled={sending || !emailTo}>{sending ? 'Enviando…' : 'Enviar con PDF adjunto'}</Button>
          </div>
        </Card>
      )}

      <Card title="Datos del cliente">
        <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-xs uppercase tracking-wider text-slate-400">Cliente</p><p className="mt-1 font-semibold text-navy-900">{quote.client_name}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-slate-400">Empresa</p><p className="mt-1 text-navy-900">{quote.client_company || '—'}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-slate-400">NIT</p><p className="mt-1 text-navy-900">{quote.client_nit || '—'}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-slate-400">Correo</p><p className="mt-1 text-navy-900">{quote.client_email || '—'}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-slate-400">Teléfono</p><p className="mt-1 text-navy-900">{quote.client_phone || '—'}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-slate-400">Validez</p><p className="mt-1 text-navy-900">{quote.valid_days} días · Creada el {formatDate(quote.created_at)}</p></div>
        </div>
      </Card>

      <Card title={`Detalle (${items.length} ítems)`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-3">Referencia</th>
                <th className="py-2 pr-3">Descripción</th>
                <th className="py-2 pr-3">Cant.</th>
                <th className="py-2 pr-3 text-right">V. unitario</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2.5 pr-3 font-mono text-xs">{item.reference}</td>
                  <td className="py-2.5 pr-3 font-medium text-navy-900">{item.name}</td>
                  <td className="py-2.5 pr-3">{item.quantity} {item.unit}</td>
                  <td className="py-2.5 pr-3 text-right">{formatCOP(item.unit_price)}</td>
                  <td className="py-2.5 text-right font-semibold">{formatCOP(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-end gap-1 text-sm">
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCOP(quote.subtotal)}</span></p>
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Descuento</span><span>- {formatCOP(quote.discount)}</span></p>
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">IVA</span><span>{formatCOP(quote.iva)}</span></p>
          <p className="flex w-full max-w-xs justify-between border-t border-slate-200 pt-2 font-display text-lg font-bold text-navy-900">
            <span>Total</span><span className="text-gold-600">{formatCOP(quote.total)} {quote.currency}</span>
          </p>
          {quote.notes && <p className="mt-3 w-full rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">📝 {quote.notes}</p>}
        </div>
      </Card>

      <Card title="Cambiar estado">
        <div className="flex flex-wrap gap-2">
          {Object.entries(QUOTE_STATUS_LABELS).map(([value, label]) => (
            <Button key={value} variant={quote.status === value ? 'primary' : 'secondary'} onClick={() => changeStatus(value)}>
              {label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
