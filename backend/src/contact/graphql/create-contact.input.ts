import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateContactInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string = '';

  @Field()
  @IsEmail()
  email: string = '';

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message: string = '';
}
