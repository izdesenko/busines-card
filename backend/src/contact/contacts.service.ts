import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactType } from './graphql/contact.type';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ContactType[]> {
    const contacts = await this.prisma.contact.findMany({ orderBy: { order: 'asc' } });
    return contacts.map((c) => ({
      id: c.id,
      type: c.type,
      label: c.label,
      value: c.value,
      url: c.url ?? undefined,
      order: c.order,
    }));
  }

  findOne(id: number) {
    return this.prisma.contact.findUnique({ where: { id } });
  }
}
