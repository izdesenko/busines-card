import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

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
      const contactsJson = this.config.get<string>('DEFAULT_CONTACTS', '[]');
      let defaultContacts = [];
      try {
        defaultContacts = JSON.parse(contactsJson);
      } catch (e) {
        this.logger.error('DEFAULT_CONTACTS в .env содержит некорректный JSON');
      }

      if (Array.isArray(defaultContacts) && defaultContacts.length > 0) {
        await this.prisma.contact.createMany({ data: defaultContacts });
        this.logger.log('Заполнена таблица Contact дефолтными данными из конфигурации.');
      } else {
        this.logger.log('Таблица Contact останется пустой (DEFAULT_CONTACTS пустой или не задан).');
      }
    }
  }
}
