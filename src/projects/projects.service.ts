import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { order: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  // Не используются публичным контроллером (CRUD ведётся через AdminJS),
  // но пригодятся при расширении API.
  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  update(id: number, dto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
