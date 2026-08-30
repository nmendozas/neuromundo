/** Tipos compartidos del frontend (espejo de los modelos de la API). */

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface SiteInfo {
  content: Record<string, string>;
  parameters: Record<string, string>;
}

export interface Item {
  id: number;
  reference: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  cost_price: number;
  sale_price: number;
  emoji: string;
  active: number;
}

export interface Quote {
  id: number;
  number: string;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_nit: string;
  status: string;
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  currency: string;
  valid_days: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: number;
  quote_id: number;
  item_id: number | null;
  reference: string;
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface QuoteDetail {
  quote: Quote;
  items: QuoteItem[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface Stats {
  items: number;
  quotes: number;
  messagesUnread: number;
  quotesByStatus: Record<string, number>;
  recentQuotes: Quote[];
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value ?? 0);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}
