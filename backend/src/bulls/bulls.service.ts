import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Bull, BullUso, Favorite } from '../database/entities';
import {
  BullConnection,
  BullEdge,
  BullType,
  BullFiltersInput,
  BullOrderBy,
} from './dto/bull.dto';

@Injectable()
export class BullsService {
  constructor(
    @InjectRepository(Bull)
    private readonly bullRepository: Repository<Bull>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  private calculateBullScore(bull: Bull): number {
    return Number(
      (
        bull.crecimiento * 0.3 +
        bull.facilidadParto * 0.25 +
        bull.reproduccion * 0.2 +
        bull.moderacion * 0.15 +
        bull.carcasa * 0.1
      ).toFixed(2),
    );
  }

  private encodeCursor(id: number, score: number): string {
    return Buffer.from(`${id}:${score}`).toString('base64');
  }

  private decodeCursor(cursor: string): { id: number; score: number } {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    const [id, score] = decoded.split(':');
    return { id: parseInt(id, 10), score: parseFloat(score) };
  }

  private async getUserFavoriteIds(userId?: string): Promise<Set<number>> {
    if (!userId) return new Set();

    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: ['bullId'],
    });

    return new Set(favorites.map((f) => f.bullId));
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Bull>,
    filters: BullFiltersInput | undefined,
    userId?: string,
  ): SelectQueryBuilder<Bull> {
    if (!filters) return queryBuilder;

    // Search filter (caravana or nombre)
    if (filters.search) {
      queryBuilder.andWhere(
        '(bull.caravana ILIKE :search OR bull.nombre ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Origen filter
    if (filters.origen && filters.origen.length > 0) {
      queryBuilder.andWhere('bull.origen IN (:...origen)', {
        origen: filters.origen,
      });
    }

    // Para vaquillona filter
    if (filters.paraVaquillona === true) {
      queryBuilder.andWhere('bull.uso = :uso', { uso: BullUso.VAQUILLONA });
    }

    // Pelaje filter
    if (filters.pelaje && filters.pelaje.length > 0) {
      queryBuilder.andWhere('bull.pelaje IN (:...pelaje)', {
        pelaje: filters.pelaje,
      });
    }

    // Favorites only filter
    if (filters.favoritesOnly && userId) {
      queryBuilder.innerJoin(
        'bull.favorites',
        'favorite',
        'favorite.userId = :userId',
        { userId },
      );
    }

    return queryBuilder;
  }

  private mapBullToType(bull: Bull, isFavorite: boolean): BullType {
    return {
      id: bull.id,
      caravana: bull.caravana,
      nombre: bull.nombre,
      uso: bull.uso,
      origen: bull.origen,
      pelaje: bull.pelaje,
      raza: bull.raza,
      edadMeses: bull.edadMeses,
      caracteristicaDestacada: bull.caracteristicaDestacada,
      stats: {
        crecimiento: bull.crecimiento,
        facilidadParto: bull.facilidadParto,
        reproduccion: bull.reproduccion,
        moderacion: bull.moderacion,
        carcasa: bull.carcasa,
      },
      bullScore: this.calculateBullScore(bull),
      isFavorite,
    };
  }

  async findAll(
    first: number = 10,
    after?: string,
    filters?: BullFiltersInput,
    orderBy: BullOrderBy = BullOrderBy.SCORE_DESC,
    userId?: string,
  ): Promise<BullConnection> {
    // Get user's favorite IDs for marking favorites
    const favoriteIds = await this.getUserFavoriteIds(userId);

    // Build the score calculation SQL
    const scoreFormula = `(bull.crecimiento * 0.30 + bull.facilidad_parto * 0.25 + bull.reproduccion * 0.20 + bull.moderacion * 0.15 + bull.carcasa * 0.10)`;

    // Base query
    let queryBuilder = this.bullRepository
      .createQueryBuilder('bull')
      .addSelect(scoreFormula, 'calculated_score');

    // Apply filters
    queryBuilder = this.applyFilters(queryBuilder, filters, userId);

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply cursor-based pagination
    if (after) {
      const { id, score } = this.decodeCursor(after);
      if (orderBy === BullOrderBy.SCORE_DESC) {
        queryBuilder.andWhere(
          `(${scoreFormula} < :score OR (${scoreFormula} = :score AND bull.id > :id))`,
          { score, id },
        );
      } else {
        queryBuilder.andWhere(
          `(${scoreFormula} > :score OR (${scoreFormula} = :score AND bull.id > :id))`,
          { score, id },
        );
      }
    }

    // Apply ordering using the calculated_score alias
    const orderDirection = orderBy === BullOrderBy.SCORE_DESC ? 'DESC' : 'ASC';
    queryBuilder
      .orderBy('calculated_score', orderDirection)
      .addOrderBy('bull.id', 'ASC');

    // Fetch one extra to check if there's a next page
    const bulls = await queryBuilder.take(first + 1).getMany();

    const hasNextPage = bulls.length > first;
    const nodes = hasNextPage ? bulls.slice(0, first) : bulls;

    // Build edges with cursors
    const edges: BullEdge[] = nodes.map((bull) => {
      const score = this.calculateBullScore(bull);
      return {
        node: this.mapBullToType(bull, favoriteIds.has(bull.id)),
        cursor: this.encodeCursor(bull.id, score),
      };
    });

    return {
      edges,
      pageInfo: {
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        hasNextPage,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        hasPreviousPage: !!after,
      },
      totalCount,
    };
  }

  async findById(id: number, userId?: string): Promise<BullType | null> {
    const bull = await this.bullRepository.findOne({ where: { id } });
    if (!bull) return null;

    const favoriteIds = await this.getUserFavoriteIds(userId);
    return this.mapBullToType(bull, favoriteIds.has(bull.id));
  }
}
