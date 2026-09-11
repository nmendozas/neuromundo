import { fetchSiteInfo, fetchCatalogItems } from '@/server/data';
import { Portfolio } from '@/components/sections/Portfolio';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const [info, items] = await Promise.all([fetchSiteInfo(), fetchCatalogItems()]);
  return <Portfolio content={info.content} items={items} />;
}