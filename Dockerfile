## ── Stage 1: Build the client ────────────────────────────────────────
FROM node:24-alpine AS client-build
RUN corepack enable
WORKDIR /app/client
COPY client/package.json client/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY client/ ./
RUN pnpm build

## ── Stage 2: Build the server ────────────────────────────────────────
FROM node:24-alpine AS server-build
RUN corepack enable
WORKDIR /app/server
COPY server/package.json server/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY server/ ./
RUN pnpm prisma generate
RUN pnpm build

## ── Stage 3: Production image ────────────────────────────────────────
FROM node:24-alpine
RUN corepack enable
WORKDIR /app

COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/node_modules ./node_modules
COPY --from=server-build /app/server/prisma ./prisma
COPY --from=server-build /app/server/package.json ./
COPY --from=client-build /app/client/dist ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]
