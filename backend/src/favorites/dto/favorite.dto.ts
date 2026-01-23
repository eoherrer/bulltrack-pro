import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class ToggleFavoriteInput {
  @Field(() => Int)
  @IsOptional()
  @IsInt()
  @Min(1)
  bullId: number;
}

@ObjectType()
export class ToggleFavoriteResult {
  @Field(() => Int)
  bullId: number;

  @Field()
  isFavorite: boolean;
}
