import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class ToggleFavoriteInput {
  @Field(() => Int)
  bullId: number;
}

@ObjectType()
export class ToggleFavoriteResult {
  @Field(() => Int)
  bullId: number;

  @Field()
  isFavorite: boolean;
}
