import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Сессии нужны для passport-local (например, POST /api/auth/login).
  // Сама AdminJS-панель авторизуется независимо через собственную подписанную
  // cookie (см. sessionOptions/auth в src/admin/admin.config.ts).
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 часов
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors();

  const port = process.env.PORT ? Number(process.env.PORT) : 3300;
  await app.listen(port);

  logger.log(`🚀 Сервер запущен:     http://localhost:${port}`);
  logger.log(`🛠  Admin-панель:     http://localhost:${port}/admin`);
  logger.log(`🔮 GraphQL endpoint: http://localhost:${port}/api/graphql`);
}
bootstrap();
