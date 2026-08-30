import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Бросается, когда Telegram API вернул ошибку при отправке сообщения.
 */
export class TelegramDeliveryException extends HttpException {
  constructor(message: string) {
    super(
      { code: 'TELEGRAM_DELIVERY_FAILED', message },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
