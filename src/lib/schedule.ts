import { getModule } from "@/data/modules";
import type {
  Assignment,
  ClassSession,
  Locale,
  Milestone,
  RecordingLink,
  ResolvedMeetingLink,
  SessionComment,
  Stream,
  StreamFilter,
  StreamRecordingValue,
} from "@/types/calendar";

export const MADRID_TZ = "Europe/Madrid";

/** Get YYYY-MM-DD for a Date in Europe/Madrid */
export function getMadridDateStr(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

/** Get HH:mm (24h) for a Date in Europe/Madrid */
export function getMadridTimeStr(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h}:${m}`;
}

/**
 * Convert a Madrid wall-clock date ("YYYY-MM-DD") and time ("HH:mm")
 * into an accurate JS Date (UTC instant), handling CET (+01:00) and CEST (+02:00).
 */
export function madridDateTimeToUtc(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);

  // Initial UTC guess
  const utcGuess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));

  // Measure what Madrid wall-clock says for that UTC guess
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(utcGuess);

  const my = Number(parts.find((p) => p.type === "year")?.value);
  const mo = Number(parts.find((p) => p.type === "month")?.value);
  const md = Number(parts.find((p) => p.type === "day")?.value);
  const mh = Number(parts.find((p) => p.type === "hour")?.value);
  const mmin = Number(parts.find((p) => p.type === "minute")?.value);

  const madridAsUtc = Date.UTC(my, mo - 1, md, mh === 24 ? 0 : mh, mmin, 0);
  const offsetMs = madridAsUtc - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offsetMs);
}

/** Check if the viewer's browser timezone differs from Europe/Madrid */
export function isDifferentFromMadridTz(): boolean {
  try {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return Boolean(userTz && userTz !== MADRID_TZ);
  } catch {
    return false;
  }
}

/** Format a session's time range in the user's local browser timezone */
export function formatLocalTimeRange(session: ClassSession): string {
  const start = madridDateTimeToUtc(session.date, session.startTime);
  const end = madridDateTimeToUtc(session.date, session.endTime);
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fmt.format(start)}–${fmt.format(end)}`;
}

/** Format a YYYY-MM-DD string nicely in ES or EN */
export function formatDateHeading(
  dateStr: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const tag = locale === "es" ? "es-ES" : "en-GB";
  const formatted = new Intl.DateTimeFormat(tag, {
    ...options,
    timeZone: "UTC",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatMonthYear(
  year: number,
  monthIndex: number,
  locale: Locale,
): string {
  const date = new Date(Date.UTC(year, monthIndex, 15, 12, 0, 0));
  const tag = locale === "es" ? "es-ES" : "en-GB";
  const str = new Intl.DateTimeFormat(tag, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  locale: Locale,
): string {
  if (startDate === endDate) {
    return formatDateHeading(startDate, locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const s = formatDateHeading(startDate, locale, {
    day: "numeric",
    month: "short",
  });
  const e = formatDateHeading(endDate, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${s} – ${e}`;
}

export function isSessionLive(
  session: ClassSession,
  now: Date = new Date(),
): boolean {
  if (session.status === "cancelled") return false;
  const start = madridDateTimeToUtc(session.date, session.startTime);
  const end = madridDateTimeToUtc(session.date, session.endTime);
  // Treat 15 minutes before start as "live/joining window"
  const joinWindowStart = new Date(start.getTime() - 15 * 60 * 1000);
  return now >= joinWindowStart && now <= end;
}

export function isSessionPast(
  session: ClassSession,
  now: Date = new Date(),
): boolean {
  const end = madridDateTimeToUtc(session.date, session.endTime);
  return now > end;
}

/** Find today's session (if any) and the next upcoming session */
export function getTodayAndNextSession(
  sessions: ClassSession[],
  now: Date = new Date(),
): {
  todaySession: ClassSession | null;
  nextSession: ClassSession | null;
  live: boolean;
} {
  const todayStr = getMadridDateStr(now);
  const todaySession =
    sessions.find((s) => s.date === todayStr && s.status !== "cancelled") ??
    null;

  if (todaySession && !isSessionPast(todaySession, now)) {
    return {
      todaySession,
      nextSession: todaySession,
      live: isSessionLive(todaySession, now),
    };
  }

  const nextSession =
    sessions.find(
      (s) => s.status !== "cancelled" && !isSessionPast(s, now),
    ) ?? null;

  return {
    todaySession: null,
    nextSession,
    live: false,
  };
}

/**
 * Resolve the best meeting URL for a session + specific stream (M11 or M12).
 * Priority:
 *  1. Session-specific stream override (`session.streamUrls[stream]`)
 *  2. Session-specific shared URL (`session.meetingUrl`)
 *  3. Module recurring stream URL (`module.streamUrls[stream]`)
 *  4. Module recurring shared URL (`module.defaultMeetingUrl`)
 *  5. Highest-upvoted (then newest) non-hidden student-shared URL matching stream or BOTH
 */
export function resolveMeetingLink(
  session: ClassSession,
  stream: Stream,
  sessionComments: SessionComment[] = [],
): ResolvedMeetingLink | null {
  const mod = getModule(session.moduleId);

  if (session.streamUrls?.[stream]) {
    return {
      url: session.streamUrls[stream]!,
      source: "session",
      stream,
    };
  }
  if (session.meetingUrl) {
    return {
      url: session.meetingUrl,
      source: "session",
      stream: "BOTH",
    };
  }
  if (mod.streamUrls?.[stream]) {
    return {
      url: mod.streamUrls[stream]!,
      source: "recurring",
      stream,
    };
  }
  if (mod.defaultMeetingUrl) {
    return {
      url: mod.defaultMeetingUrl,
      source: "recurring",
      stream: "BOTH",
    };
  }

  // Fallback to student-shared URLs from comments (skip comments with >= 3 reports)
  const candidates = sessionComments
    .filter(
      (c) =>
        Boolean(c.sharedUrl) &&
        c.reportCount < 3 &&
        (c.stream === stream || c.stream === "BOTH"),
    )
    .sort((a, b) => {
      // Exact stream match preferred over BOTH if pinned or tied
      if ((a.isPinned ? 1 : 0) !== (b.isPinned ? 1 : 0)) {
        return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      }
      if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
      return b.createdAt.localeCompare(a.createdAt);
    });

  if (candidates.length > 0 && candidates[0].sharedUrl) {
    return {
      url: candidates[0].sharedUrl,
      source: "student",
      stream: candidates[0].stream,
      sharedBy: candidates[0].authorName,
      sharedAt: candidates[0].createdAt,
      upvotes: candidates[0].upvotes,
    };
  }

  return null;
}

function normalizeRecordings(value?: StreamRecordingValue): RecordingLink[] {
  if (!value) return [];
  if (typeof value === "string") return [{ url: value }];
  return value;
}

export function resolveRecordings(
  session: ClassSession,
  stream: Stream,
): RecordingLink[] {
  const streamVal = session.recordingUrls?.[stream];
  if (streamVal) return normalizeRecordings(streamVal);
  return normalizeRecordings(session.recordingUrl);
}

/** Build a Monday-first 6x7 (or 5x7) calendar grid of YYYY-MM-DD cells */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
): Array<{ dateStr: string; day: number; inCurrentMonth: boolean }> {
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const lastOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0));

  // JS getUTCDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat -> convert to Mon=0..Sun=6
  const startOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  const totalDays = lastOfMonth.getUTCDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  const cells: Array<{
    dateStr: string;
    day: number;
    inCurrentMonth: boolean;
  }> = [];

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(Date.UTC(year, monthIndex, 1 - startOffset + i));
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dayNum = d.getUTCDate();
    const dayStr = String(dayNum).padStart(2, "0");
    cells.push({
      dateStr: `${y}-${m}-${dayStr}`,
      day: dayNum,
      inCurrentMonth: d.getUTCMonth() === monthIndex,
    });
  }

  return cells;
}

/** Get the Monday YYYY-MM-DD for the week containing `dateStr` */
export function getWeekStartMonday(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return formatUtcDateStr(date);
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return formatUtcDateStr(date);
}

export function formatUtcDateStr(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMilestonesOnDate(
  dateStr: string,
  milestones: Milestone[],
): Milestone[] {
  return milestones.filter(
    (ms) => dateStr >= ms.startDate && dateStr <= ms.endDate,
  );
}

export function filterAssignmentsByStream(
  assignments: Assignment[],
  streamFilter: StreamFilter,
): Assignment[] {
  if (streamFilter === "ALL") return assignments;
  return assignments.filter(
    (a) => a.stream === "BOTH" || a.stream === streamFilter,
  );
}

export function isAssignmentPast(
  assignment: Assignment,
  now: Date = new Date(),
): boolean {
  const due = madridDateTimeToUtc(assignment.dueDate, assignment.dueTime);
  return now > due;
}

export function getUpcomingAssignments(
  assignments: Assignment[],
  streamFilter: StreamFilter,
  withinDays: number = 14,
  now: Date = new Date(),
): Assignment[] {
  const cutoff = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
  return filterAssignmentsByStream(assignments, streamFilter)
    .filter((a) => {
      const due = madridDateTimeToUtc(a.dueDate, a.dueTime);
      return due >= now && due <= cutoff;
    })
    .sort((a, b) =>
      `${a.dueDate}T${a.dueTime}`.localeCompare(`${b.dueDate}T${b.dueTime}`),
    );
}

/** Extract the first HTTP(S) URL from free text (e.g. a pasted Teams link) */
export function extractFirstUrl(text: string): string | undefined {
  const match = text.match(/https?:\/\/[^\s<>()]+/i);
  if (!match) return undefined;
  return match[0].replace(/[.,;!?]+$/, "");
}

/** Validate a URL is safe http(s) */
export function sanitizeHttpUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function formatRelativeTime(iso: string, locale: Locale): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return locale === "es" ? "Ahora mismo" : "Just now";
  if (mins < 60) {
    return locale === "es" ? `hace ${mins} min` : `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return locale === "es" ? `hace ${hours} h` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 14) {
    return locale === "es" ? `hace ${days} d` : `${days}d ago`;
  }
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}
