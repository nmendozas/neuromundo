/** Cliente de fetch para componentes del navegador (BFF /api de Next). */

export class ClientApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function clientFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { ...init, cache: 'no-store' });

  if (res.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    throw new ClientApiError(401, 'No autorizado');
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      message = data.error ?? message;
    } catch {
      /* sin cuerpo JSON */
    }
    throw new ClientApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
