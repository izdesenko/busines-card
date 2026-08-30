import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactType } from './graphql/contact.type';
import { ContactFormResultType } from './graphql/contact-form-result.type';
import { CreateContactInput } from './graphql/create-contact.input';
import { CONTACT_SERVICE, IContactService } from './interfaces/contact-service.interface';
import {
  ISendMessageService,
  SEND_MESSAGE_SERVICE,
} from './interfaces/send-message-service.interface';

@Resolver(() => ContactType)
export class ContactResolver {
  constructor(
    @Inject(SEND_MESSAGE_SERVICE) private readonly sendMessageService: ISendMessageService,
    @Inject(CONTACT_SERVICE) private readonly contactService: IContactService,
  ) {}

  @Query(() => [ContactType], {
    name: 'getContacts',
    description: 'Список контактов для секции "Контакты"',
  })
  async getContacts(): Promise<ContactType[]> {
    return this.contactService.findAll();
  }

  @Mutation(() => ContactFormResultType, {
    name: 'sendContactForm',
    description: 'Отправляет сообщение с формы обратной связи в Telegram',
  })
  async sendContactForm(@Args('input') input: CreateContactInput): Promise<ContactFormResultType> {
    return this.sendMessageService.sendToTelegram(input);
  }
}
