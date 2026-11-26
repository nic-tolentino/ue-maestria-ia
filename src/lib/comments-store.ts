import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  CommentStream,
  ReportReason,
  SessionComment,
} from "@/types/calendar";

/**
 * Mock / local-file comment store designed with a clean async repository interface.
 * To migrate to Neon Postgres or Supabase in Phase 2, replace only the implementation
 * in this file — all API routes and React components stay untouched.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "comments.json");

const SEED_COMMENTS: SessionComment[] = [
  {
    id: "seed-1",
    sessionId: "2026-11-26-thu",
    authorName: "Carlos M.",
    stream: "M11",
    body: "El profesor confirmó por el chat de Teams que hoy empezamos puntuales a las 18:30. Os dejo el enlace de nuestra sala de M11.",
    sharedUrl: "https://teams.microsoft.com/l/meetup-join/demo-m11-2026-11-26",
    upvotes: 6,
    reportCount: 0,
    isPinned: true,
    createdAt: "2026-11-26T10:15:00.000Z",
  },
  {
    id: "seed-2",
    sessionId: "2026-11-26-thu",
    authorName: "Laura P.",
    stream: "M12",
    body: "Para M12 usamos el mismo enlace recurrente de Teams de Machine Learning con Álvaro. ¡Nos vemos a las 18:30!",
    upvotes: 5,
    reportCount: 0,
    createdAt: "2026-11-26T10:42:00.000Z",
  },
  {
    id: "seed-3",
    sessionId: "2026-11-26-thu",
    authorName: "Sofia R.",
    stream: "BOTH",
    body: "Recordad que la grabación suele tardar ~1 hora en aparecer en el canal de Teams después de clase.",
    upvotes: 3,
    reportCount: 0,
    createdAt: "2026-11-26T11:05:00.000Z",
  },
  {
    id: "seed-4",
    sessionId: "2026-12-01-tue",
    authorName: "David G.",
    stream: "BOTH",
    body: "Class 5 of AWS AI Practitioner (AIF-C01) — we'll be covering Amazon Bedrock and SageMaker AI.",
    upvotes: 4,
    reportCount: 0,
    createdAt: "2026-11-25T19:30:00.000Z",
  },
  {
    id: "seed-5",
    sessionId: "2026-11-24-tue",
    authorName: "Elena V.",
    stream: "M11",
    body: "Las diapositivas del roadmap de AWS AIF-C01 y Azure AI-901 ya están subidas en el campus virtual.",
    upvotes: 7,
    reportCount: 0,
    createdAt: "2026-11-24T20:10:00.000Z",
  },
];

// In-memory cache (also serves as fallback on read-only serverless filesystems)
let memoryStore: SessionComment[] | null = null;

async function readStore(): Promise<SessionComment[]> {
  if (memoryStore) return memoryStore;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as SessionComment[];
    if (Array.isArray(parsed)) {
      memoryStore = parsed;
      return memoryStore;
    }
  } catch {
    // File does not exist yet — seed it
  }
  memoryStore = [...SEED_COMMENTS];
  await persistStore(memoryStore);
  return memoryStore;
}

async function persistStore(items: SessionComment[]): Promise<void> {
  memoryStore = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch {
    // On read-only deployments (e.g. Vercel serverless without DB), keep working in memory
  }
}

export async function listComments(
  sessionId?: string,
): Promise<SessionComment[]> {
  const all = await readStore();
  const filtered = sessionId
    ? all.filter((c) => c.sessionId === sessionId)
    : all;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createComment(input: {
  sessionId: string;
  authorName: string;
  stream: CommentStream;
  body: string;
  sharedUrl?: string;
}): Promise<SessionComment> {
  const all = await readStore();
  const comment: SessionComment = {
    id: crypto.randomUUID(),
    sessionId: input.sessionId,
    authorName: input.authorName.trim().slice(0, 60),
    stream: input.stream,
    body: input.body.trim().slice(0, 1500),
    sharedUrl: input.sharedUrl,
    upvotes: 0,
    reportCount: 0,
    reports: [],
    isPinned: false,
    createdAt: new Date().toISOString(),
  };
  await persistStore([comment, ...all]);
  return comment;
}

export async function voteComment(
  id: string,
  delta: 1 | -1,
): Promise<SessionComment | null> {
  const all = await readStore();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const updated: SessionComment = {
    ...all[idx],
    upvotes: Math.max(0, all[idx].upvotes + delta),
  };
  const next = [...all];
  next[idx] = updated;
  await persistStore(next);
  return updated;
}

export async function reportComment(
  id: string,
  reason: ReportReason,
  details?: string,
): Promise<SessionComment | null> {
  const all = await readStore();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const existing = all[idx];
  const updated: SessionComment = {
    ...existing,
    reportCount: existing.reportCount + 1,
    reports: [
      ...(existing.reports ?? []),
      {
        reason,
        details: details?.trim().slice(0, 500) || undefined,
        createdAt: new Date().toISOString(),
      },
    ],
  };
  const next = [...all];
  next[idx] = updated;
  await persistStore(next);
  return updated;
}

export async function deleteComment(id: string): Promise<boolean> {
  const all = await readStore();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await persistStore(next);
  return true;
}
