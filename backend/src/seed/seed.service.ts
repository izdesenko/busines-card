import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const DEFAULT_CONTACTS = [
  {
    type: 'telegram',
    label: 'Telegram',
    value: '@ilyazdesenko',
    url: 'https://t.me/ilyazdesenko',
    order: 1,
  },
  {
    type: 'email',
    label: 'Email',
    value: 'ilya@zdesenko.dev',
    url: 'mailto:ilya@zdesenko.dev',
    order: 2,
  },
  {
    type: 'github',
    label: 'GitHub',
    value: 'github.com/ilyazdesenko',
    url: 'https://github.com/ilyazdesenko',
    order: 3,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * При старте приложения заполняем пустые таблицы дефолтными данными.
   */
  async onModuleInit() {
    // Создаём администратора по умолчанию, если таблица User пуста.
    const userCount = await this.usersService.count();
    if (userCount === 0) {
      const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
      const password = this.config.get<string>('ADMIN_PASSWORD', 'admin');
      await this.usersService.create(username, password);
      this.logger.warn(
        `Таблица User была пуста — создан администратор по умолчанию: "${username}". ` +
          'Обязательно смените пароль после первого входа в /admin ' +
          '(переменные ADMIN_USERNAME / ADMIN_PASSWORD в .env).',
      );
    }

    // Заполняем контакты по умолчанию, если таблица Contact пуста.
    const contactCount = await this.prisma.contact.count();
    if (contactCount === 0) {
      await this.prisma.contact.createMany({ data: DEFAULT_CONTACTS });
      this.logger.log('Заполнена таблица Contact дефолтными данными.');
    }
  }
}
