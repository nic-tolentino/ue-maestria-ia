"use client";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Link2,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import { ASSIGNMENTS } from "@/data/assignments";
import { MILESTONES } from "@/data/milestones";
import { getModule, getModuleShortName, MODULE_COLORS } from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  buildMonthGrid,
  filterAssignmentsByStream,
  formatMonthYear,
  getMadridDateStr,
  getMilestonesOnDate,
  isAssignmentPast,
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

interface MonthViewProps {
  year: number;
  monthIndex: number;
  sessions: ClassSession[];
  commentsBySession: Record<string, SessionComment[]>;
  streamFilter: StreamFilter;
  locale: Locale;
  onChangeMonth: (year: number, monthIndex: number) => void;
  onJumpToday: () => void;
  onOpenSession: (session: ClassSession) => void;
}

export function MonthView({
  year,
  monthIndex,
  sessions,
  commentsBySession,
  streamFilter,
  locale,
  onChangeMonth,
  onJumpToday,
  onOpenSession,
}: MonthViewProps) {
  const t = getTranslations(locale);
  const todayStr = getMadridDateStr();
  const cells = buildMonthGrid(year, monthIndex);

  const sessionsByDate = new Map<string, ClassSession[]>();
  for (const s of sessions) {
    const arr = sessionsByDate.get(s.date) ?? [];
    arr.push(s);
    sessionsByDate.set(s.date, arr);
  }

  const assignmentsByDate = new Map<string, Assignment[]>();
  for (const a of filterAssignmentsByStream(ASSIGNMENTS, streamFilter)) {
    const arr = assignmentsByDate.get(a.dueDate) ?? [];
    arr.push(a);
    assignmentsByDate.set(a.dueDate, arr);
  }

  function prevMonth() {
    if (monthIndex === 0) onChangeMonth(year - 1, 11);
    else onChangeMonth(year, monthIndex - 1);
  }

  function nextMonth() {
    if (monthIndex === 11) onChangeMonth(year + 1, 0);
    else onChangeMonth(year, monthIndex + 1);
  }

  function hasAnyLink(session: ClassSession): boolean {
    const sc = commentsBySession[session.id] ?? [];
    const streams: Stream[] =
      streamFilter === "ALL" ? ["M11", "M12"] : [streamFilter];
    return streams.some((st) => Boolean(resolveMeetingLink(session, st, sc)));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Month Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
          {formatMonthYear(year, monthIndex, locale)}
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
            onClick={prevMonth}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-semibold text-slate-500">
        {t.weekdaysShort.map((dayName) => (
          <div key={dayName} className="py-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
        {cells.map((cell) => {
          const isToday = cell.dateStr === todayStr;
          const daySessions = sessionsByDate.get(cell.dateStr) ?? [];
          const dayMilestones = getMilestonesOnDate(cell.dateStr, MILESTONES);
          const dayAssignments = assignmentsByDate.get(cell.dateStr) ?? [];

          return (
            <div
              key={cell.dateStr}
              className={`min-h-[86px] p-1.5 sm:min-h-[112px] sm:p-2 ${
                cell.inCurrentMonth ? "bg-white" : "bg-slate-50/60"
              } ${isToday ? "bg-red-50/40" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? "bg-red-600 text-white"
                      : cell.inCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-400"
                  }`}
                >
                  {cell.day}
                </span>
              </div>

              <div className="mt-1 space-y-1">
                {dayMilestones.map((ms) => (
                  <div
                    key={ms.id}
                    title={locale === "en" ? ms.titleEn : ms.titleEs}
                    className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
                      ms.type === "tfm"
                        ? "border-purple-200 bg-purple-50 text-purple-900"
                        : "border-rose-200 bg-rose-50 text-rose-900"
                    }`}
                  >
                    <GraduationCap className="hidden h-3 w-3 shrink-0 sm:inline" />
                    <span className="truncate">
                      {locale === "en" ? ms.titleEn : ms.titleEs}
                    </span>
                  </div>
                ))}

                {dayAssignments.map((a) => {
                  const past = isAssignmentPast(a);
                  const title =
                    locale === "en" && a.titleEn ? a.titleEn : a.titleEs;
                  return (
                    <div
                      key={a.id}
                      title={`${t.dueAtLabel} ${a.dueTime} (${a.stream}) · ${title}`}
                      className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${
                        past
                          ? "border-slate-200 bg-slate-50 text-slate-500"
                          : "border-amber-200 bg-amber-50 text-amber-900"
                      }`}
                    >
                      <ClipboardList className="hidden h-2.5 w-2.5 shrink-0 sm:inline" />
                      <span className="truncate">
                        {a.dueTime} · {title}
                      </span>
                    </div>
                  );
                })}

                {daySessions.map((session) => {
                  const mod = getModule(session.moduleId);
                  const colors = MODULE_COLORS[mod.color];
                  const comments = (commentsBySession[session.id] ?? []).filter(
                    (c) => c.reportCount < 3,
                  );
                  const linked = hasAnyLink(session);
                  const hasRecording = (
                    streamFilter === "ALL"
                      ? (["M11", "M12"] as Stream[])
                      : [streamFilter]
                  ).some((st) => resolveRecordings(session, st).length > 0);
                  const label =
                    locale === "en"
                      ? session.titleEn ||
                        session.title ||
                        getModuleShortName(mod, locale)
                      : session.title || getModuleShortName(mod, locale);

                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => onOpenSession(session)}
                      className={`group block w-full rounded-lg border p-1.5 text-left transition ${colors.bg} ${colors.bgHover} ${colors.border} ${
                        session.status === "cancelled"
                          ? "line-through opacity-60"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-bold sm:text-[11px] ${colors.text}`}
                        >
                          {session.startTime}
                        </span>
                        <div className="flex items-center gap-1">
                          {hasRecording && (
                            <PlayCircle
                              className="h-3 w-3 text-rose-600"
                              aria-label="Recording available"
                            />
                          )}
                          {linked && (
                            <Link2
                              className="h-3 w-3 text-emerald-600"
                              aria-label="Meeting link available"
                            />
                          )}
                          {comments.length > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-600">
                              <MessageSquare className="h-2.5 w-2.5" />
                              {comments.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <p
                        className={`mt-0.5 truncate text-[10px] font-medium sm:text-[11px] ${colors.text}`}
                      >
                        {label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
