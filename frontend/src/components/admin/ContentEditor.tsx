'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { clientFetch } from '@/lib/client-api';
import type { SiteInfo } from '@/types';
import { Alert, Button, Card, Field, Input, Spinner, Textarea } from '@/components/admin/ui';
import { DEFAULT_PORTFOLIO } from '@/config/site';

const GROUPS: Array<{ title: string; fields: Array<[string, string]> }> = [
  {
    title: 'Hero (inicio)',
    fields: [
      ['hero_eyebrow', 'Frase corta superior'],
      ['hero_title_1', 'Título parte 1'],
      ['hero_title_highlight', 'Título resaltado'],
      ['hero_title_2', 'Título parte 2'],
      ['hero_subtitle', 'Subtítulo'],
    ],
  },
  {
    title: 'Historia',
    fields: [
      ['history_title', 'Título de la sección'],
      ['history_text', 'Texto de la historia'],
    ],
  },
  {
    title: 'Misión',
    fields: [
      ['mission_title', 'Título'],
      ['mission_text', 'Texto'],
    ],
  },
  {
    title: 'Visión',
    fields: [
      ['vision_title', 'Título'],
      ['vision_text', 'Texto'],
    ],
  },
  {
    title: 'Valores',
    fields: [
      ['values_title', 'Título'],
      ['values_text', 'Valores separados por coma'],
    ],
  },
  {
    title: 'Contacto',
    fields: [
      ['contact_title', 'Título de la sección'],
      ['contact_text', 'Texto de la sección'],
    ],
  },
];

const TEXTAREAS = new Set(['hero_subtitle', 'history_text', 'mission_text', 'vision_text', 'values_text', 'contact_text']);

export function ContentEditor() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const info = await clientFetch<SiteInfo>('/api/content');
        setContent(info.content);
      } catch (err) {
        setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'No se pudo cargar el contenido.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key: string, value: string) => setContent((c) => ({ ...c, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await clientFetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      setMessage({ tone: 'success', text: 'Contenido guardado. La web pública ya lo muestra.' });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      {GROUPS.map((group) => (
        <Card key={group.title} title={group.title}>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map(([key, label]) =>
              TEXTAREAS.has(key) ? (
                <Field key={key} label={label} className="sm:col-span-2">
                  <Textarea rows={4} value={content[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
                </Field>
              ) : (
                <Field key={key} label={label}>
                  <Input value={content[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
                </Field>
              ),
            )}
          </div>
        </Card>
      ))}

      <Card title="Portafolio público">
        <p className="mb-4 text-sm text-slate-500">Edita las tarjetas y la vista personalizada de cada servicio. La URL se genera con el identificador del servicio.</p>
        <Field label="Título de la vista"><Input value={content.portfolio_title ?? ''} onChange={(e) => set('portfolio_title', e.target.value)} /></Field>
        <Field label="Subtítulo de la vista" className="mt-4"><Textarea rows={3} value={content.portfolio_subtitle ?? ''} onChange={(e) => set('portfolio_subtitle', e.target.value)} /></Field>
        <div className="mt-6 space-y-5">
          {(() => {
            let services = DEFAULT_PORTFOLIO;
            try { const parsed = JSON.parse(content.portfolio_services ?? 'null'); if (Array.isArray(parsed)) services = parsed; } catch { /* usa defaults */ }
            return services.map((service, index) => (
              <div key={service.id} className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 font-semibold text-navy-900">{service.num}. {service.title}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input aria-label="Título" value={service.title} onChange={(e) => { const next = [...services]; next[index] = { ...service, title: e.target.value }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Input aria-label="Categoría" value={service.category} onChange={(e) => { const next = [...services]; next[index] = { ...service, category: e.target.value }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Textarea aria-label="Descripción" rows={2} className="sm:col-span-2" value={service.description} onChange={(e) => { const next = [...services]; next[index] = { ...service, description: e.target.value }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Textarea aria-label="Detalles (uno por línea)" rows={4} className="sm:col-span-2" value={service.details.join('\n')} onChange={(e) => { const next = [...services]; next[index] = { ...service, details: e.target.value.split('\n').filter(Boolean) }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Textarea aria-label="Descripción completa" placeholder="Descripción que aparecerá en el detalle" rows={3} className="sm:col-span-2" value={service.longDescription ?? ''} onChange={(e) => { const next = [...services]; next[index] = { ...service, longDescription: e.target.value }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Textarea aria-label="Beneficios (uno por línea)" placeholder="Beneficios de la solución, uno por línea" rows={3} className="sm:col-span-2" value={(service.benefits ?? []).join('\n')} onChange={(e) => { const next = [...services]; next[index] = { ...service, benefits: e.target.value.split('\n').filter(Boolean) }; set('portfolio_services', JSON.stringify(next)); }} />
                  <Textarea aria-label="Proceso (uno por línea)" placeholder="Pasos del proceso, uno por línea" rows={3} className="sm:col-span-2" value={(service.process ?? []).join('\n')} onChange={(e) => { const next = [...services]; next[index] = { ...service, process: e.target.value.split('\n').filter(Boolean) }; set('portfolio_services', JSON.stringify(next)); }} />
                </div>
              </div>
            ));
          })()}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Guardando…' : '💾 Guardar contenido'}</Button>
        <span className="text-xs text-slate-400">Los cambios se reflejan de inmediato en la página pública.</span>
      </div>
    </form>
  );
}
