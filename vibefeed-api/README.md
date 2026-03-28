# VibeFeed API

Node.js/Express backend for VibeFeed. Deploy to Railway or run locally.

## Run locally

```bash
cp .env.example .env
# Edit .env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from Supabase Dashboard
npm run dev
```

Server runs at http://localhost:3001.

## Endpoints

- `GET /health` — health check
- `GET /feed?page=0&limit=10` — feed (requires Supabase tables)
- `POST /track/like` — body: `{ trackId, userId }`
- `DELETE /track/like` — body: `{ trackId, userId }`
- `POST /track/save` — body: `{ trackId, userId }`
- `GET /track/:id/comments` — list comments
- `POST /track/:id/comments` — body: `{ userId, text }`

## Supabase

Run `../supabase-schema.sql` in your Supabase project (SQL Editor) before using the API.
