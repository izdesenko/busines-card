# Frontend визитки — Vue 3 + Vite + TypeScript + Pinia + GraphQL

SPA-визитка в виде tmux-интерфейса (вкладки `whoami` / `htop` / `projects` / `sendmail`).
Весь текстовый и табличный контент — динамический, приходит с бэкенда через GraphQL.
UI-строки редактируются через админку (AdminJS) и хранятся в таблице `TextContent`.

## Стек

- **Vue 3** (`<script setup>`, Composition API) + **Vite** + **TypeScript**
- **Pinia** — единый источник состояния: каждый стор дергает GraphQL при
  первом обращении (`fetch()` идемпотентен — повторные вызовы при переключении
  вкладок ничего не перезапрашивают) и держит `loading` / `error` / данные.
- **graphql-request** — выбран как самый легковесный клиент: никакого
  собственного кеша/reactive-слоя поверх Vue, потому что кеширование и
  реактивность здесь и так на Pinia. Apollo Client был бы избыточным весом
  ради возможностей (нормализованный кеш, оптимистичные апдейты), которые
  в этом проекте не нужны.
- **Tailwind CSS** — тема расширена под дизайн визитки (тёмный slate-фон,
  мятный/янтарный акценты, JetBrains Mono + Space Grotesk), а не дефолтная
  палитра Tailwind.

## Структура

```
src/
  main.ts                  # createApp + Pinia
  App.vue                  # раскладка, список вкладок, переключение табов, контейнер-инфо
  style.css                # Tailwind-слои + анимации (blink, pulse, fade, toast) + кастомный скроллбар
  index.html               # VITE_SITE_TITLE подставляется в <title>

  graphql/
    client.ts              # инстанс GraphQLClient (graphql-request)
    queries.ts             # текст запросов GraphQL: getSkills, getProjects, getTextContents, getContacts
    mutations.ts           # текст мутаций GraphQL: sendContactForm
  types/index.ts           # TS-интерфейсы под GraphQL-схему бэкенда

  stores/                  # Pinia сторы, загрузка информации о:
    skills                 # навыках - вкладка htop
    projects               # проектах - вкладка ls -lA ~/work
    textContent            # тексты на вкладках (био, заголовки, команды, ...)
    contacts               # контактах (username + ссылка)
    contactForm            # отправка данных (имя, email, текст) на метод апи для отправки сообщения в telegram через бота.

  components/
    TmuxWindow.vue         # рамка терминала + tmux status/tab bar + часы (фикс. высота)
    panes/
      WhoamiPane.vue       # hero_title/hero_role/about_me (v-html) из TextContent
      HtopPane.vue         # навыки, сгруппированные по категориям, с CPU-барами
      ProjectsPane.vue     # портфолио
      SendmailPane.vue     # список контактов + форма в стиле команды `swaks`
    ui/
      ToastHost.vue        # уведомления об отправке формы
      CopyButton.vue       # copy-to-clipboard для контактов
  composables/useToast.ts  # реактивный стор тостов (простой синглтон)
```

## Установка и запуск

1. Убедитесь, что бэкенд поднят на `http://localhost:3300` (см. `../backend/README.md`).

2. Установите зависимости (**Node.js 18+**):

   ```bash
   npm install
   ```

3. Скопируйте `.env.example` в `.env`.

   ```bash
   cp .env.example .env
   ```

   Доступные переменные:
   - `VITE_GRAPHQL_URL` — URL GraphQL (по умолчанию `/api/graphql` — через прокси)
   - `VITE_GRAPHQL_HOST` — абсолютный адрес бэкенда (используется при необходимости)
   - `VITE_SITE_TITLE` — текст в `<title>` (по умолчанию `"User — Software Developer"`)

4. Запустите dev-сервер:

   ```bash
   npm run dev
   ```

   Откройте `http://localhost:3400`.

## Прокси и CORS

`vite.config.ts` проксирует `/api` на `http://localhost:3300`, поэтому в
dev-режиме браузер всегда стучится на свой origin (`localhost:3400`) и не
упирается в CORS. Бэкенд к тому же вызывает `app.enableCors()` в `main.ts`
(с конфигурируемым `CORS_ORIGIN`), так что прямые запросы на
`localhost:3300/api/graphql` тоже отработают без блокировок.

Для прод-сборки задайте `VITE_GRAPHQL_URL` с абсолютным адресом бэкенда
(например, `https://api.example.com/api/graphql`).

## Источник UI-строк

Все видимые пользователю строки хранятся в таблице `TextContent` на бэкенде
и подтягиваются через GraphQL-запрос `getTextContents`. В каждом Vue-компоненте
используется хелпер `textContent.get('key', '<дефолт>')` из `stores/textContent.ts`:

- `hero_title`, `hero_role`, `about_me` — главный экран (`whoami`)
- `nav_whoami`, `nav_htop`, `nav_projects`, `nav_sendmail` — метки вкладок
- `tmux_window_title`, `tmux_session_label` — заголовок окна tmux
- `container_image`, `container_restart` — подпись внизу страницы
- `btn_submit`, `btn_sending`, `btn_retry`, `btn_copy`, `btn_copied` — кнопки
- `link_github`, `link_live` — ссылки на проекты
- `text_smtp_*` — SMTP-подобные ответы для формы обратной связи
- `text_error_loading_*` — fallback-сообщения об ошибках загрузки
- `prompt_*` — строки в стиле `whoami`, `ls -la`, `swaks` (псевдо-терминальный UI)
- `toast_icon_success`, `toast_icon_error` — иконки уведомлений

Полный список ключей и дефолтные значения — в `backend/src/seed/seed.service.ts`.

## О `v-html`

`hero_title` / `hero_role` / `about_me` и подобные текстовые блоки
редактируются через AdminJS и приходят с бэкенда как HTML-строки —
`WhoamiPane.vue` рендерит их через `v-html`. Источник контента доверенный
(его может менять только администратор через AdminJS-логин), это не
произвольный пользовательский ввод, поэтому XSS-риск здесь ограничен уровнем
доверия к самой админке.

## Проверка

1. `npm run dev` — приложение стартует без ошибок, видно 4 вкладки tmux.
2. Вкладка `whoami` — имя/роль/текст о себе подтягиваются из `getTextContents`.
3. Вкладка `htop` — навыки из `getSkills`, сгруппированные по категориям
   (Backend, Frontend, Database и т.д.) с CPU-барами по уровню владения.
4. Вкладка `projects` — список из `getProjects` с технологиями и ссылками.
5. Вкладка `sendmail` — контакты из `getContacts` (copy-to-clipboard работает),
   ниже форма в виде команды `swaks`: валидация email, состояние `sending…`
   на кнопке, toast с результатом (`sendContactForm` → Telegram на бэкенде).

## Полезные команды

```bash
npm run dev        # dev-сервер (http://localhost:3400)
npm run build      # production-сборка (в dist/)
npm run preview    # просмотр production-сборки локально
npm run type-check # vue-tsc без emit'а
```