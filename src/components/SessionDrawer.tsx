"use client";

import { useEffect } from "react";
import {
  Calendar,
  Clock,
  ExternalLink,
  Info,
  Link2Off,
  PlayCircle,
  User,
  X,
} from "lucide-react";
import { getModule, MODULE_COLORS } from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  formatDateHeading,
  formatLocalTimeRange,
  isDifferentFromMadridTz,
  resolveMeetingLink,
  resolveRecordings,
} from "@/lib/schedule";
import type {
  ClassSession,
  Locale,
  SessionComment,
  Stream,
  StreamFilter,
} from "@/types/calendar";
import { CommentThread } from "./CommentThread";
import { StreamBadge } from "./StreamBadge";

interface SessionDrawerProps {
  session: ClassSession;
  comments: SessionComment[];
  streamFilter: StreamFilter;
  locale: Locale;
  onClose: () => void;
  onOpenUnit?: (moduleId: string) => void;
  onCommentCreated: (comment: SessionComment) => void;
  onCommentUpdated: (comment: SessionComment) => void;
}

export function SessionDrawer({
  session,
  comments,
  streamFilter,
  locale,
  onClose,
  onOpenUnit,
  onCommentCreated,
  onCommentUpdated,
}: SessionDrawerProps) {
  const t = getTranslations(locale);
  const mod = getModule(session.moduleId);
  const colors = MODULE_COLORS[mod.color];
  const showLocalTz = isDifferentFromMadridTz();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const title =
    locale === "en"
      ? session.titleEn || session.title || mod.nameEn || mod.name
      : session.title || mod.name;

  const moduleDescription =
    locale === "en" ? mod.descriptionEn : mod.descriptionEs;
  const sessionNotes = locale === "en" ? session.notesEn : session.notesEs;

  // Put the student's chosen stream first, while still showing both M11 and M12 link cards
  const orderedStreams: Stream[] =
    streamFilter === "M12" ? ["M12", "M11"] : ["M11", "M12"];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {mod.id !== "tbd" && onOpenUnit ? (
                <button
                  type="button"
                  onClick={() => onOpenUnit(mod.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition hover:opacity-80 ${colors.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  {mod.code}
                </button>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  {mod.code}
                </span>
              )}
              {mod.canvasUrl && (
                <a
                  href={mod.canvasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <span>Canvas</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {session.status === "cancelled" && (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  {t.statusCancelled}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900">
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {locale === "en" && mod.nameEn ? mod.nameEn : mod.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {/* Date & Time */}
          <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{formatDateHeading(session.date, locale)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>
                {session.startTime}–{session.endTime}{" "}
                <span className="text-xs text-slate-400">
                  ({t.heroMadridTime})
                </span>
              </span>
            </div>
            {showLocalTz && (
              <div className="w-full text-xs font-medium text-indigo-700">
                {t.heroYourTime}: {formatLocalTimeRange(session)}
              </div>
            )}
          </div>

          {/* Meeting & Recording Links per Stream (M11 & M12) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {orderedStreams.map((stream) => {
              const link = resolveMeetingLink(session, stream, comments);
              const recordings = resolveRecordings(session, stream);
              const isPreferred = streamFilter === stream;
              const professor = mod.professors?.[stream];

              return (
                <div
                  key={stream}
                  className={`rounded-xl border p-3.5 ${
                    isPreferred
                      ? stream === "M11"
                        ? "border-indigo-300 bg-indigo-50/40 ring-1 ring-indigo-200"
                        : "border-teal-300 bg-teal-50/40 ring-1 ring-teal-200"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <StreamBadge stream={stream} locale={locale} size="sm" />
                    {professor && (
                      <span className="inline-flex items-center gap-1 truncate text-[11px] text-slate-500">
                        <User className="h-3 w-3" />
                        {professor}
                      </span>
                    )}
                  </div>

                  {link ? (
                    <div className="mt-2.5">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                          stream === "M11"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-teal-600 hover:bg-teal-700"
                        }`}
                      >
                        <span>
                          {t.heroJoinTeams} ({stream})
                        </span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        {link.source === "session" && t.linkSourceSession}
                        {link.source === "recurring" && t.linkSourceRecurring}
                        {link.source === "student" &&
                          `${t.linkSourceStudent} ${link.sharedBy}`}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      <Link2Off className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{t.heroLinkPending}</span>
                    </div>
                  )}

                  {recordings.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {recordings.map((rec, idx) => {
                        const partLabel =
                          locale === "en"
                            ? rec.labelEn || rec.labelEs
                            : rec.labelEs || rec.labelEn;
                        return (
                          <a
                            key={`${stream}-rec-${idx}`}
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {t.watchRecording}
                              {partLabel ? ` · ${partLabel}` : ""} ({stream})
                            </span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Module / Session Notes */}
          {(moduleDescription || sessionNotes) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs leading-relaxed text-slate-600">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                <span>{sessionNotes ? t.sessionNotes : t.moduleNotes}</span>
              </div>
              {sessionNotes && <p>{sessionNotes}</p>}
              {moduleDescription && (
                <p className={sessionNotes ? "mt-1.5" : ""}>
                  {moduleDescription}
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <hr className="border-slate-200" />

          {/* Comments Thread (Both M11 & M12 shown together, tagged) */}
          <CommentThread
            sessionId={session.id}
            comments={comments}
            preferredStream={streamFilter}
            locale={locale}
            onCommentCreated={onCommentCreated}
            onCommentUpdated={onCommentUpdated}
          />
        </div>
      </div>
    </div>
  );
}
