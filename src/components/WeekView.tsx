"use client";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  ExternalLink,
  GraduationCap,
  Link2Off,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";
import { ASSIGNMENTS } from "@/data/assignments";
import { MILESTONES } from "@/data/milestones";
import { getModule, MODULE_COLORS } from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  addDays,
  filterAssignmentsByStream,
  formatDateHeading,
  formatDateRange,
  formatLocalTimeRange,
  getMadridDateStr,
  getMilestonesOnDate,
  isAssignmentPast,
  isDifferentFromMadridTz,
  resolveMeetingLink,
  resolveRecordings,
} from "@/lib/schedule";
import type {
  Assignment,
  ClassSession,
  Locale,
  SessionComment,
  Stream,
  StreamFilter,
} from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

interface WeekViewProps {
  weekStartMonday: string;
  sessions: ClassSession[];
  commentsBySession: Record<string, SessionComment[]>;
  streamFilter: StreamFilter;
  locale: Locale;
  onChangeWeek: (newMonday: string) => void;
  onJumpToday: () => void;
  onOpenSession: (session: ClassSession) => void;
}

export function WeekView({
  weekStartMonday,
  sessions,
  commentsBySession,
  streamFilter,
  locale,
  onChangeWeek,
  onJumpToday,
  onOpenSession,
}: WeekViewProps) {
  const t = getTranslations(locale);
  const todayStr = getMadridDateStr();
  const showLocalTz = isDifferentFromMadridTz();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartMonday, i));
  const weekEnd = days[6];

  const sessionsByDate = new Map<string, ClassSession[]>();
  for (const s of sessions) {
    if (s.date >= weekStartMonday && s.date <= weekEnd) {
      const arr = sessionsByDate.get(s.date) ?? [];
      arr.push(s);
      sessionsByDate.set(s.date, arr);
    }
  }

  const assignmentsByDate = new Map<string, Assignment[]>();
  for (const a of filterAssignmentsByStream(ASSIGNMENTS, streamFilter)) {
    if (a.dueDate >= weekStartMonday && a.dueDate <= weekEnd) {
      const arr = assignmentsByDate.get(a.dueDate) ?? [];
      arr.push(a);
      assignmentsByDate.set(a.dueDate, arr);
    }
  }

  const weekHasClasses = sessionsByDate.size > 0;
  const streamsToShow: Stream[] =
    streamFilter === "ALL" ? ["M11", "M12"] : [streamFilter];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Week Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
          {formatDateRange(weekStartMonday, weekEnd, locale)}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onJumpToday}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t.todayBtn}
          </button>
          <button
            type="button"
            onClick={() => onChangeWeek(addDays(weekStartMonday, -7))}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeWeek(addDays(weekStartMonday, 7))}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!weekHasClasses && (
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-center text-xs font-medium text-slate-500">
          {t.weekHolidayNote}
        </div>
      )}

      {/* 7-day responsive columns */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-7 md:divide-x md:divide-y-0">
        {days.map((dateStr, idx) => {
          const isToday = dateStr === todayStr;
          const daySessions = sessionsByDate.get(dateStr) ?? [];
          const dayMilestones = getMilestonesOnDate(dateStr, MILESTONES);
          const dayAssignments = assignmentsByDate.get(dateStr) ?? [];
          const dayNum = Number(dateStr.split("-")[2]);

          return (
            <div
              key={dateStr}
              className={`flex flex-col p-3 md:min-h-[260px] ${
                isToday ? "bg-red-50/30" : "bg-white"
              }`}
            >
              {/* Day Header */}
              <div className="mb-2.5 flex items-center justify-between md:flex-col md:items-start md:gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.weekdaysShort[idx]}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      isToday
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {dayNum}
                  </span>
                  <span className="text-xs text-slate-400 md:hidden">
                    {formatDateHeading(dateStr, locale, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Milestones */}
              {dayMilestones.map((ms) => (
                <div
                  key={ms.id}
                  className={`mb-2 rounded-xl border p-2 text-xs font-semibold ${
                    ms.type === "tfm"
                      ? "border-purple-200 bg-purple-50 text-purple-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span>{locale === "en" ? ms.titleEn : ms.titleEs}</span>
                  </div>
                </div>
              ))}

              {/* Assignment Deadlines */}
              {dayAssignments.length > 0 && (
                <div className="mb-2 space-y-1.5">
                  {dayAssignments.map((a) => {
                    const past = isAssignmentPast(a);
                    const aMod = getModule(a.moduleId);
                    return (
                      <div
                        key={a.id}
                        title={locale === "en" && a.notesEn ? a.notesEn : a.notesEs}
                        className={`rounded-xl border p-2 text-[11px] ${
                          past
                            ? "border-slate-200 bg-slate-50 text-slate-500"
                            : "border-amber-200 bg-amber-50/90 text-amber-950"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-flex items-center gap-1 font-bold">
                            <ClipboardList className="h-3 w-3 shrink-0" />
                            {t.dueAtLabel} {a.dueTime}
                          </span>
                          <StreamBadge stream={a.stream} locale={locale} />
                        </div>
                        <p className="mt-1 line-clamp-2 font-semibold leading-snug">
                          {locale === "en" && a.titleEn ? a.titleEn : a.titleEs}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[10px] opacity-80">
                          <span>
                            {aMod.code} ·{" "}
                            {a.type === "quiz"
                              ? t.assignmentQuizBadge
                              : t.assignmentTaskBadge}
                          </span>
                          {past && <span>{t.closedBadge}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Class Cards */}
              {daySessions.length === 0 &&
              dayMilestones.length === 0 &&
              dayAssignments.length === 0 ? (
                <div className="hidden flex-1 items-center justify-center rounded-xl border border-dashed border-slate-100 text-[11px] text-slate-300 md:flex">
                  —
                </div>
              ) : (
                <div className="space-y-2">
                  {daySessions.map((session) => {
                    const mod = getModule(session.moduleId);
                    const colors = MODULE_COLORS[mod.color];
                    const sc = commentsBySession[session.id] ?? [];
                    const visibleCount = sc.filter(
                      (c) => c.reportCount < 3,
                    ).length;
                    const title =
                      locale === "en"
                        ? session.titleEn || session.title || mod.nameEn || mod.name
                        : session.title || mod.name;

                    const professor =
                      streamFilter === "ALL"
                        ? mod.professors?.M12 || mod.professors?.M11
                        : mod.professors?.[streamFilter];

                    const resolved = streamsToShow.map((st) => ({
                      stream: st,
                      link: resolveMeetingLink(session, st, sc),
                    }));

                    return (
                      <div
                        key={session.id}
                        className={`rounded-xl border p-2.5 transition ${colors.bg} ${colors.border}`}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenSession(session)}
                          className="block w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold ${colors.text}`}
                            >
                              <Clock className="h-3 w-3" />
                              {session.startTime}–{session.endTime}
                            </span>
                            {visibleCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                                <MessageSquare className="h-2.5 w-2.5" />
                                {visibleCount}
                              </span>
                            )}
                          </div>

                          {showLocalTz && (
                            <p className="mt-0.5 text-[10px] text-slate-500">
                              {t.heroYourTime}: {formatLocalTimeRange(session)}
                            </p>
                          )}

                          <p
                            className={`mt-1.5 line-clamp-3 text-xs font-semibold leading-snug ${colors.text}`}
                          >
                            {title}
                          </p>

                          {professor && (
                            <p className="mt-1 flex items-center gap-1 truncate text-[10px] font-medium text-slate-600">
                              <User className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{professor}</span>
                            </p>
                          )}
                        </button>

                        {/* Quick link & recording buttons */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-black/5 pt-2">
                          {resolved.map(({ stream, link }) =>
                            link ? (
                              <a
                                key={stream}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-white transition ${
                                  stream === "M11"
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-teal-600 hover:bg-teal-700"
                                }`}
                              >
                                <span>{stream}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <button
                                key={stream}
                                type="button"
                                onClick={() => onOpenSession(session)}
                                className="inline-flex items-center gap-1 rounded-lg bg-white/70 px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-white"
                              >
                                <Link2Off className="h-2.5 w-2.5" />
                                <span>{stream}</span>
                              </button>
                            ),
                          )}

                          {streamsToShow.flatMap((stream) =>
                            resolveRecordings(session, stream).map(
                              (rec, idx) => {
                                const partLabel =
                                  locale === "en"
                                    ? rec.labelEn || rec.labelEs
                                    : rec.labelEs || rec.labelEn;
                                return (
                                  <a
                                    key={`rec-${stream}-${idx}`}
                                    href={rec.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-800 transition hover:bg-rose-100"
                                  >
                                    <PlayCircle className="h-3 w-3 shrink-0" />
                                    <span>
                                      {partLabel || t.recordingShort}
                                      {streamFilter === "ALL"
                                        ? ` ${stream}`
                                        : ""}
                                    </span>
                                  </a>
                                );
                              },
                            ),
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
