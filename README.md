# Calendario · Máster en IA (Universidad Europea · M11 & M12)

A clean, bilingual (ES/EN) class calendar, Microsoft Teams link hub, and student comment board for the online Master's in AI at Universidad Europea.

## Features

- **Today / Up Next Hero:** Instantly shows if there's class today (or live now), with direct Teams join buttons for **M11** and **M12**.
- **Remembered Group (`M11` / `M12`):** First-visit picker saved in `localStorage` to highlight your stream's links, while keeping comments from both streams visible and clearly tagged.
- **Month, Week & Agenda Views:** Filterable by module, grouped chronologically or by course, plus Exams & TFM defense dates.
- **Recurring + Per-Class + Student-Shared Links:** Automatically resolves per-session links → module recurring links → top-upvoted student-shared Teams links.
- **Low-Barrier Comments:** Name-only posting, group badge (`M11`, `M12`, `M11 + M12`), upvotes, sorting (`Most helpful` / `Newest`), and **Report** button.
- **Instant Phone Alerts:** Sends push notifications to your phone on new comments and **urgent alerts** on reports via **ntfy.sh**, **Telegram**, or a webhook.
- **Subscribable `.ics` Feed:** `/api/calendar.ics?stream=M11` and `/api/calendar.ics?stream=M12` for Google Calendar, Apple Calendar, and Outlook.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating the Schedule & Links

- **Modules & recurring links:** Edit `src/data/modules.ts` (`streamUrls: { M11: "...", M12: "..." }` or `defaultMeetingUrl`).
- **Class sessions & one-off links:** Edit `src/data/sessions.ts` (set `moduleId`, optional `title`, or `streamUrls` / `meetingUrl`).
- **Exams & TFM milestones:** Edit `src/data/milestones.ts`.

## Phone Notifications Setup (Optional)

Copy `.env.example` to `.env.local` (or add these variables in Vercel Project Settings):

### Easiest Option: `ntfy.sh` (Free, iOS & Android)
1. Install the **ntfy** app on your phone.
2. Subscribe to a private, hard-to-guess topic name (e.g. `ue-ia-alerts-9f4k2x`).
3. Set `NTFY_TOPIC=ue-ia-alerts-9f4k2x` and `NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app`.
   - New comments arrive at normal priority; **Reports** arrive at urgent priority with a tap-to-open link directly to that class session!

*(Telegram Bot via `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` and generic webhooks via `NOTIFY_WEBHOOK_URL` are also built into `src/lib/notifications.ts`.)*

## Upgrading from Mock Comments Store to Postgres (Vercel)

Comments currently use a local file-backed mock store in `src/lib/comments-store.ts` (`.data/comments.json`). When ready for production on Vercel:
1. Add **Neon Postgres** (or **Supabase**) from the Vercel Storage marketplace.
2. Replace only the 5 async functions inside `src/lib/comments-store.ts` with SQL queries against a `comments` table—no API routes or UI components need to change.
