FROM node:22-alpine AS base

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock turbo.json tsconfig.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

FROM base AS dev

ENV NODE_ENV=development
ENV TURBO_TELEMETRY_DISABLED=1

RUN yarn install --frozen-lockfile

RUN yarn db:generate

EXPOSE $PORT

VOLUME ["/app/.turbo"]

CMD ["yarn", "turbo", "run", "dev", "--filter=..."]
