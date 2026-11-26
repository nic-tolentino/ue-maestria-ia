"use client";

import { useState } from "react";
import { CalendarPlus, Check, Copy, Download, X } from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import type { Locale, Stream } from "@/types/calendar";

interface SubscribeModalProps {
  locale: Locale;
  defaultStream: Stream;
  onClose: () => void;
}

export function SubscribeModal({
  locale,
  defaultStream,
  onClose,
}: SubscribeModalProps) {
  const t = getTranslations(locale);
  const [selectedStream, setSelectedStream] = useState<Stream>(defaultStream);
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const feedPath = `/api/calendar.ics?stream=${selectedStream}`;
  const fullUrl = `${origin}${feedPath}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.subscribeTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Google Calendar · Apple Calendar · Outlook
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600">{t.subscribeSubtitle}</p>

        <div className="mt-4 flex gap-2">
          {(["M11", "M12"] as Stream[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStream(s)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                selectedStream === s
                  ? s === "M11"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                    : "border-teal-500 bg-teal-50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.streamLabel} {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <code className="flex-1 truncate px-2 text-xs text-slate-700">
            {fullUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {t.copyLink}
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <a
            href={feedPath}
            download={`ue-master-ia-${selectedStream.toLowerCase()}.ics`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            {t.downloadIcs}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
