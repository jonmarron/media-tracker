'use client';

import Link from 'next/link';
import { BookOpen, Film, Star, ArrowRight } from 'lucide-react';
import { MediaItem, MediaType } from '@/types';

interface RecentMediaRowProps {
  type: MediaType;
  items: MediaItem[];
}

export function RecentMediaRow({ type, items }: RecentMediaRowProps) {
  const title = type === 'book' ? 'Recently Added Books' : 'Recently Added Films';
  const href = type === 'book' ? '/books' : '/films';

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">Nothing added yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
          {items.map((item) => (
            <RecentItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function RecentItem({ item }: { item: MediaItem }) {
  const Icon = item.type === 'book' ? BookOpen : Film;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)]">
        <Icon className="h-4 w-4 text-[var(--muted)]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{item.title}</span>
        <span className="truncate text-xs text-[var(--muted)]">
          {item.type === 'book' ? item.author : item.director}
          {item.year ? ` · ${item.year}` : ''}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            item.status === 'completed'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {item.status === 'completed' ? 'Completed' : 'Want'}
        </span>
        {item.status === 'completed' && item.rating && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
