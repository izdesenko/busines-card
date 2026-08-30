import type { Contact } from '@prisma/client';
import type { ContactType } from '../graphql/contact.type';

export interface IContactService {
  findAll(): Promise<ContactType[]>;
  findOne(id: number): Promise<Contact | null>;
}

export const CONTACT_SERVICE = Symbol('IContactService');
