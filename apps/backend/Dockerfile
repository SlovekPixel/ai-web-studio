ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

FROM base AS prepare
COPY . .
RUN pnpm dlx turbo@2.10.4 prune backend --docker

FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile
COPY --from=prepare /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm build --filter=backend \
  && pnpm deploy --filter=backend --prod /prod

FROM node:${NODE_VERSION}-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /prod/package.json ./package.json
COPY --from=builder /prod/node_modules ./node_modules

COPY --from=builder /app/apps/backend/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
