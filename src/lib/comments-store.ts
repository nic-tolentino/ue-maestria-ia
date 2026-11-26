import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type {
  CommentStream,
  ReportReason,
  SessionComment,
} from "@/types/calendar";

/**
 * Dual-driver comment repository:
 *  - **Neon Postgres** (production): used automatically when `DATABASE_URL` is set
 *    and `USE_MOCK_STORE !== "true"`. Bootstraps its own tables on first query.
 *  - **Local Mock File Store** (dev): used automatically when `DATABASE_URL` is unset
 *    or `USE_MOCK_STORE=true`. Persists to `.data/comments.json` and seeds dev fixtures
 *    in non-production environments (unless `SEED_MOCK_COMMENTS=false`).
 */

export type StorageMode = "neon" | "mock";

export function getStorageMode(): StorageMode {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  const forceMock = process.env.USE_MOCK_STORE?.trim().toLowerCase() === "true";
  return hasDb && !forceMock ? "neon" : "mock";
}

// ============================================================================
// NEON POSTGRES DRIVER
// ============================================================================

interface DbCommentRow {
  id: string;
  session_id: string;
  author_name: string;
  stream: CommentStream;
  body: string;
  shared_url: string | null;
  upvotes: number;
  report_count: number;
  is_pinned: boolean;
  created_at: string | Date;
}

function rowToComment(row: DbCommentRow): SessionComment {
  return {
    id: row.id,
    sessionId: row.session_id,
    authorName: row.author_name,
    stream: row.stream,
    body: row.body,
    sharedUrl: row.shared_url ?? undefined,
    upvotes: Number(row.upvotes) || 0,
    reportCount: Number(row.report_count) || 0,
    isPinned: Boolean(row.is_pinned),
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

let schemaReadyPromise: Promise<void> | null = null;

function getNeonClient() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(url);
}

async function ensureNeonSchema(): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      const sql = getNeonClient();
      await sql`
        CREATE TABLE IF NOT EXISTS comments (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          author_name TEXT NOT NULL,
          stream TEXT NOT NULL CHECK (stream IN ('M11', 'M12', 'BOTH')),
          body TEXT NOT NULL,
          shared_url TEXT,
          upvotes INTEGER NOT NULL DEFAULT 0,
          report_count INTEGER NOT NULL DEFAULT 0,
          is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_comments_session_id
          ON comments (session_id)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_comments_created_at
          ON comments (created_at DESC)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS comment_reports (
          id TEXT PRIMARY KEY,
          comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
          reason TEXT NOT NULL,
          details TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_comment_reports_comment_id
          ON comment_reports (comment_id)
      `;
    })().catch((err) => {
      // Allow retry on subsequent requests if initial cold-start query failed
      schemaReadyPromise = null;
      throw err;
    });
  }
  await schemaReadyPromise;
}

// ============================================================================
// LOCAL MOCK FILE STORE DRIVER (for zero-setup local development)
// ============================================================================

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "comments.json");

/**
 * Dev-only mock fixtures so anyone cloning the repo can immediately test
 * comments, stream badges, pinned posts, upvotes, reports, and admin moderation.
 * Never seeded in production (`NODE_ENV === "production"`).
 */
const DEV_SEED_COMMENTS: SessionComment[] = [
  {
    id: "dev-seed-1",
    sessionId: "2026-11-30-mon",
    authorName: "Ana (Mock Dev)",
    stream: "M12",
    body: "[DEV MOCK] Ejemplo de comentario fijado: recordad que hoy vence la entrega de la Actividad 4 de Intro a Data Science a las 18:00.",
    upvotes: 6,
    reportCount: 0,
    isPinned: true,
    createdAt: "2026-11-26T10:15:00.000Z",
  },
  {
    id: "dev-seed-2",
    sessionId: "2026-11-30-mon",
    authorName: "Carlos (Mock Dev)",
    stream: "M11",
    body: "[DEV MOCK] Sample M11 comment with a mock meeting link so you can test student-shared link fallback locally.",
    sharedUrl: "https://teams.microsoft.com/meet/mock-dev-m11-room",
    upvotes: 4,
    reportCount: 0,
    createdAt: "2026-11-26T10:42:00.000Z",
  },
  {
    id: "dev-seed-3",
    sessionId: "2026-11-30-mon",
    authorName: "Sofía (Mock Dev)",
    stream: "BOTH",
    body: "[DEV MOCK] Recordings usually appear in the Teams channel ~1 hour after class finishes.",
    upvotes: 3,
    reportCount: 0,
    createdAt: "2026-11-26T11:05:00.000Z",
  },
  {
    id: "dev-seed-4",
    sessionId: "2026-12-01-tue",
    authorName: "David (Mock Dev)",
    stream: "BOTH",
    body: "[DEV MOCK] Class 5 of AWS AI Practitioner (AIF-C01) — Amazon Bedrock & SageMaker AI.",
    upvotes: 2,
    reportCount: 0,
    createdAt: "2026-11-25T19:30:00.000Z",
  },
];

let memoryStore: SessionComment[] | null = null;

function shouldSeedDevMock(): boolean {
  if (process.env.SEED_MOCK_COMMENTS?.trim().toLowerCase() === "true") {
    return true;
  }
  if (process.env.SEED_MOCK_COMMENTS?.trim().toLowerCase() === "false") {
    return false;
  }
  return process.env.NODE_ENV !== "production";
}

async function readMockStore(): Promise<SessionComment[]> {
  if (memoryStore) return memoryStore;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as SessionComment[];
    if (Array.isArray(parsed)) {
      memoryStore = parsed;
      return memoryStore;
    }
  } catch {
    // File does not exist yet
  }
  memoryStore = shouldSeedDevMock() ? [...DEV_SEED_COMMENTS] : [];
  await persistMockStore(memoryStore);
  return memoryStore;
}

async function persistMockStore(items: SessionComment[]): Promise<void> {
  memoryStore = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch {
    // On read-only filesystems, keep working in memory
  }
}

// ============================================================================
// PUBLIC REPOSITORY API
// ============================================================================

export async function listComments(
  sessionId?: string,
): Promise<SessionComment[]> {
  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = sessionId
      ? ((await sql`
          SELECT id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
          FROM comments
          WHERE session_id = ${sessionId}
          ORDER BY is_pinned DESC, created_at DESC
        `) as DbCommentRow[])
      : ((await sql`
          SELECT id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
          FROM comments
          ORDER BY is_pinned DESC, created_at DESC
        `) as DbCommentRow[]);
    return rows.map(rowToComment);
  }

  const all = await readMockStore();
  const filtered = sessionId
    ? all.filter((c) => c.sessionId === sessionId)
    : all;
  return [...filtered].sort((a, b) => {
    if (Boolean(b.isPinned) !== Boolean(a.isPinned)) {
      return Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export interface CreateCommentInput {
  sessionId: string;
  authorName: string;
  stream: CommentStream;
  body: string;
  sharedUrl?: string;
}

export async function createComment(
  input: CreateCommentInput,
): Promise<SessionComment> {
  const id = `c_${crypto.randomUUID()}`;
  const authorName = input.authorName.trim().slice(0, 60);
  const body = input.body.trim().slice(0, 1500);
  const sharedUrl = input.sharedUrl?.trim() || undefined;

  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = (await sql`
      INSERT INTO comments (id, session_id, author_name, stream, body, shared_url)
      VALUES (${id}, ${input.sessionId}, ${authorName}, ${input.stream}, ${body}, ${sharedUrl ?? null})
      RETURNING id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
    `) as DbCommentRow[];
    return rowToComment(rows[0]);
  }

  const all = await readMockStore();
  const created: SessionComment = {
    id,
    sessionId: input.sessionId,
    authorName,
    stream: input.stream,
    body,
    sharedUrl,
    upvotes: 0,
    reportCount: 0,
    isPinned: false,
    createdAt: new Date().toISOString(),
  };
  await persistMockStore([created, ...all]);
  return created;
}

export async function voteComment(
  commentId: string,
  delta: 1 | -1,
): Promise<SessionComment | null> {
  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = (await sql`
      UPDATE comments
      SET upvotes = GREATEST(0, upvotes + ${delta})
      WHERE id = ${commentId}
      RETURNING id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
    `) as DbCommentRow[];
    return rows[0] ? rowToComment(rows[0]) : null;
  }

  const all = await readMockStore();
  const idx = all.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;

  const updated: SessionComment = {
    ...all[idx],
    upvotes: Math.max(0, all[idx].upvotes + delta),
  };
  const next = [...all];
  next[idx] = updated;
  await persistMockStore(next);
  return updated;
}

export async function reportComment(
  commentId: string,
  reason: ReportReason,
  details?: string,
): Promise<SessionComment | null> {
  const cleanDetails = details?.trim().slice(0, 400) || undefined;

  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const reportId = `r_${crypto.randomUUID()}`;

    const rows = (await sql`
      UPDATE comments
      SET report_count = report_count + 1
      WHERE id = ${commentId}
      RETURNING id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
    `) as DbCommentRow[];
    if (!rows[0]) return null;

    await sql`
      INSERT INTO comment_reports (id, comment_id, reason, details)
      VALUES (${reportId}, ${commentId}, ${reason}, ${cleanDetails ?? null})
    `;

    return rowToComment(rows[0]);
  }

  const all = await readMockStore();
  const idx = all.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;

  const existing = all[idx];
  const updated: SessionComment = {
    ...existing,
    reportCount: existing.reportCount + 1,
    reports: [
      ...(existing.reports ?? []),
      {
        reason,
        details: cleanDetails,
        createdAt: new Date().toISOString(),
      },
    ],
  };
  const next = [...all];
  next[idx] = updated;
  await persistMockStore(next);
  return updated;
}

export async function setCommentPinned(
  commentId: string,
  isPinned: boolean,
): Promise<SessionComment | null> {
  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = (await sql`
      UPDATE comments
      SET is_pinned = ${isPinned}
      WHERE id = ${commentId}
      RETURNING id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
    `) as DbCommentRow[];
    return rows[0] ? rowToComment(rows[0]) : null;
  }

  const all = await readMockStore();
  const idx = all.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;

  const updated: SessionComment = { ...all[idx], isPinned };
  const next = [...all];
  next[idx] = updated;
  await persistMockStore(next);
  return updated;
}

export async function clearCommentReports(
  commentId: string,
): Promise<SessionComment | null> {
  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = (await sql`
      UPDATE comments
      SET report_count = 0
      WHERE id = ${commentId}
      RETURNING id, session_id, author_name, stream, body, shared_url, upvotes, report_count, is_pinned, created_at
    `) as DbCommentRow[];
    if (!rows[0]) return null;
    await sql`DELETE FROM comment_reports WHERE comment_id = ${commentId}`;
    return rowToComment(rows[0]);
  }

  const all = await readMockStore();
  const idx = all.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;

  const updated: SessionComment = {
    ...all[idx],
    reportCount: 0,
    reports: [],
  };
  const next = [...all];
  next[idx] = updated;
  await persistMockStore(next);
  return updated;
}

export async function deleteComment(commentId: string): Promise<boolean> {
  if (getStorageMode() === "neon") {
    await ensureNeonSchema();
    const sql = getNeonClient();
    const rows = (await sql`
      DELETE FROM comments
      WHERE id = ${commentId}
      RETURNING id
    `) as { id: string }[];
    return rows.length > 0;
  }

  const all = await readMockStore();
  const next = all.filter((c) => c.id !== commentId);
  if (next.length === all.length) return false;
  await persistMockStore(next);
  return true;
}
