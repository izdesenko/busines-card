import { Injectable } from '@nestjs/common';
import type { Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SkillGroupType } from './graphql/skill.type';
import { ISkillsService } from './interfaces/skills-service.interface';

@Injectable()
export class SkillsService implements ISkillsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.skill.findMany({
      include: { category: true },
      orderBy: [{ name: 'asc' }],
    });
  }

  async findGrouped(): Promise<SkillGroupType[]> {
    const skills = await this.findAll();
    const groups = new Map<number, SkillGroupType>();

    for (const skill of skills) {
      let existing = groups.get(skill.category.id);
      if (!existing) {
        existing = {
          category: skill.category.name,
          skills: [],
        };
        groups.set(skill.category.id, existing);
      }
      existing.skills.push({
        id: skill.id,
        level: skill.level,
        name: skill.name,
      });
    }

    // Sort groups by category order
    const sorted = Array.from(groups.values()).sort((a, b) => {
      const catA = skills.find((s) => s.category.name === a.category)?.category.order ?? 999;
      const catB = skills.find((s) => s.category.name === b.category)?.category.order ?? 999;
      return catA - catB;
    });

    return sorted;
  }

  findOne(id: number) {
    return this.prisma.skill.findUnique({ include: { category: true }, where: { id } });
  }
}
