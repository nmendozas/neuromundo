'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { siteConfig, whatsappLink } from '@/config/site';
import { EASE } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/icons';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero({ content, parameters }: { content: Record<string, string>; parameters: Record<string, string> }) {
  const title1 = content.hero_title_1 ?? 'Salud, tecnología y';
  const highlight = content.hero_title_highlight ?? 'soluciones';
  const title2 = content.hero_title_2 ?? 'para tu IPS';
  const subtitle = content.hero_subtitle ?? '';
  const companyName = parameters['company.name'] ?? siteConfig.name;
  const whatsappNumber = parameters['company.whatsapp'] ?? siteConfig.whatsappNumber;
  const whatsappMessage = `Hola ${companyName} 👋 Quisiera información sobre sus insumos y servicios.`;

  return (
    <section id="top" className="relative overflow-hidden bg-navy-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-gold-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[380px] w-[380px] rounded-full bg-navy-600/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pt-44 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)] lg:gap-16">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
              {content.hero_eyebrow ?? siteConfig.slogan}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {title1}{' '}
            <span className="text-gradient">{highlight}</span>
            <br className="hidden sm:block" /> {title2}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-100 shadow-xl shadow-gold-500/25 transition-all hover:-translate-y-0.5 hover:bg-gold-400"
            >
              Ver Servicios
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
            >
              Contactar
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Cotización rápida
            </a>
          </motion.div>
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show" className="flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt="Logotipo de NeuroMundo S.A.S"
              width={357}
              height={204}
              className="h-auto w-56 object-contain sm:w-72 lg:w-full lg:max-w-[360px]"
              priority
            />
          </motion.div>
        </div>

        <motion.dl
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
        >
          {siteConfig.stats.map((stat) => (
            <motion.div key={stat.label} variants={item} className="flex flex-col gap-1 bg-navy-950/80 px-6 py-6 backdrop-blur-sm">
              <dt className="order-2 text-xs font-medium uppercase tracking-wider text-slate-400">{stat.label}</dt>
              <dd className="order-1 font-display text-3xl font-bold text-gold-300 sm:text-4xl">{stat.value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>

      <svg className="relative block w-full text-slate-50" viewBox="0 0 1440 64" fill="currentColor" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 64h1440V32C1080 64 720 0 0 32v32Z" />
      </svg>
    </section>
  );
}
