import type { CreateContactInput } from '../graphql/create-contact.input';
import type { SendContactResult } from '../send-message.service';

export interface ISendMessageService {
  sendToTelegram(dto: CreateContactInput): Promise<SendContactResult>;
}

export const SEND_MESSAGE_SERVICE = Symbol('ISendMessageService');
