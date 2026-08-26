# Frontend визитки — Vue 3 + Vite + TypeScript + Pinia + GraphQL

SPA-визитка в виде tmux-интерфейса (вкладки `whoami` / `htop` / `projects` /
`sendmail`), весь текстовый и табличный контент — динамический, приходит с
бэкенда (`../dev-card-backend`) через GraphQL.

⚠️ Как и бэкенд, этот проект собран без доступа в интернет: `npm install` не
запускался, живой сборки/типопроверки не было. Структура и API соответствуют
актуальной документации Vue 3 / graphql-request / Pinia / Tailwind, но
обязательно прогоните шаги ниже локально перед деплоем.

## Стек и почему именно так

- **Vue 3** (`<script setup>`, Composition API) + **Vite** + **TypeScript**
- **Pinia** — единый источник состояния: каждый стор дергает GraphQL при
  первом обращении (`fetch()` идемпотентен — повторные вызовы при переключении
  вкладок ничего не перезапрашивают) и держит `loading` / `error` / данные.
- **graphql-request** — выбран как самый легковесный клиент из вариантов в ТЗ:
  никакого собственного кеша/reactive-слоя поверх Vue, потому что кеширование
  и реактивность здесь и так на Pinia. Apollo Client тут был бы избыточным
  весом ради возможностей (нормализованный кеш, оптимистичные апдейты),
  которые в этом проекте не нужны.
- **Tailwind CSS** — тема расширена под уже существующий дизайн визитки
  (тёмный slate-фон, мятный/янтарный акценты, JetBrains Mono + Space Grotesk),
  а не дефолтная палитра Tailwind.

## Структура

```
src/
  main.ts                 # createApp + Pinia
  App.vue                  # раскладка, список вкладок, переключение табов
  style.css                # Tailwind-слои + анимации (blink, pulse, fade, toast)
  graphql/
    client.ts               # инстанс GraphQLClient (graphql-request)
    queries.ts               # getSkills / getProjects / getTextContents / getContacts
    mutations.ts             # sendContactForm
  types/index.ts            # TS-интерфейсы под GraphQL-схему бэкенда
  stores/                   # Pinia: skills, projects, textContent, contacts, contactForm
  components/
    TmuxWindow.vue           # рамка терминала + tmux status/tab bar + часы
    panes/
      WhoamiPane.vue          # hero_title/hero_role/about_me (v-html) из TextContent
      HtopPane.vue             # навыки, сгруппированные по категориям (getSkills)
      ProjectsPane.vue         # портфолио в стиле `ls -la ~/projects`
      SendmailPane.vue         # список контактов + форма в стиле `swaks`
    ui/
      ToastHost.vue            # уведомления об отправке формы
      CopyButton.vue           # copy-to-clipboard для контактов
  composables/useToast.ts    # реактивный стор тостов (простой синглтон)
```

## Установка и запуск

1. Убедитесь, что бэкенд поднят на `http://localhost:3000` (см.
   `../dev-card-backend/README.md`) — там же теперь есть `/graphql`.

2. Установите зависимости (**Node.js 18+**):

   ```bash
   npm install
   ```

3. Скопируйте `.env.example` в `.env`. Значение по умолчанию (`/graphql`)
   работает через прокси из `vite.config.ts` — ничего менять не нужно, если
   бэкенд крутится на 3000-м порту локально.

   ```bash
   cp .env.example .env
   ```

4. Запустите dev-сервер:

   ```bash
   npm run dev
   ```

   Откройте `http://localhost:5173`.

## Прокси и CORS (шаг 8 из ТЗ)

`vite.config.ts` проксирует `/graphql` на `http://localhost:3000`, поэтому в
dev-режиме браузер всегда стучится на свой origin (`localhost:5173`) и не
упирается в CORS. Бэкенд к тому же уже вызывает `app.enableCors()` в
`main.ts`, так что прямые запросы на `localhost:3000/graphql` тоже отработают
без блокировок — прокси здесь скорее про единый origin и относительные URL,
чем про обход ограничений.

Для прод-сборки задайте `VITE_GRAPHQL_URL` с абсолютным адресом бэкенда.

## О `v-html`

`hero_title`/`hero_role`/`about_me` и подобные текстовые блоки редактируются
через AdminJS и приходят с бэкенда как HTML-строки (так задано в ТЗ) —
`WhoamiPane.vue` рендерит их через `v-html`. Источник контента доверенный
(его может менять только администратор через AdminJS-логин), это не
произвольный пользовательский ввод, поэтому XSS-риск здесь ограничен уровнем
доверия к самой админке.

## Проверка

1. `npm run dev` — приложение стартует без ошибок, видно 4 вкладки tmux.
2. Вкладка `whoami` — имя/роль/текст о себе подтягиваются из `getTextContents`.
3. Вкладка `htop` — навыки из `getSkills`, сгруппированные по категориям,
   с CPU-барами по уровню владения.
4. Вкладка `projects` — список из `getProjects`.
5. Вкладка `sendmail` — контакты из `getContacts` (copy-to-clipboard работает),
   ниже форма в виде команды `swaks`: валидация email, состояние `sending…`
   на кнопке, toast с результатом (`sendContactForm` → Telegram на бэкенде).
