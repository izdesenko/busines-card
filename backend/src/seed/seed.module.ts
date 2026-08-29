import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [SeedService],
})
export class SeedModule {}
