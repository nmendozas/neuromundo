import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat';
import { fetchPublicParameters } from '@/server/data';

/** Layout del sitio público: navbar + footer + botón flotante de WhatsApp. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const parameters = await fetchPublicParameters();

  return (
    <>
      <Navbar parameters={parameters} />
      <main>{children}</main>
      <Footer parameters={parameters} />
      <WhatsAppFloat parameters={parameters} />
    </>
  );
}
