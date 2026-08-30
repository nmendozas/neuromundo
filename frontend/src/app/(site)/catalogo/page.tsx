import { CatalogBrowser } from '@/components/sections/CatalogBrowser';
import { fetchCatalogItems } from '@/server/data';

export const dynamic = 'force-dynamic';

/** Catálogo público informativo. Los precios se comparten únicamente bajo solicitud. */
export default async function CatalogPage() {
  const items = await fetchCatalogItems();
  return <CatalogBrowser items={items} />;
}