'use client';

import { create } from 'zustand';
import { BullOrigen, BullPelaje, BullOrderBy, BullFilters } from '@/types';

interface FiltersState {
  filters: BullFilters;
  orderBy: BullOrderBy;
  setSearch: (search: string) => void;
  toggleOrigen: (origen: BullOrigen) => void;
  setParaVaquillona: (value: boolean) => void;
  togglePelaje: (pelaje: BullPelaje) => void;
  setFavoritesOnly: (value: boolean) => void;
  setOrderBy: (orderBy: BullOrderBy) => void;
  resetFilters: () => void;
  setAllOrigins: (selected: boolean) => void;
}

const initialFilters: BullFilters = {
  search: '',
  origen: [],
  paraVaquillona: false,
  pelaje: [],
  favoritesOnly: false,
};

export const useFilters = create<FiltersState>((set) => ({
  filters: initialFilters,
  orderBy: BullOrderBy.SCORE_DESC,

  setSearch: (search: string) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),

  toggleOrigen: (origen: BullOrigen) =>
    set((state) => {
      const currentOrigen = state.filters.origen || [];
      const hasOrigen = currentOrigen.includes(origen);
      return {
        filters: {
          ...state.filters,
          origen: hasOrigen
            ? currentOrigen.filter((o) => o !== origen)
            : [...currentOrigen, origen],
        },
      };
    }),

  setParaVaquillona: (value: boolean) =>
    set((state) => ({
      filters: { ...state.filters, paraVaquillona: value },
    })),

  togglePelaje: (pelaje: BullPelaje) =>
    set((state) => {
      const currentPelaje = state.filters.pelaje || [];
      const hasPelaje = currentPelaje.includes(pelaje);
      return {
        filters: {
          ...state.filters,
          pelaje: hasPelaje
            ? currentPelaje.filter((p) => p !== pelaje)
            : [...currentPelaje, pelaje],
        },
      };
    }),

  setFavoritesOnly: (value: boolean) =>
    set((state) => ({
      filters: { ...state.filters, favoritesOnly: value },
    })),

  setOrderBy: (orderBy: BullOrderBy) => set({ orderBy }),

  resetFilters: () => set({ filters: initialFilters, orderBy: BullOrderBy.SCORE_DESC }),

  setAllOrigins: (selected: boolean) =>
    set((state) => ({
      filters: {
        ...state.filters,
        origen: selected ? [] : state.filters.origen,
      },
    })),
}));
