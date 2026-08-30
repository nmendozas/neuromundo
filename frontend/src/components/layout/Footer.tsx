import Image from 'next/image';
import { siteConfig, whatsappLink } from '@/config/site';
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="NeuroMundo S.A.S" width={40} height={40} className="h-9 w-9" />
              <span className="font-display text-base font-bold tracking-tight text-white">
                NeuroMundo <span className="text-clinical-300">S.A.S</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Servicios y venta de insumos médicos. {siteConfig.slogan}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <MapPinIcon className="h-4 w-4 text-clinical-400" />
              {siteConfig.country}
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-clinical-300">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="transition-colors hover:text-clinical-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/admin" className="transition-colors hover:text-clinical-300">
                  Acceso administrador
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contacto</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="flex items-center gap-2.5 transition-colors hover:text-clinical-300">
                    <MailIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                    {email}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={whatsappLink('Hola NeuroMundo S.A.S 👋 Quisiera más información.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-clinical-300"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                  {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:+${siteConfig.phone}`} className="flex items-center gap-2.5 transition-colors hover:text-clinical-300">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-clinical-400" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {siteConfig.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con <span className="text-clinical-400">♥</span> para el sector salud colombiano.
          </p>
        </div>
      </div>
    </footer>
  );
}
