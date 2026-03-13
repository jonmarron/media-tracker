'use client';

import { BookOpen, Film, Star } from 'lucide-react';
import { MediaItem } from '@/types';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] transition-all hover:border-[var(--primary)] hover:shadow-md"
      onClick={() => onClick(item)}
    >
      {/* Cover */}
      <div className="relative flex h-40 items-center justify-center bg-[var(--surface)]">
        {item.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--border)]">
            {item.type === 'book' ? (
              <BookOpen className="h-10 w-10" />
            ) : (
              <Film className="h-10 w-10" />
            )}
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            item.status === 'completed'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {item.status === 'completed' ? 'Completed' : 'Want'}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-[var(--primary)]">
          {item.title}
        </h3>
        <p className="text-xs text-[var(--muted)]">
          {item.type === 'book' ? item.author : item.director}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-[var(--muted)]">
            {item.genre}
            {item.year ? ` · ${item.year}` : ''}
          </span>
          {item.status === 'completed' && item.rating && (
            <Stars rating={item.rating} />
          )}
        </div>
      </div>
    </article>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-[var(--border)]'
          }`}
        />
      ))}
    </div>
  );
}
