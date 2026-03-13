'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Film, Clapperboard } from 'lucide-react';
import styles from './Sidebar.module.css';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/films', label: 'Films', icon: Film },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Clapperboard className={styles.logoIcon} />
        <span className={styles.logoText}>MediaTracker</span>
      </div>

      <nav className={styles.nav}>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon className={styles.navIcon} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
