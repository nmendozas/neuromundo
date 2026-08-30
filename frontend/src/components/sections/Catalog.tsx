'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FALLBACK_PRODUCTS, whatsappLink } from '@/config/site';
import type { Item } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/icons';
import ProductGallery from '@/components/sections/ProductGallery';
import { useState, type FormEvent } from 'react';
import { clientFetch } from '@/lib/client-api';

interface CatalogProduct {
  id?: number;
  reference: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
  image_1?: string;
  images?: string[];
  featured?: number;
}

function toProducts(items: Item[]): CatalogProduct[] {
  if (!items.length) return FALLBACK_PRODUCTS;
  return items.map((item) => ({
    reference: item.reference,
    name: item.name,
    category: item.category,
    description: item.description,
    emoji: item.emoji || '🩺',
    id: item.id,
    image_1: item.image_1,
    images: [item.image_1, item.image_2, item.image_3, item.image_4, item.image_5].filter(Boolean),
    featured: item.featured,
  }));
}

/** Catálogo informativo: cada producto cotiza por WhatsApp. */
export function Catalog({ items }: { items: Item[] }) {
  const products: CatalogProduct[] = items.length
    ? toProducts(items).filter((product) => product.featured).slice(0, 5)
    : FALLBACK_PRODUCTS.slice(0, 5).map((product) => ({ ...product }));
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setSending(true);
    try {
      await clientFetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), service: 'Catálogo informativo', message: `Solicito información sobre ${selected.name} (Ref. ${selected.reference}).\nInstitución: ${form.company.trim()}\n${form.message.trim()}` }) });
      setStatus('Solicitud enviada. Te contactaremos pronto.');
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.');
    } finally { setSending(false); }
  };

  return (
    <section id="catalogo" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full border border-gold-500/10" />
      <div className="pointer-events-none absolute -right-20 top-40 h-[22rem] w-[22rem] rounded-full border border-gold-500/10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catálogo informativo"
          title="Insumos médicos de alta calidad"
          description="El 90% de nuestro portafolio es importado directamente desde EE. UU. Este catálogo es informativo: cada referencia se cotiza a la medida según marca, origen y especificación técnica."
          dark
        />

        {items.length > 0 && products.length === 0 ? <p className="mt-12 border border-dashed border-white/20 p-10 text-center text-slate-400">Próximamente presentaremos nuestros productos destacados.</p> : <div className="mt-16 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.reference} delay={(index % 4) * 0.07} className={index === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group relative flex h-full flex-col overflow-hidden bg-navy-900 transition-colors hover:bg-navy-800 ${index === 0 ? 'min-h-[34rem]' : 'min-h-[29rem]'}`}
              >
                <div className={`relative flex ${index === 0 ? 'h-64 sm:h-80' : 'h-48'} items-center justify-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-navy-800 via-navy-900 to-[#59451f]`}>
                  <span className="pointer-events-none absolute -right-2 -top-8 font-display text-[10rem] font-semibold leading-none text-white/[0.035]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.25em] text-gold-300">{String(index + 1).padStart(2, '0')} / 05</span>
                  {product.image_1 ? <Image src={product.image_1} alt={product.name} fill sizes="(max-width: 640px) 100vw, 600px" className="object-contain p-8 transition duration-700 group-hover:scale-105" /> : <span className="text-7xl drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-110">{product.emoji}</span>}
                  <span className="absolute bottom-5 left-5 border-l-2 border-gold-400 pl-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200">
                    {product.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-gold-300">REF. {product.reference}</p>
                  <h3 className={`mt-4 font-display font-medium leading-tight text-white ${index === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{product.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{product.description}</p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5"><button type="button" onClick={() => { setSelected(product); setStatus(null); }} className="inline-flex items-center gap-2 bg-gold-500 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-navy-950 transition hover:bg-gold-300">Solicitar información <span aria-hidden="true">↗</span></button><a
                    href={whatsappLink(
                      `Hola NeuroMundo S.A.S 👋 Estoy interesado en cotizar: ${product.name} (Ref. ${product.reference}).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8ff0b4] transition hover:text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a><Link href={`/catalogo/${product.id ?? product.reference}`} className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition hover:text-gold-300">Ver ficha →</Link></div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>}

        <div className="mt-12 text-center"><Link href="/catalogo" className="inline-flex border border-gold-400 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300 transition hover:bg-gold-500 hover:text-navy-950">Ver catálogo completo <span className="ml-3">↗</span></Link></div><Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-slate-400">
            ⚕️ Solicita el portafolio completo de referencias por{' '}
            <a
              href={whatsappLink('Hola NeuroMundo S.A.S 👋 ¿Podrían enviarme el portafolio completo de insumos?')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-600 underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>{' '}
            — precios concertados según volumen, origen y plazos de pago.
          </p>
        </Reveal>
      </div>
      {selected && <div role="dialog" aria-modal="true" aria-labelledby="featured-request-title" className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 p-4" onClick={() => setSelected(null)}><div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 text-navy-900 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-gold-600">Detalle de producto</p><h2 id="featured-request-title" className="mt-1 font-display text-2xl font-bold">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">Ref. {selected.reference}</p></div><button type="button" aria-label="Cerrar formulario" onClick={() => setSelected(null)} className="text-2xl text-slate-500 hover:text-navy-900">×</button></div><div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"><div><ProductGallery images={selected.images ?? (selected.image_1 ? [selected.image_1] : [])} emoji={selected.emoji} name={selected.name} /></div><div><p className="text-sm leading-7 text-slate-600">{selected.description}</p><dl className="mt-6 grid grid-cols-2 gap-5 border-y border-navy-950/10 py-5"><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Categoría</dt><dd className="mt-1 text-sm font-semibold">{selected.category}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Referencia</dt><dd className="mt-1 text-sm font-semibold">{selected.reference}</dd></div></dl></div></div>{status && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}<form onSubmit={submit} className="mt-7 grid gap-4 border-t border-navy-950/10 pt-6 sm:grid-cols-2"><p className="font-display text-xl sm:col-span-2">Solicitar información</p><input required placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-gold-500" /><input required type="email" placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-gold-500" /><input required placeholder="Teléfono / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-gold-500" /><input placeholder="Institución / IPS" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-gold-500" /><textarea required rows={3} placeholder="Especificaciones, cantidades o mensaje adicional" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-gold-500 sm:col-span-2" /><div className="flex flex-wrap justify-end gap-3 sm:col-span-2"><a href={whatsappLink(`Hola NeuroMundo S.A.S 👋 Quiero información sobre ${selected.name} (Ref. ${selected.reference}).`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#25D366] px-5 py-3 text-sm font-semibold text-[#159447]"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a><button type="submit" disabled={sending} className="rounded-xl bg-navy-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{sending ? 'Enviando…' : 'Enviar solicitud'}</button></div></form></div></div>}
    </section>
  );
}
