import { create } from 'zustand';
import { FeedItem } from '../types';

interface FeedState {
  items: FeedItem[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  likedIds: Set<string>;
  savedIds: Set<string>;
  setItems: (items: FeedItem[]) => void;
  appendItems: (items: FeedItem[]) => void;
  setCurrentIndex: (index: number) => void;
  toggleLike: (trackId: string) => void;
  toggleSave: (trackId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  items: [],
  currentIndex: 0,
  isLoading: false,
  hasMore: true,
  likedIds: new Set(),
  savedIds: new Set(),
  setItems: (items) => set({ items }),
  appendItems: (items) => set((state) => ({ items: [...state.items, ...items] })),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  toggleLike: (trackId) =>
    set((state) => {
      const likedIds = new Set(state.likedIds);
      likedIds.has(trackId) ? likedIds.delete(trackId) : likedIds.add(trackId);
      return { likedIds };
    }),
  toggleSave: (trackId) =>
    set((state) => {
      const savedIds = new Set(state.savedIds);
      savedIds.has(trackId) ? savedIds.delete(trackId) : savedIds.add(trackId);
      return { savedIds };
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));
