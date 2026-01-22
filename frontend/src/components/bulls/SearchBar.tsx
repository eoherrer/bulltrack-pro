'use client';

import { useState, useEffect } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { Input } from '@/components/ui';

export function SearchBar() {
  const { filters, setSearch } = useFilters();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  return (
    <Input
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
      placeholder="Busca por caravana, nombre o cabana"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      className="max-w-md"
    />
  );
}
