'use client';

import { motion } from 'framer-motion';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '@/config/site';
import { WhatsAppIcon } from '@/components/icons';

/** Botón flotante de WhatsApp (pulso sutil + hover). */
export function WhatsAppFloat() {
  return (
    <motion.a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/30 transition-colors hover:bg-[#1EBE5D]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </motion.a>
  );
}
