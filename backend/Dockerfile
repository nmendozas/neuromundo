# ═══════════════════════════════════════════════════════════════
# NeuroMundo API · Node.js + Express + TypeScript · node:18-alpine
# better-sqlite3 se compila desde fuente en la etapa de build (alpine)
# ═══════════════════════════════════════════════════════════════

# ---------- Etapa 1: Dependencias ----------
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund

# ---------- Etapa 2: Build TypeScript ----------
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Etapa 3: Runtime ----------
FROM node:18-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "dist/index.js"]
