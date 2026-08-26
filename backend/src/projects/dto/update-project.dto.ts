import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  technologies?: string;

  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @IsOptional()
  @IsUrl()
  liveLink?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
