'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { AddItemDrawer } from '@/components/AddItemDrawer';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className={styles.root}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : styles.closed}`}>
        <Sidebar />
      </div>

      <div className={styles.main}>
        <Navbar
          onMenuClick={() => setSidebarOpen((o) => !o)}
          onAddClick={() => setDrawerOpen(true)}
        />
        <main className={styles.content} key={refreshKey}>{children}</main>
      </div>

      <AddItemDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdded={handleAdded}
      />
    </div>
  );
}
