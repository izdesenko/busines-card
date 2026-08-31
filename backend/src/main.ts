import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const corsOrigin = config.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    credentials: true,
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
  });

  const port = config.get<number>('PORT', 3300);
  await app.listen(port);

  logger.log(`🚀 Сервер запущен:     http://localhost:${port}`);
  logger.log(`🛠  Admin-панель:     http://localhost:${port}/admin`);
  logger.log(`🔮 GraphQL endpoint: http://localhost:${port}/api/graphql`);
}
bootstrap();
