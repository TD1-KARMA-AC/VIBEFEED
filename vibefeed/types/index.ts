export interface Track {
  id: string;
  spotify_id: string;
  title: string;
  artist: string;
  album: string;
  album_art_url: string;
  preview_url: string | null;
  bpm: number;
  key: string;
  energy: number;
  genre: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface TrackAnalysis {
  track_id: string;
  vibe: string[];
  scenes: string[];
  dna: string[];
  dj_mix: string[];
  lyrics_preview: string[];
  dropmatch_ids: string[];
  cached_at: string;
}

export interface FeedItem extends Track {
  analysis: TrackAnalysis;
  is_liked: boolean;
  is_saved: boolean;
  why_in_feed: string;
}

export interface VibeDNA {
  primary_vibe: string;
  secondary_vibe: string;
  hidden_vibe: string;
  primary_pct: number;
  secondary_pct: number;
  hidden_pct: number;
  peak_time: string;
  avg_bpm: number;
  energy_style: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  vibe_dna: VibeDNA | null;
}

export interface Comment {
  id: string;
  track_id: string;
  user_id: string;
  username: string;
  text: string;
  likes: number;
  created_at: string;
  is_pinned: boolean;
}

export type Palette = {
  c1: string;
  c2: string;
  c3: string;
  glow: string;
};
