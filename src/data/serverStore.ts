import { MediaItem, MediaType } from '@/types';
import { mockItems } from './mockData';

// Module-level store — shared across requests within the same server process.
// Seeded with mock data on first load.
let store: MediaItem[] = [...mockItems];

export function getAllItems(type?: MediaType): MediaItem[] {
  return type ? store.filter((item) => item.type === type) : [...store];
}

export function findItem(id: string): MediaItem | undefined {
  return store.find((item) => item.id === id);
}

export function createItem(data: Omit<MediaItem, 'id' | 'dateAdded'>): MediaItem {
  const newItem: MediaItem = {
    ...data,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  store.push(newItem);
  return newItem;
}

export function updateItemInStore(id: string, updates: Partial<MediaItem>): MediaItem | null {
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...updates };
  return store[index];
}

export function deleteItemFromStore(id: string): boolean {
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
