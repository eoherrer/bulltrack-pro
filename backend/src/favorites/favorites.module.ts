import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesResolver } from './favorites.resolver';
import { Favorite, Bull } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Bull])],
  providers: [FavoritesService, FavoritesResolver],
  exports: [FavoritesService],
})
export class FavoritesModule {}
