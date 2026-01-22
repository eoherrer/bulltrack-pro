import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteInput, ToggleFavoriteResult } from './dto/favorite.dto';
import { GqlAuthGuard, CurrentUser } from '../common';
import type { CurrentUserPayload } from '../common';

@Resolver()
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Mutation(() => ToggleFavoriteResult)
  @UseGuards(GqlAuthGuard)
  async toggleFavorite(
    @Args('input') input: ToggleFavoriteInput,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ToggleFavoriteResult> {
    return this.favoritesService.toggleFavorite(user.userId, input.bullId);
  }
}
