-- VibeFeed Supabase schema — run in Supabase Dashboard → SQL Editor
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Tracks
create table public.tracks (
  id uuid default uuid_generate_v4() primary key,
  spotify_id text unique not null,
  title text not null,
  artist text not null,
  album text not null,
  album_art_url text,
  preview_url text,
  bpm integer,
  musical_key text,
  energy decimal(3,2),
  genre text,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- AI analysis cache
create table public.track_analysis (
  track_id uuid references public.tracks(id) on delete cascade primary key,
  vibe text[] default '{}',
  scenes text[] default '{}',
  dna text[] default '{}',
  dj_mix text[] default '{}',
  lyrics_preview text[] default '{}',
  dropmatch_ids uuid[] default '{}',
  cached_at timestamptz default now(),
  expires_at timestamptz default now() + interval '7 days'
);

-- User likes
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, track_id)
);

-- User saves
create table public.saved_tracks (
  user_id uuid references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, track_id)
);

-- Comments
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  text text not null check (char_length(text) <= 500),
  likes integer default 0,
  is_pinned boolean default false,
  created_at timestamptz default now()
);

-- Vibe DNA per user
create table public.vibe_profiles (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  primary_vibe text,
  secondary_vibe text,
  hidden_vibe text,
  primary_pct integer default 0,
  secondary_pct integer default 0,
  hidden_pct integer default 0,
  peak_time text,
  avg_bpm integer,
  energy_style text,
  total_interactions integer default 0,
  updated_at timestamptz default now()
);

-- DropMatch cache
create table public.dropmatch_cache (
  track_id uuid references public.tracks(id) on delete cascade primary key,
  compatible_track_ids uuid[] default '{}',
  compat_scores integer[] default '{}',
  computed_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.track_analysis enable row level security;
alter table public.likes enable row level security;
alter table public.saved_tracks enable row level security;
alter table public.comments enable row level security;
alter table public.vibe_profiles enable row level security;
alter table public.dropmatch_cache enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Tracks: public read, service role write
create policy "Tracks are viewable by everyone" on public.tracks for select using (true);

-- Analysis: public read
create policy "Analysis is viewable by everyone" on public.track_analysis for select using (true);

-- Likes: users manage own
create policy "Users can view all likes" on public.likes for select using (true);
create policy "Users can manage own likes" on public.likes for all using (auth.uid() = user_id);

-- Saves: users manage own
create policy "Users can view own saves" on public.saved_tracks for select using (auth.uid() = user_id);
create policy "Users can manage own saves" on public.saved_tracks for all using (auth.uid() = user_id);

-- Comments: public read, auth write
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Authenticated users can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

-- Vibe profiles: users manage own
create policy "Users can view own vibe profile" on public.vibe_profiles for select using (auth.uid() = user_id);
create policy "Users can manage own vibe profile" on public.vibe_profiles for all using (auth.uid() = user_id);

-- DropMatch: public read
create policy "DropMatch cache is viewable by everyone" on public.dropmatch_cache for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  insert into public.vibe_profiles (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment like count atomically
create or replace function increment_likes(track_id uuid)
returns void as $$
  update public.tracks set likes_count = likes_count + 1 where id = track_id;
$$ language sql security definer;

create or replace function decrement_likes(track_id uuid)
returns void as $$
  update public.tracks set likes_count = greatest(0, likes_count - 1) where id = track_id;
$$ language sql security definer;
