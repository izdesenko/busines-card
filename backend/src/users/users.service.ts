import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  count() {
    return this.prisma.user.count();
  }

  async create(username: string, plainPassword: string) {
    const password = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return this.prisma.user.create({ data: { username, password } });
  }
}
