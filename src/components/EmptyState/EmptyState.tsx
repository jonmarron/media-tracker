import { BookOpen, Film } from 'lucide-react';
import { MediaType } from '@/types';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  type: MediaType;
  filtered: boolean;
}

export function EmptyState({ type, filtered }: EmptyStateProps) {
  const Icon = type === 'book' ? BookOpen : Film;
  const noun = type === 'book' ? 'books' : 'films';

  return (
    <div className={styles.root}>
      <Icon className={styles.icon} />
      <p className={styles.heading}>
        {filtered ? `No ${noun} match this filter` : `No ${noun} yet`}
      </p>
      <p className={styles.subtext}>
        {filtered
          ? 'Try switching to a different filter.'
          : `Click "+ Add" to add your first ${type}.`}
      </p>
    </div>
  );
}
