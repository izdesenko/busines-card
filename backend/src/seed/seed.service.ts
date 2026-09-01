import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
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
    const saltRounds = Number(this.config.get<string>('BCRYPT_SALT_ROUNDS', '10'));

    // Создаём администратора по умолчанию, если таблица User пуста.
    const userCount = await this.usersService.count();
    if (userCount === 0) {
      const username = this.config.get<string>('ADMIN_USERNAME', 'admin');
      const password = this.config.get<string>('ADMIN_PASSWORD', 'admin');
      const hashed = await bcrypt.hash(password, saltRounds);
      await this.prisma.user.create({ data: { username, password: hashed } });
      this.logger.warn(
        `Таблица User была пуста — создан администратор по умолчанию: "${username}". ` +
          'Обязательно смените пароль после первого входа в /admin ' +
          '(переменные ADMIN_USERNAME / ADMIN_PASSWORD в .env).',
      );
    }

    // Заполняем текстовый контент для UI по умолчанию, если таблица TextContent пуста.
    const textContentCount = await this.prisma.textContent.count();
    if (textContentCount === 0) {
      const defaultTextContent = [
        { key: 'hero_title', value: 'root' },
        { key: 'hero_role', value: 'root' },
        { key: 'about_me', value: '' },
        { key: 'nav_whoami', value: 'id' },
        { key: 'nav_htop', value: 'htop' },
        { key: 'nav_projects', value: 'ls -la ~/work' },
        { key: 'nav_sendmail', value: 'sendmail' },
        { key: 'container_image', value: 'user:latest' },
        { key: 'container_restart', value: 'unless-stopped' },
        { key: 'prompt_whoami', value: 'whoami' },
        { key: 'prompt_cat_about', value: 'cat about.txt' },
        { key: 'prompt_projects', value: 'ls -la ~/projects' },
        {
          key: 'prompt_empty_projects',
          value: 'drwxr-xr-x  пусто — проекты ещё не добавлены в админке.',
        },
        { key: 'prompt_loading', value: 'сканирование директории…' },
        { key: 'prompt_queue', value: 'подключение к очереди…' },
        { key: 'prompt_htop_loading', value: 'загрузка процессов…' },
        {
          key: 'prompt_htop_tasks',
          value: 'Tasks: {total} total, {running} running · Load average: {load}',
        },
        { key: 'prompt_htop_mem', value: 'Mem [|||||||||||||||||||] занят делом' },
        { key: 'prompt_htop_pid', value: 'PID' },
        { key: 'prompt_htop_command', value: 'COMMAND' },
        { key: 'prompt_htop_cpu', value: 'CPU' },
        { key: 'prompt_htop_idle', value: 'Навыки ещё не добавлены в админке.' },
        { key: 'prompt_email_subject', value: 'Письмо с визитки' },
        { key: 'prompt_sender_name', value: 'export SENDER_NAME=' },
        { key: 'prompt_swaks', value: 'swaks \\' },
        { key: 'prompt_to', value: '--to' },
        { key: 'prompt_to_value', value: 'user' },
        { key: 'prompt_from', value: '--from' },
        { key: 'prompt_header', value: '--header' },
        { key: 'prompt_body', value: '--body' },
        { key: 'btn_submit', value: '▶ run' },
        { key: 'btn_sending', value: 'sending…' },
        { key: 'btn_copy', value: 'copy' },
        { key: 'btn_copied', value: 'copied ✓' },
        { key: 'btn_retry', value: 'повторить' },
        { key: 'link_github', value: 'github ↗' },
        { key: 'link_live', value: 'live ↗' },
        { key: 'text_smtp_delivered', value: '250 2.0.0 OK — сообщение доставлено' },
        {
          key: 'text_smtp_no_telegram',
          value: '451 сообщение принято, но Telegram не настроен на бэкенде',
        },
        { key: 'text_smtp_error', value: '550' },
        { key: 'text_error_loading_skills', value: 'Не удалось загрузить навыки' },
        { key: 'text_error_loading_projects', value: 'Не удалось загрузить проекты' },
        { key: 'text_error_loading_contacts', value: 'Не удалось загрузить контакты' },
        { key: 'text_error_sending_message', value: 'Не удалось отправить сообщение' },
        { key: 'tmux_window_title', value: 'user@dev — tmux' },
        { key: 'tmux_session_label', value: '[user]' },
        { key: 'text_smtp_queue_delivered', value: '250 delivered' },
        { key: 'prompt_sender_name_placeholder', value: 'Ваше имя' },
        { key: 'prompt_email_placeholder', value: 'Input your email' },
        { key: 'prompt_message_placeholder', value: 'Input message' },
        { key: 'toast_icon_success', value: '✓' },
        { key: 'toast_icon_error', value: '✕' },
      ];

      await this.prisma.textContent.createMany({ data: defaultTextContent });
      this.logger.log('Заполнена таблица TextContent дефолтными данными для UI.');

      // Seed SkillCategories и Skills
      const categories = [
        { name: 'Backend', order: 1 },
        { name: 'Frontend', order: 2 },
        { name: 'Database', order: 3 },
        { name: 'Devops', order: 4 },
        { name: 'AI', order: 5 },
        { name: 'Other', order: 6 },
      ];

      for (const cat of categories) {
        await this.prisma.skillCategory.create({ data: cat });
      }

      const skillCategoryMap = new Map<string, number>();
      const dbCategories = await this.prisma.skillCategory.findMany();
      for (const cat of dbCategories) {
        skillCategoryMap.set(cat.name, cat.id);
      }

      const defaultSkills = [
        { categoryName: 'Backend', level: 80, name: 'NestJS' },
        { categoryName: 'Backend', level: 100, name: 'Node.js' },
        { categoryName: 'Frontend', level: 90, name: 'TypeScript' },
        { categoryName: 'Frontend', level: 75, name: 'Vue.js' },
        { categoryName: 'Database', level: 70, name: 'PostgreSQL' },
        { categoryName: 'Devops', level: 60, name: 'Docker' },
      ];

      for (const skill of defaultSkills) {
        const categoryId = skillCategoryMap.get(skill.categoryName);
        if (categoryId) {
          await this.prisma.skill.create({
            data: { level: skill.level, name: skill.name, categoryId },
          });
        }
      }
      this.logger.log('Заполнены SkillCategory и Skill дефолтными данными.');
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
