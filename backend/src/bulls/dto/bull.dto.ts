import {
  Field,
  ObjectType,
  InputType,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BullUso, BullOrigen, BullPelaje } from '../../database/entities';

// Register enums for GraphQL
registerEnumType(BullUso, {
  name: 'BullUso',
  description: 'Bull usage type',
});

registerEnumType(BullOrigen, {
  name: 'BullOrigen',
  description: 'Bull origin type',
});

registerEnumType(BullPelaje, {
  name: 'BullPelaje',
  description: 'Bull coat color',
});

export enum BullOrderBy {
  SCORE_DESC = 'SCORE_DESC',
  SCORE_ASC = 'SCORE_ASC',
}

registerEnumType(BullOrderBy, {
  name: 'BullOrderBy',
  description: 'Bull ordering options',
});

@ObjectType()
export class BullStats {
  @Field(() => Int)
  crecimiento: number;

  @Field(() => Int)
  facilidadParto: number;

  @Field(() => Int)
  reproduccion: number;

  @Field(() => Int)
  moderacion: number;

  @Field(() => Int)
  carcasa: number;
}

@ObjectType()
export class BullType {
  @Field(() => Int)
  id: number;

  @Field()
  caravana: string;

  @Field()
  nombre: string;

  @Field(() => BullUso)
  uso: BullUso;

  @Field(() => BullOrigen)
  origen: BullOrigen;

  @Field(() => BullPelaje)
  pelaje: BullPelaje;

  @Field()
  raza: string;

  @Field(() => Int)
  edadMeses: number;

  @Field(() => String, { nullable: true })
  caracteristicaDestacada: string | null;

  @Field(() => BullStats)
  stats: BullStats;

  @Field(() => Float)
  bullScore: number;

  @Field(() => Boolean)
  isFavorite: boolean;
}

@ObjectType()
export class BullEdge {
  @Field(() => BullType)
  node: BullType;

  @Field()
  cursor: string;
}

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  endCursor: string | null;

  @Field()
  hasNextPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field()
  hasPreviousPage: boolean;
}

@ObjectType()
export class BullConnection {
  @Field(() => [BullEdge])
  edges: BullEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}

@InputType()
export class BullFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => [BullOrigen], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(BullOrigen, { each: true })
  origen?: BullOrigen[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  paraVaquillona?: boolean;

  @Field(() => [BullPelaje], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(BullPelaje, { each: true })
  pelaje?: BullPelaje[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  favoritesOnly?: boolean;
}

@InputType()
export class BullsQueryInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  first?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => BullFiltersInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => BullFiltersInput)
  filters?: BullFiltersInput;

  @Field(() => BullOrderBy, { nullable: true, defaultValue: BullOrderBy.SCORE_DESC })
  @IsOptional()
  @IsEnum(BullOrderBy)
  orderBy?: BullOrderBy;
}
