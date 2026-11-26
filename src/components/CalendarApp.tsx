"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarPlus,
  Database,
  GraduationCap,
  Languages,
  ListTodo,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";
import { SESSIONS } from "@/data/sessions";
import type { StorageMode } from "@/lib/comments-store";
import { getTranslations } from "@/lib/i18n";
import { getMadridDateStr, getWeekStartMonday } from "@/lib/schedule";
import type {
  CalendarViewMode,
  ClassSession,
  Locale,
  SessionComment,
  StreamFilter,
} from "@/types/calendar";
import { AgendaView } from "./AgendaView";
import { MonthView } from "./MonthView";
import { NextClassHero } from "./NextClassHero";
import { SessionDrawer } from "./SessionDrawer";
import { StreamOnboardingModal } from "./StreamOnboardingModal";
import { SubscribeModal } from "./SubscribeModal";
import { UnitsView } from "./UnitsView";
import { WeekView } from "./WeekView";

const STREAM_STORAGE_KEY = "ue-ai-stream-pref";
const LOCALE_STORAGE_KEY = "ue-ai-locale";
const VIEW_STORAGE_KEY = "ue-ai-view-mode";
const ADMIN_SESSION_KEY = "ue-ai-admin-secret";

interface CalendarAppProps {
  initialComments: SessionComment[];
  storageMode?: StorageMode;
}

export function CalendarApp({
  initialComments,
  storageMode = "mock",
}: CalendarAppProps) {
  const todayStr = getMadridDateStr();
  const [todayY, todayM] = todayStr.split("-").map(Number);

  const [locale, setLocale] = useState<Locale>("es");
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("ALL");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Admin moderation state (stored only in sessionStorage for organizer convenience)
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminVerifying, setAdminVerifying] = useState(false);

  // Calendar navigation state
  const [monthYear, setMonthYear] = useState({
    year: todayY,
    monthIndex: todayM - 1,
  });
  const [weekStartMonday, setWeekStartMonday] = useState(() =>
    getWeekStartMonday(todayStr),
  );

  // Selected session drawer & comments state
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [comments, setComments] = useState<SessionComment[]>(initialComments);

  const t = getTranslations(locale);

  // Hydrate saved preferences (stream, locale, viewMode, admin session) + URL ?session= deep link
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale === "es" || savedLocale === "en") {
        setLocale(savedLocale);
      } else if (
        typeof navigator !== "undefined" &&
        navigator.language.toLowerCase().startsWith("en")
      ) {
        setLocale("en");
      }

      const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
      if (
        savedView === "week" ||
        savedView === "month" ||
        savedView === "agenda" ||
        savedView === "units"
      ) {
        setViewMode(savedView);
      }

      const savedAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (savedAdmin) {
        setAdminSecret(savedAdmin);
      }

      const savedStream = localStorage.getItem(STREAM_STORAGE_KEY);
      if (
        savedStream === "M11" ||
        savedStream === "M12" ||
        savedStream === "ALL"
      ) {
        setStreamFilter(savedStream);
      } else {
        setShowOnboarding(true);
      }
    } catch {
      // ignore storage issues
    }

    // Check URL ?session=<id> (e.g., tapped from a phone notification!)
    const params = new URLSearchParams(window.location.search);
    const deepSession = params.get("session");
    if (deepSession && SESSIONS.some((s) => s.id === deepSession)) {
      setSelectedSessionId(deepSession);
    }
  }, []);

  // Refresh comments from API on mount so client always has latest data
  useEffect(() => {
    let active = true;
    fetch("/api/comments")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { comments?: SessionComment[] } | null) => {
        if (active && data?.comments) {
          setComments(data.comments);
        }
      })
      .catch(() => {
        // fallback to initialComments
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectStream = useCallback((choice: StreamFilter) => {
    setStreamFilter(choice);
    setShowOnboarding(false);
    try {
      localStorage.setItem(STREAM_STORAGE_KEY, choice);
    } catch {
      // ignore
    }
  }, []);

  const handleSelectViewMode = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === "es" ? "en" : "es";
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleOpenSession = useCallback((session: ClassSession) => {
    setSelectedSessionId(session.id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("session", session.id);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, []);

  const handleCloseSession = useCallback(() => {
    setSelectedSessionId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("session");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, []);

  const handleOpenUnit = useCallback(
    (moduleId: string) => {
      handleCloseSession();
      setSelectedUnitId(moduleId);
      handleSelectViewMode("units");
    },
    [handleCloseSession, handleSelectViewMode],
  );

  const handleJumpToday = useCallback(() => {
    const nowStr = getMadridDateStr();
    const [y, m] = nowStr.split("-").map(Number);
    setMonthYear({ year: y, monthIndex: m - 1 });
    setWeekStartMonday(getWeekStartMonday(nowStr));
  }, []);

  const handleCommentCreated = useCallback((created: SessionComment) => {
    setComments((prev) => [created, ...prev]);
  }, []);

  const handleCommentUpdated = useCallback((updated: SessionComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }, []);

  const handleCommentDeleted = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  const handleUnlockAdmin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminError(null);
      const candidate = adminInput.trim();
      if (!candidate) return;
      setAdminVerifying(true);
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: candidate }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setAdminError(data.error || t.adminInvalidSecret);
          return;
        }
        setAdminSecret(candidate);
        setAdminInput("");
        setShowAdminModal(false);
        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, candidate);
        } catch {
          // ignore
        }
      } catch {
        setAdminError("Network error");
      } finally {
        setAdminVerifying(false);
      }
    },
    [adminInput, t.adminInvalidSecret],
  );

  const handleLockAdmin = useCallback(() => {
    setAdminSecret(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  const commentsBySession = useMemo(() => {
    const map: Record<string, SessionComment[]> = {};
    for (const c of comments) {
      if (!map[c.sessionId]) map[c.sessionId] = [];
      map[c.sessionId].push(c);
    }
    return map;
  }, [comments]);

  const selectedSession = useMemo(
    () => SESSIONS.find((s) => s.id === selectedSessionId) ?? null,
    [selectedSessionId],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                {t.appTitle}
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Stream Switcher + ICS + Language Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Stream Switcher */}
            <div
              className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs"
              role="group"
              aria-label={t.streamLabel}
            >
              {(["M11", "M12", "ALL"] as StreamFilter[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectStream(opt)}
                  className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${
                    streamFilter === opt
                      ? opt === "M11"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : opt === "M12"
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt === "ALL" ? t.streamAll : opt}
                </button>
              ))}
            </div>

            {/* Subscribe .ics button */}
            <button
              type="button"
              onClick={() => setShowSubscribe(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">{t.subscribeIcs}</span>
              <span className="sm:hidden">.ics</span>
            </button>

            {/* Bilingual ES/EN Toggle */}
            <button
              type="button"
              onClick={handleToggleLocale}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              title="Switch language / Cambiar idioma"
            >
              <Languages className="h-3.5 w-3.5 text-slate-500" />
              <span>{locale.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        {/* Today / Up Next Hero */}
        <NextClassHero
          sessions={SESSIONS}
          commentsBySession={commentsBySession}
          streamFilter={streamFilter}
          locale={locale}
          onOpenSession={handleOpenSession}
        />

        {/* View Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleSelectViewMode("week")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === "week"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              {t.viewWeek}
            </button>
            <button
              type="button"
              onClick={() => handleSelectViewMode("month")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === "month"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              {t.viewMonth}
            </button>
            <button
              type="button"
              onClick={() => handleSelectViewMode("agenda")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === "agenda"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ListTodo className="h-4 w-4" />
              {t.viewAgenda}
            </button>
            <button
              type="button"
              onClick={() => handleSelectViewMode("units")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === "units"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              {t.viewUnits}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {SESSIONS.length} {t.sessionsCount} · Nov 2026 – Jun 2027 (
            {t.heroMadridTime})
          </p>
        </div>

        {/* Active View */}
        {viewMode === "month" && (
          <MonthView
            year={monthYear.year}
            monthIndex={monthYear.monthIndex}
            sessions={SESSIONS}
            commentsBySession={commentsBySession}
            streamFilter={streamFilter}
            locale={locale}
            onChangeMonth={(y, m) => setMonthYear({ year: y, monthIndex: m })}
            onJumpToday={handleJumpToday}
            onOpenSession={handleOpenSession}
          />
        )}

        {viewMode === "week" && (
          <WeekView
            weekStartMonday={weekStartMonday}
            sessions={SESSIONS}
            commentsBySession={commentsBySession}
            streamFilter={streamFilter}
            locale={locale}
            onChangeWeek={setWeekStartMonday}
            onJumpToday={handleJumpToday}
            onOpenSession={handleOpenSession}
          />
        )}

        {viewMode === "agenda" && (
          <AgendaView
            sessions={SESSIONS}
            commentsBySession={commentsBySession}
            streamFilter={streamFilter}
            locale={locale}
            onOpenSession={handleOpenSession}
          />
        )}

        {viewMode === "units" && (
          <UnitsView
            sessions={SESSIONS}
            commentsBySession={commentsBySession}
            streamFilter={streamFilter}
            locale={locale}
            initialModuleId={selectedUnitId}
            onOpenSession={handleOpenSession}
          />
        )}
      </main>

      {/* Subtle Footer: Storage Mode (in dev mock) + Discreet Organizer Admin Toggle */}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 pb-8 pt-2 text-[11px] text-slate-400 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span>{t.appSubtitle}</span>
          {storageMode === "mock" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
              <Database className="h-3 w-3" />
              {t.mockModeNotice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {adminSecret ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                {t.adminActive}
              </span>
              <button
                type="button"
                onClick={handleLockAdmin}
                className="rounded-md px-1.5 py-0.5 font-medium text-slate-500 underline hover:text-slate-800"
              >
                {t.adminLockBtn}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAdminError(null);
                setShowAdminModal(true);
              }}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title={t.adminUnlockTitle}
            >
              <Lock className="h-3 w-3" />
              <span>{t.adminMode}</span>
            </button>
          )}
        </div>
      </footer>

      {/* Modals & Drawer */}
      {showOnboarding && (
        <StreamOnboardingModal locale={locale} onSelect={handleSelectStream} />
      )}

      {showSubscribe && (
        <SubscribeModal
          locale={locale}
          defaultStream={streamFilter === "M12" ? "M12" : "M11"}
          onClose={() => setShowSubscribe(false)}
        />
      )}

      {showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.adminUnlockTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={t.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{t.adminUnlockHint}</p>

            <form onSubmit={handleUnlockAdmin} className="mt-4 space-y-3">
              <input
                type="password"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                placeholder={t.adminSecretPlaceholder}
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
              {adminError && (
                <p className="text-xs font-medium text-rose-600">
                  {adminError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={adminVerifying}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {t.adminUnlockBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSession && (
        <SessionDrawer
          session={selectedSession}
          comments={commentsBySession[selectedSession.id] ?? []}
          streamFilter={streamFilter}
          locale={locale}
          adminSecret={adminSecret}
          onClose={handleCloseSession}
          onOpenUnit={handleOpenUnit}
          onCommentCreated={handleCommentCreated}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </div>
  );
}
