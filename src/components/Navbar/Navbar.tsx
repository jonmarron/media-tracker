'use client';

import { usePathname } from 'next/navigation';
import { Search, Plus, Menu } from 'lucide-react';
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
        <input type="search" placeholder="Search..." className={styles.searchInput} />
      </div>
    </header>
  );
}
