'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { CloseIcon, MenuIcon } from '@/components/icons';

export function Navbar({ parameters }: { parameters: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const getHref = (href: string) => (href.startsWith('#') ? `/${href}` : href);
  const companyName = parameters['company.name'] || siteConfig.name;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-gold-500/25 bg-navy-950/95 backdrop-blur-md transition-all duration-300 ${
        scrolled || open ? 'shadow-lg shadow-navy-950/10' : ''
      }`}
    >
      <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/logo.png" alt={companyName} width={60} height={34} className="h-[34px] w-auto object-contain" priority />
          <span className="font-display text-[15px] font-semibold tracking-[0.03em] text-gold-300">
            {companyName}
          </span>
        </a>

        <ul className="hidden items-center gap-[22px] md:flex">
          {siteConfig.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={getHref(link.href)}
                className="border-b border-transparent pb-[3px] text-[13px] font-medium uppercase tracking-[0.03em] text-white/70 transition-colors hover:border-gold-500 hover:text-gold-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/admin"
          className="hidden whitespace-nowrap rounded-lg bg-gold-500 px-[18px] py-[9px] text-xs font-bold uppercase tracking-[0.04em] text-navy-950 transition-colors hover:bg-gold-400 md:inline-flex"
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
            className="overflow-hidden border-t border-gold-500/25 bg-navy-950/95 backdrop-blur-md md:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={getHref(link.href)}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-[13px] font-medium uppercase tracking-[0.03em] text-white/70 transition-colors hover:bg-white/5 hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/admin" onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[0.04em] text-gold-300 hover:bg-white/5">
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
