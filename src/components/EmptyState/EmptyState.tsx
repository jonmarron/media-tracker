import { BookOpen, Film } from 'lucide-react';
import { MediaType } from '@/types';

interface EmptyStateProps {
  type: MediaType;
  filtered: boolean;
}

export function EmptyState({ type, filtered }: EmptyStateProps) {
  const Icon = type === 'book' ? BookOpen : Film;
  const noun = type === 'book' ? 'books' : 'films';

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Icon className="h-12 w-12 text-[var(--border)]" />
      <p className="text-sm font-medium text-[var(--foreground)]">
        {filtered ? `No ${noun} match this filter` : `No ${noun} yet`}
      </p>
      <p className="text-xs text-[var(--muted)]">
        {filtered
          ? 'Try switching to a different filter.'
          : `Click "+ Add" to add your first ${type}.`}
      </p>
    </div>
  );
}
