'use client';

import { usePathname, useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/client-api';

const LINKS = [
  { href: '/admin', label: 'Dashboard', emoji: '📊' },
  { href: '/admin/items', label: 'Catálogo de ítems', emoji: '🧩' },
  { href: '/catalogo', label: 'Ver catálogo público', emoji: '🛍️' },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', emoji: '📄' },
  { href: '/admin/cotizaciones/nueva', label: 'Nueva cotización', emoji: '➕' },
  { href: '/admin/contenido', label: 'Contenido de la web', emoji: '✏️' },
  { href: '/portafolio', label: 'Ver portafolio público', emoji: '📚' },
  { href: '/admin/parametros', label: 'Parámetros', emoji: '⚙️' },
  { href: '/admin/mensajes', label: 'Mensajes de contacto', emoji: '📬' },
];

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await clientFetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-navy-950 text-white lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-5">
        <div>
          <p className="font-display text-base font-bold">
            NeuroMundo <span className="text-gold-300">Admin</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/20"
        >
          Salir
        </button>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-6">
        {LINKS.map((link) => {
          const active =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-gold-500/20 text-gold-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{link.emoji}</span>
              <span className="whitespace-nowrap">{link.label}</span>
            </a>
          );
        })}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:mt-4"
        >
          🌐 Ver sitio público
        </a>
      </nav>
    </aside>
  );
}
