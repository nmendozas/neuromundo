import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Catalog } from '@/components/sections/Catalog';
import { Contact } from '@/components/sections/Contact';
import { fetchSiteInfo, fetchCatalogItems } from '@/server/data';

export const dynamic = 'force-dynamic';

/**
 * NeuroMundo S.A.S — Página de inicio
 * Hero → Servicios → Catálogo → Contacto
 */
export default async function Home() {
  const [info, items] = await Promise.all([fetchSiteInfo(), fetchCatalogItems()]);

  return (
    <>
      <Hero content={info.content} />
      <Services />
      <Catalog items={items} />
      <Contact content={info.content} parameters={info.parameters} />
    </>
  );
}
