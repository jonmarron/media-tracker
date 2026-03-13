'use client';

import { MediaStatus } from '@/types';
import styles from './FilterBar.module.css';

export type FilterOption = 'all' | MediaStatus;

const filters: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'want', label: 'Want to Read/Watch' },
];

interface FilterBarProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`${styles.button} ${active === value ? styles.active : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
