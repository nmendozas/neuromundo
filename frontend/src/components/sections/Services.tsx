'use client';

import { motion } from 'framer-motion';
import { services } from '@/config/site';
import { ServiceIcon, ArrowRightIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Services() {
  return (
    <section id="servicios" className="bg-paper-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portafolio completo"
          title="Nueve líneas de servicio, un solo interlocutor"
          description="Desde el suministro de material de osteosíntesis hasta la recuperación de cartera ante ADRES: cada línea puede contratarse de forma independiente o integrada."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={(index % 3) * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex h-full flex-col rounded-2xl border border-paper-200 bg-white p-8 shadow-card transition-shadow hover:shadow-xl"
              >
                <span className="pointer-events-none absolute right-6 top-4 font-display text-6xl font-bold text-slate-100 transition-colors group-hover:text-gold-100">
                  {service.num}
                </span>

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600 transition-colors group-hover:bg-gold-500 group-hover:text-white">
                  <ServiceIcon service={service} className="h-6 w-6" />
                </div>

                <h3 className="relative mt-6 font-display text-lg font-bold leading-snug text-navy-900">{service.title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>

                <div className="relative mt-6 flex items-center justify-between">
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{service.category}</span>
                  <a href="#contacto" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors group-hover:text-gold-600">
                    Cotizar
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
