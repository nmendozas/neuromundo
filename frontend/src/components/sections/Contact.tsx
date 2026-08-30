'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { formServiceOptions, siteConfig } from '@/config/site';
import { Reveal } from '@/components/ui/Reveal';
import { clientFetch } from '@/lib/client-api';
import { MailIcon, PhoneIcon, SendIcon, WhatsAppIcon } from '@/components/icons';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-clinical-400 focus:ring-4 focus:ring-clinical-100';

interface ContactProps {
  content: Record<string, string>;
  parameters: Record<string, string>;
}

export function Contact({ content, parameters }: ContactProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: formServiceOptions[0],
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const data = await clientFetch<{ ok: boolean; emailStatus: string }>('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (data.ok) {
        setStatus({
          ok: true,
          text:
            data.emailStatus === 'enviado'
              ? '¡Gracias! Tu mensaje fue enviado y recibirás respuesta pronto.'
              : '¡Gracias! Tu mensaje fue registrado. Te contactaremos pronto.',
        });
        setForm({ name: '', email: '', phone: '', service: formServiceOptions[0], message: '' });
      }
    } catch (err) {
      setStatus({
        ok: false,
        text: err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Intenta de nuevo.',
      });
    } finally {
      setSending(false);
    }
  };

  const companyName = parameters['company.name'] ?? siteConfig.name;
  const managerEmail = parameters['company.email'] ?? siteConfig.emails[0];
  const whatsappNumber = parameters['company.whatsapp'] ?? siteConfig.whatsappNumber;
  const phoneDisplay = parameters['company.phone'] ?? siteConfig.phoneDisplay;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola NeuroMundo S.A.S 👋 Quisiera más información.')}`;

  return (
    <section id="contacto" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-0 h-[360px] w-[360px] rounded-full bg-clinical-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-clinical-300">
                <span className="h-1.5 w-1.5 rounded-full bg-clinical-400" />
                Hablemos
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
                {content.contact_title ?? 'Un mundo de soluciones para tu IPS'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                {content.contact_text ?? ''}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-clinical-300">{siteConfig.manager.role}</p>
                  <p className="mt-1 font-display text-lg font-bold text-white">{siteConfig.manager.name}</p>
                  <div className="mt-4 space-y-2.5 text-sm">
                    <a href={`mailto:${managerEmail}`} className="flex items-center gap-3 text-slate-300 transition-colors hover:text-clinical-300">
                      <MailIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                      {managerEmail}
                    </a>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 transition-colors hover:text-clinical-300">
                      <WhatsAppIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                      WhatsApp: {siteConfig.whatsappDisplay}
                    </a>
                    <a href={`tel:+${siteConfig.phone}`} className="flex items-center gap-3 text-slate-300 transition-colors hover:text-clinical-300">
                      <PhoneIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                      Celular: {phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="h-px flex-1 bg-white/10" />
                  <span>Atención al cliente 24/7 · {companyName}</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-navy-900 shadow-2xl sm:p-8">
              <h3 className="font-display text-xl font-bold text-navy-900">Solicita una cotización</h3>
              <p className="mt-1 text-sm text-slate-500">Completa el formulario y te contactaremos por correo o WhatsApp.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Nombre completo</span>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Ej. María González" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Correo corporativo</span>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="correo@ips.com.co" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Teléfono / WhatsApp</span>
                  <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+57 300 000 0000" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Línea de servicio</span>
                  <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                    {formServiceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Mensaje</span>
                  <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Cuéntanos tu necesidad: volumen, plazos, especificaciones…" className={`${inputClass} resize-none`} />
                </label>
              </div>

              {status && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                    status.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {status.text}
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-clinical-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-clinical-500/25 transition-colors hover:bg-clinical-600 disabled:opacity-70"
              >
                <SendIcon className="h-4 w-4" />
                {sending ? 'Enviando…' : 'Enviar solicitud'}
              </motion.button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Tus datos se guardan de forma segura y solo se usan para darte respuesta.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
