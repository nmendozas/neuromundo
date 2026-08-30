# 🔑 Credenciales — NeuroMundo S.A.S

> ⚠️ **Este documento contiene credenciales de acceso.** Mantenlo en un lugar seguro y no lo subas a repositorios públicos.

---

## Acceso al panel de administración

| Campo | Valor |
|---|---|
| URL | `http://localhost:3000/login` |
| Usuario | `admin` |
| Contraseña | `Admin123!` |

> ⚠️ En producción debes cambiar estas credenciales. Se configuran por
> **variables de entorno** antes de levantar el contenedor (ver abajo).

---

## Credenciales por defecto y cómo cambiarlas

Las credenciales se leen de variables de entorno. Si no se definen, se usan
estos valores **por defecto**:

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Usuario del panel |
| `ADMIN_PASSWORD` | `Admin123!` | Contraseña del panel |
| `SESSION_SECRET` | *(generado en primera ejecución)* | Firma de la cookie de sesión |

### Método 1 — Archivo `.env` en la raíz del proyecto

Crea un archivo `.env` en la carpeta raíz `Neuromundo/`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=UnaClaveFuerte123!
SESSION_SECRET=una-frase-muy-larga-y-segura-de-al-menos-32-caracteres
```

### Método 2 — Variables de entorno del sistema/VPS

```bash
# Linux / macOS / VPS
export ADMIN_PASSWORD="UnaClaveFuerte123!"
export SESSION_SECRET="una-frase-muy-larga-y-segura"

# Windows (PowerShell)
$env:ADMIN_PASSWORD = "UnaClaveFuerte123!"
$env:SESSION_SECRET = "una-frase-muy-larga-y-segura"
```

---

## Configuración de correo (SMTP)

Necesaria solo si quieres **enviar cotizaciones por correo con PDF adjunto**.
Se administra desde el panel: **Parámetros → Configuración de correo**, o vía
variables de entorno:

| Variable | Descripción |
|---|---|
| `SMTP_HOST` | Servidor SMTP (ej. `smtp.tu-host.com`) |
| `SMTP_PORT` | Puerto (habitual: `587` o `465`) |
| `SMTP_USER` | Cuenta de correo remitente |
| `SMTP_PASS` | Contraseña de la cuenta |
| `SMTP_FROM` | *(opcional)* Correo que aparecerá como remitente |
| `SMTP_SECURE` | *(opcional)* `true` para TLS explícito / puerto 465 |

> 💡 Puedes probar la conexión desde el panel: **Parámetros → Probar SMTP**.

---

## Base de datos

- En local: `backend/data/neuromundo.db` (otra lugar de `backend/data/`).
- En Docker: volumen `neuromundo-data` → `/app/data/neuromundo.db`.
- Backups: copia el archivo `.db` mientras el servicio está detenido.
