import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillGroupType } from './graphql/skill.type';
import { ISkillsService } from './interfaces/skills-service.interface';

@Injectable()
export class SkillsService implements ISkillsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findGrouped(): Promise<SkillGroupType[]> {
    const skills = await this.findAll();
    const groups = new Map<string, SkillGroupType>();

    for (const skill of skills) {
      const existing = groups.get(skill.category);
      if (existing) {
        existing.skills.push({
          id: skill.id,
          name: skill.name,
          level: skill.level,
        });
      } else {
        groups.set(skill.category, {
          category: skill.category,
          skills: [{ id: skill.id, name: skill.name, level: skill.level }],
        });
      }
    }

    return Array.from(groups.values());
  }

  findOne(id: number) {
    return this.prisma.skill.findUnique({ where: { id } });
  }
}
