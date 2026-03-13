import { MediaItem, MediaType } from '@/types';

export async function getItems(type?: MediaType): Promise<MediaItem[]> {
  const url = type ? `/api/items?type=${type}` : '/api/items';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json() as Promise<MediaItem[]>;
}

export async function addItem(
  data: Omit<MediaItem, 'id' | 'dateAdded'>
): Promise<MediaItem> {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json() as { error: string };
    throw new Error(err.error ?? 'Failed to add item');
  }
  return res.json() as Promise<MediaItem>;
}

export async function updateItem(
  id: string,
  updates: Partial<MediaItem>
): Promise<MediaItem> {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json() as { error: string };
    throw new Error(err.error ?? 'Failed to update item');
  }
  return res.json() as Promise<MediaItem>;
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete item');
  }
}

export async function searchItems(
  query: string,
  type?: MediaType
): Promise<MediaItem[]> {
  const items = await getItems(type);
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.author?.toLowerCase().includes(q) ||
      item.director?.toLowerCase().includes(q) ||
      item.genre?.toLowerCase().includes(q)
  );
}
