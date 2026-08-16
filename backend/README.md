# Faris Venture — backend

Small Node/Express + SQLite API that powers the "Add a new business" admin panel, and feeds live deal / track-record data into the main site.

## What it is

- `GET /api/deals`, `GET /api/track-record` — public, no login. The main site (`index.html`) fetches these on load.
- `POST/PUT/DELETE /api/deals`, `/api/track-record` — require a login token.
- `POST /api/login` — pass `{ "password": "..." }`, get back a token (valid 12h).
- `/admin` — a plain HTML/JS admin panel: log in with the password, fill a form, click save. No coding needed to add a new business.

Data lives in a SQLite file at `backend/data/faris.db`. First run seeds it with the businesses that used to be hardcoded on the site.

## Environment variables

Copy `.env.example` to `.env` for local runs, or set these in Coolify → your backend app → Environment Variables:

- `ADMIN_PASSWORD` — the password you'll type into `/admin` to log in. **Set a real one before deploying.**
- `ADMIN_TOKEN_SECRET` — random long string, used to sign login tokens. **Set a real one before deploying.**
- `ALLOWED_ORIGINS` — comma-separated list of sites allowed to call this API (default `https://farisventure.com`).
- `PORT` — defaults to `4000`.

## Local run

```bash
cd backend
npm install
ADMIN_PASSWORD=test123 ADMIN_TOKEN_SECRET=localsecret npm start
```

Visit `http://localhost:4000/admin` to log in with `test123`.

## Deploying (Coolify)

1. In Coolify, create a **new Application** from the same GitHub repo (`muminul7/farisventure.com`), but set **Base Directory** to `backend`.
2. Build Pack: **Dockerfile** (it'll find `backend/Dockerfile` automatically).
3. Set the environment variables above (real password + real secret).
4. Add a **Persistent Storage** volume mounted at `/app/data` — this keeps your deals/track-record data across redeploys. Without this, every redeploy wipes the database back to the seed data.
5. Set the domain to `api.farisventure.com` (Coolify handles HTTPS automatically, same as the main site).
6. In your DNS (Hostinger), add an `A` record: `api` → your VPS IP (same one the main site points to).
7. Deploy. Visit `https://api.farisventure.com/api/health` — should return `{"ok":true}`.
8. Visit `https://api.farisventure.com/admin`, log in, and add/edit businesses. Changes show up on the main site within a page refresh (no redeploy of the main site needed).

## Adding a new business — day to day

Once deployed, no code or redeploy is needed:

1. Go to `https://api.farisventure.com/admin`.
2. Log in with the admin password.
3. Fill in "Add new deal" (for an active business) or "Add track record entry" (for historical pre-fund deals).
4. Save. Refresh `farisventure.com` — it's live.
