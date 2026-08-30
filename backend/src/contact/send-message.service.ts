import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramDeliveryException } from '../common/exceptions/telegram-delivery.exception';
import { CreateContactInput } from './graphql/create-contact.input';
import { ISendMessageService } from './interfaces/send-message-service.interface';

export interface SendContactResult {
  delivered: boolean;
}

@Injectable()
export class SendMessageService implements ISendMessageService {
  private readonly logger = new Logger(SendMessageService.name);

  constructor(private readonly config: ConfigService) {}

  async sendToTelegram(dto: CreateContactInput): Promise<SendContactResult> {
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
      ...(dto.phone ? [`Телефон: ${dto.phone}`] : []),
      '',
      dto.message,
    ].join('\n');

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Telegram API вернул ошибку ${response.status}: ${body}`);
      throw new TelegramDeliveryException('Не удалось отправить сообщение в Telegram');
    }

    return { delivered: true };
  }
}
