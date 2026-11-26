# Calendario · Máster Universitario en Inteligencia Artificial (UE Valencia · 2026–27)

Bilingual (**ES / EN**) live class calendar, Microsoft Teams link hub, video recordings archive, units directory, and private grade tracker for the online Master's in AI at Universidad Europea de Valencia (**M11 & M12** streams).

## Features

- **Weekly (default), Monthly, Agenda & Units views** — remembers your last selected view and preferred stream (`M11`, `M12`, or `Both`).
- **Today / Up Next Hero** — live status, Madrid time + automatic local timezone conversion, professor name, recurring Teams join button, and upcoming assignment deadline strip.
- **Units (`Asignaturas`) Hub** — modules in chronological study order (Aula Tutor, 1st Semester, Cloud Certifications AWS/Azure, 2nd Semester, TFM), direct Canvas links, grading weights, and a **private personal grade tracker** stored only in `localStorage`.
- **Low-friction Student Comments** — name-only posting, M11 / M12 / Both stream tags, automatic Teams link detection, upvotes, and reporting (auto-hides after 3 reports).
- **Instant Phone Notifications (`ntfy.sh`)** — normal push on new comments, **urgent** push on reported comments with a tap-to-open deep link to the exact session.
- **One-tap Admin Moderation** — discreet footer lock button (`ADMIN_SECRET`) to pin official links, clear false reports, or delete spam directly from your phone.
- **Calendar Subscription (`.ics`)** — stream-specific RFC 5545 feed at `/api/calendar.ics?stream=M12` (or `M11`) with 24h reminders for assignments.

---

## Local Development (Zero-Setup Mock Mode)

Anyone can pull down this repository and run it locally with **no database or environment variables required**:

```bash
git clone <repo-url>
cd ue-maestria-ia
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### How Mock Mode Works

- Whenever `DATABASE_URL` is **not set** (or `USE_MOCK_STORE=true`), the app automatically runs in **Dev Mock Mode** (shown as a small badge in the footer):
  - Comments, upvotes, pins, reports, and deletes are saved locally to `.data/comments.json` (git-ignored).
  - On first launch in `npm run dev`, realistic `[DEV MOCK]` sample comments are automatically seeded so you can immediately test comment threads, sorting, stream badges, and shared links.
  - Phone notifications are logged cleanly to your terminal console (`[NOTIFY:DEFAULT] ...` / `[NOTIFY:URGENT] ...`).
- **Testing Admin Moderation locally:** click **Admin** in the bottom-right footer and enter **`dev`** (the local development fallback when `ADMIN_SECRET` is unset).
- **Reset mock data** back to fresh fixtures anytime:
  ```bash
  npm run reset:mock
  ```
- **Start mock mode with zero seeded comments:** add `SEED_MOCK_COMMENTS=false` to `.env.local`.
- **Force mock mode while `DATABASE_URL` is in your `.env.local`:** add `USE_MOCK_STORE=true` to `.env.local`.

> **Safety note:** Mock dev fixtures are **never** seeded when `NODE_ENV === "production"`, so fake comments can never leak into a live deployment.

---

## Deploying to Vercel + Neon Postgres + ntfy.sh

### 1. Connect Neon Postgres

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. In your Vercel project dashboard, go to **Storage → Create Database → Neon (Serverless Postgres)** and link it to the project.
   - Vercel automatically injects `DATABASE_URL` into your environment variables.
   - Alternatively, create a free database at [neon.tech](https://neon.tech) and paste the connection string as `DATABASE_URL` in Vercel → **Settings → Environment Variables**.
3. **No manual SQL needed:** On the very first request, [`src/lib/comments-store.ts`](src/lib/comments-store.ts) automatically runs `CREATE TABLE IF NOT EXISTS` for `comments` and `comment_reports`. The full schema is also documented in [`db/schema.sql`](db/schema.sql).

### 2. Set Up Instant Phone Alerts with `ntfy.sh`

1. Install the free **ntfy** app on iOS ([App Store](https://apps.apple.com/app/ntfy/id1625396347)) or Android ([Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy)).
2. Tap **+** to subscribe to a hard-to-guess private topic name, e.g. `ue-ia-alerts-8k3m9p2x`.
3. In Vercel → **Settings → Environment Variables**, add:
   - `NTFY_TOPIC` = `ue-ia-alerts-8k3m9p2x`
   - *(Optional)* `NEXT_PUBLIC_SITE_URL` = `https://your-site.vercel.app` *(Vercel's production URL is also auto-detected if omitted)*
4. Whenever a student posts a comment or reports spam, you'll get a push notification on your phone. Tapping it opens that exact class session directly in the app.

### 3. Enable Organizer Admin Moderation

1. In Vercel → **Settings → Environment Variables**, add a strong passphrase:
   - `ADMIN_SECRET` = `<your-secret-passphrase>`
2. Redeploy.
3. On your phone or laptop, click **Admin** in the bottom-right footer, enter your `ADMIN_SECRET`, and every comment will show **Pin / Unpin**, **Clear reports**, and **Delete** controls.

---

## Updating Course Content

All schedule and course metadata lives in clean TypeScript data files under `src/data/`:

- [`src/data/modules.ts`](src/data/modules.ts) — Modules in chronological study order, Canvas portal URLs, professors (`M11` / `M12`), recurring Teams URLs, and grading rubrics (`grading`).
- [`src/data/sessions.ts`](src/data/sessions.ts) — Class dates/times, session titles, per-session Teams links, and single or multi-part recording URLs.
- [`src/data/assignments.ts`](src/data/assignments.ts) — Assignment and quiz due dates (linked automatically to the Hero strip, Calendar views, `.ics` reminders, and Units grading table).
- [`src/data/milestones.ts`](src/data/milestones.ts) — Semester exam windows and TFM defense dates.

## Scripts

```bash
npm run dev         # Start local dev server (auto-uses mock data if no DATABASE_URL)
npm run typecheck   # Run TypeScript compiler check
npm run build       # Production build
npm run reset:mock  # Delete .data/ to reset local mock comments
```
