import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITextContentService } from './interfaces/text-content-service.interface';

@Injectable()
export class TextContentService implements ITextContentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.textContent.findMany({ orderBy: { key: 'asc' } });
  }

  findByKey(key: string) {
    return this.prisma.textContent.findUnique({ where: { key } });
  }
}
