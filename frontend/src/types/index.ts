export enum BullUso {
  VAQUILLONA = 'VAQUILLONA',
  VACA = 'VACA',
}

export enum BullOrigen {
  PROPIO = 'PROPIO',
  CATALOGO = 'CATALOGO',
}

export enum BullPelaje {
  NEGRO = 'NEGRO',
  COLORADO = 'COLORADO',
}

export enum BullOrderBy {
  SCORE_DESC = 'SCORE_DESC',
  SCORE_ASC = 'SCORE_ASC',
}

export interface BullStats {
  crecimiento: number;
  facilidadParto: number;
  reproduccion: number;
  moderacion: number;
  carcasa: number;
}

export interface Bull {
  id: number;
  caravana: string;
  nombre: string;
  uso: BullUso;
  origen: BullOrigen;
  pelaje: BullPelaje;
  raza: string;
  edadMeses: number;
  caracteristicaDestacada: string | null;
  stats: BullStats;
  bullScore: number;
  isFavorite: boolean;
}

export interface BullEdge {
  node: Bull;
  cursor: string;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  startCursor: string | null;
  hasPreviousPage: boolean;
}

export interface BullConnection {
  edges: BullEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface BullFilters {
  search?: string;
  origen?: BullOrigen[];
  paraVaquillona?: boolean;
  pelaje?: BullPelaje[];
  favoritesOnly?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}
