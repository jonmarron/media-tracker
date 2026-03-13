'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Plus, Menu } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchContext } from '@/context/SearchContext';
import styles from './Navbar.module.css';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/books': 'Books',
  '/films': 'Films',
};

interface NavbarProps {
  onMenuClick: () => void;
  onAddClick: () => void;
}

export function Navbar({ onMenuClick, onAddClick }: NavbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'MediaTracker';
  const { setSearchQuery } = useSearchContext();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // Clear search when navigating between pages
  useEffect(() => {
    setInputValue('');
    setSearchQuery('');
  }, [pathname, setSearchQuery]);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuButton} onClick={onMenuClick} aria-label="Open menu">
          <Menu className={styles.menuIcon} />
        </button>
        <h1 className={styles.title}>{title}</h1>
        <button className={styles.addButton} onClick={onAddClick}>
          <Plus className={styles.addIcon} />
          Add
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search..."
          className={styles.searchInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="Search media"
        />
      </div>
    </header>
  );
}
