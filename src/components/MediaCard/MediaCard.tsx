'use client';

import { BookOpen, Film, Star } from 'lucide-react';
import { MediaItem } from '@/types';
import styles from './MediaCard.module.css';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

export function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <article className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.cover}>
        {item.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverUrl} alt={item.title} className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            {item.type === 'book' ? (
              <BookOpen className={styles.coverIcon} />
            ) : (
              <Film className={styles.coverIcon} />
            )}
          </div>
        )}
        <span className={`${styles.badge} ${item.status === 'completed' ? styles.badgeCompleted : styles.badgeWant}`}>
          {item.status === 'completed' ? 'Completed' : 'Want'}
        </span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.creator}>
          {item.type === 'book' ? item.author : item.director}
        </p>
        <div className={styles.meta}>
          <span className={styles.metaText}>
            {item.genre}{item.year ? ` · ${item.year}` : ''}
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
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < rating ? styles.starFilled : styles.starEmpty} />
      ))}
    </div>
  );
}
