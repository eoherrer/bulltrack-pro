'use client';

import { useQuery } from '@apollo/client';
import { useFilters } from '@/hooks/useFilters';
import { BULLS_QUERY } from '@/lib/graphql/queries';
import { BullConnection } from '@/types';
import { BullCard } from './BullCard';
import { BullCardSkeleton } from '@/components/ui';
import { Button } from '@/components/ui';

export function BullList() {
  const { filters, orderBy } = useFilters();

  const { data, loading, error, fetchMore, refetch } = useQuery<{ bulls: BullConnection }>(
    BULLS_QUERY,
    {
      variables: {
        input: {
          first: 10,
          filters: {
            search: filters.search || undefined,
            origen: filters.origen && filters.origen.length > 0 ? filters.origen : undefined,
            paraVaquillona: filters.paraVaquillona || undefined,
            pelaje: filters.pelaje && filters.pelaje.length > 0 ? filters.pelaje : undefined,
            favoritesOnly: filters.favoritesOnly || undefined,
          },
          orderBy,
        },
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const handleLoadMore = () => {
    if (!data?.bulls.pageInfo.hasNextPage) return;

    fetchMore({
      variables: {
        input: {
          first: 10,
          after: data.bulls.pageInfo.endCursor,
          filters: {
            search: filters.search || undefined,
            origen: filters.origen && filters.origen.length > 0 ? filters.origen : undefined,
            paraVaquillona: filters.paraVaquillona || undefined,
            pelaje: filters.pelaje && filters.pelaje.length > 0 ? filters.pelaje : undefined,
            favoritesOnly: filters.favoritesOnly || undefined,
          },
          orderBy,
        },
      },
    });
  };

  const handleFavoriteToggle = (bullId: number, isFavorite: boolean) => {
    // Refetch to update the list if favorites filter is active
    if (filters.favoritesOnly) {
      refetch();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-400 text-center">Error al cargar los toros</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const bulls = data?.bulls.edges || [];
  const totalCount = data?.bulls.totalCount || 0;
  const hasNextPage = data?.bulls.pageInfo.hasNextPage || false;

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          <span className="text-white font-semibold">{totalCount}</span> resultados
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-800 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bull cards */}
      <div className="space-y-3">
        {loading && bulls.length === 0 ? (
          // Initial loading state
          Array.from({ length: 5 }).map((_, index) => (
            <BullCardSkeleton key={index} />
          ))
        ) : bulls.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-center">No se encontraron toros con los filtros aplicados</p>
          </div>
        ) : (
          // Bull list
          <>
            {bulls.map((edge, index) => (
              <BullCard
                key={edge.node.id}
                bull={edge.node}
                rank={index + 1}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}

            {/* Load more */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  isLoading={loading}
                >
                  Cargar mas
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
