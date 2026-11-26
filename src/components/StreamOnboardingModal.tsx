"use client";

import { GraduationCap } from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import type { Locale, StreamFilter } from "@/types/calendar";

interface StreamOnboardingModalProps {
  locale: Locale;
  onSelect: (choice: StreamFilter) => void;
}

export function StreamOnboardingModal({
  locale,
  onSelect,
}: StreamOnboardingModalProps) {
  const t = getTranslations(locale);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {t.chooseStreamTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {t.chooseStreamSubtitle}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelect("M11")}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-indigo-200 bg-indigo-50/70 px-4 py-5 text-center transition hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span className="text-2xl font-bold text-indigo-900">M11</span>
            <span className="mt-1 text-xs font-medium text-indigo-700">
              {locale === "es" ? "Grupo M11" : "Group M11"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelect("M12")}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-teal-200 bg-teal-50/70 px-4 py-5 text-center transition hover:border-teal-500 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span className="text-2xl font-bold text-teal-900">M12</span>
            <span className="mt-1 text-xs font-medium text-teal-700">
              {locale === "es" ? "Grupo M12" : "Group M12"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelect("ALL")}
          className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {locale === "es"
            ? "Ver ambos grupos (M11 + M12)"
            : "Show both groups (M11 + M12)"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          {t.chooseStreamHint}
        </p>
      </div>
    </div>
  );
}
