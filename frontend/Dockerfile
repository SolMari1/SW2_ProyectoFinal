FROM node:24-alpine AS base
WORKDIR /app

# ── Dependencias (imagen de desarrollo usada por docker-compose) ─────────────
FROM base AS installer
COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app
USER node
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
