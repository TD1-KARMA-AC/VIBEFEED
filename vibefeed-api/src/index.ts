import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fetchSeedTracks } from './spotify';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

// GET /feed — reads from DB only, never calls Spotify/OpenAI live
app.get('/feed', async (req, res) => {
  const page = Number(req.query.page ?? 0);
  const limit = Number(req.query.limit ?? 10);
  const from = page * limit;

  const { data, error } = await supabase
    .from('tracks')
    .select(`
      *,
      track_analysis (
        vibe, scenes, dna, dj_mix, lyrics_preview, dropmatch_ids
      )
    `)
    .range(from, from + limit - 1)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const feed = (data ?? []).map((track: Record<string, unknown>, i: number) => ({
    ...track,
    analysis: track.track_analysis,
    is_liked: false,
    is_saved: false,
    why_in_feed: WHY_REASONS[i % WHY_REASONS.length],
  }));

  res.json(feed);
});

// POST /track/like
app.post('/track/like', async (req, res) => {
  const { trackId, userId } = req.body;
  const { error } = await supabase
    .from('likes')
    .upsert({ user_id: userId, track_id: trackId });
  if (!error) await supabase.rpc('increment_likes', { track_id: trackId });
  res.json({ success: !error });
});

// DELETE /track/like
app.delete('/track/like', async (req, res) => {
  const { trackId, userId } = req.body;
  const { error } = await supabase
    .from('likes')
    .delete()
    .match({ user_id: userId, track_id: trackId });
  if (!error) await supabase.rpc('decrement_likes', { track_id: trackId });
  res.json({ success: !error });
});

// POST /track/save
app.post('/track/save', async (req, res) => {
  const { trackId, userId } = req.body;
  const { error } = await supabase
    .from('saved_tracks')
    .upsert({ user_id: userId, track_id: trackId });
  res.json({ success: !error });
});

// GET /track/:id/comments
app.get('/track/:id/comments', async (req, res) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('track_id', req.params.id)
    .order('created_at', { ascending: false })
    .limit(50);
  res.json(data ?? []);
});

// POST /track/:id/comments
app.post('/track/:id/comments', async (req, res) => {
  const { userId, text } = req.body;
  const { data, error } = await supabase
    .from('comments')
    .insert({ track_id: req.params.id, user_id: userId, text })
    .select()
    .single();
  res.json(data ?? { error: error?.message });
});

// POST /admin/seed-spotify
// Body: { query?: string, limit?: number }
app.post('/admin/seed-spotify', async (req, res) => {
  try {
    const query = String(req.body?.query ?? 'melodic house');
    const limit = Number(req.body?.limit ?? 20);
    const tracks = await fetchSeedTracks(query, limit);

    let inserted = 0;
    for (const t of tracks) {
      const { data: row, error } = await supabase
        .from('tracks')
        .upsert(
          {
            spotify_id: t.spotify_id,
            title: t.title,
            artist: t.artist,
            album: t.album,
            album_art_url: t.album_art_url,
            preview_url: t.preview_url,
            bpm: t.bpm,
            musical_key: t.musical_key,
            energy: t.energy,
            genre: t.genre,
          },
          { onConflict: 'spotify_id' }
        )
        .select('id')
        .single();

      if (error || !row?.id) continue;

      await supabase
        .from('track_analysis')
        .upsert({
          track_id: row.id,
          vibe: t._seed_meta.vibe,
          scenes: t._seed_meta.scenes,
          dna: t._seed_meta.dna,
          dj_mix: t._seed_meta.dj_mix,
          lyrics_preview: t._seed_meta.lyrics_preview,
          dropmatch_ids: [],
        });

      inserted += 1;
    }

    res.json({ ok: true, fetched: tracks.length, upserted: inserted, query });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Seed failed';
    res.status(500).json({ ok: false, error: message });
  }
});

const WHY_REASONS = [
  'Based on your recent saves · 91% match',
  '94% energy match to your DNA',
  'Trending in your vibe range',
  '97% genre match',
  "New from an artist you'll love",
];

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`VibeFeed API running on port ${PORT}`));
