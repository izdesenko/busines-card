import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectType {
  @Field(() => Int)
  id: number = 0;

  @Field()
  title: string = '';

  @Field()
  description: string = '';

  @Field()
  technologies: string = '';

  @Field(() => String, { nullable: true })
  githubLink?: string;

  @Field(() => String, { nullable: true })
  liveLink?: string;

  @Field(() => Int)
  order: number = 0;
}
