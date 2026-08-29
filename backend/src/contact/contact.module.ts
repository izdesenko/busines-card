import { Module } from '@nestjs/common';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { ContactsService } from './contacts.service';

@Module({
  providers: [ContactService, ContactsService, ContactResolver],
  exports: [ContactService, ContactsService],
})
export class ContactModule {}
