import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import AdminJS from 'adminjs';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

// Регистрируем Prisma-адаптер один раз при загрузке модуля.
AdminJS.registerAdapter({ Database, Resource });

/**
 * Конфигурация AdminJS: подключает Prisma-модели Skill, Project, TextContent,
 * Contact и User как ресурсы с автосгенерированным CRUD UI, и защищает /admin
 * логином/паролем через AuthService (bcrypt-проверка).
 */
export async function buildAdminModuleOptions(
  prisma: PrismaService,
  authService: AuthService,
  config: ConfigService,
) {
  const cookieSecret = config.get<string>('ADMIN_COOKIE_SECRET', 'default-cookie-secret-change-me');
  const brandName = config.get<string>('ADMIN_BRAND_NAME', 'Онлайн-визитка');
  const adminRootPath = config.get<string>('ADMIN_ROOT_PATH', '/admin');
  const saltRounds = Number(config.get<string>('BCRYPT_SALT_ROUNDS', '10'));

  async function hashPasswordBeforeSave(request: any) {
    if (request.payload?.password) {
      request.payload.password = await bcrypt.hash(request.payload.password, saltRounds);
    }
    return request;
  }

  return {
    adminJsOptions: {
      rootPath: adminRootPath,
      branding: {
        companyName: brandName,
        softwareBrothers: false,
      },
      resources: [
        {
          resource: { client: prisma, model: getModelByName('SkillCategory') },
          options: {
            navigation: { icon: 'Folder', name: 'Контент сайта' },
          },
        },
        {
          resource: { client: prisma, model: getModelByName('Skill') },
          options: {
            navigation: { icon: 'Tool', name: 'Контент сайта' },
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