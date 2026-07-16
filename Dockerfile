# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages ./packages
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

FROM base AS deps
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend
RUN pnpm --filter @repo/types build \
  && pnpm --filter backend build \
  && pnpm --filter frontend build

FROM deps AS backend
ENV NODE_ENV=production
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM deps AS frontend
ENV NODE_ENV=production
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/apps/frontend/dist ./apps/frontend/dist
COPY apps/frontend/vite.config.ts ./apps/frontend/vite.config.ts
COPY apps/frontend/index.html ./apps/frontend/index.html
COPY apps/frontend/tsconfig.json ./apps/frontend/tsconfig.json
COPY apps/frontend/tsconfig.app.json ./apps/frontend/tsconfig.app.json
COPY apps/frontend/tsconfig.node.json ./apps/frontend/tsconfig.node.json
EXPOSE 5173
CMD ["pnpm", "--filter", "frontend", "start"]
