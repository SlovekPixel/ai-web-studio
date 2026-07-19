# Backend

HTTP API сервиса AI Web Studio. NestJS-приложение с модульной (hexagonal) структурой, TypeORM и JWT-аутентификацией.

## Стек

- **Runtime:** Node.js 18+, TypeScript
- **Framework:** NestJS 11
- **Validation:** Zod
- **ORM:** TypeORM + PostgreSQL (`pg`)
- **Dev / build:** Vite + `vite-plugin-node`, SWC

## Требования

- Node.js >= 18
- pnpm 9
- PostgreSQL 18 (локально или через Docker Compose)

## Быстрый старт

Из корня монорепозитория:

Слои модулей:

- `domain` — сущности, порты
- `application` — use-case сервисы
- `infrastructure` — адаптеры (JWT, bcrypt, TypeORM)
- `presentation` — HTTP controllers, DTO
