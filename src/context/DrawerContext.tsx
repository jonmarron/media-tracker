'use client';

import { createContext, useContext } from 'react';
import type { MediaItem } from '@/types';

interface DrawerContextValue {
  openEdit: (item: MediaItem) => void;
}

export const DrawerContext = createContext<DrawerContextValue>({
  openEdit: () => {},
});

export function useDrawerContext() {
  return useContext(DrawerContext);
}
