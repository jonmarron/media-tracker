'use client';

import Link from 'next/link';
import { BookOpen, Film, Star, ArrowRight } from 'lucide-react';
import { MediaItem, MediaType } from '@/types';
import styles from './RecentMediaRow.module.css';

interface RecentMediaRowProps {
  type: MediaType;
  items: MediaItem[];
}

export function RecentMediaRow({ type, items }: RecentMediaRowProps) {
  const title = type === 'book' ? 'Recently Added Books' : 'Recently Added Films';
  const href = type === 'book' ? '/books' : '/films';

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{title}</h2>
        <Link href={href} className={styles.viewAll}>
          View all <ArrowRight className={styles.viewAllIcon} />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>Nothing added yet.</p>
      ) : (
        <div className={styles.list}>
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
    <div className={styles.item}>
      <div className={styles.itemIcon}>
        <Icon className={styles.itemIconSvg} />
      </div>
      <div className={styles.itemBody}>
        <span className={styles.itemTitle}>{item.title}</span>
        <span className={styles.itemSubtitle}>
          {item.type === 'book' ? item.author : item.director}
          {item.year ? ` · ${item.year}` : ''}
        </span>
      </div>
      <div className={styles.itemMeta}>
        <span className={`${styles.badge} ${item.status === 'completed' ? styles.badgeCompleted : styles.badgeWant}`}>
          {item.status === 'completed' ? 'Completed' : 'Want'}
        </span>
        {item.status === 'completed' && item.rating && (
          <div className={styles.stars}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} className={styles.starIcon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
