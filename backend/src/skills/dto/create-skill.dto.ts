import { IsIn, IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export type SkillCategory = 'Backend' | 'Frontend' | 'Devops' | 'Other';

export class CreateSkillDto {
  @IsIn(['Backend', 'Frontend', 'Devops', 'Other'])
  category: SkillCategory;

  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @Min(1)
  @Max(100)
  level: number;
}
