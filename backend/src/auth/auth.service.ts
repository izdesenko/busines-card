import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Проверяет логин/пароль администратора по bcrypt-хэшу.
   * Используется AdminJS для авторизации в /admin
   * (см. src/admin/admin.config.ts).
   */
  async validateAdmin(username: string, plainPassword: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
