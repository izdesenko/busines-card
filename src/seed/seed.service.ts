import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Шаг 5 из ТЗ: при старте приложения проверяем таблицу User.
   * Если она пуста — создаём администратора по умолчанию из .env.
   */
  async onModuleInit() {
    const existing = await this.usersService.count();
    if (existing > 0) return;

    const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin123');

    await this.usersService.create(username, password);

    this.logger.warn(
      `Таблица User была пуста — создан администратор по умолчанию: "${username}". ` +
        'Обязательно смените пароль после первого входа в /admin ' +
        '(переменные ADMIN_USERNAME / ADMIN_PASSWORD в .env).',
    );
  }
}
