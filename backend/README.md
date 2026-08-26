# Backend сайта-визитки — NestJS + Prisma + SQLite + AdminJS

Лёгкий бэкенд для сайта-визитки разработчика с автогенерируемой админ-панелью
и REST API для фронтенда. Реализован строго по ТЗ: NestJS (TypeScript),
Prisma ORM + SQLite, AdminJS для CRUD, Passport.js (passport-local + bcrypt)
для проверки пароля администратора, отправка формы обратной связи в Telegram.

⚠️ **Важно:** этот проект собран в песочнице без доступа в интернет, поэтому
`npm install` здесь не запускался и код не был скомпилирован/протестирован
живым запуском. Структура и API написаны по актуальной документации пакетов,
но перед продакшеном обязательно прогоните шаги ниже локально и почитайте
свежие changelog'и adminjs/@adminjs-nestjs — это быстро развивающиеся пакеты.

## Стек

- **NestJS** (TypeScript) — фреймворк
- **Prisma ORM** + **SQLite** (`database.sqlite`, один файл)
- **AdminJS** (`@adminjs/nestjs` + `@adminjs/prisma`) — автогенерируемая админка на `/admin`
- **Passport.js** (`@nestjs/passport` + `passport-local` + `bcrypt`) — проверка логина/пароля
- **class-validator / class-transformer** — валидация DTO

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
  schema.prisma          # модели User, Skill, Project, TextContent (SQLite)
src/
  main.ts                # bootstrap, сессии, passport, ValidationPipe
  app.module.ts           # сборка всех модулей + подключение AdminJS
  prisma/                 # PrismaService (глобальный провайдер)
  users/                  # UsersService — поиск/создание админа, bcrypt-хэш
  auth/                   # AuthService, LocalStrategy, session-сериализация
  skills/                 # GET /api/skills, /api/skills/:id
  projects/               # GET /api/projects, /api/projects/:id
  text-content/           # GET /api/content, /api/content/:key
  contact/                # POST /api/contact → отправка в Telegram
  seed/                   # SeedService — создаёт админа при первом старте
  admin/                  # admin.config.ts — конфигурация AdminJS-ресурсов
```

## Установка и запуск

1. Установите зависимости (нужен **Node.js 18+**, из-за глобального `fetch`
   в `contact.service.ts`):

   ```bash
   npm install
   ```

2. Скопируйте `.env.example` в `.env` и заполните значения:

   ```bash
   cp .env.example .env
   ```

   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — логин/пароль администратора,
     который будет автоматически создан при первом старте, если таблица
     `User` пуста (см. `src/seed/seed.service.ts`).
   - `SESSION_SECRET`, `ADMIN_COOKIE_SECRET` — замените на случайные строки.
   - `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — токен бота от [@BotFather](https://t.me/BotFather)
     и chat_id получателя (например, узнать свой через [@userinfobot](https://t.me/userinfobot)).
     Если оставить пустыми — форма обратной связи не упадёт, а просто
     залогирует сообщение в консоль вместо отправки.

3. Сгенерируйте Prisma Client и накатите миграцию (создаст `database.sqlite`):

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Запустите в dev-режиме:

   ```bash
   npm run start:dev
   ```

   При первом старте в консоли появится предупреждение о созданном
   администраторе по умолчанию.

## Проверка (Definition of Done из ТЗ)

1. `npm run start:dev` — приложение стартует без ошибок.
2. `http://localhost:3000/admin` — открывается форма входа AdminJS; пускает
   только по `ADMIN_USERNAME` / `ADMIN_PASSWORD` (проверка через bcrypt в
   `AuthService.validateAdmin`).
3. В админке доступен CRUD для `Skill`, `Project`, `TextContent`, `User`
   (поле `password` в форме `User` при сохранении автоматически хэшируется
   через bcrypt, см. `hashPasswordBeforeSave` в `admin.config.ts`).
4. Публичные эндпоинты отдают JSON:
   - `GET /api/skills`, `GET /api/skills/:id`
   - `GET /api/projects`, `GET /api/projects/:id`
   - `GET /api/content`, `GET /api/content/:key`
   - `POST /api/contact` — тело `{ name, email, phone?, message }`,
     отправляет сообщение в Telegram-бота.

## Полезные команды Prisma

```bash
npm run prisma:studio   # визуальный браузер по SQLite-базе
npm run prisma:deploy   # применить миграции в проде (без --create)
```
