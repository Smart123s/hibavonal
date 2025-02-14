FROM node:23-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=development

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable

RUN pnpm install --frozen-lockfile

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "run", "dev"]
