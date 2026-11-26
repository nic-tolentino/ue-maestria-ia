"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Flag,
  Link2,
  Pin,
  Send,
  ShieldCheck,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import { formatRelativeTime } from "@/lib/schedule";
import type {
  CommentStream,
  Locale,
  ReportReason,
  SessionComment,
  StreamFilter,
} from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

const NAME_STORAGE_KEY = "ue-ai-author-name";
const UPVOTES_STORAGE_KEY = "ue-ai-upvoted-ids";
const REPORTED_STORAGE_KEY = "ue-ai-reported-ids";

interface CommentThreadProps {
  sessionId: string;
  comments: SessionComment[];
  preferredStream: StreamFilter;
  locale: Locale;
  adminSecret?: string | null;
  onCommentCreated: (comment: SessionComment) => void;
  onCommentUpdated: (comment: SessionComment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

export function CommentThread({
  sessionId,
  comments,
  preferredStream,
  locale,
  adminSecret,
  onCommentCreated,
  onCommentUpdated,
  onCommentDeleted,
}: CommentThreadProps) {
  const t = getTranslations(locale);
  const isAdmin = Boolean(adminSecret);

  const defaultPostStream: CommentStream =
    preferredStream === "ALL" ? "BOTH" : preferredStream;

  const [authorName, setAuthorName] = useState("");
  const [postStream, setPostStream] =
    useState<CommentStream>(defaultPostStream);
  const [body, setBody] = useState("");
  const [sharedUrl, setSharedUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter & sort state
  const [streamTab, setStreamTab] = useState<"ALL" | "M11" | "M12">("ALL");
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");

  // Local upvote / report tracking
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Inline report panel state
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>("wrong_link");
  const [reportDetails, setReportDetails] = useState("");
  const [reportToast, setReportToast] = useState<string | null>(null);

  // Admin moderation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [adminBusyId, setAdminBusyId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem(NAME_STORAGE_KEY);
      if (savedName) setAuthorName(savedName);
      const savedVotes = JSON.parse(
        localStorage.getItem(UPVOTES_STORAGE_KEY) || "[]",
      ) as string[];
      if (Array.isArray(savedVotes)) setUpvotedIds(new Set(savedVotes));
      const savedReports = JSON.parse(
        localStorage.getItem(REPORTED_STORAGE_KEY) || "[]",
      ) as string[];
      if (Array.isArray(savedReports)) setReportedIds(new Set(savedReports));
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    setPostStream(preferredStream === "ALL" ? "BOTH" : preferredStream);
  }, [preferredStream]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedName = authorName.trim();
    const trimmedBody = body.trim();
    const trimmedUrl = sharedUrl.trim();

    if (!trimmedName) {
      setFormError(t.formErrorName);
      return;
    }
    if (!trimmedBody && !trimmedUrl) {
      setFormError(t.formErrorBody);
      return;
    }

    setSubmitting(true);
    try {
      localStorage.setItem(NAME_STORAGE_KEY, trimmedName);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          authorName: trimmedName,
          stream: postStream,
          body: trimmedBody,
          sharedUrl: trimmedUrl || undefined,
          website: website || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setFormError(data.error || "Error posting comment");
        return;
      }
      const data = (await res.json()) as { comment?: SessionComment };
      if (data.comment) {
        onCommentCreated(data.comment);
      }
      setBody("");
      setSharedUrl("");
    } catch {
      setFormError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleVote(comment: SessionComment) {
    const already = upvotedIds.has(comment.id);
    const delta: 1 | -1 = already ? -1 : 1;

    // Optimistic local state
    const nextVotes = new Set(upvotedIds);
    if (already) nextVotes.delete(comment.id);
    else nextVotes.add(comment.id);
    setUpvotedIds(nextVotes);
    try {
      localStorage.setItem(
        UPVOTES_STORAGE_KEY,
        JSON.stringify(Array.from(nextVotes)),
      );
    } catch {
      // ignore
    }

    onCommentUpdated({
      ...comment,
      upvotes: Math.max(0, comment.upvotes + delta),
    });

    try {
      const res = await fetch(`/api/comments/${comment.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) {
        const data = (await res.json()) as { comment: SessionComment };
        onCommentUpdated(data.comment);
      }
    } catch {
      // keep optimistic value
    }
  }

  async function handleSubmitReport(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { comment: SessionComment };
        onCommentUpdated(data.comment);
        const nextReported = new Set(reportedIds);
        nextReported.add(commentId);
        setReportedIds(nextReported);
        try {
          localStorage.setItem(
            REPORTED_STORAGE_KEY,
            JSON.stringify(Array.from(nextReported)),
          );
        } catch {
          // ignore
        }
        setReportingId(null);
        setReportDetails("");
        setReportToast(t.reportSuccess);
        setTimeout(() => setReportToast(null), 3500);
      }
    } catch {
      // ignore
    }
  }

  async function handleAdminPin(comment: SessionComment) {
    if (!adminSecret) return;
    setAdminBusyId(comment.id);
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
        const data = (await res.json()) as { comment: SessionComment };
        onCommentUpdated(data.comment);
      }
    } finally {
      setAdminBusyId(null);
    }
  }

  async function handleAdminClearReports(comment: SessionComment) {
    if (!adminSecret) return;
    setAdminBusyId(comment.id);
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(comment.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ clearReports: true }),
      });
      if (res.ok) {
        const data = (await res.json()) as { comment: SessionComment };
        onCommentUpdated(data.comment);
      }
    } finally {
      setAdminBusyId(null);
    }
  }

  async function handleAdminDelete(commentId: string) {
    if (!adminSecret) return;
    setAdminBusyId(commentId);
    try {
      const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        onCommentDeleted?.(commentId);
      }
    } finally {
      setAdminBusyId(null);
    }
  }

  const filtered = comments.filter((c) => {
    if (streamTab === "ALL") return true;
    return c.stream === streamTab || c.stream === "BOTH";
  });

  const sorted = [...filtered].sort((a, b) => {
    // Pinned always first
    if ((a.isPinned ? 1 : 0) !== (b.isPinned ? 1 : 0)) {
      return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
    }
    if (sortBy === "top") {
      if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

  const reasonKeys: ReportReason[] = [
    "wrong_link",
    "spam",
    "outdated",
    "inappropriate",
    "other",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-900">{t.commentsTitle}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{t.commentsSubtitle}</p>
      </div>

      {/* Report confirmation toast */}
      {reportToast && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{reportToast}</span>
        </div>
      )}

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
          {(["ALL", "M11", "M12"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStreamTab(tab)}
              className={`rounded-md px-2.5 py-1 font-semibold transition ${
                streamTab === tab
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab === "ALL" ? t.commentsFilterAll : tab}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setSortBy("top")}
            className={`rounded-md px-2.5 py-1 font-semibold transition ${
              sortBy === "top"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.sortTop}
          </button>
          <button
            type="button"
            onClick={() => setSortBy("newest")}
            className={`rounded-md px-2.5 py-1 font-semibold transition ${
              sortBy === "newest"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.sortNewest}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2.5">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center text-xs text-slate-500">
            {t.noCommentsYet}
          </div>
        ) : (
          sorted.map((comment) => {
            const isHidden =
              !isAdmin &&
              comment.reportCount >= 3 &&
              !revealedIds.has(comment.id);
            const hasUpvoted = upvotedIds.has(comment.id);
            const hasReported = reportedIds.has(comment.id);
            const isBusy = adminBusyId === comment.id;

            if (isHidden) {
              return (
                <div
                  key={comment.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500"
                >
                  <span>{t.hiddenDueToReports}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = new Set(revealedIds);
                      next.add(comment.id);
                      setRevealedIds(next);
                    }}
                    className="font-semibold text-slate-700 underline hover:text-slate-900"
                  >
                    {t.showAnyway}
                  </button>
                </div>
              );
            }

            return (
              <div
                key={comment.id}
                className={`rounded-xl border p-3.5 transition ${
                  isAdmin && comment.reportCount >= 3
                    ? "border-rose-300 bg-rose-50/40"
                    : comment.isPinned
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-slate-200 bg-white"
                }`}
              >
                {isAdmin && comment.reportCount > 0 && (
                  <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-rose-100/80 px-2.5 py-1 text-[11px] font-semibold text-rose-800">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      {comment.reportCount >= 3
                        ? t.adminHiddenBanner.replace(
                            "{n}",
                            String(comment.reportCount),
                          )
                        : `${t.reportedBadge} (${comment.reportCount}x)`}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {comment.authorName}
                    </span>
                    <StreamBadge stream={comment.stream} locale={locale} />
                    {comment.isPinned && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                        <Pin className="h-2.5 w-2.5" />
                        {t.pinnedBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatRelativeTime(comment.createdAt, locale)}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {comment.body}
                </p>

                {comment.sharedUrl && (
                  <a
                    href={comment.sharedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                      <span className="truncate">{comment.sharedUrl}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1">
                      {t.openLink}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </a>
                )}

                {/* Actions: Upvote + Report + Admin Moderation */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVote(comment)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                      hasUpvoted
                        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{comment.upvotes}</span>
                    <span className="hidden sm:inline">{t.upvoteLabel}</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleAdminPin(comment)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition disabled:opacity-50 ${
                            comment.isPinned
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Pin className="h-3 w-3" />
                          <span>
                            {comment.isPinned ? t.adminUnpin : t.adminPin}
                          </span>
                        </button>

                        {comment.reportCount > 0 && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleAdminClearReports(comment)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            <span>{t.adminClearReports}</span>
                          </button>
                        )}

                        {confirmDeleteId === comment.id ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleAdminDelete(comment.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{t.adminConfirmDelete}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setConfirmDeleteId(comment.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{t.adminDelete}</span>
                          </button>
                        )}
                      </>
                    )}

                    {hasReported ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <Flag className="h-3 w-3" />
                        {t.reportedBadge}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setReportingId(
                            reportingId === comment.id ? null : comment.id,
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Flag className="h-3 w-3" />
                        <span>{t.reportLabel}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Report Form */}
                {reportingId === comment.id && (
                  <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50/60 p-3">
                    <p className="text-xs font-bold text-rose-900">
                      {t.reportModalTitle}
                    </p>
                    <p className="mt-0.5 text-[11px] text-rose-700">
                      {t.reportModalDesc}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {reasonKeys.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setReportReason(reason)}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                            reportReason === reason
                              ? "border-rose-500 bg-rose-600 text-white"
                              : "border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
                          }`}
                        >
                          {t.reportReasons[reason]}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder={t.reportDetailsPlaceholder}
                      className="mt-2 w-full rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-rose-400 focus:outline-none"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReportingId(null)}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitReport(comment.id)}
                        className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        {t.reportSubmit}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Post New Comment Form (Name-only, low barrier) */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5"
      >
        {/* Invisible honeypot trap for automated spam bots */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
              {t.formYourName} *
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t.formNamePlaceholder}
              maxLength={60}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-600">
              {t.formYourGroup}
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(["M11", "M12", "BOTH"] as CommentStream[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setPostStream(st)}
                  className={`rounded-md py-1 text-xs font-semibold transition ${
                    postStream === st
                      ? st === "M11"
                        ? "bg-indigo-600 text-white"
                        : st === "M12"
                          ? "bg-teal-600 text-white"
                          : "bg-slate-800 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {st === "BOTH" ? t.streamAll : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            {t.formMessage}
          </label>
          <textarea
            rows={2}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.formMessagePlaceholder}
            maxLength={1500}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            {t.formUrlOptional}
          </label>
          <input
            type="url"
            value={sharedUrl}
            onChange={(e) => setSharedUrl(e.target.value)}
            placeholder={t.formUrlPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>

        {formError && (
          <p className="text-xs font-medium text-rose-600">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{submitting ? t.formSubmitting : t.formSubmit}</span>
        </button>
      </form>
    </div>
  );
}
