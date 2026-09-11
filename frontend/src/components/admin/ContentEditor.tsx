'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { clientFetch } from '@/lib/client-api';
import type { SiteInfo } from '@/types';
import { Alert, Button, Card, Field, Input, Spinner, Textarea } from '@/components/admin/ui';

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

const TABS = [
  { id: 'home', label: 'Inicio', groups: ['Hero (inicio)'] },
  { id: 'about', label: 'Nosotros', groups: ['Historia', 'Misión', 'Visión', 'Valores'] },
  { id: 'contact', label: 'Contacto', groups: ['Contacto'] },
  { id: 'portfolio', label: 'Portafolio', groups: ['Portafolio público'] },
] as const;

export function ContentEditor() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('home');
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

      <div className="sticky top-4 z-20 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {GROUPS.filter((group) => (TABS.find((tab) => tab.id === activeTab)?.groups as readonly string[] | undefined)?.includes(group.title)).map((group) => (
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

      {activeTab === 'portfolio' && <Card title="Portafolio público">
        <p className="mb-4 text-sm text-slate-500">Aquí solo se edita el contenido editorial. Las tarjetas y los ítems publicados se administran exclusivamente desde el catálogo.</p>
        <Field label="Título de la vista"><Input value={content.portfolio_title ?? ''} onChange={(e) => set('portfolio_title', e.target.value)} /></Field>
        <Field label="Subtítulo de la vista" className="mt-4"><Textarea rows={3} value={content.portfolio_subtitle ?? ''} onChange={(e) => set('portfolio_subtitle', e.target.value)} /></Field>
        <Link href="/admin/items" className="mt-6 inline-flex bg-navy-950 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-white hover:bg-navy-800">Administrar ítems del catálogo →</Link>
      </Card>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Guardando…' : '💾 Guardar contenido'}</Button>
        <span className="text-xs text-slate-400">Los cambios se reflejan de inmediato en la página pública.</span>
      </div>
    </form>
  );
}
