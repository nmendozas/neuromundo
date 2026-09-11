'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { clientFetch } from '@/lib/client-api';
import { Alert, Button, Card, Field, Input, Spinner, Textarea } from '@/components/admin/ui';

interface ParamsResponse {
  parameters: Record<string, string>;
  smtp_configured: boolean;
}

const COMPANY_FIELDS: Array<[string, string]> = [
  ['company.name', 'Nombre de la empresa'],
  ['company.slogan', 'Eslogan'],
  ['company.nit', 'NIT'],
  ['company.address', 'Dirección'],
  ['company.city', 'Ciudad'],
  ['company.phone', 'Teléfono'],
  ['company.whatsapp', 'WhatsApp (código país + número)'],
  ['company.email', 'Correo principal'],
  ['company.email2', 'Correo secundario'],
  ['company.contact_name', 'Nombre del contacto'],
  ['company.contact_role', 'Cargo del contacto'],
];

const QUOTE_FIELDS: Array<[string, string]> = [
  ['quote.prefix', 'Prefijo de numeración'],
  ['quote.iva', 'IVA (%)'],
  ['quote.valid_days', 'Validez (días)'],
  ['quote.discount_mode', 'Modo de descuento (percent | amount)'],
  ['quote.currency', 'Moneda'],
  ['quote.footer_note', 'Nota de pie en PDF'],
];

export function ParametersEditor() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await clientFetch<ParamsResponse>('/api/parameters');
        setParams(data.parameters);
        setSmtpConfigured(data.smtp_configured);
      } catch (err) {
        setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'No se pudieron cargar los parámetros.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key: string, value: string) => setParams((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await clientFetch('/api/parameters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters: params }),
      });
      setMessage({ tone: 'success', text: 'Parámetros guardados correctamente.' });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const testSmtp = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const data = await clientFetch<{ ok: boolean; message?: string }>('/api/parameters/smtp-test', { method: 'POST' });
      setMessage({ tone: 'success', text: data.message ?? 'Conexión SMTP exitosa ✅' });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Conexión SMTP fallida.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      <Card title="Datos de la empresa">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPANY_FIELDS.map(([key, label]) => (
            <Field key={key} label={label}>
              <Input value={params[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Parámetros de cotización">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUOTE_FIELDS.map(([key, label]) =>
            key === 'quote.footer_note' ? (
              <Field key={key} label={label} className="sm:col-span-2 lg:col-span-3">
                <Textarea rows={2} value={params[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
              </Field>
            ) : (
              <Field key={key} label={label}>
                <Input value={params[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
              </Field>
            ),
          )}
        </div>
      </Card>

      <Card title="Correo (SMTP)">
        <p className="text-sm text-slate-500">
          El servidor de correo se configura con variables de entorno en el contenedor
          (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">SMTP_HOST</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">SMTP_USER</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">SMTP_PASS</code>).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${smtpConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {smtpConfigured ? '● SMTP configurado' : '○ SMTP no configurado'}
          </span>
          <Button type="button" variant="secondary" onClick={testSmtp} disabled={!smtpConfigured || testing}>
            {testing ? 'Probando…' : 'Probar conexión'}
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Guardando…' : '💾 Guardar parámetros'}</Button>
      </div>
    </form>
  );
}
