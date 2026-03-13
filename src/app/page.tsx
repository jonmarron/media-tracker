'use client';

import { useMemo } from 'react';
import { useMediaItems } from '@/hooks/useMediaItems';
import { StatCard } from '@/components/StatCard';
import { RecentMediaRow } from '@/components/RecentMediaRow';

export default function DashboardPage() {
  const { items: books } = useMediaItems('book');
  const { items: films } = useMediaItems('film');

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

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Books" value={books.length} />
        <StatCard label="Total Films" value={films.length} />
        <StatCard label="Completed" value={totalCompleted} />
        <StatCard label="Wishlist" value={totalWant} />
      </div>

      {/* Recent sections */}
      <RecentMediaRow type="book" items={recentBooks} />
      <RecentMediaRow type="film" items={recentFilms} />
    </div>
  );
}
