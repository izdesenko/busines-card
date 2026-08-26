import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { UpdateTextContentDto } from './dto/update-text-content.dto';

@Injectable()
export class TextContentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.textContent.findMany({ orderBy: { key: 'asc' } });
  }

  findByKey(key: string) {
    return this.prisma.textContent.findUnique({ where: { key } });
  }

  // Не используются публичным контроллером (CRUD ведётся через AdminJS),
  // но пригодятся при расширении API.
  create(dto: CreateTextContentDto) {
    return this.prisma.textContent.create({ data: dto });
  }

  update(id: number, dto: UpdateTextContentDto) {
    return this.prisma.textContent.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.textContent.delete({ where: { id } });
  }
}
