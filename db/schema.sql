-- UE Master in AI · Class Calendar Database Schema (Neon / PostgreSQL)
-- Note: The app automatically runs CREATE TABLE IF NOT EXISTS on first boot,
-- so you don't have to execute this manually — it's provided for reference & inspection.

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
);

CREATE INDEX IF NOT EXISTS idx_comments_session_id
  ON comments (session_id);

CREATE INDEX IF NOT EXISTS idx_comments_created_at
  ON comments (created_at DESC);

CREATE TABLE IF NOT EXISTS comment_reports (
  id TEXT PRIMARY KEY,
  comment_id TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comment_reports_comment_id
  ON comment_reports (comment_id);
