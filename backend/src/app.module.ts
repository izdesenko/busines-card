import { join } from 'node:path';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { buildAdminModuleOptions } from './admin/admin.config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ContactModule } from './contact/contact.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { SeedModule } from './seed/seed.module';
import { SkillsModule } from './skills/skills.module';
import { TextContentModule } from './text-content/text-content.module';
import { UsersModule } from './users/users.module';

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

    // GraphQL с автогенерацией SDL-схемы из декораторов @ObjectType/@Resolver.
    // Точка входа: POST /api/graphql (см. main.ts — настраивается глобально через
    // GraphQLOptionsFactory и доступно как у Apollo, так и через Insomnia/postman).
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      path: '/api/graphql',
    }),

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
