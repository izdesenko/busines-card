# Backend сайта-визитки — NestJS + Prisma + AdminJS + GraphQL

Лёгкий бэкенд для сайта-визитки разработчика с автогенерируемой админ-панелью и GraphQL API.
Поддерживает подключение к SQLite (по умолчанию), MySQL и PostgreSQL через переменную `DATABASE_DRIVER`.

## Стек

- **NestJS** (TypeScript) — фреймворк
- **Prisma ORM** — ORM с поддержкой SQLite / MySQL / PostgreSQL
- **SQLite** (`database.sqlite`, один файл) — по умолчанию
- **AdminJS** (`@adminjs/nestjs` + `@adminjs/prisma`) — автогенерируемая админка на `/admin`
- **Passport.js** (`@nestjs/passport` + `passport-local` + `bcrypt`) — проверка логина/пароля
- **class-validator / class-transformer** — валидация DTO (используется в `CreateContactInput` для формы обратной связи, подключается глобально через `ValidationPipe` в `main.ts`)
- **@nestjs/graphql** + `apollo-server-express` — GraphQL API

## Важный технический нюанс: AdminJS и ESM

Начиная с 7-й версии AdminJS распространяется только как ESM-пакет, а NestJS
по умолчанию собирается в CommonJS. Официально задокументированный обходной
путь (см. https://docs.adminjs.co/installation/plugins/nest) — подключать
`@adminjs/nestjs` через динамический `import()` прямо внутри массива `imports`
в `AppModule`, что и сделано в `src/app.module.ts`. NestJS умеет резолвить
`Promise<DynamicModule>`, так что это официально поддерживаемый паттерн, а не
хак. Если при установке версии пакетов "разъедутся" и сборка начнёт падать —
это первое место, куда стоит посмотреть; при необходимости можно закрепить
adminjs на последней CommonJS-совместимой ветке (v6.x).

## Структура проекта

```
prisma/
  schema.sqlite.prisma   # шаблон схемы для SQLite
  schema.mysql.prisma    # шаблон схемы для MySQL
  schema.postgresql.prisma # шаблон схемы для PostgreSQL
  schema.prisma          # ← актуальная схема (генерируется скриптом)
src/
  main.ts                # bootstrap, сессии, CORS, ValidationPipe
  app.module.ts          # сборка всех модулей + динамический импорт AdminJS
  prisma/                # PrismaService (глобальный провайдер)
  users/                 # UsersService — поиск/создание админа, bcrypt-хэш
  auth/                  # AuthService, LocalStrategy, session-сериализация
  skills/                # SkillsResolver + SkillsService (GraphQL)
  projects/              # ProjectsResolver + ProjectsService
  text-content/          # TextContentResolver + TextContentService
  contact/               # ContactResolver + ContactService + ContactFormService
  seed/                  # SeedService — создаёт админа и заполняет дефолтные данные
  admin/                 # admin.config.ts — конфигурация AdminJS-ресурсов
scripts/
  switch-db.js           # Переключение между SQLite / MySQL / PostgreSQL
```

## Установка и запуск

### 1. Выбор СУБД

По умолчанию используется SQLite (файл `database.sqlite` в корне `prisma/`).
Для смены драйвера выполните:

```bash
# SQLite (по умолчанию)
npm run db:use:sqlite

# MySQL
npm run db:use:mysql
# Затем в .env укажи: DATABASE_URL="mysql://user:password@localhost:3306/devcard"

# PostgreSQL
npm run db:use:postgres
# Затем в .env укажи: DATABASE_URL="postgresql://user:password@localhost:5432/devcard"
```

Скрипт:
- обновит `DATABASE_DRIVER` в `.env`
- скопирует нужный `schema.*.prisma` в `schema.prisma`

### 2. Установка зависимостей и инициализация

```bash
npm install
npx prisma db push    # создаст/обновит БД согласно схеме
```

### 3. Запуск в dev-режиме

```bash
npm run start:dev
```

При первом старте в консоли появится предупреждение о созданном
администраторе по умолчанию (логин/пароль из `.env`).

## Проверка (Definition of Done из ТЗ)

1. `npm run start:dev` — приложение стартует без ошибок.
2. `http://localhost:3300/admin` — открывается форма входа AdminJS; пускает
   только по `ADMIN_USERNAME` / `ADMIN_PASSWORD` (проверка через bcrypt в
   `AuthService.validateAdmin`).
3. В админке доступен CRUD для:
   - `User` (поле `password` хэшируется через bcrypt при сохранении)
   - `SkillCategory`
   - `Skill` (с привязкой к категории)
   - `Project`
   - `TextContent`
   - `Contact`
4. Публичные GraphQL-эндпоинты:
   - `GET /api/graphql` — GraphQL Playground
   - `query { getSkills { category skills { id name level } } }` — навыки по категориям
   - `query { getProjects { id title description technologies githubLink liveLink order } }` — проекты
   - `query { getTextContents { key value } }` — все UI-строки
   - `mutation { sendContactForm(input: { name email message }) { delivered } }` — форма обратной связи

## Полезные команды

```bash
npm run db:use:sqlite   # переключить на SQLite (по умолчанию)
npm run db:use:mysql    # переключить на MySQL
npm run db:use:postgres # переключить на PostgreSQL
npm run db:generate     # сгенерировать Prisma Client после смены драйвера
npm run db:push         # синхронизировать схему с БД
npm run db:reset        # сбросить БД (drop + create) — полезно в dev
npm run db:studio       # визуальный браузер БД (работает только с SQLite)
npm run start:dev       # dev-сервер с hot-reload
npm run start           # запуск production-сборки (после npm run build)
npm run build           # production-сборка (в dist/)
npm run start:debug     # dev-сервер с отладкой
```

## Переменные окружения (.env)

См. `.env.example` — все переменные с комментариями.

**Ключевые:**
- `DATABASE_DRIVER` — `sqlite` | `mysql` | `postgresql`
- `DATABASE_URL` — строка подключения (см. шаблоны в `.env.example`)
- `PORT` — порт сервера (по умолчанию 3300)
- `CORS_ORIGIN` — origins для CORS, `*` для всех
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — логин/пароль администратора
- `SESSION_SECRET`, `ADMIN_COOKIE_SECRET` — секреты сессий (обязательно в проде)
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — для отправки писем в Telegram (опционально)