import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill')
export class SkillType {
  @Field(() => Int)
  id: number = 0;

  @Field()
  name: string = '';

  @Field(() => Int, { description: 'Уровень владения, 1..100' })
  level: number = 0;
}

@ObjectType('SkillGroup')
export class SkillGroupType {
  @Field({ description: 'Backend | Frontend | Devops | Database | Other' })
  category: string = '';

  @Field(() => [SkillType])
  skills: SkillType[] = [];
}
