"use client";

import {
  Calendar,
  ClipboardList,
  Clock,
  ExternalLink,
  Link2Off,
  MessageSquare,
  Radio,
  Sparkles,
  User,
} from "lucide-react";
import { ASSIGNMENTS } from "@/data/assignments";
import { getModule, MODULE_COLORS } from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  formatDateHeading,
  formatLocalTimeRange,
  getTodayAndNextSession,
  getUpcomingAssignments,
  isDifferentFromMadridTz,
  resolveMeetingLink,
} from "@/lib/schedule";
import type {
  ClassSession,
  Locale,
  SessionComment,
  Stream,
  StreamFilter,
} from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

interface NextClassHeroProps {
  sessions: ClassSession[];
  commentsBySession: Record<string, SessionComment[]>;
  streamFilter: StreamFilter;
  locale: Locale;
  onOpenSession: (session: ClassSession) => void;
}

export function NextClassHero({
  sessions,
  commentsBySession,
  streamFilter,
  locale,
  onOpenSession,
}: NextClassHeroProps) {
  const t = getTranslations(locale);
  const { todaySession, nextSession, live } = getTodayAndNextSession(sessions);
  const featured = todaySession ?? nextSession;
  const showLocalTz = isDifferentFromMadridTz();
  const upcomingDeadlines = getUpcomingAssignments(
    ASSIGNMENTS,
    streamFilter,
    14,
  );

  if (!featured) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <p className="text-sm font-semibold text-slate-700">{t.heroAllDone}</p>
      </section>
    );
  }

  const mod = getModule(featured.moduleId);
  const colors = MODULE_COLORS[mod.color];
  const sessionComments = commentsBySession[featured.id] ?? [];
  const visibleComments = sessionComments.filter((c) => c.reportCount < 3);

  const streamsToShow: Stream[] =
    streamFilter === "ALL" ? ["M11", "M12"] : [streamFilter];

  const resolvedLinks = streamsToShow.map((s) => ({
    stream: s,
    link: resolveMeetingLink(featured, s, sessionComments),
  }));

  const professorDisplay =
    streamFilter === "ALL"
      ? (["M11", "M12"] as Stream[])
          .filter((s) => mod.professors?.[s])
          .map((s) => `${mod.professors![s]} (${s})`)
          .join(" · ")
      : mod.professors?.[streamFilter];

  const sessionTitle =
    locale === "en"
      ? featured.titleEn || featured.title || mod.nameEn || mod.name
      : featured.title || mod.name;

  const latestComment = visibleComments[0];

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-xs transition sm:p-6 ${
        live
          ? "border-red-300 ring-2 ring-red-100"
          : todaySession
            ? "border-emerald-200 ring-1 ring-emerald-100"
            : "border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Status + Class Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {live ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold tracking-wide text-white">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                {t.heroLiveNow}
              </span>
            ) : todaySession ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold tracking-wide text-white">
                <Sparkles className="h-3.5 w-3.5" />
                {t.heroClassToday}
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wide text-slate-700">
                  {t.heroNoClassToday}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {t.heroNextClass}
                </span>
              </>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
              {mod.code}
            </span>
          </div>

          <h2 className="mt-2.5 text-lg font-bold text-slate-900 sm:text-xl">
            {sessionTitle}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formatDateHeading(featured.date, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>
                {featured.startTime}–{featured.endTime}{" "}
                <span className="text-xs text-slate-400">
                  ({t.heroMadridTime})
                </span>
              </span>
            </span>
            {professorDisplay && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <User className="h-3.5 w-3.5 text-slate-400" />
                {professorDisplay}
              </span>
            )}
            {showLocalTz && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {t.heroYourTime}: {formatLocalTimeRange(featured)}
              </span>
            )}
          </div>

          {latestComment && (
            <button
              type="button"
              onClick={() => onOpenSession(featured)}
              className="mt-3 flex max-w-2xl items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100/80"
            >
              <StreamBadge stream={latestComment.stream} locale={locale} />
              <span className="font-semibold text-slate-900">
                {latestComment.authorName}:
              </span>
              <span className="truncate">{latestComment.body}</span>
            </button>
          )}
        </div>

        {/* Right: Join Buttons & Details CTA */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="flex flex-wrap gap-2">
            {resolvedLinks.map(({ stream, link }) =>
              link ? (
                <a
                  key={stream}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition ${
                    stream === "M11"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  <span>
                    {streamFilter === "ALL"
                      ? `${t.heroJoinStream} ${stream}`
                      : `${t.heroJoinTeams} (${stream})`}
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button
                  key={stream}
                  type="button"
                  onClick={() => onOpenSession(featured)}
                  className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <Link2Off className="h-4 w-4 text-slate-400" />
                  <span>
                    {stream}: {t.heroLinkPending}
                  </span>
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenSession(featured)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.heroOpenDetails}</span>
            {visibleComments.length > 0 && (
              <span className="ml-0.5 rounded-full bg-slate-900 px-1.5 py-0.2 text-[11px] font-bold text-white">
                {visibleComments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Upcoming Assignment Deadline Strip */}
      {upcomingDeadlines.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-800">
            <ClipboardList className="h-3.5 w-3.5 text-amber-600" />
            {t.upcomingDeadlinesLabel}:
          </span>
          {upcomingDeadlines.map((a) => {
            const aMod = getModule(a.moduleId);
            return (
              <span
                key={a.id}
                className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-950"
              >
                <span className="font-bold">{aMod.code}</span>
                <span className="font-medium">
                  {locale === "en" && a.titleEn ? a.titleEn : a.titleEs}
                </span>
                <span className="text-amber-700">
                  ·{" "}
                  {formatDateHeading(a.dueDate, locale, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  {a.dueTime}
                </span>
                <StreamBadge stream={a.stream} locale={locale} />
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}
