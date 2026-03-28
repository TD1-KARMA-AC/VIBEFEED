import axios from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

let cachedToken: string | null = null;
let tokenExpiryMs = 0;

function getClientCreds() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET');
  }
  return { clientId, clientSecret };
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryMs) {
    return cachedToken;
  }

  const { clientId, clientSecret } = getClientCreds();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString();
  const { data } = await axios.post(
    SPOTIFY_TOKEN_URL,
    body,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    }
  );

  cachedToken = data.access_token;
  tokenExpiryMs = now + Math.max(0, (data.expires_in - 60) * 1000);
  return cachedToken!;
}

async function spotifyGet<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const token = await getAccessToken();
  const { data } = await axios.get<T>(`${SPOTIFY_API_BASE}${path}`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
    timeout: 12000,
  });
  return data;
}

type SpotifyTrack = {
  id: string;
  name: string;
  preview_url: string | null;
  popularity: number;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
};

type SearchResponse = { tracks?: { items: SpotifyTrack[] } };
type AudioFeature = { id: string; tempo: number; key: number; mode: number; energy: number };
type AudioFeaturesResponse = { audio_features: Array<AudioFeature | null> };

const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function keyToMusical(k: number, mode: number) {
  const base = KEY_NAMES[k] ?? 'C';
  return `${base} ${mode === 1 ? 'maj' : 'min'}`;
}

function inferGenre(query: string) {
  return query.toLowerCase().includes('house') ? 'House' : 'Electronic';
}

export async function fetchSeedTracks(query: string, limit = 20) {
  const q = query.trim() || 'melodic house';
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  const search = await spotifyGet<SearchResponse>('/search', {
    q,
    type: 'track',
    limit: safeLimit,
  });
  const items = search.tracks?.items ?? [];
  if (items.length === 0) return [];

  const ids = items.map((t) => t.id).join(',');
  const audio = await spotifyGet<AudioFeaturesResponse>('/audio-features', { ids });
  const featureMap = new Map<string, AudioFeature>();
  for (const f of audio.audio_features ?? []) {
    if (f?.id) featureMap.set(f.id, f);
  }

  return items.map((t) => {
    const feat = featureMap.get(t.id);
    const bpm = feat ? Math.round(feat.tempo) : 120;
    const energy = feat ? Number(feat.energy.toFixed(2)) : 0.6;
    const key = feat ? keyToMusical(feat.key, feat.mode) : 'C min';
    return {
      spotify_id: t.id,
      title: t.name,
      artist: (t.artists ?? []).map((a) => a.name).join(', ') || 'Unknown',
      album: t.album?.name || 'Unknown',
      album_art_url: t.album?.images?.[0]?.url ?? null,
      preview_url: t.preview_url,
      bpm,
      musical_key: key,
      energy,
      genre: inferGenre(q),
      likes_count: 0,
      comments_count: 0,
      _seed_meta: {
        vibe: ['melodic', 'euphoric', 'night drive'],
        scenes: ['city lights', 'late night'],
        dna: ['progressive', 'emotional EDM'],
        dj_mix: ['Layered pads', 'Big builds'],
        lyrics_preview: ['Feel the rise', 'Hold the moment', 'Let it breathe'],
      },
    };
  });
}
