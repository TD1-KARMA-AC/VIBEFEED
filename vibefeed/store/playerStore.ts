import { create } from 'zustand';
import { FeedItem } from '../types';

interface PlayerState {
  currentTrack: FeedItem | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  setTrack: (track: FeedItem) => void;
  setPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 30,
  setTrack: (track) => set({ currentTrack: track }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ currentTrack: null, isPlaying: false, progress: 0 }),
}));
