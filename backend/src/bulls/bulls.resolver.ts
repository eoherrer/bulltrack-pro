import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BullsService } from './bulls.service';
import {
  BullConnection,
  BullType,
  BullsQueryInput,
  BullOrderBy,
} from './dto/bull.dto';
import { OptionalAuthGuard, CurrentUser } from '../common';
import type { CurrentUserPayload } from '../common';

@Resolver(() => BullType)
export class BullsResolver {
  constructor(private readonly bullsService: BullsService) {}

  @Query(() => BullConnection, { name: 'bulls' })
  @UseGuards(OptionalAuthGuard)
  async getBulls(
    @Args('input', { nullable: true }) input: BullsQueryInput,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<BullConnection> {
    const { first = 10, after, filters, orderBy = BullOrderBy.SCORE_DESC } = input || {};

    return this.bullsService.findAll(
      first,
      after,
      filters,
      orderBy,
      user?.userId,
    );
  }

  @Query(() => BullType, { name: 'bull', nullable: true })
  @UseGuards(OptionalAuthGuard)
  async getBull(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<BullType | null> {
    return this.bullsService.findById(id, user?.userId);
  }
}
