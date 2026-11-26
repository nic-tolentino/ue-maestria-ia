"use client";

import type { CommentStream, Locale } from "@/types/calendar";
import { getTranslations } from "@/lib/i18n";

interface StreamBadgeProps {
  stream: CommentStream;
  locale?: Locale;
  size?: "xs" | "sm";
}

export function StreamBadge({
  stream,
  locale = "es",
  size = "xs",
}: StreamBadgeProps) {
  const t = getTranslations(locale);
  const sizeClass =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[11px]";

  if (stream === "M11") {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 font-semibold text-indigo-800 ${sizeClass}`}
      >
        M11
      </span>
    );
  }
  if (stream === "M12") {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-teal-200 bg-teal-50 font-semibold text-teal-800 ${sizeClass}`}
      >
        M12
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-700 ${sizeClass}`}
    >
      {t.streamBothBadge}
    </span>
  );
}
