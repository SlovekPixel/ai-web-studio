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
- Nginx (Docker): `NGINX_HTTP_PORT`, `NGINX_HTTPS_PORT`

Порт СУБД меняется через `POSTGRES_PORT` (проброс в Docker и подключение приложения).

## Docker + HTTPS

Полный стек (postgres, redis, backend, nginx) с TLS-терминацией на nginx:

```bash
cp .env.example .env
docker compose up --build
```

- API: `https://localhost/api`
- Swagger: `https://localhost/api/docs`
- HTTP (`:80`) редиректит на HTTPS

При первом запуске nginx генерирует self-signed сертификаты в `docker/nginx/certs/` (`fullchain.pem`, `privkey.pem`). Браузер покажет предупреждение — его нужно принять; для curl используйте `-k`.

Чтобы подставить реальные сертификаты, положите `fullchain.pem` и `privkey.pem` в `docker/nginx/certs/` и перезапустите nginx — существующие файлы entrypoint не перезаписывает.

Backend в Compose доступен только через nginx (порт наружу не публикуется). Для локальной разработки без TLS по-прежнему используйте `pnpm start:dev` (HTTP).

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
