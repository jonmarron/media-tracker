export type MediaType = 'book' | 'film';
export type MediaStatus = 'completed' | 'want';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  author?: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number;
  status: MediaStatus;
  notes?: string;
  coverUrl?: string;
  dateAdded: string;
  dateCompleted?: string;
}
