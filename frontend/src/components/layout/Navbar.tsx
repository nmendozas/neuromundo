'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { CloseIcon, MenuIcon } from '@/components/icons';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open ? 'border-b border-white/10 bg-navy-950/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="NeuroMundo S.A.S" width={40} height={40} className="h-9 w-9" priority />
          <span className="font-display text-base font-bold tracking-tight text-white">
            NeuroMundo <span className="text-clinical-300">S.A.S</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {siteConfig.navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-clinical-300">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/admin"
          className="hidden rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 md:inline-flex"
        >
          Acceso admin
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-md md:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-clinical-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/admin" onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5">
                  Acceso admin
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
