'use client';

import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Sección "Nosotros": historia, misión, visión y valores (contenido CMS). */
export function About({ content }: { content: Record<string, string> }) {
  const cards = [
    {
      title: content.mission_title ?? 'Misión',
      text: content.mission_text ?? '',
      emoji: '🎯',
    },
    {
      title: content.vision_title ?? 'Visión',
      text: content.vision_text ?? '',
      emoji: '🔭',
    },
  ];

  return (
    <section id="nosotros" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nosotros"
          title={content.history_title ?? 'Nuestra historia'}
        />

        <Reveal className="mx-auto mt-8 max-w-4xl">
          <p className="text-center text-base leading-relaxed text-slate-600 sm:text-lg">
            {content.history_text ?? ''}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-navy-900 to-navy-800 p-8 text-white shadow-card"
              >
                <span className="absolute -right-3 -top-3 text-8xl opacity-10">{card.emoji}</span>
                <h3 className="font-display text-2xl font-bold">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{card.text}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {(content.values_text ?? '')
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean)
              .map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-clinical-200 bg-clinical-50 px-5 py-2 text-sm font-semibold text-clinical-700"
                >
                  {value}
                </span>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
