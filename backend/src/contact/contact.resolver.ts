import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { ContactService } from './contact.service';
import type { ContactsService } from './contacts.service';
import { ContactType } from './graphql/contact.type';
import { ContactFormResultType } from './graphql/contact-form-result.type';
import type { CreateContactInput } from './graphql/create-contact.input';

@Resolver(() => ContactType)
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactsService: ContactsService,
  ) {}

  @Query(() => [ContactType], {
    name: 'getContacts',
    description: 'Список контактов для секции "Контакты"',
  })
  async getContacts(): Promise<ContactType[]> {
    return this.contactsService.findAll();
  }

  @Mutation(() => ContactFormResultType, {
    name: 'sendContactForm',
    description: 'Отправляет сообщение с формы обратной связи в Telegram',
  })
  async sendContactForm(
    @Args('input') input: CreateContactInput,
  ): Promise<ContactFormResultType> {
    return this.contactService.sendToTelegram(input);
  }
}
