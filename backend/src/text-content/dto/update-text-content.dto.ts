import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTextContentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  key?: string;

  @IsOptional()
  @IsString()
  value?: string;
}
