ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack install
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/types/package.json packages/types/
COPY packages/typescript-config/package.json packages/typescript-config/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY turbo.json ./
COPY packages ./packages

FROM base AS build-backend
COPY apps/backend ./apps/backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm build --filter=backend \
  && pnpm deploy --filter=backend --prod /prod

FROM node:${NODE_VERSION}-alpine AS backend
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build-backend /prod/package.json ./package.json
COPY --from=build-backend /prod/node_modules ./node_modules
COPY --from=build-backend /app/apps/backend/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]

FROM base AS build-frontend
ENV NEXT_TELEMETRY_DISABLED=1
COPY apps/frontend ./apps/frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm build --filter=frontend

FROM node:${NODE_VERSION}-alpine AS frontend
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ENV BACKEND_URL=http://backend:3000
WORKDIR /app
COPY --from=build-frontend /app/apps/frontend/public ./apps/frontend/public
COPY --from=build-frontend /app/apps/frontend/.next/standalone ./
COPY --from=build-frontend /app/apps/frontend/.next/static ./apps/frontend/.next/static
USER node
EXPOSE 3001
CMD ["node", "apps/frontend/server.js"]
