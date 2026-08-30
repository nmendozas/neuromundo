# NeuroMundo S.A.S — Contexto global para agentes IA

> Este archivo es leído automáticamente por agentes IA (Antigravity, Copilot, Cursor, etc.)
> al trabajar en este repositorio. Respétalo siempre.

---

## Arquitectura del proyecto

Monorepo con dos servicios independientes que se comunican por HTTP:

```
Neuromundo/
├── backend/          # API REST — Express + TypeScript + better-sqlite3
├── frontend/         # Web pública + panel admin — Next.js 14 + Tailwind CSS
├── tools/
│   └── arrancar.ps1  # ⚠️  NO MODIFICAR — launcher de servicios (ver sección crítica)
├── iniciar-local.bat # Punto de entrada: instala deps, compila y arranca ambos servicios
├── detener-local.bat # Detiene todos los servicios y libera los puertos
└── .run/             # PIDs y logs generados en tiempo de ejecución (no versionar)
```

---

## Backend — `backend/`

| Elemento | Detalle |
|---|---|
| **Runtime** | Node.js 18+ (compatible con nvm4w en Windows) |
| **Lenguaje** | TypeScript 5 → compilado a `dist/` con `tsc` |
| **Framework** | Express 4 |
| **Base de datos** | `better-sqlite3` → archivo `backend/data/neuromundo.db` |
| **Puerto** | `4000` |
| **Entry point** | `backend/dist/index.js` (producción) / `backend/src/index.ts` (dev) |
| **Compilar** | `cd backend && npm run build` |
| **Dev** | `cd backend && npm run dev` (tsx watch) |

### Rutas registradas

| Ruta | Archivo | Descripción |
|---|---|---|
| `GET /healthz` | `src/routes/health.ts` | Health check |
| `POST /api/auth/*` | `src/routes/auth.ts` | Autenticación admin |
| `GET/POST /api/quotes/*` | `src/routes/quotes.ts` | Cotizaciones |
| `GET/POST /api/items/*` | `src/routes/items.ts` | Catálogo de servicios |
| `GET/POST /api/content/*` | `src/routes/content.ts` | CMS textos |
| `GET/POST /api/parameters/*` | `src/routes/parameters.ts` | Parámetros globales |
| `POST /api/contact` | `src/routes/contact.ts` | Formulario de contacto (email) |
| `GET /api/stats` | `src/routes/stats.ts` | Estadísticas del sistema |

### Dependencias clave

- `better-sqlite3` — requiere binarios nativos compilados con node-gyp.
  Si `npm install` falla silenciosamente, ejecutar:
  `npm approve-scripts better-sqlite3 esbuild` y luego `npm install` de nuevo.
- `nodemailer` — configurado vía variables de entorno en `backend/.env`
- `pdfmake` / `exceljs` — generación de documentos para cotizaciones

---

## Frontend — `frontend/`

| Elemento | Detalle |
|---|---|
| **Framework** | Next.js 14.2.15 (App Router) |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS 3 + Framer Motion |
| **Puerto** | `3000` |
| **Entry point** | `frontend/node_modules/next/dist/bin/next.js` |
| **Dev** | `cd frontend && npm run dev` |

### Variables de entorno del frontend

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `API_URL` | `http://localhost:4000` | URL interna de la API (server-side) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `573052743878` | Número WhatsApp público |
| `NEXT_TELEMETRY_DISABLED` | `1` | Desactiva telemetría de Next.js |

---

## ⚠️ Secciones críticas — NO modificar sin autorización explícita

### `tools/arrancar.ps1`
Este script fue diseñado deliberadamente para abrir **ventanas de consola visibles** (`cmd /k`)
para cada servicio. **No revertir a `-WindowStyle Hidden`**. El modo visible es necesario
para poder depurar errores en tiempo real.

Comportamiento esperado:
- Detecta Node.js automáticamente (compatible con nvm4w en `C:\nvm4w\nodejs\node.exe`)
- Si el puerto ya está ocupado → omite ese servicio (no lo relanza)
- Abre dos ventanas tituladas: `NeuroMundo - API :4000` y `NeuroMundo - Web :3000`

### `backend/data/neuromundo.db`
Base de datos SQLite de producción local. **No eliminar, no truncar, no mover.**

### `backend/npm` scripts de instalación
`better-sqlite3` requiere aprobación explícita de scripts:
```powershell
cd backend
npm approve-scripts better-sqlite3 esbuild
npm install
```

---

## Flujo de arranque local

```
iniciar-local.bat
  ├── Verifica node en PATH
  ├── Si no existe backend/node_modules → npm install (backend)
  ├── Si no existe backend/dist/index.js → npm run build (backend)
  ├── Si no existe frontend/node_modules/next → npm install (frontend)
  └── PowerShell: tools/arrancar.ps1
        ├── Puerto 4000 libre → abre ventana "NeuroMundo - API :4000"
        └── Puerto 3000 libre → abre ventana "NeuroMundo - Web :3000"
```

---

## Convenciones de código

- **Backend**: sin `any` implícito, todos los handlers usan tipos de `src/types/`
- **Frontend**: componentes en `frontend/src/components/`, páginas en `frontend/src/app/`
- **Commits**: prefijos convencionales — `feat:`, `fix:`, `refactor:`, `docs:`
- **No usar** `npm install -g` ni instalar paquetes globales sin consultar
