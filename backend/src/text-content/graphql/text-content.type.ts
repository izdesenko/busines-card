import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TextContentType {
  @Field()
  key: string = '';

  @Field({ description: 'Может содержать HTML' })
  value: string = '';
}
