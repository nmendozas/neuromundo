'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Curva de easing premium usada en todo el sitio. */
export const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

interface RevealProps {
  children: ReactNode;
  /** Retardo en segundos (útil para stagger) */
  delay?: number;
  /** Desplazamiento vertical inicial en px */
  y?: number;
  className?: string;
}

/**
 * Wrapper reutilizable: fade-in + slide-up al entrar en el viewport.
 * Respeta prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 32, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
