import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { ConfigService } from '@nestjs/config';
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
        companyName: 'Илья Здесенко — визитка',
        softwareBrothers: false,
      },
      resources: [
        {
          resource: { model: getModelByName('Skill'), client: prisma },
          options: {
            navigation: { name: 'Контент сайта', icon: 'Tool' },
            properties: {
              category: {
                availableValues: [
                  { value: 'Backend', label: 'Backend' },
                  { value: 'Frontend', label: 'Frontend' },
                  { value: 'Devops', label: 'Devops' },
                  { value: 'Other', label: 'Other' },
                ],
              },
            },
          },
        },
        {
          resource: { model: getModelByName('Project'), client: prisma },
          options: {
            navigation: { name: 'Контент сайта', icon: 'Grid' },
          },
        },
        {
          resource: { model: getModelByName('TextContent'), client: prisma },
          options: {
            navigation: { name: 'Контент сайта', icon: 'FileText' },
          },
        },
        {
          resource: { model: getModelByName('Contact'), client: prisma },
          options: {
            navigation: { name: 'Контент сайта', icon: 'Email' },
          },
        },
        {
          resource: { model: getModelByName('User'), client: prisma },
          options: {
            navigation: { name: 'Доступ', icon: 'Lock' },
            properties: {
              password: {
                type: 'password',
                isVisible: { list: false, show: false, edit: true, filter: false },
              },
            },
            actions: {
              // Поле password в форме создания/редактирования всегда
              // автоматически хэшируется bcrypt перед записью в БД.
              new: { before: [hashPasswordBeforeSave] },
              edit: { before: [hashPasswordBeforeSave] },
            },
          },
        },
      ],
    },
    auth: {
      authenticate: async (username: string, password: string) => {
        const user = await authService.validateAdmin(username, password);
        return user ?? null;
      },
      cookieName: 'admin-session',
      cookiePassword: cookieSecret,
    },
    sessionOptions: {
      resave: false,
      saveUninitialized: false,
      secret: cookieSecret,
    },
  };
}
