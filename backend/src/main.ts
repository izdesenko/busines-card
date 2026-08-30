import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  const port = process.env.PORT ? Number(process.env.PORT) : 3300;
  await app.listen(port);

  logger.log(`🚀 Сервер запущен:     http://localhost:${port}`);
  logger.log(`🛠  Admin-панель:     http://localhost:${port}/admin`);
  logger.log(`🔮 GraphQL endpoint: http://localhost:${port}/api/graphql`);
}
bootstrap();
