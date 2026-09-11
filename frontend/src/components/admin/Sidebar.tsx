'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';

const NAV_GROUPS = [
  {
    label: 'Resumen',
    links: [{ href: '/admin', label: 'Dashboard', emoji: '📊' }],
  },
  {
    label: 'Gestión comercial',
    links: [
      { href: '/admin/items', label: 'Catálogo de ítems', emoji: '🧩' },
      { href: '/admin/cotizaciones', label: 'Cotizaciones', emoji: '📄' },
      { href: '/admin/cotizaciones/nueva', label: 'Nueva cotización', emoji: '➕' },
      { href: '/admin/mensajes', label: 'Mensajes de contacto', emoji: '📬' },
    ],
  },
  {
    label: 'Sitio web',
    links: [
      { href: '/admin/contenido', label: 'Contenido de la web', emoji: '✏️' },
      { href: '/admin/parametros', label: 'Parámetros', emoji: '⚙️' },
    ],
  },
  {
    label: 'Accesos públicos',
    links: [
      { href: '/catalogo', label: 'Ver catálogo público', emoji: '🛍️' },
      { href: '/portafolio', label: 'Ver portafolio público', emoji: '📚' },
    ],
  },
];

const isActivePath = (pathname: string, href: string) =>
  href === '/admin' ? pathname === href : pathname.startsWith(href);

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await clientFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-navy-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">
            NeuroMundo <span className="text-gold-300">Admin</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Sesión iniciada como {username}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/15"
        >
          Salir
        </button>
      </div>

      <nav className="flex flex-1 flex-row gap-5 overflow-x-auto px-3 py-4 lg:block lg:overflow-y-auto lg:px-3 lg:py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="min-w-max lg:mb-6 lg:min-w-0">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex shrink-0 items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'border-gold-400 bg-gold-500/15 text-gold-300'
                        : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span aria-hidden="true" className="w-5 text-center text-base">{link.emoji}</span>
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-3 rounded-xl border-t border-white/10 px-3 py-4 text-sm font-medium text-slate-400 transition-colors hover:text-white lg:mt-auto"
        >
          <span aria-hidden="true" className="w-5 text-center text-base">🌐</span>
          <span className="whitespace-nowrap">Ver sitio público</span>
        </Link>
      </nav>
    </aside>
  );
}
