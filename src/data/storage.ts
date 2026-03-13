'use client';

import { MediaItem, MediaType } from '@/types';
import { mockItems } from './mockData';

const STORAGE_KEY = 'media-tracker-items';

function loadItems(): MediaItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as MediaItem[];
  // First visit — seed with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItems));
  return mockItems;
}

function saveItems(items: MediaItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getItems(type?: MediaType): MediaItem[] {
  const items = loadItems();
  return type ? items.filter((item) => item.type === type) : items;
}

export function addItem(
  item: Omit<MediaItem, 'id' | 'dateAdded'>
): MediaItem {
  const items = loadItems();
  const newItem: MediaItem = {
    ...item,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  saveItems([...items, newItem]);
  return newItem;
}

export function updateItem(
  id: string,
  updates: Partial<MediaItem>
): MediaItem {
  const items = loadItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Item ${id} not found`);
  const updated = { ...items[index], ...updates };
  const newItems = [...items];
  newItems[index] = updated;
  saveItems(newItems);
  return updated;
}

export function deleteItem(id: string): void {
  const items = loadItems();
  saveItems(items.filter((item) => item.id !== id));
}

export function searchItems(query: string, type?: MediaType): MediaItem[] {
  const items = getItems(type);
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.author?.toLowerCase().includes(q) ||
      item.director?.toLowerCase().includes(q) ||
      item.genre?.toLowerCase().includes(q)
  );
}
