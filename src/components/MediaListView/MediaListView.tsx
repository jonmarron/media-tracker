'use client';

import { useState, useMemo } from 'react';
import { MediaItem, MediaType } from '@/types';
import { useMediaItems } from '@/hooks/useMediaItems';
import { useSearchContext } from '@/context/SearchContext';
import { useDrawerContext } from '@/context/DrawerContext';
import { FilterBar, FilterOption } from '@/components/FilterBar';
import { MediaCard } from '@/components/MediaCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './MediaListView.module.css';

interface MediaListViewProps {
  type: MediaType;
}

export function MediaListView({ type }: MediaListViewProps) {
  const { items } = useMediaItems(type);
  const { searchQuery } = useSearchContext();
  const { openEdit } = useDrawerContext();
  const [filter, setFilter] = useState<FilterOption>('all');

  const searchFiltered = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.director?.toLowerCase().includes(q) ||
        item.genre?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const filtered =
    filter === 'all' ? searchFiltered : searchFiltered.filter((i) => i.status === filter);

  function handleCardClick(item: MediaItem) {
    openEdit(item);
  }

  const isSearchEmpty = searchQuery.length > 0 && filtered.length === 0;

  return (
    <div className={styles.root}>
      <FilterBar active={filter} onChange={setFilter} />
      {isSearchEmpty ? (
        <div className={styles.searchEmpty}>
          <p className={styles.searchEmptyHeading}>No results for &ldquo;{searchQuery}&rdquo;</p>
          <p className={styles.searchEmptySubtext}>Try a different search term.</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState type={type} filtered={filter !== 'all'} />
      ) : (
        <div className={styles.grid}>
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      )}
    </div>
  );
}
