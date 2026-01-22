import { Field, ObjectType, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor: string | null;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => Int, { nullable: true })
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}
