'use client';

import { useMutation } from '@apollo/client';
import { Bull, BullOrigen, BullUso } from '@/types';
import { Badge } from '@/components/ui';
import { RadarChart } from './RadarChart';
import { ScoreBar } from './ScoreBar';
import { TOGGLE_FAVORITE_MUTATION } from '@/lib/graphql/mutations';
import { BULLS_QUERY } from '@/lib/graphql/queries';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface BullCardProps {
  bull: Bull;
  rank: number;
  onFavoriteToggle?: (bullId: number, isFavorite: boolean) => void;
}

export function BullCard({ bull, rank, onFavoriteToggle }: BullCardProps) {
  const { isAuthenticated } = useAuth();

  const [toggleFavorite, { loading: toggleLoading }] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    refetchQueries: [{ query: BULLS_QUERY }],
    onCompleted: (data) => {
      if (onFavoriteToggle) {
        onFavoriteToggle(data.toggleFavorite.bullId, data.toggleFavorite.isFavorite);
      }
    },
  });

  const handleFavoriteClick = () => {
    if (!isAuthenticated || toggleLoading) return;
    toggleFavorite({
      variables: { input: { bullId: bull.id } },
    });
  };

  const getOrigenBadge = () => {
    if (bull.origen === BullOrigen.PROPIO) {
      return <Badge variant="success">Propio</Badge>;
    }
    return <Badge variant="info">Catalogo</Badge>;
  };

  const getUsoBadge = () => {
    if (bull.uso === BullUso.VAQUILLONA) {
      return <Badge variant="warning">Para vaquillona</Badge>;
    }
    return <Badge>Para vaca</Badge>;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Rank & Checkbox */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border-2 border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
            {/* Checkbox placeholder */}
          </div>
          <span className="text-xl font-bold text-gray-400">#{rank}</span>
        </div>

        {/* Bull Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
          <img
            src={`https://placehold.co/80x80/1f2937/9ca3af?text=${bull.caravana}`}
            alt={bull.nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bull Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            Toro #{bull.caravana}
          </h3>
          <p className="text-sm text-gray-400">
            {bull.raza} . {bull.edadMeses} meses
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {getOrigenBadge()}
            {getUsoBadge()}
          </div>
        </div>

        {/* Bull Score */}
        <div className="flex-1 px-4 border-l border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bull Score</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{bull.bullScore.toFixed(1)}</span>
          </div>
          <div className="mt-2">
            <ScoreBar score={bull.bullScore} />
          </div>
          {bull.caracteristicaDestacada && (
            <p className="text-xs text-gray-400 mt-2">
              {bull.caracteristicaDestacada}
            </p>
          )}
        </div>

        {/* Radar Chart */}
        <div className="flex-shrink-0">
          <RadarChart stats={bull.stats} size={100} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={handleFavoriteClick}
            disabled={!isAuthenticated || toggleLoading}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              bull.isFavorite
                ? 'bg-red-500/20 hover:bg-red-500/30'
                : 'bg-gray-700 hover:bg-gray-600',
              (!isAuthenticated || toggleLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <svg
              className={cn('w-5 h-5', bull.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-300')}
              fill={bull.isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
