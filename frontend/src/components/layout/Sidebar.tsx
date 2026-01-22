'use client';

import { useFilters } from '@/hooks/useFilters';
import { useAuth } from '@/hooks/useAuth';
import { BullOrigen, BullPelaje, BullOrderBy } from '@/types';
import { Checkbox, Toggle, Select } from '@/components/ui';

export function Sidebar() {
  const { isAuthenticated } = useAuth();
  const {
    filters,
    orderBy,
    toggleOrigen,
    setParaVaquillona,
    togglePelaje,
    setFavoritesOnly,
    setOrderBy,
    setAllOrigins,
  } = useFilters();

  const isAllOriginsSelected = !filters.origen || filters.origen.length === 0;
  const isPropiosSelected = filters.origen?.includes(BullOrigen.PROPIO) || false;
  const isCatalogoSelected = filters.origen?.includes(BullOrigen.CATALOGO) || false;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
      {/* Filtros Activos */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Filtros Activos
        </h3>

        {/* Origen */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Origen</p>
          <div className="space-y-2">
            <Checkbox
              checked={isAllOriginsSelected}
              onChange={() => setAllOrigins(true)}
              label="Todos"
            />
            <Checkbox
              checked={isPropiosSelected}
              onChange={() => toggleOrigen(BullOrigen.PROPIO)}
              label="Toros propios"
            />
            <Checkbox
              checked={isCatalogoSelected}
              onChange={() => toggleOrigen(BullOrigen.CATALOGO)}
              label="Catalogo"
            />
            {isAuthenticated && (
              <Checkbox
                checked={filters.favoritesOnly || false}
                onChange={setFavoritesOnly}
                label="Favoritos"
              />
            )}
          </div>
        </div>
      </div>

      {/* Filtros Productivos */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Filtros Productivos
        </h3>

        <div className="space-y-4">
          <Toggle
            checked={filters.paraVaquillona || false}
            onChange={setParaVaquillona}
            label="Para vaquillona"
            sublabel="Facilidad de parto"
          />

          <div>
            <p className="text-sm text-gray-400 mb-2">Pelaje</p>
            <Select
              value={
                filters.pelaje && filters.pelaje.length === 1
                  ? filters.pelaje[0]
                  : 'todos'
              }
              onChange={(value) => {
                if (value === 'todos') {
                  if (filters.pelaje?.includes(BullPelaje.NEGRO)) togglePelaje(BullPelaje.NEGRO);
                  if (filters.pelaje?.includes(BullPelaje.COLORADO)) togglePelaje(BullPelaje.COLORADO);
                } else {
                  const pelaje = value as BullPelaje;
                  if (!filters.pelaje?.includes(pelaje)) {
                    if (filters.pelaje?.includes(BullPelaje.NEGRO)) togglePelaje(BullPelaje.NEGRO);
                    if (filters.pelaje?.includes(BullPelaje.COLORADO)) togglePelaje(BullPelaje.COLORADO);
                    togglePelaje(pelaje);
                  }
                }
              }}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: BullPelaje.NEGRO, label: 'Negro' },
                { value: BullPelaje.COLORADO, label: 'Colorado' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Ordenamiento */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Ordenamiento
        </h3>
        <Select
          value={orderBy}
          onChange={(value) => setOrderBy(value as BullOrderBy)}
          options={[
            { value: BullOrderBy.SCORE_DESC, label: 'Score mejor a peor' },
            { value: BullOrderBy.SCORE_ASC, label: 'Score peor a mejor' },
          ]}
        />
      </div>

      {/* Objetivo actual */}
      <div className="mt-auto">
        <div className="bg-gray-800 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Objetivo actual</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Maximizar la ganancia de peso (destete) manteniendo facilidad de parto.
          </p>
          <button className="mt-3 text-emerald-400 text-sm font-medium flex items-center gap-1 hover:text-emerald-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Editar criterios
          </button>
        </div>
      </div>
    </aside>
  );
}
