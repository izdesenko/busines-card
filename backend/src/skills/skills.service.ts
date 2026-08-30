import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
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
    const skills: Skill[] = await this.findAll();
    const groups = new Map<string, SkillGroupType>();

    for (const skill of skills) {
      let existing = groups.get(skill.category);
      if (!existing) {
        existing = <SkillGroupType>{
          category: skill.category,
          skills: [],
        };
        groups.set(skill.category, existing);
      }
      existing.skills.push(skill);
    }

    return Array.from(groups.values());
  }

  findOne(id: number) {
    return this.prisma.skill.findUnique({ where: { id } });
  }
}
