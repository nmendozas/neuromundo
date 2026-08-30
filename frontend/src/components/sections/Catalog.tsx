'use client';

import { motion } from 'framer-motion';
import { FALLBACK_PRODUCTS, whatsappLink } from '@/config/site';
import type { Item } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/icons';

interface CatalogProduct {
  reference: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
}

function toProducts(items: Item[]): CatalogProduct[] {
  if (!items.length) return FALLBACK_PRODUCTS;
  return items.map((item) => ({
    reference: item.reference,
    name: item.name,
    category: item.category,
    description: item.description,
    emoji: item.emoji || '🩺',
  }));
}

/** Catálogo informativo: cada producto cotiza por WhatsApp. */
export function Catalog({ items }: { items: Item[] }) {
  const products = toProducts(items);

  return (
    <section id="catalogo" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catálogo informativo"
          title="Insumos médicos de alta calidad"
          description="El 90% de nuestro portafolio es importado directamente desde EE. UU. Este catálogo es informativo: cada referencia se cotiza a la medida según marca, origen y especificación técnica."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.reference} delay={(index % 4) * 0.07}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-shadow hover:shadow-xl"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-clinical-700">
                  <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">{product.emoji}</span>
                  <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-clinical-200 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-xs font-medium tracking-wide text-slate-400">Ref. {product.reference}</p>
                  <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-navy-900">{product.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.description}</p>

                  <a
                    href={whatsappLink(
                      `Hola NeuroMundo S.A.S 👋 Estoy interesado en cotizar: ${product.name} (Ref. ${product.reference}).`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-[#1EBE5D]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Cotizar por WhatsApp
                  </a>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-slate-500">
            ⚕️ Solicita el portafolio completo de referencias por{' '}
            <a
              href={whatsappLink('Hola NeuroMundo S.A.S 👋 ¿Podrían enviarme el portafolio completo de insumos?')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-clinical-600 underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>{' '}
            — precios concertados según volumen, origen y plazos de pago.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
