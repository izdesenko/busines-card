import { IsString, MinLength } from 'class-validator';

export class CreateTextContentDto {
  /** Идентификатор блока, например: 'hero_title', 'about_me' */
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  value: string;
}
