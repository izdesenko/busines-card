import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateContactInput {
  @Field()
  @IsString()
  @MinLength(1)
  name: string = '';

  @Field()
  @IsEmail()
  email: string = '';

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field()
  @IsString()
  @MinLength(1)
  message: string = '';
}
