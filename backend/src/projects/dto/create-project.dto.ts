import { IsInt, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  /** Технологии через запятую, например: "NestJS, Prisma, Docker" */
  @IsString()
  technologies: string;

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
