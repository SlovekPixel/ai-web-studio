# Backend

HTTP API сервиса AI Web Studio на NestJS.

## Стек

- **Runtime:** Node.js 18+, TypeScript
- **Framework:** NestJS 11
- **ORM:** TypeORM + PostgreSQL
- **Cache / sessions:** Redis (ioredis)
- **Auth:** JWT в httpOnly-cookies + Redis session store
- **Validation:** Zod (`nestjs-zod`, схемы в `@repo/types`)
- **i18n:** `ru` / `en` (`Accept-Language`)
- **Logging:** Winston
- **Docs:** Swagger (`/api/docs`)

## Запуск

Из корня монорепозитория:

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres redis
pnpm --filter backend start:dev
```

## Docker

Полный стек (postgres, redis, backend, frontend):

```bash
cp .env.example .env
docker compose up --build
```

Образы собираются из `apps/backend/Dockerfile` и `apps/frontend/Dockerfile` (`turbo prune` + multi-stage).

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Frontend: `http://localhost:3001`

## Архитектура

Проект следует **hexagonal / clean architecture** в стиле NestJS: домен не зависит от фреймворка и БД, инфраструктура подключается через порты.

### Разделение `core` и `modules`

```
src/
├── core/                 # кросс-cutting (глобальные модули)
│   ├── configuration/
│   ├── database/
│   ├── redis/
│   ├── i18n/
│   └── logging/
├── modules/              # доменные bounded contexts
│   ├── auth/
│   ├── users/
│   └── organizations/
├── filters/
├── config/
└── swagger/
```

- **`core/`** — платформенные сервисы, общие для всех фич.
- **`modules/`** — бизнес-контексты со своей слоистой структурой.

### Слои модуля

Каждый модуль в `src/modules/<name>/` строится так:

| Слой | Путь | Ответственность |
|------|------|-----------------|
| Presentation | `presentation/http/` | Controllers, DTO, Swagger, guards/decorators |
| Application | `application/use-cases/` | Оркестрация сценариев (`execute`) |
| Domain | `domain/` | Entities, ports (`Symbol` + интерфейс), constants |
| Infrastructure | `infrastructure/` | TypeORM, Redis, bcrypt, JWT и другие адаптеры |
