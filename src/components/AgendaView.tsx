"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Link2Off,
  List,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";
import { ASSIGNMENTS } from "@/data/assignments";
import { MILESTONES } from "@/data/milestones";
import {
  getModule,
  getModuleShortName,
  MODULE_COLORS,
  MODULES,
} from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  filterAssignmentsByStream,
  formatDateHeading,
  formatDateRange,
  getMadridDateStr,
  isAssignmentPast,
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
import { StreamBadge } from "./StreamBadge";

interface AgendaViewProps {
  sessions: ClassSession[];
  commentsBySession: Record<string, SessionComment[]>;
  streamFilter: StreamFilter;
  locale: Locale;
  onOpenSession: (session: ClassSession) => void;
}

export function AgendaView({
  sessions,
  commentsBySession,
  streamFilter,
  locale,
  onOpenSession,
}: AgendaViewProps) {
  const t = getTranslations(locale);
  const todayStr = getMadridDateStr();

  const [selectedModuleId, setSelectedModuleId] = useState<string>("ALL");
  const [showPast, setShowPast] = useState<boolean>(false);
  const [groupMode, setGroupMode] = useState<"chrono" | "module">("chrono");

  const streamsToShow: Stream[] =
    streamFilter === "ALL" ? ["M11", "M12"] : [streamFilter];

  const filteredSessions = sessions.filter((s) => {
    if (!showPast && s.date < todayStr) return false;
    if (selectedModuleId !== "ALL" && s.moduleId !== selectedModuleId) {
      return false;
    }
    return true;
  });

  const filteredAssignments = filterAssignmentsByStream(
    ASSIGNMENTS,
    streamFilter,
  )
    .filter((a) => {
      if (!showPast && isAssignmentPast(a)) return false;
      if (selectedModuleId !== "ALL" && a.moduleId !== selectedModuleId) {
        return false;
      }
      return true;
    })
    .sort((a, b) =>
      `${a.dueDate}T${a.dueTime}`.localeCompare(`${b.dueDate}T${b.dueTime}`),
    );

  // Group by module for "By Module" view
  const groupedByModule = new Map<string, ClassSession[]>();
  for (const s of filteredSessions) {
    const arr = groupedByModule.get(s.moduleId) ?? [];
    arr.push(s);
    groupedByModule.set(s.moduleId, arr);
  }

  // Session counts across full schedule for the modules directory
  const totalCountsByModule = new Map<string, number>();
  for (const s of sessions) {
    totalCountsByModule.set(
      s.moduleId,
      (totalCountsByModule.get(s.moduleId) ?? 0) + 1,
    );
  }

  function renderSessionRow(session: ClassSession) {
    const mod = getModule(session.moduleId);
    const colors = MODULE_COLORS[mod.color];
    const sc = commentsBySession[session.id] ?? [];
    const visibleComments = sc.filter((c) => c.reportCount < 3);
    const isToday = session.date === todayStr;
    const title =
      locale === "en"
        ? session.titleEn || session.title || mod.nameEn || mod.name
        : session.title || mod.name;

    const resolved = streamsToShow.map((st) => ({
      stream: st,
      link: resolveMeetingLink(session, st, sc),
    }));

    return (
      <div
        key={session.id}
        className={`flex flex-col gap-3 rounded-xl border bg-white p-3.5 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between ${
          isToday ? "border-red-300 bg-red-50/20" : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenSession(session)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span
            className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${colors.dot}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {formatDateHeading(session.date, locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {session.startTime}–{session.endTime}
              </span>
              <span
                className={`rounded-full border px-2 py-0.2 text-[11px] font-semibold ${colors.badge}`}
              >
                {mod.code}
              </span>
              {isToday && (
                <span className="rounded-full bg-red-600 px-2 py-0.2 text-[10px] font-bold text-white">
                  {t.todayBtn.toUpperCase()}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-2 pl-6 sm:pl-0">
          {resolved.map(({ stream, link }) =>
            link ? (
              <a
                key={stream}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition ${
                  stream === "M11"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                <span>{stream}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <button
                key={stream}
                type="button"
                onClick={() => onOpenSession(session)}
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              >
                <Link2Off className="h-3 w-3" />
                <span>{stream}</span>
              </button>
            ),
          )}

          {streamsToShow.flatMap((stream) =>
            resolveRecordings(session, stream).map((rec, idx) => {
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
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                >
                  <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {partLabel
                      ? `${t.recordingShort} · ${partLabel}`
                      : t.recordingShort}
                    {streamFilter === "ALL" ? ` (${stream})` : ""}
                  </span>
                </a>
              );
            }),
          )}

          <button
            type="button"
            onClick={() => onOpenSession(session)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
            <span>{visibleComments.length}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exams & TFM Key Dates */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-red-600" />
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {t.agendaMilestonesTitle}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {MILESTONES.map((ms) => (
            <div
              key={ms.id}
              className={`rounded-xl border p-3 ${
                ms.type === "tfm"
                  ? "border-purple-200 bg-purple-50/60"
                  : ms.type === "extraordinary"
                    ? "border-amber-200 bg-amber-50/60"
                    : "border-rose-200 bg-rose-50/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {formatDateRange(ms.startDate, ms.endDate, locale)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    ms.type === "tfm"
                      ? "bg-purple-200/70 text-purple-900"
                      : ms.type === "extraordinary"
                        ? "bg-amber-200/70 text-amber-900"
                        : "bg-rose-200/70 text-rose-900"
                  }`}
                >
                  {ms.type === "tfm"
                    ? t.tfmBadge
                    : ms.type === "extraordinary"
                      ? t.extraordinaryBadge
                      : t.examBadge}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-700">
                {locale === "en" ? ms.titleEn : ms.titleEs}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters & Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-slate-400 focus:outline-none sm:text-sm"
          >
            <option value="ALL">{t.agendaFilterAllModules}</option>
            {MODULES.filter((m) => m.category !== "general").map((m) => {
              const count = totalCountsByModule.get(m.id) ?? 0;
              return (
                <option key={m.id} value={m.id}>
                  {getModuleShortName(m, locale)} ({count})
                </option>
              );
            })}
          </select>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              className="rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            {t.agendaShowPast}
          </label>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setGroupMode("chrono")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              groupMode === "chrono"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            {t.agendaGroupChrono}
          </button>
          <button
            type="button"
            onClick={() => setGroupMode("module")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              groupMode === "module"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {t.agendaGroupByModule}
          </button>
        </div>
      </div>

      {/* Assignments & Deadlines */}
      {filteredAssignments.length > 0 && (
        <section className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-xs sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              {t.assignmentsTitle}
            </h3>
          </div>
          <div className="space-y-2">
            {filteredAssignments.map((a) => {
              const past = isAssignmentPast(a);
              const aMod = getModule(a.moduleId);
              const aColors = MODULE_COLORS[aMod.color];
              const note = locale === "en" && a.notesEn ? a.notesEn : a.notesEs;
              return (
                <div
                  key={a.id}
                  className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${
                    past
                      ? "border-slate-200 bg-slate-50/80 text-slate-600"
                      : "border-amber-200 bg-amber-50/50 text-slate-900"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full border px-2 py-0.2 text-[11px] font-semibold ${aColors.badge}`}
                      >
                        {aMod.code}
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.2 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                        {a.type === "quiz"
                          ? t.assignmentQuizBadge
                          : t.assignmentTaskBadge}
                      </span>
                      <StreamBadge stream={a.stream} locale={locale} />
                      {a.points && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {a.points} {t.pointsLabel}
                        </span>
                      )}
                      {past && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] font-bold uppercase text-slate-600">
                          {t.closedBadge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {locale === "en" && a.titleEn ? a.titleEn : a.titleEs}
                    </p>
                    {note && (
                      <p className="mt-0.5 text-xs text-slate-500">{note}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-xs font-bold text-amber-900 sm:text-right">
                    <div>
                      {t.dueAtLabel}:{" "}
                      {formatDateHeading(a.dueDate, locale, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="font-semibold text-amber-700">
                      {a.dueTime} ({t.heroMadridTime})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Session List */}
      {groupMode === "chrono" ? (
        <div className="space-y-2.5">
          {filteredSessions.map((session) => renderSessionRow(session))}
          {filteredSessions.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              <Calendar className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              {t.noClassesThisWeek}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {MODULES.filter((m) => groupedByModule.has(m.id)).map((mod) => {
            const list = groupedByModule.get(mod.id) ?? [];
            const colors = MODULE_COLORS[mod.color];
            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${colors.dot}`} />
                    <h4 className="text-sm font-bold text-slate-900">
                      {locale === "en" && mod.nameEn ? mod.nameEn : mod.name}
                    </h4>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
                  >
                    {list.length}{" "}
                    {list.length === 1 ? t.sessionSingle : t.sessionsCount}
                  </span>
                </div>
                <div className="space-y-2">
                  {list.map((session) => renderSessionRow(session))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Master's Curriculum Directory (grouped in official UE Valencia order) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            {t.agendaModulesOverview}
          </h3>
        </div>
        <div className="space-y-4">
          {(
            [
              { key: 1, label: t.semester1Label },
              { key: "cert", label: t.certsTrackLabel },
              { key: 2, label: t.semester2Label },
              { key: "tfm", label: t.tfmTrackLabel },
            ] as const
          ).map((group) => {
            const groupModules = MODULES.filter(
              (m) => m.semester === group.key,
            );
            if (groupModules.length === 0) return null;
            return (
              <div key={String(group.key)}>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {group.label}
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {groupModules.map((mod) => {
                    const colors = MODULE_COLORS[mod.color];
                    const count = totalCountsByModule.get(mod.id) ?? 0;
                    const profEntries = (["M11", "M12"] as Stream[])
                      .filter((s) => mod.professors?.[s])
                      .map((s) => `${mod.professors![s]} (${s})`);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          setSelectedModuleId(
                            selectedModuleId === mod.id ? "ALL" : mod.id,
                          );
                        }}
                        className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-left transition ${
                          selectedModuleId === mod.id
                            ? `${colors.bg} ${colors.border} ring-1 ring-slate-300`
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}
                            />
                            <span className="text-[11px] font-bold text-slate-500">
                              {mod.code}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-semibold leading-snug text-slate-900">
                            {locale === "en" && mod.nameEn
                              ? mod.nameEn
                              : mod.name}
                          </p>
                          {profEntries.length > 0 && (
                            <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-500">
                              <User className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {profEntries.join(" · ")}
                              </span>
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
