import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactFormResultType {
  @Field({ description: 'true, если отправлено в Telegram; false, если только залогировано' })
  delivered: boolean = false;
}
