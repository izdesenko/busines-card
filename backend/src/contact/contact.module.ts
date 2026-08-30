import { Module } from '@nestjs/common';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { CONTACT_SERVICE } from './interfaces/contact-service.interface';
import { SEND_MESSAGE_SERVICE } from './interfaces/send-message-service.interface';
import { SendMessageService } from './send-message.service';

@Module({
  exports: [CONTACT_SERVICE, SEND_MESSAGE_SERVICE],
  providers: [
    { provide: CONTACT_SERVICE, useClass: ContactService },
    { provide: SEND_MESSAGE_SERVICE, useClass: SendMessageService },
    ContactResolver,
  ],
})
export class ContactModule {}
