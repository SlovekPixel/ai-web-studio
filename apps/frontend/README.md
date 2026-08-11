# Frontend

Next.js кабинет AI Web Studio.

## Стек

- Next.js 16 (App Router, Rspack)
- TypeScript, Tailwind CSS, shadcn/ui
- TanStack Query, React Hook Form, Zod (`@repo/types`)
- Auth через same-origin proxy `/api/*` → NestJS

## Структура

```
src/
  app/                 # маршруты Next.js
  components/
    ui/                # дизайн-система (shadcn)
    layout/            # shell, sidebar, theme
    shared/            # переиспользуемые UI-хелперы
  features/
    auth/              # api + components + hooks
    users/
    organizations/
  lib/
    api/               # http-клиент, routes, errors
  providers/
```

Новая фича = новая папка в `features/<name>` с `api.ts`, `components/`, `hooks/`.
UI-кит остаётся в `components/ui`.

## Запуск

```bash
pnpm install
pnpm --filter @repo/types build
pnpm dev:frontend
```

- Frontend: `http://localhost:3001`
- Нужен backend и `BACKEND_URL` в корневом `.env`

## Docker

Полный стек из корня репозитория:

```bash
cp .env.example .env
docker compose up --build
```

Frontend-образ: `apps/frontend/Dockerfile` (`turbo prune` + Next standalone). В Compose задайте `BACKEND_URL` (по умолчанию `http://backend:3000`).
