# Онлайн-визитка разработчика

Сайт-визитка с админкой, портфолио и формой обратной связи.
Дизайн в виде интерфейса консольной утилиты tmux: в табах содержится
информация о разработчике, знакомых технологиях, проектах и контактах для связи.

## Архитектура

Проект состоит из двух независимых сервисов:

- **backend** — NestJS + Prisma + AdminJS. GraphQL API и админ-панель.
- **frontend** — Vue 3 + Vite + TypeScript + Pinia. SPA, получает данные с backend через GraphQL.

Подробности по каждому сервису — в их README:
- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)

## Структура

```
business-card/
├── backend/                  # NestJS + Prisma + AdminJS (API + админка)
├── frontend/                 # Vue 3 + Vite + TypeScript (SPA)
└── README.md                 # Этот файл
```

## Быстрый старт

```bash
# 1. Поднять backend
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run start:dev            # запустит на http://localhost:3300

# 2. Поднять frontend (в отдельном терминале)
cd frontend
cp .env.example .env
npm install
npm run dev                 # запустит на http://localhost:3400
```

- **Витрина:** http://localhost:3400
- **Админка:** http://localhost:3300/admin
- **GraphQL Playground:** http://localhost:3300/api/graphql

Логин и пароль администратора по умолчанию — `admin` / `admin` (смените при первом входе).

## Разворачивание в продакшене

Общий план:

1. Подготовить окружение (Node.js 18+, СУБД, обратный прокси).
2. Собрать и запустить `backend` как сервис (systemd / pm2 / Docker).
3. Собрать `frontend` (`npm run build`) и отдавать статику из `dist/` через Nginx / Caddy / Vercel.
4. Настроить проксирование `/api/` на backend.
5. Настроить HTTPS (Let's Encrypt).

Детали по настройке каждого сервиса — в их README:
- **Backend:** [backend/README.md](./backend/README.md#установка-и-запуск)
- **Frontend:** [frontend/README.md](./frontend/README.md#установка-и-запуск)

## Поддерживаемые СУБД

- **SQLite** — по умолчанию, для dev и небольших инсталляций
- **MySQL** — для средних нагрузок
- **PostgreSQL** — для серьёзного прода

Переключение выполняется одной командой `npm run db:use:sqlite | mysql | postgres` в папке `backend`. Подробности — в [backend/README.md](./backend/README.md).

## Лицензия

MIT.