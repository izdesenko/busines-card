import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { SkillGroupType } from './graphql/skill.type';
import { ISkillsService, SKILLS_SERVICE } from './interfaces/skills-service.interface';

@Resolver(() => SkillGroupType)
export class SkillsResolver {
  constructor(
    @Inject(SKILLS_SERVICE) private readonly skillsService: ISkillsService,
  ) {}

  @Query(() => [SkillGroupType], {
    name: 'getSkills',
    description: 'Список навыков, сгруппированных по категориям',
  })
  async getSkills(): Promise<SkillGroupType[]> {
    return this.skillsService.findGrouped();
  }
}
