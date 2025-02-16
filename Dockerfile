FROM node:23-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS builder

RUN corepack enable

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate

RUN pnpm run build

FROM base AS prod

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
