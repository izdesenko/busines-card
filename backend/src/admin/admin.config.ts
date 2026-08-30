import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import AdminJS from 'adminjs';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

// Регистрируем Prisma-адаптер один раз при загрузке модуля.
AdminJS.registerAdapter({ Database, Resource });

const SALT_ROUNDS = 10;

async function hashPasswordBeforeSave(request: any) {
  if (request.payload?.password) {
    request.payload.password = await bcrypt.hash(request.payload.password, SALT_ROUNDS);
  }
  return request;
}

/**
 * Конфигурация AdminJS: подключает Prisma-модели Skill, Project, TextContent,
 * Contact и User как ресурсы с автосгенерированным CRUD UI, и защищает /admin
 * логином/паролем через AuthService (bcrypt-проверка).
 */
export function buildAdminModuleOptions(
  prisma: PrismaService,
  authService: AuthService,
  config: ConfigService,
) {
  const cookieSecret = config.get<string>('ADMIN_COOKIE_SECRET', 'default-cookie-secret-change-me');

  return {
    adminJsOptions: {
      rootPath: '/admin',
      branding: {
        companyName: 'Онлайн-визитка',
        softwareBrothers: false,
      },
      resources: [
        {
          resource: { client: prisma, model: getModelByName('Skill') },
          options: {
            navigation: { icon: 'Tool', name: 'Контент сайта' },
            properties: {
              category: {
                availableValues: [
                  { label: 'AI', value: 'AI' },
                  { label: 'Backend', value: 'Backend' },
                  { label: 'Frontend', value: 'Frontend' },
                  { label: 'Database', value: 'Database' },
                  { label: 'Devops', value: 'Devops' },
                  { label: 'Other', value: 'Other' },
                ],
              },
            },
          },
        },
        {
          resource: { client: prisma, model: getModelByName('Project') },
          options: {
            navigation: { icon: 'Grid', name: 'Контент сайта' },
          },
        },
        {
          resource: { client: prisma, model: getModelByName('TextContent') },
          options: {
            navigation: { icon: 'FileText', name: 'Контент сайта' },
          },
        },
        {
          resource: { client: prisma, model: getModelByName('Contact') },
          options: {
            navigation: { icon: 'Email', name: 'Контент сайта' },
          },
        },
        {
          resource: { client: prisma, model: getModelByName('User') },
          options: {
            navigation: { icon: 'Lock', name: 'Доступ' },
            actions: {
              // Поле password в форме создания/редактирования всегда
              // автоматически хэшируется bcrypt перед записью в БД.
              edit: { before: [hashPasswordBeforeSave] },
              new: { before: [hashPasswordBeforeSave] },
            },
            properties: {
              password: {
                isVisible: { edit: true, filter: false, list: false, show: false },
                type: 'password',
              },
            },
          },
        },
      ],
    },
    auth: {
      cookieName: 'admin-session',
      cookiePassword: cookieSecret,
      authenticate: (username: string, password: string): Promise<Omit<User, 'password'>> =>
        authService.validateAdmin(username, password),
    },
    sessionOptions: {
      resave: false,
      saveUninitialized: false,
      secret: cookieSecret,
    },
  };
}
