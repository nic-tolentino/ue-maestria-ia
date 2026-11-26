"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Mail,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import {
  getModule,
  getModuleShortName,
  MODULE_COLORS,
} from "@/data/modules";
import {
  buildFacultyDirectory,
  CLASS_REPRESENTATIVES,
  PROGRAM_LEADERSHIP,
  STUDENT_SUPPORT_CONTACTS,
} from "@/data/people";
import { getTranslations } from "@/lib/i18n";
import type { Locale, StreamFilter } from "@/types/calendar";
import { StreamBadge } from "./StreamBadge";

interface PeopleViewProps {
  streamFilter: StreamFilter;
  locale: Locale;
  onOpenUnit: (moduleId: string) => void;
}

function getInitials(name: string): string {
  const parts = name
    .replace(/,/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function PeopleView({
  streamFilter,
  locale,
  onOpenUnit,
}: PeopleViewProps) {
  const t = getTranslations(locale);
  const [query, setQuery] = useState("");
  const [showAllStreams, setShowAllStreams] = useState(false);

  const effectiveStream: StreamFilter = showAllStreams ? "ALL" : streamFilter;
  const normalizedQuery = query.trim().toLowerCase();

  const allFaculty = useMemo(() => buildFacultyDirectory(), []);

  const filteredLeadership = useMemo(() => {
    if (!normalizedQuery) return PROGRAM_LEADERSHIP;
    return PROGRAM_LEADERSHIP.filter((p) => {
      const hay = [
        p.name,
        p.roleEs,
        p.roleEn,
        p.badgeEs,
        p.badgeEn,
        p.noteEs,
        p.noteEn,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredReps = useMemo(() => {
    return CLASS_REPRESENTATIVES.filter((rep) => {
      if (effectiveStream !== "ALL" && rep.stream !== effectiveStream) {
        return false;
      }
      if (!normalizedQuery) return true;
      const hay = [rep.name, rep.roleEs, rep.roleEn, rep.stream]
        .join(" ")
        .toLowerCase();
      return hay.includes(normalizedQuery);
    });
  }, [effectiveStream, normalizedQuery]);

  const filteredFaculty = useMemo(() => {
    return allFaculty
      .map((member) => {
        const assignments =
          effectiveStream === "ALL"
            ? member.assignments
            : member.assignments.filter((a) =>
                a.streams.includes(effectiveStream),
              );
        return { ...member, assignments };
      })
      .filter((member) => {
        if (member.assignments.length === 0) return false;
        if (!normalizedQuery) return true;
        const hay = [
          member.name,
          member.leadershipRoleEs ?? "",
          member.leadershipRoleEn ?? "",
          ...member.assignments.flatMap((a) => [
            a.module.name,
            a.module.nameEn ?? "",
            a.module.shortName,
            a.module.shortNameEn ?? "",
            a.module.code,
            ...a.streams,
          ]),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(normalizedQuery);
      });
  }, [allFaculty, effectiveStream, normalizedQuery]);

  const hasAnyResults =
    filteredLeadership.length > 0 ||
    filteredReps.length > 0 ||
    filteredFaculty.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Search & Stream Context Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                {t.peopleTitle}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{t.peopleSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.peopleSearchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>

            {streamFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setShowAllStreams((prev) => !prev)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  showAllStreams
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {showAllStreams
                  ? t.peopleShowingAll
                  : t.peopleFilterNotice.replace("{stream}", streamFilter)}
              </button>
            )}
          </div>
        </div>
      </section>

      {!hasAnyResults && (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t.peopleNoMatches}
        </section>
      )}

      {/* 1. Program Leadership & Online Tutoring */}
      {filteredLeadership.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              {t.peopleLeadershipTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {filteredLeadership.map((staff) => {
              const isTutor = staff.id === "david-garde";
              return (
                <article
                  key={staff.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            isTutor
                              ? "bg-amber-100 text-amber-900"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {getInitials(staff.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900">
                            {staff.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-600">
                            {locale === "en" ? staff.roleEn : staff.roleEs}
                          </p>
                        </div>
                      </div>
                      <StreamBadge stream={staff.stream} locale={locale} />
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {locale === "en" ? staff.noteEn : staff.noteEs}
                    </p>
                  </div>

                  {staff.relatedModuleIds &&
                    staff.relatedModuleIds.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                        {staff.relatedModuleIds.map((modId) => {
                          const mod = getModule(modId);
                          const colors = MODULE_COLORS[mod.color];
                          return (
                            <button
                              key={modId}
                              type="button"
                              onClick={() => onOpenUnit(modId)}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold transition hover:opacity-80 ${colors.badge}`}
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>{getModuleShortName(mod, locale)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Class Representatives (Delegados) */}
      {filteredReps.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                {t.peopleRepsTitle}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {t.peopleRepsSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReps.map((rep) => (
              <article
                key={rep.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      rep.stream === "M11"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-teal-100 text-teal-800"
                    }`}
                  >
                    {getInitials(rep.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-slate-900">
                      {rep.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-600">
                      {locale === "en" ? rep.roleEn : rep.roleEs}
                    </p>
                  </div>
                </div>
                <StreamBadge stream={rep.stream} locale={locale} />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Faculty & Professors (auto-derived from modules.ts) */}
      {filteredFaculty.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                {t.peopleFacultyTitle}
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {filteredFaculty.length}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {t.peopleFacultyHint}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredFaculty.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">
                        {member.name}
                      </h4>
                      {member.leadershipRoleEs && (
                        <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700">
                          <Award className="h-3 w-3" />
                          <span>
                            {locale === "en"
                              ? member.leadershipRoleEn
                              : member.leadershipRoleEs}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {member.assignments.map(({ module: mod, streams }) => {
                    const colors = MODULE_COLORS[mod.color];
                    const streamLabel =
                      streams.length === 2 ? "BOTH" : streams[0];
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => onOpenUnit(mod.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-left transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`}
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {getModuleShortName(mod, locale)}
                        </span>
                        <StreamBadge stream={streamLabel} locale={locale} />
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 4. University Student Support (ODI) */}
      {!normalizedQuery && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              {t.peopleSupportTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STUDENT_SUPPORT_CONTACTS.map((contact) => (
              <article
                key={contact.id}
                className="flex flex-col justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    {locale === "en" ? contact.nameEn : contact.nameEs}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {locale === "en" ? contact.noteEn : contact.noteEs}
                  </p>
                </div>
                <div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
