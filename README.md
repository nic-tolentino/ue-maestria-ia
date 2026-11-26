# Máster en IA · Portal / Hub (UE Valencia · 2026–27)

Bilingual (**ES / EN**) student hub with live class calendar, Microsoft Teams link directory, video recordings archive, official Teaching Guide PDFs, syllabus & bibliography, and private grade tracker for the online Master's in AI at Universidad Europea de Valencia (**M11 & M12** streams).

## Features

- **Top-level Calendar + Course & Units navigation** — Calendar (`Week` default, `Month`, `Agenda`) and **Course & Units** (`Guides & Grades`) right in the sticky header, with shareable deep links (`/?session=...` and `/?view=course&unit=...`).
- **Today / Up Next Hero** — live status, Madrid time + automatic local timezone conversion, professor names (M11 & M12), recurring Teams join button, direct jump to the active unit's guide, and clickable upcoming assignment deadlines.
- **Course & Units (`Curso y Asignaturas`) Hub** — all modules in chronological study order (Aula Tutor, 1st Semester, Cloud Certifications AWS/Azure, 2nd Semester, TFM), direct Canvas links, official Teaching Guide PDFs (`/guides/*.pdf`), bilingual syllabus topics, bibliography, and a **private personal grade tracker** stored only in `localStorage`.
- **Low-friction Student Comments** — name-only posting, M11 / M12 / Both stream tags, automatic Teams link detection, upvotes, and reporting (auto-hides after 3 reports).
- **Instant Phone Notifications (`ntfy.sh`)** — normal push on new comments, **urgent** push on reported comments with tap-to-open buttons straight to `/admin` or the exact class session.
- **Dedicated Admin Dashboard (`/admin`)** — protected by `ADMIN_SECRET`, with a **Reports Triage Queue** (reason, timestamp, reporter details, target comment) and a **Chronological All-Comments Feed** across every session, with search, filters, 1-tap Pin/Unpin, Clear reports, and 2-tap Delete.
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

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3000/admin](http://localhost:3000/admin) for the moderation dashboard).

### How Mock Mode Works

- Whenever `DATABASE_URL` is **not set** (or `USE_MOCK_STORE=true`), the app automatically runs in **Dev Mock Mode** (shown as a small badge in the footer):
  - Comments, upvotes, pins, reports, and deletes are saved locally to `.data/comments.json` (git-ignored).
  - On first launch in `npm run dev`, realistic `[DEV MOCK]` sample comments (including a reported fixture) are automatically seeded so you can immediately test comment threads, sorting, stream badges, shared links, and the `/admin` reports triage queue.
  - Phone notifications are logged cleanly to your terminal console (`[NOTIFY:DEFAULT] ...` / `[NOTIFY:URGENT] ...`).
- **Testing Admin Moderation locally:** visit [`/admin`](http://localhost:3000/admin) (or click **Admin** in the bottom-right footer) and enter **`dev`** (the local development fallback when `ADMIN_SECRET` is unset).
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
4. Whenever a student posts a comment or reports spam, you'll get a push notification on your phone. Reported alerts open `/admin` directly for one-tap triage.

### 3. Enable Organizer Admin Moderation

1. In Vercel → **Settings → Environment Variables**, add a strong passphrase:
   - `ADMIN_SECRET` = `<your-secret-passphrase>`
2. Redeploy.
3. Visit `/admin` (or click **Admin** in the bottom-right footer) on your phone or laptop and sign in with your `ADMIN_SECRET`:
   - **Reports Queue tab** — every report in chronological order with reason, details, timestamp, target comment, and 1-tap **Pin/Unpin**, **Clear reports**, or **Delete**.
   - **All Comments tab** — chronological feed across all sessions with search, stream/status filters, and moderation actions.
   - Signing in on `/admin` also keeps inline moderation controls enabled when jumping straight into any session drawer on `/`.

---

## Updating Course Content

All schedule and course metadata lives in clean TypeScript data files under `src/data/`:

- [`src/data/modules.ts`](src/data/modules.ts) — Modules in chronological study order, Canvas portal URLs, official Teaching Guide PDF links (`guidePdfUrl`), ECTS, syllabus topics, bibliography, professors (`M11` / `M12`), recurring Teams URLs, and grading rubrics (`grading`).
- `public/guides/` — Official UE Teaching Guide PDFs served statically at `/guides/<filename>.pdf` (linked from each unit in the Units hub).
- [`src/data/sessions.ts`](src/data/sessions.ts) — Class dates/times, session titles, per-session Teams links, and single or multi-part recording URLs.
- [`src/data/assignments.ts`](src/data/assignments.ts) — Assignment and quiz due dates (linked automatically to the Hero strip, Calendar views, `.ics` reminders, and Units grading table).
- [`src/data/milestones.ts`](src/data/milestones.ts) — Semester exam windows and TFM defense dates.
- [`src/data/people.ts`](src/data/people.ts) — Program leadership (co-directors & Online Tutor), elected M11/M12 class representatives, and student support contacts (faculty cards are auto-derived from `modules.ts`).

## Scripts

```bash
npm run dev         # Start local dev server (auto-uses mock data if no DATABASE_URL)
npm run typecheck   # Run TypeScript compiler check
npm run build       # Production build
npm run reset:mock  # Delete .data/ to reset local mock comments
```
