'use client';

import { useState } from 'react';
import { MediaItem, MediaType } from '@/types';
import { useMediaItems } from '@/hooks/useMediaItems';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { MediaCard } from '@/components/MediaCard';
import { EmptyState } from '@/components/EmptyState';

interface MediaListViewProps {
  type: MediaType;
}

export function MediaListView({ type }: MediaListViewProps) {
  const { items } = useMediaItems(type);
  const [filter, setFilter] = useState<FilterOption>('all');

  const filtered =
    filter === 'all' ? items : items.filter((i) => i.status === filter);

  function handleCardClick(item: MediaItem) {
    console.log('card clicked:', item.id);
  }

  return (
    <div className="flex flex-col gap-5">
      <FilterBar active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState type={type} filtered={filter !== 'all'} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      )}
    </div>
  );
}
