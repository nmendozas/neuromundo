import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPortfolio } from '@/server/data';
import { siteConfig, whatsappLink } from '@/config/site';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const services = await fetchPortfolio();
  const service = services.find((item) => item.id === decodeURIComponent(params.id));
  if (!service) notFound();

  const benefits = service.benefits?.length ? service.benefits : service.details;
  const process = service.process?.length ? service.process : ['Conocemos la necesidad de tu institución.', 'Diseñamos una propuesta técnica y comercial.', 'Acompañamos la implementación y medimos resultados.'];
  const message = `Hola ${siteConfig.name} 👋 Estoy interesado en el servicio: ${service.title}.`;

  return (
    <div className="min-h-screen bg-paper-100 text-navy-900">
      <section className="relative overflow-hidden bg-navy-950 px-4 pb-20 pt-32 text-white sm:px-6 sm:pt-40 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/portafolio" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300 hover:text-white">← Volver al portafolio</Link>
          <p className="mt-12 font-mono text-xs uppercase tracking-[0.22em] text-gold-300">{service.num} · {service.category}</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{service.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{service.longDescription ?? service.description}</p>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <article className="space-y-12">
          <section><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">La solución</p><h2 className="mt-4 font-display text-3xl font-medium">Una respuesta diseñada para tu operación</h2><p className="mt-5 text-base leading-8 text-slate-600">{service.longDescription ?? service.description}</p></section>
          <section><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">Qué incluye</p><ul className="mt-5 grid gap-4 sm:grid-cols-2">{benefits.map((item) => <li key={item} className="border-l-2 border-gold-500 bg-white p-5 text-sm leading-6 text-slate-600">{item}</li>)}</ul></section>
          <section><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">Cómo trabajamos</p><ol className="mt-5 grid gap-4">{process.map((item, index) => <li key={item} className="flex gap-4 border-t border-paper-300 pt-4"><span className="font-mono text-gold-700">0{index + 1}</span><span className="text-sm leading-6 text-slate-600">{item}</span></li>)}</ol></section>
        </article>
        <aside className="h-fit border border-navy-950/15 bg-navy-950 p-7 text-white lg:sticky lg:top-24"><p className="font-mono text-[10px] uppercase tracking-widest text-gold-300">Hablemos de tu proyecto</p><p className="mt-4 text-sm leading-6 text-slate-300">Recibe una propuesta ajustada al tamaño, urgencia y objetivos de tu institución.</p><a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full justify-center bg-gold-500 px-4 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-navy-950 hover:bg-gold-300">Solicitar asesoría ↗</a><Link href="/contacto" className="mt-5 block text-center text-xs text-slate-400 underline hover:text-white">Enviar solicitud formal</Link></aside>
      </main>
      <footer className="bg-navy-950 px-4 py-8 text-center text-xs text-slate-400">{siteConfig.name} · Soluciones para instituciones de salud</footer>
    </div>
  );
}