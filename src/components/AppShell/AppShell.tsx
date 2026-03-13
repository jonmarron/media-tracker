'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { AddItemDrawer } from '@/components/AddItemDrawer';
import { SearchProvider } from '@/context/SearchContext';
import { DrawerContext } from '@/context/DrawerContext';
import type { MediaItem } from '@/types';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleChanged() {
    setRefreshKey((k) => k + 1);
  }

  function openAdd() {
    setEditingItem(null);
    setDrawerOpen(true);
  }

  function openEdit(item: MediaItem) {
    setEditingItem(item);
    setDrawerOpen(true);
  }

  function handleClose() {
    setDrawerOpen(false);
    setEditingItem(null);
  }

  return (
    <SearchProvider>
      <DrawerContext.Provider value={{ openEdit }}>
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
              onAddClick={openAdd}
            />
            <main className={styles.content} key={refreshKey}>{children}</main>
          </div>

          <AddItemDrawer
            isOpen={drawerOpen}
            onClose={handleClose}
            onAdded={handleChanged}
            itemToEdit={editingItem}
          />
        </div>
      </DrawerContext.Provider>
    </SearchProvider>
  );
}
