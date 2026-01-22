import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite, Bull } from '../database/entities';
import { ToggleFavoriteResult } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Bull)
    private readonly bullRepository: Repository<Bull>,
  ) {}

  async toggleFavorite(
    userId: string,
    bullId: number,
  ): Promise<ToggleFavoriteResult> {
    // Check if bull exists
    const bull = await this.bullRepository.findOne({ where: { id: bullId } });
    if (!bull) {
      throw new NotFoundException(`Bull with id ${bullId} not found`);
    }

    // Check if favorite already exists
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, bullId },
    });

    if (existingFavorite) {
      // Remove favorite
      await this.favoriteRepository.remove(existingFavorite);
      return { bullId, isFavorite: false };
    } else {
      // Add favorite
      const favorite = this.favoriteRepository.create({
        userId,
        bullId,
      });
      await this.favoriteRepository.save(favorite);
      return { bullId, isFavorite: true };
    }
  }

  async isFavorite(userId: string, bullId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, bullId },
    });
    return !!favorite;
  }

  async getUserFavorites(userId: string): Promise<number[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: ['bullId'],
    });
    return favorites.map((f) => f.bullId);
  }
}
