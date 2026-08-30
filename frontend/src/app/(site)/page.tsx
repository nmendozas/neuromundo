import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Catalog } from '@/components/sections/Catalog';
import { Contact } from '@/components/sections/Contact';
import { fetchSiteInfo, fetchCatalogItems } from '@/server/data';

export const dynamic = 'force-dynamic';

/**
 * NeuroMundo S.A.S — Página de inicio
 * Hero → Servicios → Nosotros (historia/misión/visión) → Catálogo → Contacto
 */
export default async function Home() {
  const [info, items] = await Promise.all([fetchSiteInfo(), fetchCatalogItems()]);

  return (
    <>
      <Hero content={info.content} />
      <Services />
      <About content={info.content} />
      <Catalog items={items} />
      <Contact content={info.content} parameters={info.parameters} />
    </>
  );
}
