'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const MAX_IMAGE_DIMENSION = 1200;

export default function ProductGallery({ images, emoji, name, variant = 'card' }: { images: string[]; emoji: string; name: string; variant?: 'card' | 'hero' }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const photos = images.slice(0, 5);
  const src = photos[active];
  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setExpanded(false);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [expanded]);
  return <div className={variant === 'hero' ? 'w-full max-w-[150px]' : 'w-full'}>
    <button type="button" onClick={() => src && setExpanded(true)} className={`relative flex ${variant === 'hero' ? 'h-36' : 'h-40'} w-full items-center justify-center overflow-hidden bg-white/5 ring-1 ring-gold-400/40`} aria-label={`Ampliar imagen de ${name}`}>
      {src ? <Image src={src} alt={name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain" style={{ maxWidth: MAX_IMAGE_DIMENSION, maxHeight: MAX_IMAGE_DIMENSION }} /> : <span className="text-6xl">{emoji}</span>}
    </button>
    {photos.length > 1 && <div className="mt-2 grid grid-cols-4 gap-1">{photos.slice(0, 4).map((photo, index) => <button key={photo} type="button" onClick={() => setActive(index)} className="relative h-10 overflow-hidden border border-white/20"><Image src={photo} alt={`${name} ${index + 1}`} fill sizes="80px" className="object-cover" /></button>)}</div>}
    {expanded && src && <div role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${name}`} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setExpanded(false)}><div className="relative h-[min(85vh,900px)] w-[min(92vw,1200px)]" onClick={(event) => event.stopPropagation()}><Image src={src} alt={name} fill sizes="92vw" className="object-contain" priority /><button type="button" aria-label="Cerrar imagen ampliada" onClick={() => setExpanded(false)} className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-2xl text-white">×</button></div></div>}
  </div>;
}