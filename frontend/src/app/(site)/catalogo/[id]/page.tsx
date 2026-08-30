import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FALLBACK_PRODUCTS, siteConfig, whatsappLink } from '@/config/site';
import { fetchCatalogItems } from '@/server/data';
import type { Item } from '@/types';

type DetailProduct = {
  id: string;
  reference: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  emoji: string;
};

function normalizeItems(items: Item[]): DetailProduct[] {
  if (items.length) {
    return items.map((item) => ({
      id: String(item.id),
      reference: item.reference,
      name: item.name,
      category: item.category,
      description: item.description,
      unit: item.unit,
      emoji: item.emoji || '🩺',
    }));
  }

  return FALLBACK_PRODUCTS.map((item) => ({ ...item, id: item.reference, unit: 'unidad' }));
}

export default async function CatalogDetailPage({ params }: { params: { id: string } }) {
  const products = normalizeItems(await fetchCatalogItems());
  const requestedId = decodeURIComponent(params.id);
  const product = products.find((item) => item.id === requestedId || item.reference === requestedId);
  if (!product) notFound();

  const sameCategory = products.filter((item) => item.id !== product.id && item.category === product.category);
  const otherProducts = products.filter((item) => item.id !== product.id && item.category !== product.category);
  const related = [...sameCategory, ...otherProducts].slice(0, 4);
  const requestMessage = `Hola NeuroMundo S.A.S 👋 Estoy interesado en ${product.name} (Ref. ${product.reference}).`;

  return (
    <div className="min-h-screen bg-paper-100 text-navy-900">
      <section className="bg-navy-950 px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/catalogo" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300 hover:text-white">← Volver al catálogo</Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[150px_minmax(0,1fr)] lg:items-start">
            <div className="flex h-36 w-36 items-center justify-center bg-white/5 text-7xl ring-1 ring-gold-400/40">{product.emoji}</div>
            <div><p className="font-mono text-xs uppercase tracking-[0.22em] text-gold-300">{product.category} · Ref. {product.reference}</p><h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{product.name}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Ficha informativa para equipos de compras, farmacia y atención clínica.</p></div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <article className="border border-navy-950/15 bg-paper-50 p-6 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">Información del artículo</p><h2 className="mt-5 font-display text-3xl font-medium">Descripción</h2><p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{product.description || 'La información técnica completa se entrega bajo solicitud y se confirma según la referencia requerida.'}</p><dl className="mt-10 grid gap-6 border-t border-navy-950/15 pt-7 sm:grid-cols-2"><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Referencia</dt><dd className="mt-2 font-semibold text-navy-900">{product.reference}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Presentación</dt><dd className="mt-2 font-semibold text-navy-900">{product.unit}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Categoría</dt><dd className="mt-2 font-semibold text-navy-900">{product.category}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Disponibilidad</dt><dd className="mt-2 font-semibold text-navy-900">Confirmar con asesor</dd></div></dl></article>
        <aside className="h-fit border border-navy-950/15 bg-navy-950 p-6 text-white lg:sticky lg:top-24"><p className="font-mono text-[10px] uppercase tracking-widest text-gold-300">¿Necesitas una cotización?</p><p className="mt-4 text-sm leading-6 text-slate-300">Solicita ficha técnica, marcas disponibles, tiempos de entrega y condiciones comerciales.</p><a href={whatsappLink(requestMessage)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full justify-center bg-gold-500 px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-navy-950 hover:bg-gold-300">Consultar por WhatsApp ↗</a><Link href="/catalogo" className="mt-4 block text-center text-xs text-slate-400 underline hover:text-white">Explorar más referencias</Link></aside>
      </main>

      {related.length > 0 && <section className="border-t border-navy-950/10 bg-paper-50 px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">Continúa explorando</p><h2 className="mt-3 font-display text-3xl font-medium">Productos relacionados</h2><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.id} href={`/catalogo/${encodeURIComponent(item.reference)}`} target="_blank" rel="noopener noreferrer" className="border border-navy-950/15 p-5 transition hover:-translate-y-1 hover:border-gold-600"><span className="text-3xl">{item.emoji}</span><p className="mt-5 font-mono text-[9px] uppercase tracking-widest text-gold-700">{item.reference}</p><h3 className="mt-2 font-display text-lg font-medium">{item.name}</h3><span className="mt-4 block text-xs text-slate-500">Ver detalle ↗</span></Link>)}</div></div></section>}
      <footer className="bg-navy-950 px-4 py-8 text-center text-xs text-slate-400">{siteConfig.name} · Información sujeta a confirmación comercial</footer>
    </div>
  );
}