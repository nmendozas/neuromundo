import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: {
    default: 'NeuroMundo S.A.S | Suministro médico y soluciones para IPS',
    template: '%s · NeuroMundo S.A.S',
  },
  description:
    'Suministro de material de osteosíntesis, insumos para UCI, facturación remota SOAT/ADRES/ARL/EPS, radicación, auditoría de cuentas médicas y capacitación para IPS en Colombia.',
  keywords: [
    'insumos médicos',
    'osteosíntesis',
    'facturación SOAT',
    'ADRES',
    'auditoría de cuentas médicas',
    'UCI',
    'Colombia',
  ],
  openGraph: {
    title: 'NeuroMundo S.A.S | Un mundo de soluciones',
    description: 'Servicios y venta de insumos médicos para instituciones de salud en Colombia.',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-white font-sans text-navy-900 antialiased">{children}</body>
    </html>
  );
}
