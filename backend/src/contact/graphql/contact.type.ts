import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactType {
  @Field(() => Int)
  id: number = 0;

  @Field()
  type: string = '';

  @Field()
  label: string = '';

  @Field()
  value: string = '';

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => Int)
  order: number = 0;
}
