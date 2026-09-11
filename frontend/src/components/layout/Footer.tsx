import Image from 'next/image';
import { siteConfig, whatsappLink } from '@/config/site';
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';

export function Footer({ parameters }: { parameters: Record<string, string> }) {
  const year = new Date().getFullYear();
  const companyName = parameters['company.name'] || siteConfig.name;
  const slogan = parameters['company.slogan'] || siteConfig.slogan;
  const country = parameters['company.city'] || siteConfig.country;
  const emails = [parameters['company.email'], parameters['company.email2']].filter(Boolean);
  const whatsappNumber = parameters['company.whatsapp'] || siteConfig.whatsappNumber;
  const whatsappDisplay = parameters['company.whatsapp'] || siteConfig.whatsappDisplay;
  const phone = parameters['company.phone'] || siteConfig.phoneDisplay;
  const phoneHref = phone.replace(/[^\d+]/g, '');
  const contactWhatsApp = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="relative overflow-hidden border-t border-gold-500/30 bg-navy-950 text-slate-300">
      <div className="pointer-events-none absolute -right-40 top-[-180px] h-[460px] w-[460px] rounded-full border border-gold-500/10" />
      <div className="pointer-events-none absolute bottom-0 left-[-160px] h-[360px] w-[360px] rounded-full bg-navy-800/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-white/10 py-10 text-center sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:text-left">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">¿Hablamos de tu próximo proyecto?</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Soluciones que hacen avanzar la salud.
            </h2>
          </div>
          <a
            href={whatsappLink('Hola NeuroMundo S.A.S 👋 Quisiera más información sobre sus servicios.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-flex w-fit items-center gap-3 border border-gold-400 bg-gold-500 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-navy-950 transition-all hover:-translate-y-1 hover:bg-gold-400 lg:mx-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escríbenos ahora
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="grid gap-12 py-14 text-center sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.2fr] lg:gap-16 lg:py-16 lg:text-left">
          <div>
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Image src="/logo.png" alt={companyName} width={357} height={204} className="h-11 w-auto object-contain" />
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-white">{companyName}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">Salud · tecnología · gestión</p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-slate-400 lg:mx-0">
              Servicios e insumos médicos para instituciones que buscan operar mejor. {slogan}
            </p>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-slate-500 lg:justify-start">
              <MapPinIcon className="h-4 w-4 text-gold-400" /> {country}
            </p>
          </div>

          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">Explora</p>
            <ul className="grid gap-3 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}><a href={link.href} className="inline-flex transition-colors hover:text-gold-300">{link.label}</a></li>
              ))}
              <li><a href="/portafolio" className="inline-flex transition-colors hover:text-gold-300">Portafolio completo</a></li>
              <li><a href="#top" className="inline-flex transition-colors hover:text-gold-300">Volver al inicio ↑</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">Conversemos</p>
            <ul className="space-y-4 text-sm">
              {emails.map((email) => <li key={email}><a href={`mailto:${email}`} className="flex min-w-0 items-start gap-3 break-all transition-colors hover:text-gold-300"><MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />{email}</a></li>)}
              <li><a href={contactWhatsApp('Hola NeuroMundo S.A.S 👋 Quisiera más información.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-gold-300"><WhatsAppIcon className="h-4 w-4 shrink-0 text-gold-400" />{whatsappDisplay}</a></li>
              <li><a href={`tel:${phoneHref}`} className="flex items-center gap-3 transition-colors hover:text-gold-300"><PhoneIcon className="h-4 w-4 shrink-0 text-gold-400" />{phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/10 py-6 text-center text-[10px] uppercase tracking-wider text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {year} {companyName}. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
            <p>Hecho con <span className="text-gold-400">♥</span> para Colombia</p>
            <a href="/admin" className="transition-colors hover:text-gold-300">Acceso administrador</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
