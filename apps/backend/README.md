# Backend

HTTP API сервиса AI Web Studio на NestJS.

## Стек

- **Runtime:** Node.js 18+, TypeScript
- **Framework:** NestJS 11
- **ORM:** TypeORM + PostgreSQL
- **Validation:** Zod (`nestjs-zod`)
- **Logging:** Winston
- **Docs:** Swagger (`/api/docs`)

## Запуск

Из корня монорепозитория:

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres
pnpm start:dev
```

Переменные окружения:

- Backend: `BACKEND_HOSTNAME`, `BACKEND_PORT`, `NODE_ENV`, `ENABLE_SWAGGER`
- PostgreSQL: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`

Порт СУБД меняется через `POSTGRES_PORT` (проброс в Docker и подключение приложения).

## Docker

Полный стек (postgres, redis, backend) по HTTP:

```bash
cp .env.example .env
docker compose up --build
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

Для локальной разработки без Docker используйте `pnpm start:dev`.

## API

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/users` — список пользователей (без `hash_password`)
- `GET /api/users/:uuid` — пользователь по uuid (без `hash_password`)

## Структура

- `src/config` — swagger и прочие app-level конфиги
- `src/core/configuration` — Zod-схема env и глобальный `ConfigurationService`
- `src/core/database` — TypeORM + PostgreSQL
- `src/core/logging` — модуль логирования
- `src/modules` — доменные модули (`auth`, `users`)
