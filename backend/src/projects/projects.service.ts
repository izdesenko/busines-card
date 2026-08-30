import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectType } from './graphql/project.type';
import { IProjectsService } from './interfaces/projects-service.interface';

@Injectable()
export class ProjectsService implements IProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProjectType[]> {
    const projects = await this.prisma.project.findMany({ orderBy: { order: 'asc' } });
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      githubLink: p.githubLink ?? undefined,
      liveLink: p.liveLink ?? undefined,
      order: p.order,
    }));
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }
}
