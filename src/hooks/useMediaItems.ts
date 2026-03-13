'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaItem, MediaType } from '@/types';
import { getItems } from '@/data/storage';

export function useMediaItems(type?: MediaType) {
  const [items, setItems] = useState<MediaItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getItems(type));
  }, [type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, refresh };
}
