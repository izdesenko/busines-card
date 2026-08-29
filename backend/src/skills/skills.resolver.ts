import { Query, Resolver } from '@nestjs/graphql';
import { SkillGroupType } from './graphql/skill.type';
import { SkillsService } from './skills.service';

@Resolver(() => SkillGroupType)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [SkillGroupType], {
    name: 'getSkills',
    description: 'Список навыков, сгруппированных по категориям',
  })
  async getSkills(): Promise<SkillGroupType[]> {
    const skills = await this.skillsService.findAll();
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
}
