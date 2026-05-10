# Driveneu Driver — Next.js + Prisma (Vercel-ready)

Production-ready driver web app: dashboard, bookings, wallet, LMS, help center, profile, notifications.

## Stack
- **Next.js 14** (App Router) + TypeScript + Tailwind
- **Prisma** + **PostgreSQL**
- **NextAuth** (credentials, JWT sessions)
- **Zod** validation, **pino** logging, in-memory rate limiting
- Security headers, route middleware

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# Set DATABASE_URL (Postgres) and NEXTAUTH_SECRET (`openssl rand -base64 32`)

# 3. Database
npx prisma db push
npm run db:seed

# 4. Dev
npm run dev    # → http://localhost:3000
```

Demo login: `chandan@driveneu.test` / `driver123`

## Deploy to Vercel

1. Push this folder to GitHub.
2. On Vercel → **New Project** → import the repo.
3. Add env vars in Vercel:
   - `DATABASE_URL` — Postgres URL (Neon / Supabase / Vercel Postgres)
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your deployed URL (e.g. `https://driveneu.vercel.app`)
4. After first deploy, run from your machine once:
   ```bash
   DATABASE_URL=... npx prisma db push
   DATABASE_URL=... npm run db:seed
   ```
5. Visit your URL → log in.

`vercel.json` already runs `prisma generate && next build`.

## API surface

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | NextAuth login |
| GET  | `/api/dashboard` | Aggregated dashboard data |
| GET/POST | `/api/bookings` | List / create bookings |
| GET | `/api/wallet` | Balance + transactions |
| GET | `/api/lms` | Courses with progress |
| POST | `/api/lms/progress` | Mark module complete (auto-calculates %) |
| GET | `/api/help/faqs` | Search FAQs (public) |
| GET/POST | `/api/help/tickets` | Support tickets |
| GET | `/api/profile` | Current user |
| GET | `/api/notifications` | Driver notifications |

All authed routes use `withApi` wrapper (Zod validation + rate limit + auth + error handling).

## Project layout
```
app/
  (driver)/        ← authed app screens
  api/             ← REST endpoints
  login/
lib/               ← prisma, auth, api wrapper, logger, rate-limit
prisma/            ← schema + seed
components/driver/ ← UI building blocks
```

## Production checklist
- [x] Zod validation on every API
- [x] Auth-gated routes via middleware + per-API check
- [x] Rate limiting (swap to Upstash Redis for multi-instance)
- [x] Security headers (X-Frame-Options, CSP-friendly, etc.)
- [x] Pino logging with secret redaction
- [x] Prisma singleton (no connection leaks)
- [ ] Switch in-memory rate limiter to Redis before scaling beyond 1 instance
- [ ] Add Sentry / observability
- [ ] Add tests (Playwright + Vitest)
