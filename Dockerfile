# ---------- Build do front-end ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Variáveis do front são fixadas no build (configure como Build Args no Easypanel)
ARG VITE_SITE_URL=""
ARG VITE_META_PIXEL_ID=""
ARG VITE_API_URL=""
ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_META_PIXEL_ID=$VITE_META_PIXEL_ID \
    VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Produção: Node serve a página + API do rodízio ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server/index.js"]
