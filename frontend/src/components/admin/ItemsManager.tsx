'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { clientFetch } from '@/lib/client-api';
import type { Item } from '@/types';
import { Alert, Badge, Button, Card, Field, Input, Spinner, Textarea } from '@/components/admin/ui';

const EMPTY_FORM = {
  reference: '',
  name: '',
  category: 'General',
  description: '',
  unit: 'unidad',
  cost_price: '0',
  sale_price: '0',
  emoji: '🩺',
  image_1: '', image_2: '', image_3: '', image_4: '', image_5: '',
  featured: 0,
  active: 1,
};

interface ImportResult {
  imported: number;
  skipped: number;
  duplicates: string[];
  validRows: number;
  errors: Array<{ row: number; reference: string; errors: string[] }>;
}

export function ItemsManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientFetch<Item[]>('/api/items');
      setItems(data);
    } catch {
      setMessage({ tone: 'error', text: 'No se pudieron cargar los ítems.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({
      reference: item.reference,
      name: item.name,
      category: item.category,
      description: item.description,
      unit: item.unit,
      cost_price: String(item.cost_price),
      sale_price: String(item.sale_price),
      emoji: item.emoji,
      image_1: item.image_1, image_2: item.image_2, image_3: item.image_3, image_4: item.image_4, image_5: item.image_5,
      featured: item.featured,
      active: item.active,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      reference: form.reference.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      unit: form.unit.trim(),
      cost_price: Number(form.cost_price),
      sale_price: Number(form.sale_price),
      emoji: form.emoji || '🩺',
      image_1: form.image_1.trim(), image_2: form.image_2.trim(), image_3: form.image_3.trim(), image_4: form.image_4.trim(), image_5: form.image_5.trim(),
      featured: Number(form.featured),
      active: Number(form.active),
    };
    try {
      if (editingId) {
        await clientFetch(`/api/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setMessage({ tone: 'success', text: 'Ítem actualizado correctamente.' });
      } else {
        await clientFetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setMessage({ tone: 'success', text: 'Ítem creado correctamente.' });
      }
      setFormOpen(false);
      await loadItems();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Item) => {
    if (!window.confirm(`¿Eliminar el ítem "${item.name}" (${item.reference})?`)) return;
    try {
      await clientFetch(`/api/items/${item.id}`, { method: 'DELETE' });
      await loadItems();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al eliminar.' });
    }
  };

  const toggleActive = async (item: Item) => {
    try {
      await clientFetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: item.active ? 0 : 1 }),
      });
      setMessage({
        tone: 'success',
        text: item.active
          ? `“${item.name}” quedó bloqueado y ya no se muestra públicamente.`
          : `“${item.name}” quedó activo nuevamente.`,
      });
      await loadItems();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al cambiar el estado.' });
    }
  };

  const handleImport = async (file: File) => {
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    setMessage(null);
    const formData = new FormData();
    formData.append('file', file, file.name);
    try {
      const result = await clientFetch<ImportResult>('/api/items/import', { method: 'POST', body: formData });
      setImportResult(result);
      await loadItems();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Error al importar.' });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      <Card
        title={
          <div>
            <h1 className="font-display text-xl font-bold text-navy-900">Portafolio y catálogo</h1>
            <p className="mt-1 text-sm font-normal text-slate-500">Administra qué servicios o productos aparecen y cuáles quedan bloqueados.</p>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              />
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                {importing ? 'Importando…' : '⬆️ Importar hoja'}
              </span>
            </label>
            <a href="/api/items/template" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              📋 Plantilla
            </a>
            <a href="/api/items/export" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              ⬇️ Exportar Excel
            </a>
            <Button onClick={openNew}>+ Agregar servicio</Button>
          </div>
        }
      >
        {importResult && (
          <div className="mb-5 space-y-3">
            <Alert tone={importResult.errors.length === 0 && importResult.imported > 0 ? 'success' : 'info'}>
              Se importaron <strong>{importResult.imported}</strong> ítems.
              {importResult.skipped > 0 && ` · ${importResult.skipped} omitidos (referencias duplicadas).`}
            </Alert>
            {importResult.errors.length > 0 && (
              <div className="max-h-52 overflow-auto rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="mb-2 text-sm font-bold text-rose-700">Errores de validación ({importResult.errors.length}):</p>
                <ul className="space-y-1 text-xs text-rose-600">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>
                      Fila {err.row} {err.reference && `(${err.reference})`}: {err.errors.join(' · ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-[min(100%,28rem)] flex-1">
            <label htmlFor="items-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Buscar en el portafolio</label>
            <Input id="items-search" placeholder="Nombre, referencia o categoría…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <p className="pb-2 text-xs text-slate-500">{filtered.length} de {items.length} {items.length === 1 ? 'registro' : 'registros'}</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-3 pr-4">Servicio / producto</th>
                  <th className="py-3 pr-4">Referencia</th>
                  <th className="py-3 pr-4">Categoría</th>
                  <th className="py-3 pr-4 text-right">Costo</th>
                  <th className="py-3 pr-4 text-right">Venta</th>
                  <th className="py-3 pr-4">Estado</th>
                  <th className="py-3 pr-4">Visibilidad</th>
                  <th className="py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pr-4 align-top">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">{item.emoji}</span>
                        <div>
                          <p className="font-semibold text-navy-900">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-top font-mono text-xs">{item.reference}</td>
                    <td className="py-3 pr-4 align-top">
                      <Badge className="bg-gold-50 text-gold-700">{item.category}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-right align-top">{item.cost_price.toLocaleString('es-CO')}</td>
                    <td className="py-3 pr-4 text-right align-top font-semibold text-navy-900">{item.sale_price.toLocaleString('es-CO')}</td>
                    <td className="py-3 pr-4 align-top">
                      {item.active ? <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge> : <Badge className="bg-slate-100 text-slate-500">Inactivo</Badge>}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      {item.active ? <Badge className="bg-emerald-100 text-emerald-700">Visible</Badge> : <Badge className="bg-slate-100 text-slate-500">Bloqueado</Badge>}
                      {item.featured && <Badge className="ml-1 bg-gold-100 text-gold-700">Destacado</Badge>}
                    </td>
                    <td className="py-3 text-right align-top">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="ghost" onClick={() => toggleActive(item)}>{item.active ? 'Bloquear' : 'Activar'}</Button>
                        <Button variant="secondary" onClick={() => openEdit(item)}>Editar</Button>
                        <Button variant="danger" onClick={() => handleDelete(item)} aria-label={`Eliminar ${item.name}`}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-slate-400">
                      {search ? 'No hay resultados para esa búsqueda.' : 'No hay registros. Agrega un servicio o importa una hoja de cálculo.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {formOpen && (
        <Card title={editingId ? 'Editar ítem' : 'Nuevo ítem'}>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Referencia">
              <Input required value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} placeholder="MAOS-1001" />
            </Field>
            <Field label="Nombre">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Placa de osteosíntesis" />
            </Field>
            <Field label="Categoría">
              <Input required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Ortopedia" />
            </Field>
            <Field label="Unidad">
              <Input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="unidad" />
            </Field>
            <Field label="Costo (COP)" className="sm:col-span-2">
              <Input type="number" min={0} step="0.01" value={form.cost_price} onChange={(e) => setForm((f) => ({ ...f, cost_price: e.target.value }))} />
            </Field>
            <Field label="Venta (COP)" className="sm:col-span-2">
              <Input type="number" min={0} step="0.01" value={form.sale_price} onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))} />
            </Field>
            <Field label="Emoji">
              <Input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} placeholder="🦴" />
            </Field>
            {[1, 2, 3, 4, 5].map((number) => <Field key={number} label={`Imagen ${number}${number === 1 ? ' (principal)' : ''}`}>
              <Input type="url" value={form[`image_${number}` as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [`image_${number}`]: e.target.value }))} placeholder="https://…" />
            </Field>)}
            <Field label="Mostrar en inicio">
              <select value={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-100">
                <option value={0}>No</option>
                <option value={1}>Sí, destacado</option>
              </select>
              <p className="mt-1 text-xs text-slate-400">Máximo 12 productos destacados.</p>
            </Field>
            <Field label="Estado">
              <select
                value={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-100"
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </Field>
            <Field label="Descripción" className="sm:col-span-2 lg:col-span-4">
              <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descripción del insumo…" />
            </Field>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar ítem'}</Button>
              <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
