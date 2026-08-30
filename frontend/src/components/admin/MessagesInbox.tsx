'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientFetch } from '@/lib/client-api';
import type { ContactMessage } from '@/types';
import { formatDate } from '@/types';
import { Alert, Badge, Button, Card, Spinner } from '@/components/admin/ui';

export function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await clientFetch<ContactMessage[]>('/api/messages'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los mensajes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (msg: ContactMessage) => {
    await clientFetch(`/api/messages/${msg.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: msg.is_read ? 0 : 1 }),
    });
    await load();
  };

  const remove = async (msg: ContactMessage) => {
    if (!window.confirm(`¿Eliminar el mensaje de ${msg.name}?`)) return;
    await clientFetch(`/api/messages/${msg.id}`, { method: 'DELETE' });
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <Card title="Mensajes de contacto">
      {error && <Alert tone="error">{error}</Alert>}

      {messages.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">No hay mensajes de contacto todavía.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`rounded-2xl border p-5 ${msg.is_read ? 'border-slate-100 bg-white' : 'border-gold-200 bg-gold-50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {msg.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{msg.name}</p>
                    <p className="text-xs text-slate-400">
                      {msg.email} · {msg.phone || 'sin teléfono'} · {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.is_read && <Badge className="bg-gold-500 text-white">Nuevo</Badge>}
                  <Button variant="secondary" onClick={() => toggleRead(msg)}>
                    {msg.is_read ? 'Marcar no leído' : 'Marcar leído'}
                  </Button>
                  <Button variant="danger" onClick={() => remove(msg)}>🗑</Button>
                </div>
              </div>
              {msg.service && (
                <p className="mt-3">
                  <Badge className="bg-navy-100 text-navy-700">Línea: {msg.service}</Badge>
                </p>
              )}
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
