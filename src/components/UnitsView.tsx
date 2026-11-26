"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Code2,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  Library,
  Link2Off,
  Lock,
  Mail,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { ASSIGNMENTS } from "@/data/assignments";
import { getModuleShortName, MODULE_COLORS, MODULES } from "@/data/modules";
import { getTranslations } from "@/lib/i18n";
import {
  formatDateHeading,
  isAssignmentPast,
  resolveMeetingLink,
  resolveRecordings,
} from "@/lib/schedule";
import type {
  Assignment,
  ClassSession,
  Locale,
  ModuleInfo,
  SessionComment,
  Stream,
  StreamFilter,
} from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

const GRADES_STORAGE_KEY = "ue-ai-personal-grades-v1";

type GradeMap = Record<string, string>;

interface UnitsViewProps {
  sessions: ClassSession[];
  commentsBySession: Record<string, SessionComment[]>;
  streamFilter: StreamFilter;
  locale: Locale;
  initialModuleId?: string | null;
  onOpenSession: (session: ClassSession) => void;
  onSelectModule?: (moduleId: string) => void;
}

export function UnitsView({
  sessions,
  commentsBySession,
  streamFilter,
  locale,
  initialModuleId,
  onOpenSession,
  onSelectModule,
}: UnitsViewProps) {
  const t = getTranslations(locale);
  const unitModules = useMemo(
    () => MODULES.filter((m) => m.id !== "tbd"),
    [],
  );

  const [selectedId, setSelectedId] = useState<string>(
    initialModuleId && unitModules.some((m) => m.id === initialModuleId)
      ? initialModuleId
      : "intro-ds-ia",
  );
  const [grades, setGrades] = useState<GradeMap>({});

  useEffect(() => {
    if (initialModuleId && unitModules.some((m) => m.id === initialModuleId)) {
      setSelectedId(initialModuleId);
    }
  }, [initialModuleId, unitModules]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GRADES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GradeMap;
        if (parsed && typeof parsed === "object") {
          setGrades(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  function updateGrade(itemId: string, rawValue: string) {
    // Allow empty or valid decimal 0–10
    if (rawValue !== "") {
      const normalized = rawValue.replace(",", ".");
      if (!/^\d{0,2}(\.\d{0,2})?$/.test(normalized)) return;
      const num = Number(normalized);
      if (!Number.isNaN(num) && num > 10) return;
      rawValue = normalized;
    }

    setGrades((prev) => {
      const next = { ...prev };
      if (rawValue === "") delete next[itemId];
      else next[itemId] = rawValue;
      try {
        localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function clearUnitGrades(mod: ModuleInfo) {
    if (!mod.grading) return;
    setGrades((prev) => {
      const next = { ...prev };
      for (const item of mod.grading!) {
        delete next[item.id];
      }
      try {
        localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const assignmentsById = useMemo(() => {
    const map: Record<string, Assignment> = {};
    for (const a of ASSIGNMENTS) map[a.id] = a;
    return map;
  }, []);

  const sessionCountByModule = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sessions) {
      counts[s.moduleId] = (counts[s.moduleId] ?? 0) + 1;
    }
    return counts;
  }, [sessions]);

  const selectedModule =
    unitModules.find((m) => m.id === selectedId) ?? unitModules[0];
  const colors = MODULE_COLORS[selectedModule.color];

  const unitSessions = useMemo(
    () => sessions.filter((s) => s.moduleId === selectedModule.id),
    [sessions, selectedModule.id],
  );

  const streamsToShow: Stream[] =
    streamFilter === "ALL" ? ["M11", "M12"] : [streamFilter];

  // Compute live grade stats for the selected module
  const gradeStats = useMemo(() => {
    const items = selectedModule.grading ?? [];
    let evaluatedPct = 0;
    let earnedOutOf10 = 0;
    let totalWeight = 0;

    for (const item of items) {
      if (item.weightPercent <= 0) continue;
      totalWeight += item.weightPercent;
      const val = grades[item.id];
      if (val !== undefined && val !== "" && !Number.isNaN(Number(val))) {
        const score = Math.min(10, Math.max(0, Number(val)));
        evaluatedPct += item.weightPercent;
        earnedOutOf10 += (score * item.weightPercent) / 100;
      }
    }

    const remainingPct = Math.max(0, totalWeight - evaluatedPct);
    const currentAvg =
      evaluatedPct > 0 ? (earnedOutOf10 / evaluatedPct) * 100 : null;
    const neededToPass =
      remainingPct > 0 ? ((5 - earnedOutOf10) / remainingPct) * 100 : null;

    return {
      totalWeight,
      evaluatedPct,
      remainingPct,
      earnedOutOf10,
      currentAvg,
      neededToPass,
    };
  }, [selectedModule, grades]);

  const semesterGroups = [
    { key: "general", label: t.generalTrackLabel },
    { key: 1, label: t.semester1Label },
    { key: "cert", label: t.certsTrackLabel },
    { key: 2, label: t.semester2Label },
    { key: "tfm", label: t.tfmTrackLabel },
  ] as const;

  const moduleDesc =
    locale === "en"
      ? selectedModule.descriptionEn || selectedModule.descriptionEs
      : selectedModule.descriptionEs || selectedModule.descriptionEn;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Left Sidebar: Unit Picker */}
      <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            {t.agendaModulesOverview}
          </h3>
        </div>

        <div className="space-y-4">
          {semesterGroups.map((group) => {
            const list = unitModules.filter((m) => m.semester === group.key);
            if (list.length === 0) return null;
            return (
              <div key={String(group.key)}>
                <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {list.map((mod) => {
                    const modColors = MODULE_COLORS[mod.color];
                    const isActive = mod.id === selectedModule.id;
                    const sCount = sessionCountByModule[mod.id] ?? 0;
                    const hasGrades = (mod.grading ?? []).some(
                      (g) => grades[g.id] !== undefined && grades[g.id] !== "",
                    );

                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(mod.id);
                          onSelectModule?.(mod.id);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                          isActive
                            ? `${modColors.bg} ${modColors.border} ring-1 ring-slate-300`
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${modColors.dot}`}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-900">
                              {getModuleShortName(mod, locale)}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {mod.code}
                              {sCount > 0
                                ? ` · ${sCount} ${sCount === 1 ? t.sessionSingle : t.sessionsCount}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {hasGrades && (
                            <Award className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                          {mod.guidePdfUrl && (
                            <span
                              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700"
                              title={t.openTeachingGuide}
                            >
                              PDF
                            </span>
                          )}
                          {mod.canvasUrl && (
                            <span
                              className="rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700"
                              title="Canvas"
                            >
                              Canvas
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Panel: Selected Unit Hub */}
      <div className="space-y-5 lg:col-span-8">
        {/* Unit Overview Header Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${colors.badge}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  {selectedModule.code}
                </span>
                {selectedModule.semester === "general" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.generalTrackLabel}
                  </span>
                )}
                {selectedModule.semester === 1 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.semester1Label}
                  </span>
                )}
                {selectedModule.semester === "cert" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.certsTrackLabel}
                  </span>
                )}
                {selectedModule.semester === 2 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.semester2Label}
                  </span>
                )}
                {selectedModule.semester === "tfm" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.tfmTrackLabel}
                  </span>
                )}
                {selectedModule.ects && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {selectedModule.ects} ECTS
                    {selectedModule.workloadHours
                      ? ` · ${selectedModule.workloadHours}h`
                      : ""}
                  </span>
                )}
              </div>

              <h2 className="mt-2.5 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                {locale === "en" && selectedModule.nameEn
                  ? selectedModule.nameEn
                  : selectedModule.name}
              </h2>

              {moduleDesc && (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {moduleDesc}
                </p>
              )}

              {/* Professors */}
              {selectedModule.professors &&
                Object.keys(selectedModule.professors).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["M11", "M12"] as Stream[]).map((st) => {
                      const prof = selectedModule.professors?.[st];
                      if (!prof) return null;
                      return (
                        <span
                          key={st}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{prof}</span>
                          <StreamBadge stream={st} locale={locale} />
                        </span>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Quick Action Links: Canvas + Teaching Guide PDF + Recurring Teams */}
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {selectedModule.canvasUrl && (
                <a
                  href={selectedModule.canvasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>{t.openCanvas}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {selectedModule.guidePdfUrl && (
                <a
                  href={selectedModule.guidePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-rose-600" />
                  <span>{t.openTeachingGuide}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              )}

              <div className="flex flex-wrap gap-2">
                {streamsToShow.map((st) => {
                  const recurring =
                    selectedModule.streamUrls?.[st] ??
                    selectedModule.defaultMeetingUrl;
                  if (!recurring) return null;
                  return (
                    <a
                      key={st}
                      href={recurring}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition ${
                        st === "M11"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-teal-600 hover:bg-teal-700"
                      }`}
                    >
                      <span>
                        {t.heroJoinTeams} ({st})
                      </span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {selectedModule.category === "general" ? (
          selectedModule.programOverview ? (
            <div className="space-y-5">
              {/* Program Welcome & Co-Directors */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {t.programWelcomeTitle}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {t.programCoDirectorsLabel}:{" "}
                      <strong className="font-semibold text-slate-900">
                        {selectedModule.programOverview.coDirectors}
                      </strong>
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {locale === "en"
                    ? selectedModule.programOverview.welcomeEn
                    : selectedModule.programOverview.welcomeEs}
                </p>
              </section>

              {/* How we work & Tools */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {t.programMethodologyTitle}
                  </h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {locale === "en"
                    ? selectedModule.programOverview.methodologyEn
                    : selectedModule.programOverview.methodologyEs}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedModule.programOverview.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-800"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              {/* Beyond the Classroom */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {t.programBeyondTitle}
                  </h3>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {selectedModule.programOverview.beyondClassroom.map(
                    (item) => (
                      <div
                        key={item.titleEs}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                      >
                        <p className="text-xs font-bold text-slate-900">
                          {locale === "en" ? item.titleEn : item.titleEs}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          {locale === "en" ? item.detailEn : item.detailEs}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* Student Support (ODI) */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {t.programSupportTitle}
                    </h3>
                  </div>
                  <a
                    href={`mailto:${selectedModule.programOverview.supportEmail}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <span>{selectedModule.programOverview.supportEmail}</span>
                  </a>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {locale === "en"
                    ? selectedModule.programOverview.supportNoteEn
                    : selectedModule.programOverview.supportNoteEs}
                </p>
              </section>
            </div>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-sm leading-relaxed text-slate-600">
                {t.unitGeneralInfoNote}
              </p>
            </section>
          )
        ) : (
          <>
            {/* Official Syllabus, Passing Rule & Bibliography (from Teaching Guide PDF) */}
            {(selectedModule.topics?.length ||
              selectedModule.bibliography?.length ||
              selectedModule.passRuleEs) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {t.syllabusAndGuideTitle}
                    </h3>
                  </div>
                  {selectedModule.guidePdfUrl && (
                    <a
                      href={selectedModule.guidePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      <FileText className="h-3.5 w-3.5 text-rose-600" />
                      <span>{t.openTeachingGuide}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  )}
                </div>

                {selectedModule.topics && selectedModule.topics.length > 0 && (
                  <div className="mt-3.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {t.keyTopicsTitle}
                    </h4>
                    <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                      {selectedModule.topics.map((topic, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`}
                          />
                          <span>{locale === "en" ? topic.en : topic.es}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedModule.passRuleEs || selectedModule.passRuleEn) && (
                  <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
                    <span className="font-bold text-slate-800">
                      {t.passRuleLabel}:{" "}
                    </span>
                    {locale === "en"
                      ? selectedModule.passRuleEn || selectedModule.passRuleEs
                      : selectedModule.passRuleEs || selectedModule.passRuleEn}
                  </div>
                )}

                {selectedModule.bibliography &&
                  selectedModule.bibliography.length > 0 && (
                    <details className="group mt-3.5 rounded-xl border border-slate-200">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-bold text-slate-800 select-none hover:bg-slate-50">
                        <span className="inline-flex items-center gap-2">
                          <Library className="h-4 w-4 text-slate-500" />
                          <span>
                            {t.bibliographyTitle} (
                            {selectedModule.bibliography.length})
                          </span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="space-y-3 border-t border-slate-100 px-3.5 py-3 text-xs text-slate-600">
                        {(["basic", "complementary"] as const).map((kind) => {
                          const items = selectedModule.bibliography!.filter(
                            (b) => b.kind === kind,
                          );
                          if (items.length === 0) return null;
                          return (
                            <div key={kind}>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                {kind === "basic"
                                  ? t.bibliographyBasic
                                  : t.bibliographyComplementary}
                              </p>
                              <ul className="mt-1 space-y-1">
                                {items.map((book, idx) => (
                                  <li
                                    key={idx}
                                    className="leading-relaxed text-slate-700"
                                  >
                                    • {book.citation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  )}
              </section>
            )}

            {/* Grading & Personal Grade Tracker */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {t.unitGradingTitle}
                    </h3>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>{t.unitGradingPrivacy}</span>
                  </p>
                </div>

                {gradeStats.evaluatedPct > 0 && (
                  <button
                    type="button"
                    onClick={() => clearUnitGrades(selectedModule)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{t.gradeReset}</span>
                  </button>
                )}
              </div>

              {!selectedModule.grading ||
              selectedModule.grading.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center text-xs text-slate-500">
                  {t.unitNoGradingYet}
                </div>
              ) : (
                <>
                  {/* Live Grade Summary Banner */}
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {t.gradeWeightedEarned}
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-slate-900">
                          {gradeStats.earnedOutOf10.toFixed(2)}{" "}
                          <span className="text-xs font-medium text-slate-500">
                            / 10
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {t.gradeCurrentAvg}
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-slate-900">
                          {gradeStats.currentAvg !== null
                            ? `${gradeStats.currentAvg.toFixed(2)}`
                            : "—"}{" "}
                          <span className="text-xs font-medium text-slate-500">
                            ({gradeStats.evaluatedPct}% {t.gradeEvaluatedPct})
                          </span>
                        </p>
                      </div>

                      <div className="col-span-2 flex items-center sm:col-span-1">
                        {gradeStats.earnedOutOf10 >= 5 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-900">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                            {t.gradePassedAlready}
                          </span>
                        ) : gradeStats.evaluatedPct > 0 &&
                          gradeStats.neededToPass !== null ? (
                          gradeStats.neededToPass <= 10 ? (
                            <p className="text-xs font-medium text-slate-700">
                              {t.gradeNeededToPass
                                .replace(
                                  "{score}",
                                  Math.max(0, gradeStats.neededToPass).toFixed(
                                    2,
                                  ),
                                )
                                .replace(
                                  "{pct}",
                                  String(gradeStats.remainingPct),
                                )}
                            </p>
                          ) : (
                            <p className="text-xs font-semibold text-rose-700">
                              {t.gradeCannotPass}
                            </p>
                          )
                        ) : (
                          <p className="text-xs text-slate-500">
                            {locale === "es"
                              ? "Introduce tus notas (0–10) para ver tu progreso."
                              : "Enter your scores (0–10) below to track progress."}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar (out of 10 with 5.0 pass marker) */}
                    <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          gradeStats.earnedOutOf10 >= 5
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (gradeStats.earnedOutOf10 / 10) * 100)}%`,
                        }}
                      />
                      {/* 5.0 pass line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-700/60"
                        style={{ left: "50%" }}
                        title="5.0 / 10"
                      />
                    </div>
                  </div>

                  {/* Grading Rubric Rows */}
                  <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {selectedModule.grading.map((item) => {
                      const linkedAssignment = item.assignmentId
                        ? assignmentsById[item.assignmentId]
                        : undefined;
                      const unitLabel =
                        locale === "en"
                          ? item.unitLabelEn || item.unitLabelEs
                          : item.unitLabelEs || item.unitLabelEn;
                      const title =
                        locale === "en" && item.titleEn
                          ? item.titleEn
                          : item.titleEs;
                      const dueText = linkedAssignment
                        ? `${formatDateHeading(
                            linkedAssignment.dueDate,
                            locale,
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            },
                          )} · ${linkedAssignment.dueTime}`
                        : locale === "en"
                          ? item.dueDateLabelEn || item.dueDateLabelEs
                          : item.dueDateLabelEs || item.dueDateLabelEn;

                      const isPastDue = linkedAssignment
                        ? isAssignmentPast(linkedAssignment)
                        : false;

                      const rawGrade = grades[item.id] ?? "";
                      const weightedContrib =
                        rawGrade !== "" && !Number.isNaN(Number(rawGrade))
                          ? (
                              (Number(rawGrade) * item.weightPercent) /
                              100
                            ).toFixed(2)
                          : null;

                      return (
                        <div
                          key={item.id}
                          className={`flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between ${
                            item.weightPercent === 0
                              ? "bg-slate-50/60"
                              : "bg-white"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {unitLabel && (
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                  {unitLabel}
                                </span>
                              )}
                              {item.weightPercent > 0 ? (
                                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-800">
                                  {item.weightPercent}%
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                  {t.nonGradedBadge}
                                </span>
                              )}
                              {item.type === "quiz" && (
                                <span className="rounded-full border border-slate-200 px-2 py-0.2 text-[10px] font-semibold text-slate-600">
                                  {t.assignmentQuizBadge}
                                </span>
                              )}
                              {item.type === "task" && (
                                <span className="rounded-full border border-slate-200 px-2 py-0.2 text-[10px] font-semibold text-slate-600">
                                  {t.assignmentTaskBadge}
                                </span>
                              )}
                              {item.type === "exam" && (
                                <span className="rounded-full bg-rose-50 px-2 py-0.2 text-[10px] font-semibold text-rose-800">
                                  {t.finalExamLabel}
                                </span>
                              )}
                              {linkedAssignment && (
                                <StreamBadge
                                  stream={linkedAssignment.stream}
                                  locale={locale}
                                />
                              )}
                            </div>

                            <p
                              className={`mt-1 text-sm font-semibold ${
                                item.weightPercent === 0
                                  ? "text-slate-500"
                                  : "text-slate-900"
                              }`}
                            >
                              {title}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              {dueText && (
                                <span
                                  className={
                                    isPastDue
                                      ? "text-slate-400"
                                      : "font-medium text-amber-800"
                                  }
                                >
                                  {t.dueAtLabel}: {dueText}
                                  {isPastDue ? ` (${t.closedBadge})` : ""}
                                </span>
                              )}
                              {item.descriptionUrl && (
                                <a
                                  href={item.descriptionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline"
                                >
                                  <FileText className="h-3 w-3" />
                                  {t.viewDescription}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Personal Grade Input */}
                          {item.weightPercent > 0 && (
                            <div className="flex items-center gap-2 sm:shrink-0">
                              <div className="flex items-center gap-1.5">
                                <label
                                  htmlFor={`grade-${item.id}`}
                                  className="text-[11px] font-medium text-slate-500"
                                >
                                  {t.gradeYourScore}:
                                </label>
                                <input
                                  id={`grade-${item.id}`}
                                  type="text"
                                  inputMode="decimal"
                                  value={rawGrade}
                                  onChange={(e) =>
                                    updateGrade(item.id, e.target.value)
                                  }
                                  placeholder={t.gradeInputPlaceholder}
                                  className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-xs font-bold text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none"
                                />
                                <span className="text-xs text-slate-400">
                                  / 10
                                </span>
                              </div>
                              {weightedContrib !== null && (
                                <span className="w-14 text-right text-[11px] font-bold text-emerald-700">
                                  +{weightedContrib}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>

            {/* Classes & Recordings for this Unit */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {t.unitClassesTitle}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {unitSessions.length}{" "}
                  {unitSessions.length === 1
                    ? t.sessionSingle
                    : t.sessionsCount}
                </span>
              </div>

              {unitSessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center text-xs text-slate-500">
                  {t.unitNoClassesYet}
                </div>
              ) : (
                <div className="space-y-2">
                  {unitSessions.map((session) => {
                    const sc = commentsBySession[session.id] ?? [];
                    const visibleComments = sc.filter(
                      (c) => c.reportCount < 3,
                    );
                    const title =
                      locale === "en"
                        ? session.titleEn ||
                          session.title ||
                          selectedModule.nameEn ||
                          selectedModule.name
                        : session.title || selectedModule.name;

                    const resolvedLinks = streamsToShow.map((st) => ({
                      stream: st,
                      link: resolveMeetingLink(session, st, sc),
                    }));

                    return (
                      <div
                        key={session.id}
                        className="flex flex-col gap-2.5 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenSession(session)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900">
                              {formatDateHeading(session.date, locale, {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Clock className="h-3 w-3" />
                              {session.startTime}–{session.endTime}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm font-semibold text-slate-900">
                            {title}
                          </p>
                        </button>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {resolvedLinks.map(({ stream, link }) =>
                            link ? (
                              <a
                                key={stream}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition ${
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
                                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-200 px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-50"
                              >
                                <Link2Off className="h-3 w-3" />
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
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
                                  >
                                    <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                      {partLabel
                                        ? `${t.recordingShort} · ${partLabel}`
                                        : t.recordingShort}
                                      {streamFilter === "ALL"
                                        ? ` (${stream})`
                                        : ""}
                                    </span>
                                  </a>
                                );
                              },
                            ),
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenSession(session)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                            <span>{visibleComments.length}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
