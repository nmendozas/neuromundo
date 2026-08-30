# 🧠 NeuroMundo S.A.S — Sitio web + Sistema de cotizaciones

Monorepo con dos servicios contenedorizados:

| Servicio | Contenedor | Tecnología | Puerto |
|---|---|---|---|
| `frontend/` | `neuromundo-web` | Next.js 14 (App Router) + Tailwind + Framer Motion | **3000** (público) |
| `backend/` | `neuromundo-api` | Node.js + Express + TypeScript (self-hosted, sin APIs externas) | 4000 (solo red interna) |

## ✨ Funcionalidades

- **Página pública** corporativa (Hero, Servicios, Historia/Misión/Visión, Catálogo, Contacto).
- **Panel de administración** `/admin`:
  - 📊 Dashboard con métricas.
  - 🧩 CRUD de ítems del catálogo + **importación desde hojas de cálculo** (`.xlsx`/`.csv` con plantilla y validación por fila) + exportación a Excel.
  - 📄 **Cotizaciones**: builder, numeración automática `NM-2026-0001`, totales (descuento + IVA), estados, **exportación a PDF y Excel** y **envío por correo con el PDF adjunto**.
  - ✏️ **CMS**: edición de historia, misión, visión, valores, hero y contacto.
  - ⚙️ **Parámetros**: datos de empresa, IVA, validez, prefijo, nota de pie, prueba SMTP.
  - 📬 Bandeja de mensajes del formulario de contacto.
- **Base de datos SQLite** persistente (volumen Docker `neuromundo-data`).
- **Sin servicios API externos**: SMTP propio (protocolo), generación local de PDF/Excel, autenticación propia.

## 🚀 Despliegue en VPS (Docker)

```bash
# 1. Variables de entorno (opcional: cambia credenciales y SMTP)
export SESSION_SECRET="una-frase-larga-y-segura"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="UnaClaveFuerte123!"

# Correo (opcional; sin esto las cotizaciones no se envían por correo)
export SMTP_HOST="smtp.tu-host.com"
export SMTP_PORT=587
export SMTP_USER="correo@neuromundo.com"
export SMTP_PASS="clave"

# 2. Construir y levantar
docker compose up -d --build

# 3. Verificar
docker ps                          # neuromundo-web y neuromundo-api
curl http://localhost:3000         # sitio público
curl http://localhost:3000/login   # panel de administración
```

- Acceso admin: usuario y contraseña definidos por `ADMIN_USERNAME`/`ADMIN_PASSWORD` (por defecto `admin` / `Admin123!` — **cámbialos en producción**).
- La API **no se expone a internet**; el frontend actúa como proxy (BFF) con sesión en cookie `httpOnly`.
- Los datos persisten en el volumen `neuromundo-data` (`/app/data/neuromundo.db`).

## 💻 Desarrollo local

### Opción A — Un clic (recomendado)

Arranca backend y frontend **en segundo plano** (oculto) automáticamente:

```
iniciar-local.bat        # doble clic (o cmd /c iniciar-local.bat)
```

- Instala dependencias si faltan y compila el backend (solo la primera vez).
- Sitio público: `http://localhost:3000`
- Panel admin: `http://localhost:3000/login` (credenciales en `CREDENCIALES.md`)
- API (health): `http://localhost:4000/healthz`

Para detener todo:

```
detener-local.bat
```

Los procesos se lanzan ocultos y sus registros quedan en `.run/`
(`api.log`, `api.err.log`, `web.log`, `web.err.log`) junto con los archivos
`api.pid`/`web.pid`. `detener-local.bat` los detiene y limpia los `.pid`.

> 📌 **Requisitos:** Node.js 18+ y, la primera vez, permisos de escritura en la
> carpeta del proyecto (para crear `node_modules`, `.next/` y `backend/data/`).

### Opción B — Manual (dos terminales)

```bash
# Terminal 1 — Backend (puerto 4000)
cd backend
npm install
npm run dev

# Terminal 2 — Frontend (puerto 3000, con API_URL apuntando al backend local)
cd frontend
npm install
$env:API_URL="http://localhost:4000"   # PowerShell
npm run dev
```

## 🧪 Pruebas del backend

```bash
cd backend
npm run build
node dist/index.js          # en un terminal
node scripts/smoke.mjs      # en otro: 26 pruebas end-to-end
```

> Consulta `CREDENCIALES.md` para las credenciales de acceso y su configuración.

## 🧱 Estructura

```
Neuromundo/
├── docker-compose.yml       # Orquesta web + api + volumen
├── backend/                 # API Express (TypeScript)
│   ├── Dockerfile
│   └── src/
│       ├── config/env.ts    # Env validado con zod
│       ├── db/              # SQLite + repositorios
│       ├── services/        # auth, items, quotes, export (PDF/Excel), email
│       ├── routes/          # /api/*
│       └── middleware/      # auth, rate-limit, validación, errores
├── frontend/                # Next.js 14 (App Router)
│   ├── Dockerfile           # output: 'standalone'
│   └── src/
│       ├── app/             # Página pública, /admin, /login, /api (BFF)
│       ├── components/      # Públicos + panel admin
│       ├── config/site.ts   # Defaults (la API sobrescribe vía CMS)
│       └── server/          # apiFetch (BFF) + data
└── NeuroMundo_Portafolio_Servicios.html  # Portafolio original de referencia
```
