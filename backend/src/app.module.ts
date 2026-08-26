import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { TextContentModule } from './text-content/text-content.module';
import { ContactModule } from './contact/contact.module';
import { SeedModule } from './seed/seed.module';

import { buildAdminModuleOptions } from './admin/admin.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SkillsModule,
    ProjectsModule,
    TextContentModule,
    ContactModule,
    SeedModule,

    // AdminJS 7+ распространяется только как ESM-пакет, а NestJS по умолчанию
    // собирается в CommonJS. Официально задокументированный способ их подружить —
    // динамический import() прямо внутри массива imports (см.
    // https://docs.adminjs.co/installation/plugins/nest). NestJS умеет резолвить
    // Promise<DynamicModule>, переданный в imports, поэтому это безопасно.
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [PrismaModule, AuthModule, ConfigModule],
        inject: [PrismaService, AuthService, ConfigService],
        useFactory: buildAdminModuleOptions as any,
      }),
    ),
  ],
})
export class AppModule {}
