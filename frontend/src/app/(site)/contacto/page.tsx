import { ContactPremium } from '@/components/sections/ContactPremium';
import { fetchSiteInfo } from '@/server/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contacto',
  description: 'Conecta con el equipo de NeuroMundo S.A.S.',
};

export default async function ContactoPage() {
  const info = await fetchSiteInfo();
  return <ContactPremium parameters={info.parameters} />;
}