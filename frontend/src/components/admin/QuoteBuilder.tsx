'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';
import type { Item, QuoteDetail } from '@/types';
import { Alert, Button, Card, Field, Input } from '@/components/admin/ui';

interface Row {
  key: string;
  item_id: number | null;
  reference: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function QuoteBuilder() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [client, setClient] = useState({ client_name: '', client_company: '', client_email: '', client_phone: '', client_nit: '' });
  const [discount, setDiscount] = useState('0');
  const [discountMode, setDiscountMode] = useState<'percent' | 'amount'>('percent');
  const [ivaPct, setIvaPct] = useState('19');
  const [validDays, setValidDays] = useState('30');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [itemsData, paramsData] = await Promise.all([
          clientFetch<Item[]>('/api/items'),
          clientFetch<{ parameters: Record<string, string> }>('/api/parameters'),
        ]);
        setItems(itemsData.filter((item) => item.active));
        const p = paramsData.parameters;
        if (p['quote.iva']) setIvaPct(p['quote.iva']);
        if (p['quote.valid_days']) setValidDays(p['quote.valid_days']);
        if (p['quote.discount_mode'] === 'amount' || p['quote.discount_mode'] === 'percent') {
          setDiscountMode(p['quote.discount_mode']);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos.');
      }
    })();
  }, []);

  const addItem = () => {
    if (!selectedId) return;
    const item = items.find((i) => String(i.id) === selectedId);
    if (!item) return;
    const already = rows.find((r) => r.item_id === item.id);
    if (already) {
      setRows((rs) => rs.map((r) => (r.key === already.key ? { ...r, quantity: r.quantity + 1 } : r)));
    } else {
      setRows((rs) => [
        ...rs,
        { key: `${item.id}-${Date.now()}`, item_id: item.id, reference: item.reference, name: item.name, unit: item.unit, quantity: 1, unit_price: item.sale_price || 0 },
      ]);
    }
  };

  const updateRow = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const totals = useMemo(() => {
    const subtotal = round2(rows.reduce((sum, r) => sum + r.quantity * r.unit_price, 0));
    const discountValue = discountMode === 'amount' ? round2(Number(discount) || 0) : round2((subtotal * (Number(discount) || 0)) / 100);
    const base = round2(subtotal - discountValue);
    const iva = round2((base * (Number(ivaPct) || 0)) / 100);
    const total = round2(base + iva);
    return { subtotal, discountValue, iva, total };
  }, [rows, discount, discountMode, ivaPct]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rows.length === 0) {
      setError('Agrega al menos un ítem a la cotización.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const data = await clientFetch<QuoteDetail>('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...client,
          items: rows.map((r) => ({ item_id: r.item_id, reference: r.reference, name: r.name, unit: r.unit, quantity: r.quantity, unit_price: r.unit_price })),
          discount: Number(discount) || 0,
          discount_mode: discountMode,
          iva_pct: Number(ivaPct) || 0,
          valid_days: Number(validDays) || 30,
          notes,
        }),
      });
      router.push(`/admin/cotizaciones/${data.quote.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la cotización.');
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('es-CO');

  return (
    <div className="space-y-6">
      {error && <Alert tone="error">{error}</Alert>}

      <Card title="Datos del cliente">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nombre del cliente *">
            <Input required value={client.client_name} onChange={(e) => setClient((c) => ({ ...c, client_name: e.target.value }))} placeholder="Clínica, hospital o persona" />
          </Field>
          <Field label="Empresa / IPS">
            <Input value={client.client_company} onChange={(e) => setClient((c) => ({ ...c, client_company: e.target.value }))} placeholder="Clínica Andes S.A.S" />
          </Field>
          <Field label="NIT">
            <Input value={client.client_nit} onChange={(e) => setClient((c) => ({ ...c, client_nit: e.target.value }))} placeholder="900.000.000-0" />
          </Field>
          <Field label="Correo">
            <Input type="email" value={client.client_email} onChange={(e) => setClient((c) => ({ ...c, client_email: e.target.value }))} placeholder="compras@ips.co" />
          </Field>
          <Field label="Teléfono">
            <Input value={client.client_phone} onChange={(e) => setClient((c) => ({ ...c, client_phone: e.target.value }))} placeholder="+57 300 000 0000" />
          </Field>
        </div>
      </Card>

      <Card title="Ítems de la cotización">
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <Field label="Agregar del catálogo" className="min-w-[260px] flex-1">
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-100">
              <option value="">Selecciona un insumo…</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.reference} — {item.name} (${item.sale_price.toLocaleString('es-CO')})
                </option>
              ))}
            </select>
          </Field>
          <Button type="button" onClick={addItem} disabled={!selectedId}>+ Agregar ítem</Button>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
            Aún no hay ítems. Selecciona insumos del catálogo para cotizar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-3">Insumo</th>
                  <th className="py-2 pr-3">Cant.</th>
                  <th className="py-2 pr-3 text-right">V. unitario</th>
                  <th className="py-2 pr-3 text-right">Total</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-slate-100">
                    <td className="py-2 pr-3">
                      <p className="font-semibold text-navy-900">{row.name}</p>
                      <p className="font-mono text-xs text-slate-400">{row.reference} · {row.unit}</p>
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.key, { quantity: Number(e.target.value) || 0 })}
                        className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-gold-400"
                      />
                    </td>
                    <td className="py-2 pr-3 text-right">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.unit_price}
                        onChange={(e) => updateRow(row.key, { unit_price: Number(e.target.value) || 0 })}
                        className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-gold-400"
                      />
                    </td>
                    <td className="py-2 pr-3 text-right font-semibold">{fmt(row.quantity * row.unit_price)}</td>
                    <td className="py-2 text-right">
                      <Button variant="ghost" onClick={() => setRows((rs) => rs.filter((r) => r.key !== row.key))}>✕</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Condiciones y totales">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={`Descuento (${discountMode === 'percent' ? '%' : 'COP'})`}>
            <Input type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </Field>
          <Field label="Modo de descuento">
            <select value={discountMode} onChange={(e) => setDiscountMode(e.target.value as 'percent' | 'amount')} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-100">
              <option value="percent">Porcentaje (%)</option>
              <option value="amount">Monto fijo (COP)</option>
            </select>
          </Field>
          <Field label="IVA (%)">
            <Input type="number" min={0} step="0.01" value={ivaPct} onChange={(e) => setIvaPct(e.target.value)} />
          </Field>
          <Field label="Validez (días)">
            <Input type="number" min={1} value={validDays} onChange={(e) => setValidDays(e.target.value)} />
          </Field>
          <Field label="Notas / condiciones" className="sm:col-span-2 lg:col-span-4">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Entrega a 15 días, incluye transporte…" />
          </Field>
        </div>

        <div className="mt-6 flex flex-col items-end gap-1 border-t border-slate-100 pt-4 text-sm">
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Subtotal</span><span>{fmt(totals.subtotal)}</span></p>
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">Descuento</span><span>- {fmt(totals.discountValue)}</span></p>
          <p className="flex w-full max-w-xs justify-between"><span className="text-slate-500">IVA ({ivaPct}%)</span><span>{fmt(totals.iva)}</span></p>
          <p className="flex w-full max-w-xs justify-between border-t border-slate-200 pt-2 font-display text-lg font-bold text-navy-900">
            <span>Total</span><span className="text-gold-600">{fmt(totals.total)}</span>
          </p>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={saving || rows.length === 0}>{saving ? 'Guardando…' : '💾 Guardar cotización'}</Button>
        <Button variant="secondary" onClick={() => router.push('/admin/cotizaciones')}>Cancelar</Button>
      </div>
    </div>
  );
}
