import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Шаг 8 из ТЗ: проксируем GraphQL-запросы на бэкенд, чтобы в dev-режиме
    // не упираться в CORS/разные origin'ы. Бэкенд к тому же уже включает
    // app.enableCors() в main.ts, так что прокси — это скорее удобство
    // (относительные URL, единый origin), а не обязательное условие.
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
