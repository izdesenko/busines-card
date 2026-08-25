import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';

/**
 * Опциональный сессионный логин на базе passport-local — пригодится,
 * если понадобится свой фронтенд-эндпоинт входа, отдельный от /admin.
 * Сама админ-панель AdminJS авторизуется независимо, см. src/admin/admin.config.ts.
 */
@Controller('api/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Req() req: Request) {
    return { message: 'Успешный вход', user: req.user };
  }

  @Get('me')
  me(@Req() req: Request) {
    return { user: req.user ?? null };
  }
}
