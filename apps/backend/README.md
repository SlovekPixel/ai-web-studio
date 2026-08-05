# Backend

HTTP API сервиса AI Web Studio на NestJS.

## Стек

- **Runtime:** Node.js 18+, TypeScript
- **Framework:** NestJS 11
- **Validation:** Zod (`nestjs-zod`)
- **Logging:** Winston
- **Docs:** Swagger (`/api/docs`)

## Запуск

Из корня монорепозитория:

```bash
cp .env.example .env
pnpm install
pnpm start:dev
```

Переменные окружения: `BACKEND_HOSTNAME`, `BACKEND_PORT`, `NODE_ENV`, `ENABLE_SWAGGER`.

## Структура

- `src/config` — swagger и прочие app-level конфиги
- `src/core/configuration` — Zod-схема env и глобальный `ConfigurationService`
- `src/core/logging` — модуль логирования
- `src/modules` — доменные модули (будут добавляться по мере разработки)
