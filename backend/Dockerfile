FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ── Dependencias (también es la imagen de desarrollo usada por docker-compose) ─
FROM base AS installer
COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app
USER node

# ── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
COPY --chown=node:node . .
RUN npx prisma generate && npm run build

# ── Producción ───────────────────────────────────────────────────────────────
FROM builder AS runner
ENV NODE_ENV=production
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
