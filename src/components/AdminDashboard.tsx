"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownUp,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Database,
  ExternalLink,
  Flag,
  Languages,
  Link2,
  Lock,
  LogOut,
  MessageSquare,
  Pin,
  RefreshCw,
  Search,
  ShieldCheck,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { getModule, getModuleShortName, MODULE_COLORS } from "@/data/modules";
import { SESSIONS } from "@/data/sessions";
import type { AdminModerationData, AdminReportItem } from "@/lib/comments-store";
import { getTranslations } from "@/lib/i18n";
import { formatDateHeading, formatRelativeTime } from "@/lib/schedule";
import type { Locale, SessionComment } from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

const ADMIN_SESSION_KEY = "ue-ai-admin-secret";
const LOCALE_STORAGE_KEY = "ue-ai-locale";

type AdminTab = "reports" | "comments";
type CommentFilter =
  | "all"
  | "reported"
  | "hidden"
  | "pinned"
  | "links"
  | "M11"
  | "M12";

function formatExactDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function AdminDashboard() {
  const [locale, setLocale] = useState<Locale>("es");
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const [data, setData] = useState<AdminModerationData | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("comments");
  const [initializedTab, setInitializedTab] = useState(false);

  // Filters & sorting for Comments tab
  const [searchQuery, setSearchQuery] = useState("");
  const [commentFilter, setCommentFilter] = useState<CommentFilter>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Per-item action state
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const t = getTranslations(locale);

  const sessionsById = useMemo(
    () => Object.fromEntries(SESSIONS.map((s) => [s.id, s])),
    [],
  );

  const loadModerationData = useCallback(
    async (secret: string, autoPickTab = false) => {
      setLoading(true);
      setAuthError(null);
      try {
        const res = await fetch("/api/admin/moderation", {
          headers: { "x-admin-secret": secret },
          cache: "no-store",
        });
        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          if (res.status === 401) {
            try {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
            } catch {
              // ignore
            }
            setAdminSecret(null);
            setData(null);
          }
          setAuthError(errBody.error || t.adminInvalidSecret);
          return false;
        }
        const json = (await res.json()) as AdminModerationData;
        setData(json);
        setAdminSecret(secret);
        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, secret);
        } catch {
          // ignore
        }
        if (autoPickTab) {
          setActiveTab(json.reports.length > 0 ? "reports" : "comments");
          setInitializedTab(true);
        }
        return true;
      } catch {
        setAuthError(
          locale === "es" ? "Error de red al conectar." : "Network error.",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [locale, t.adminInvalidSecret],
  );

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

      const savedSecret = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (savedSecret) {
        void loadModerationData(savedSecret, true).finally(() =>
          setHydrating(false),
        );
        return;
      }
    } catch {
      // ignore
    }
    setHydrating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleToggleLocale() {
    setLocale((prev) => {
      const next: Locale = prev === "es" ? "en" : "es";
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const candidate = secretInput.trim();
    if (!candidate) return;
    const ok = await loadModerationData(candidate, !initializedTab);
    if (ok) setSecretInput("");
  }

  function handleSignOut() {
    setAdminSecret(null);
    setData(null);
    setConfirmDeleteId(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  async function handlePin(comment: SessionComment) {
    if (!adminSecret) return;
    setBusyId(comment.id);
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(comment.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ isPinned: !comment.isPinned }),
      });
      if (res.ok) {
        const json = (await res.json()) as { comment: SessionComment };
        setData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((c) =>
                  c.id === json.comment.id ? json.comment : c,
                ),
              }
            : prev,
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleClearReports(commentId: string) {
    if (!adminSecret) return;
    setBusyId(commentId);
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ clearReports: true }),
      });
      if (res.ok) {
        const json = (await res.json()) as { comment: SessionComment };
        setData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((c) =>
                  c.id === json.comment.id ? json.comment : c,
                ),
                reports: prev.reports.filter((r) => r.commentId !== commentId),
              }
            : prev,
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(commentId: string) {
    if (!adminSecret) return;
    setBusyId(commentId);
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        setData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.filter((c) => c.id !== commentId),
                reports: prev.reports.filter((r) => r.commentId !== commentId),
              }
            : prev,
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  const commentsById = useMemo(() => {
    const map: Record<string, SessionComment> = {};
    for (const c of data?.comments ?? []) map[c.id] = c;
    return map;
  }, [data]);

  const reportsByCommentId = useMemo(() => {
    const map: Record<string, AdminReportItem[]> = {};
    for (const r of data?.reports ?? []) {
      if (!map[r.commentId]) map[r.commentId] = [];
      map[r.commentId].push(r);
    }
    return map;
  }, [data]);

  const stats = useMemo(() => {
    const comments = data?.comments ?? [];
    const reports = data?.reports ?? [];
    return {
      totalComments: comments.length,
      totalReports: reports.length,
      reportedComments: comments.filter((c) => c.reportCount > 0).length,
      hiddenComments: comments.filter((c) => c.reportCount >= 3).length,
      pinnedComments: comments.filter((c) => c.isPinned).length,
    };
  }, [data]);

  const filteredComments = useMemo(() => {
    const list = data?.comments ?? [];
    const q = searchQuery.trim().toLowerCase();

    const matched = list.filter((c) => {
      if (commentFilter === "reported" && c.reportCount === 0) return false;
      if (commentFilter === "hidden" && c.reportCount < 3) return false;
      if (commentFilter === "pinned" && !c.isPinned) return false;
      if (commentFilter === "links" && !c.sharedUrl) return false;
      if (
        (commentFilter === "M11" || commentFilter === "M12") &&
        c.stream !== commentFilter &&
        c.stream !== "BOTH"
      ) {
        return false;
      }

      if (!q) return true;
      const session = sessionsById[c.sessionId];
      const mod = session ? getModule(session.moduleId) : null;
      const haystack = [
        c.authorName,
        c.body,
        c.sharedUrl ?? "",
        c.sessionId,
        session?.date ?? "",
        mod?.shortName ?? "",
        mod?.shortNameEn ?? "",
        mod?.code ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return [...matched].sort((a, b) =>
      sortOrder === "newest"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  }, [data, commentFilter, searchQuery, sortOrder, sessionsById]);

  function renderSessionTag(sessionId: string) {
    const session = sessionsById[sessionId];
    if (!session) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          <Calendar className="h-3 w-3" />
          {sessionId}
        </span>
      );
    }
    const mod = getModule(session.moduleId);
    const colors = MODULE_COLORS[mod.color];
    return (
      <Link
        href={`/?session=${encodeURIComponent(session.id)}`}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold transition hover:opacity-85 ${colors.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
        <span>
          {formatDateHeading(session.date, locale, {
            day: "numeric",
            month: "short",
          })}{" "}
          · {getModuleShortName(mod, locale)}
        </span>
        <ExternalLink className="h-2.5 w-2.5 opacity-70" />
      </Link>
    );
  }

  function renderModerationButtons(comment: SessionComment) {
    const isBusy = busyId === comment.id;
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => handlePin(comment)}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
            comment.isPinned
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Pin className="h-3.5 w-3.5" />
          <span>{comment.isPinned ? t.adminUnpin : t.adminPin}</span>
        </button>

        {comment.reportCount > 0 && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleClearReports(comment.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t.adminClearReports}</span>
          </button>
        )}

        {confirmDeleteId === comment.id ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handleDelete(comment.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.adminConfirmDelete}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setConfirmDeleteId(comment.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.adminDelete}</span>
          </button>
        )}
      </div>
    );
  }

  // ===================== AUTH GATE =====================
  if (hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>{locale === "es" ? "Cargando..." : "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (!adminSecret || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-slate-900">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  {t.adminUnlockTitle}
                </h1>
                <p className="text-[11px] text-slate-500">
                  UE Master&apos;s in AI · Admin
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleLocale}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
            >
              <Languages className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            {t.adminUnlockHint}
          </p>

          <form onSubmit={handleSignIn} className="mt-4 space-y-3">
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder={t.adminSecretPlaceholder}
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
            />

            {authError && (
              <p className="text-xs font-medium text-rose-600">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t.adminUnlockBtn}</span>
            </button>
          </form>

          <div className="mt-4 border-t border-slate-100 pt-3 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>
                {locale === "es"
                  ? "Volver al calendario"
                  : "Back to calendar"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===================== MODERATION DASHBOARD =====================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {locale === "es" ? "Calendario" : "Calendar"}
              </span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                  {locale === "es"
                    ? "Panel de Moderación"
                    : "Moderation Dashboard"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                    data.storageMode === "neon"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  <Database className="h-2.5 w-2.5" />
                  {data.storageMode === "neon" ? "Neon Postgres" : "Dev Mock"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => void loadModerationData(adminSecret, false)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {locale === "es" ? "Actualizar" : "Refresh"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleLocale}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Languages className="h-3.5 w-3.5 text-slate-500" />
              <span>{locale.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.adminLockBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`rounded-2xl border p-3.5 text-left transition ${
              stats.totalReports > 0
                ? "border-rose-200 bg-rose-50/70 hover:bg-rose-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {locale === "es" ? "Reportes activos" : "Open reports"}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                stats.totalReports > 0 ? "text-rose-700" : "text-slate-900"
              }`}
            >
              {stats.totalReports}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("comments");
              setCommentFilter("all");
            }}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:bg-slate-50"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {locale === "es" ? "Total comentarios" : "Total comments"}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalComments}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("comments");
              setCommentFilter("hidden");
            }}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:bg-slate-50"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {locale === "es" ? "Ocultos (≥3)" : "Auto-hidden (≥3)"}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                stats.hiddenComments > 0 ? "text-amber-700" : "text-slate-900"
              }`}
            >
              {stats.hiddenComments}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("comments");
              setCommentFilter("pinned");
            }}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:bg-slate-50"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {locale === "es" ? "Fijados" : "Pinned"}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.pinnedComments}
            </p>
          </button>
        </div>

        {/* Main View Switcher: Reports Queue vs All Comments */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                activeTab === "reports"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Flag className="h-4 w-4" />
              <span>
                {locale === "es" ? "Cola de reportes" : "Reports Queue"}
              </span>
              {stats.totalReports > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                    activeTab === "reports"
                      ? "bg-rose-500 text-white"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {stats.totalReports}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("comments")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                activeTab === "comments"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>
                {locale === "es"
                  ? "Todos los comentarios"
                  : "All Comments"}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
                  activeTab === "comments"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {stats.totalComments}
              </span>
            </button>
          </div>
        </div>

        {/* ===================== TAB 1: REPORTS TRIAGE QUEUE ===================== */}
        {activeTab === "reports" && (
          <section className="space-y-3">
            {data.reports.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {locale === "es"
                    ? "Todo limpio — no hay reportes pendientes"
                    : "All clear — no pending reports"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {locale === "es"
                    ? "Cuando un alumno reporte un comentario, aparecerá aquí al instante."
                    : "Whenever a student flags a comment, it will appear here immediately."}
                </p>
              </div>
            ) : (
              data.reports.map((rep) => {
                const comment = commentsById[rep.commentId];
                const reasonLabel =
                  t.reportReasons[rep.reason] ?? rep.reason;

                return (
                  <div
                    key={rep.id}
                    className="rounded-2xl border border-rose-200 bg-white p-4 shadow-xs"
                  >
                    {/* Report Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {reasonLabel}
                        </span>
                        {comment && comment.reportCount >= 3 && (
                          <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">
                            {t.adminHiddenBanner.replace(
                              "{n}",
                              String(comment.reportCount),
                            )}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatExactDateTime(rep.createdAt, locale)} ·{" "}
                        {formatRelativeTime(rep.createdAt, locale)}
                      </span>
                    </div>

                    {rep.details && (
                      <p className="mt-2 rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2 text-xs text-rose-900">
                        <span className="font-bold">
                          {locale === "es" ? "Detalle: " : "Details: "}
                        </span>
                        {rep.details}
                      </p>
                    )}

                    {/* Target Comment Preview */}
                    {comment ? (
                      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {renderSessionTag(comment.sessionId)}
                            <span className="text-xs font-bold text-slate-900">
                              {comment.authorName}
                            </span>
                            <StreamBadge
                              stream={comment.stream}
                              locale={locale}
                            />
                            {comment.isPinned && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                <Pin className="h-2.5 w-2.5" />
                                {t.pinnedBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {formatExactDateTime(comment.createdAt, locale)}
                          </span>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                          {comment.body}
                        </p>

                        {comment.sharedUrl && (
                          <a
                            href={comment.sharedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                          >
                            <Link2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {comment.sharedUrl}
                            </span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        )}

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2.5">
                          <span className="text-xs font-medium text-slate-500">
                            {comment.reportCount}x{" "}
                            {locale === "es" ? "reportado" : "reported"} ·{" "}
                            {comment.upvotes}{" "}
                            {locale === "es" ? "votos" : "upvotes"}
                          </span>
                          {renderModerationButtons(comment)}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400">
                        {locale === "es"
                          ? "Comentario ya eliminado."
                          : "Comment already deleted."}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* ===================== TAB 2: ALL COMMENTS CHRONOLOGICAL ===================== */}
        {activeTab === "comments" && (
          <section className="space-y-3">
            {/* Search + Filters + Chronological Sort Toggle */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    locale === "es"
                      ? "Buscar por autor, texto, enlace o asignatura..."
                      : "Search by author, message, link, or unit..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "newest" ? "oldest" : "newest",
                  )
                }
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowDownUp className="h-3.5 w-3.5 text-slate-500" />
                <span>
                  {sortOrder === "newest"
                    ? locale === "es"
                      ? "Más recientes primero"
                      : "Newest first"
                    : locale === "es"
                      ? "Más antiguos primero"
                      : "Oldest first"}
                </span>
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  {
                    id: "all",
                    label: locale === "es" ? "Todos" : "All",
                  },
                  {
                    id: "reported",
                    label: locale === "es" ? "Reportados" : "Reported",
                  },
                  {
                    id: "hidden",
                    label: locale === "es" ? "Ocultos" : "Hidden",
                  },
                  {
                    id: "pinned",
                    label: locale === "es" ? "Fijados" : "Pinned",
                  },
                  {
                    id: "links",
                    label: locale === "es" ? "Con enlace" : "With link",
                  },
                  { id: "M11", label: "M11" },
                  { id: "M12", label: "M12" },
                ] as { id: CommentFilter; label: string }[]
              ).map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setCommentFilter(chip.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    commentFilter === chip.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                {locale === "es"
                  ? "No hay comentarios que coincidan con este filtro."
                  : "No comments match this filter."}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredComments.map((comment) => {
                  const itemReports = reportsByCommentId[comment.id] ?? [];
                  return (
                    <div
                      key={comment.id}
                      className={`rounded-2xl border p-4 shadow-xs transition ${
                        comment.reportCount >= 3
                          ? "border-rose-300 bg-rose-50/40"
                          : comment.reportCount > 0
                            ? "border-amber-200 bg-amber-50/30"
                            : comment.isPinned
                              ? "border-amber-200 bg-amber-50/20"
                              : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {renderSessionTag(comment.sessionId)}
                          <span className="text-xs font-bold text-slate-900">
                            {comment.authorName}
                          </span>
                          <StreamBadge
                            stream={comment.stream}
                            locale={locale}
                          />
                          {comment.isPinned && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                              <Pin className="h-2.5 w-2.5" />
                              {t.pinnedBadge}
                            </span>
                          )}
                          {comment.reportCount > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                              <Flag className="h-2.5 w-2.5" />
                              {comment.reportCount}x
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatExactDateTime(comment.createdAt, locale)} ·{" "}
                          {formatRelativeTime(comment.createdAt, locale)}
                        </span>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                        {comment.body}
                      </p>

                      {comment.sharedUrl && (
                        <a
                          href={comment.sharedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                        >
                          <Link2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{comment.sharedUrl}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}

                      {itemReports.length > 0 && (
                        <div className="mt-2.5 space-y-1 rounded-xl border border-rose-200/80 bg-rose-50/70 p-2.5">
                          <p className="text-[11px] font-bold text-rose-900">
                            {locale === "es"
                              ? `Reportes (${itemReports.length}):`
                              : `Reports (${itemReports.length}):`}
                          </p>
                          {itemReports.map((r) => (
                            <div
                              key={r.id}
                              className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-rose-800"
                            >
                              <span>
                                <strong className="font-semibold">
                                  {t.reportReasons[r.reason] ?? r.reason}
                                </strong>
                                {r.details ? ` — ${r.details}` : ""}
                              </span>
                              <span className="text-[10px] text-rose-600/80">
                                {formatExactDateTime(r.createdAt, locale)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                          <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                          {comment.upvotes}
                        </span>
                        {renderModerationButtons(comment)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
