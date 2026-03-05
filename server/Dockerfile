FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:24-alpine
RUN corepack enable
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]
