import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { SkillCategory } from './create-skill.dto';

export class UpdateSkillDto {
  @IsOptional()
  @IsIn(['Backend', 'Frontend', 'Devops', 'Other'])
  category?: SkillCategory;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  level?: number;
}
