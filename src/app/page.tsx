'use client';

import { useMemo } from 'react';
import { useMediaItems } from '@/hooks/useMediaItems';
import { useSearchContext } from '@/context/SearchContext';
import { useDrawerContext } from '@/context/DrawerContext';
import { StatCard } from '@/components/StatCard';
import { RecentMediaRow } from '@/components/RecentMediaRow';
import { MediaCard } from '@/components/MediaCard';
import type { MediaItem } from '@/types';
import styles from './page.module.css';

export default function DashboardPage() {
  const { items: books } = useMediaItems('book');
  const { items: films } = useMediaItems('film');
  const { searchQuery } = useSearchContext();
  const { openEdit } = useDrawerContext();

  const recentBooks = useMemo(
    () => [...books].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 5),
    [books]
  );

  const recentFilms = useMemo(
    () => [...films].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 5),
    [films]
  );

  const totalCompleted = useMemo(
    () => [...books, ...films].filter((i) => i.status === 'completed').length,
    [books, films]
  );

  const totalWant = useMemo(
    () => [...books, ...films].filter((i) => i.status === 'want').length,
    [books, films]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return [...books, ...films].filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.director?.toLowerCase().includes(q) ||
        item.genre?.toLowerCase().includes(q)
    );
  }, [books, films, searchQuery]);

  function handleCardClick(item: MediaItem) {
    openEdit(item);
  }

  if (searchQuery) {
    return (
      <div className={styles.searchView}>
        {searchResults.length === 0 ? (
          <div className={styles.searchEmpty}>
            <p className={styles.searchEmptyHeading}>
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
            <p className={styles.searchEmptySubtext}>Try a different search term.</p>
          </div>
        ) : (
          <>
            <p className={styles.searchCount}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;
              {searchQuery}&rdquo;
            </p>
            <div className={styles.searchGrid}>
              {searchResults.map((item) => (
                <MediaCard key={item.id} item={item} onClick={handleCardClick} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <StatCard label="Total Books" value={books.length} />
        <StatCard label="Total Films" value={films.length} />
        <StatCard label="Completed" value={totalCompleted} />
        <StatCard label="Wishlist" value={totalWant} />
      </div>

      <RecentMediaRow type="book" items={recentBooks} />
      <RecentMediaRow type="film" items={recentFilms} />
    </div>
  );
}
