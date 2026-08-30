import type { Skill } from '@prisma/client';
import type { SkillGroupType } from '../graphql/skill.type';

export interface ISkillsService {
  findAll(): Promise<Skill[]>;
  findGrouped(): Promise<SkillGroupType[]>;
  findOne(id: number): Promise<Skill | null>;
}

export const SKILLS_SERVICE = Symbol('ISkillsService');
