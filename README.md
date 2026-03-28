# VIBEFEED

Monorepo for **VibeFeed**: Expo app + Node API + Supabase schema.

## Layout

| Path | Purpose |
|------|---------|
| `vibefeed/` | Expo (iOS / Android / web) — main app |
| `vibefeed-api/` | Express API for feed, likes, Spotify seed |
| `supabase-schema.sql` | Run in Supabase SQL Editor |

## Local dev

**API**

```bash
cd vibefeed-api
cp .env.example .env
# Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SPOTIFY_*
npm install
npm run dev
```

**App**

```bash
cd vibefeed
cp .env.example .env.local   # if you add one; see Expo docs for env
npm install
npx expo start
```

## Netlify (web)

- Connect this repo to Netlify.
- Config is in `netlify.toml` (build base `vibefeed`, output `dist`).
- Set env vars in Netlify: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`.

## API hosting (Railway / Render)

Deploy the `vibefeed-api` folder; set the same Supabase + Spotify env vars as in `.env.example`.

## Domain (Namecheap)

Point **A / CNAME** for `vibefeed.world` to Netlify’s instructions after you add the custom domain there. Use a subdomain (e.g. `api.vibefeed.world`) for the API host.
