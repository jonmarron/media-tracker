'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.root}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : styles.closed}`}>
        <Sidebar />
      </div>

      <div className={styles.main}>
        <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
