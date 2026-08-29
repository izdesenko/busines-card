import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { CreateContactDto } from './dto/create-contact.dto';

export interface SendContactResult {
  delivered: boolean;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly config: ConfigService) {}

  async sendToTelegram(dto: CreateContactDto): Promise<SendContactResult> {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы в .env — сообщение только залогировано, не отправлено.',
      );
      this.logger.log(`Сообщение с формы обратной связи: ${JSON.stringify(dto)}`);
      return { delivered: false };
    }

    const text = [
      '📩 Новое сообщение с сайта-визитки',
      `Имя: ${dto.name}`,
      `Email: ${dto.email}`,
      dto.phone ? `Телефон: ${dto.phone}` : null,
      '',
      dto.message,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Telegram API вернул ошибку ${response.status}: ${body}`);
      throw new InternalServerErrorException('Не удалось отправить сообщение в Telegram');
    }

    return { delivered: true };
  }
}
