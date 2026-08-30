import { fetchSiteInfo, fetchPortfolio } from '@/server/data';
import { Portfolio } from '@/components/sections/Portfolio';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const [info, services] = await Promise.all([fetchSiteInfo(), fetchPortfolio()]);
  return <Portfolio content={info.content} services={services} />;
}