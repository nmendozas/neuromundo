import { About } from '@/components/sections/About';
import { fetchSiteInfo } from '@/server/data';

export const dynamic = 'force-dynamic';

/** Página pública premium de historia, propósito y valores de NeuroMundo. */
export default async function NosotrosPage() {
  const info = await fetchSiteInfo();

  return <About content={info.content} />;
}