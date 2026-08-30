'use client';

import Image from 'next/image';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { clientFetch } from '@/lib/client-api';
import { formServiceOptions, siteConfig, whatsappLink } from '@/config/site';
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon, WhatsAppIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';

const inputClass = 'w-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-gold-500 focus:ring-4 focus:ring-gold-100';
const team = [
  ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=88', 'Dirección estratégica', 'Visión para avanzar'],
  ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=88', 'Equipo clínico', 'Excelencia asistencial'],
  ['https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=88', 'Equipo de operaciones', 'Gestión que responde'],
];

type FormState = { name: string; email: string; phone: string; service: string; message: string };

const initialForm: FormState = { name: '', email: '', phone: '', service: formServiceOptions[0], message: '' };

export function ContactPremium({ parameters }: { parameters: Record<string, string> }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const phone = parameters['company.phone'] || siteConfig.phoneDisplay;
  const email = parameters['company.email'] || siteConfig.emails[0];
  const address = parameters['company.address'] || 'Colombia · Atención a instituciones de salud';
  const whatsapp = whatsappLink('Hola NeuroMundo S.A.S 👋 Quisiera conversar sobre una solución para mi institución.');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const result = await clientFetch<{ ok: boolean; emailStatus?: string }>('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!result.ok) throw new Error('No se pudo registrar la solicitud. Intenta nuevamente.');
      setStatus({ ok: true, text: result.emailStatus === 'enviado' ? 'Solicitud enviada. Te responderemos pronto.' : 'Solicitud recibida. Te contactaremos pronto.' });
      setForm(initialForm);
    } catch (error) {
      setStatus({ ok: false, text: error instanceof Error ? error.message : 'No se pudo enviar el mensaje.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="overflow-hidden bg-paper-50 text-navy-950">
      <section className="relative isolate flex min-h-[650px] items-end overflow-hidden bg-navy-950 px-4 pb-16 pt-36 text-white sm:min-h-[760px] sm:px-6 lg:px-8 lg:pb-24">
        <Image src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=88" alt="Profesionales de la salud trabajando en equipo" fill priority className="-z-20 object-cover opacity-35" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,#0b1421_8%,rgba(11,20,33,.88)_48%,rgba(11,20,33,.18))]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_28%,rgba(213,170,76,.18),transparent_28%)]" />
        <div className="relative mx-auto w-full max-w-7xl"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.28em] text-gold-300">06 / Contacto privado</p><h1 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[.92] tracking-[-.05em] sm:text-7xl lg:text-[8rem]">Hablemos de lo que viene.</h1><p className="mt-8 max-w-xl border-l border-gold-400 pl-5 text-sm leading-7 text-slate-300 sm:text-base">Un equipo experto, una conversación clara y soluciones diseñadas alrededor de tu institución.</p><div className="mt-10 flex flex-wrap gap-3"><a href="#solicitud" className="inline-flex items-center bg-gold-500 px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-navy-950 transition hover:-translate-y-1 hover:bg-gold-300">Solicitar asesoría <span className="ml-5 text-base">↗</span></a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/25 px-6 py-4 text-xs font-semibold uppercase tracking-[.12em] text-white transition hover:border-gold-300 hover:text-gold-300"><WhatsAppIcon className="h-4 w-4" /> WhatsApp directo</a></div></Reveal></div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-[.2em] text-white/50 lg:flex"><span className="h-px w-12 bg-gold-400/70" /> Respuesta humana, soluciones precisas</div>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 sm:px-6 lg:-mt-12 lg:px-8"><div className="grid border border-white/10 bg-navy-900 p-5 text-white shadow-2xl shadow-navy-950/20 sm:grid-cols-3 sm:p-7">{[['01', 'Diagnóstico claro', 'Entendemos tu operación antes de recomendar.'], ['02', 'Respuesta oportuna', 'Acompañamiento cercano para cada decisión.'], ['03', 'Solución a la medida', 'Estrategia, suministro y gestión en un solo aliado.']].map(([number, title, text], index) => <div key={title} className={`p-3 sm:px-6 ${index > 0 ? 'mt-4 border-t border-white/10 sm:mt-0 sm:border-l sm:border-t-0' : ''}`}><p className="font-mono text-[10px] tracking-[.2em] text-gold-300">{number}</p><p className="mt-3 font-display text-xl">{title}</p><p className="mt-2 max-w-xs text-xs leading-6 text-slate-400">{text}</p></div>)}</div></section>

      <section id="solicitud" className="mx-auto grid max-w-7xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <Reveal><p className="font-mono text-[10px] uppercase tracking-[.22em] text-gold-600">Conversemos</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Tu próximo paso merece una respuesta a la medida.</h2><p className="mt-6 max-w-md text-sm leading-7 text-slate-600">Cuéntanos qué necesita tu IPS. Nuestro equipo revisará tu solicitud y te acompañará desde el primer contacto.</p><div className="mt-10 space-y-5 border-t border-navy-200 pt-7 text-sm"><a className="flex items-center gap-3 hover:text-gold-600" href={`mailto:${email}`}><MailIcon className="h-5 w-5 text-gold-500" />{email}</a><a className="flex items-center gap-3 hover:text-gold-600" href={`tel:+${siteConfig.phone}`}><PhoneIcon className="h-5 w-5 text-gold-500" />{phone}</a><p className="flex items-center gap-3"><MapPinIcon className="h-5 w-5 text-gold-500" />{address}</p></div><a href={whatsappLink('Hola NeuroMundo S.A.S 👋 Quisiera conversar sobre una solución para mi IPS.')} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 bg-navy-950 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"><WhatsAppIcon className="h-4 w-4 text-gold-300" />Escribir por WhatsApp</a></Reveal>
        <Reveal delay={.12}><form onSubmit={handleSubmit} className="border border-slate-200 bg-white p-6 shadow-card sm:p-9"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-gold-600">Solicitud privada</p><h3 className="mt-3 font-display text-2xl font-semibold">Cuéntanos tu proyecto</h3><div className="mt-7 grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nombre completo</span><input name="name" required value={form.name} onChange={handleChange} className={inputClass} /></label><label><span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Correo corporativo</span><input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} /></label><label><span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Teléfono / WhatsApp</span><input name="phone" required value={form.phone} onChange={handleChange} className={inputClass} /></label><label><span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Línea de servicio</span><select name="service" value={form.service} onChange={handleChange} className={inputClass}>{formServiceOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label className="sm:col-span-2"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Mensaje</span><textarea name="message" required rows={5} value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} /></label></div>{status && <p className={`mt-4 p-3 text-sm ${status.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{status.text}</p>}<motion.button whileHover={{ y: -2 }} disabled={sending} className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-gold-500 px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy-950 transition hover:bg-gold-400 disabled:opacity-70"><SendIcon className="h-4 w-4" />{sending ? 'Enviando…' : 'Enviar solicitud'}</motion.button></form></Reveal>
      </section>

      <section className="bg-navy-950 px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.22em] text-gold-300">El equipo detrás de la respuesta</p><h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Cercanía, experiencia y criterio.</h2></Reveal><div className="mt-12 grid gap-5 sm:grid-cols-3">{team.map(([image, role, text], index) => <Reveal key={role} delay={index * .1}><div className="group relative aspect-[4/5] overflow-hidden"><Image src={image} alt={role} fill className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" sizes="(max-width: 640px) 100vw, 33vw" /><div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" /><div className="absolute bottom-0 p-6"><p className="font-display text-xl">{role}</p><p className="mt-2 text-xs text-gold-300">{text}</p></div></div></Reveal>)}</div></div></section>

      <section className="bg-paper-100 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-gold-600">Dónde encontrarnos</p><h2 className="mt-5 font-display text-4xl font-semibold sm:text-6xl">Colombia, cerca de tu operación.</h2></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 border border-navy-950 px-5 py-3 text-xs font-bold uppercase tracking-wider text-navy-950 transition hover:bg-navy-950 hover:text-white"><WhatsAppIcon className="h-4 w-4" /> Coordinar visita</a></div></Reveal><div className="mt-10 overflow-hidden border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,24,38,.08)]"><iframe title="Mapa de ubicación de NeuroMundo en Colombia" src="https://www.google.com/maps?q=Colombia&output=embed" className="h-[360px] w-full grayscale-[.2] sm:h-[460px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section>
    </div>
  );
}