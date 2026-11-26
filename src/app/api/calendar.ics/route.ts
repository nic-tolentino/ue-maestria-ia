import { NextRequest, NextResponse } from "next/server";
import { ASSIGNMENTS } from "@/data/assignments";
import { MILESTONES } from "@/data/milestones";
import { getModule } from "@/data/modules";
import { SESSIONS } from "@/data/sessions";
import { listComments } from "@/lib/comments-store";
import { addDays, madridDateTimeToUtc, resolveMeetingLink } from "@/lib/schedule";
import type { Stream } from "@/types/calendar";

function formatIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function formatIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export async function GET(request: NextRequest) {
  const streamParam = request.nextUrl.searchParams.get("stream")?.toUpperCase();
  const stream: Stream = streamParam === "M12" ? "M12" : "M11";

  const allComments = await listComments();
  const commentsBySession = new Map<string, typeof allComments>();
  for (const c of allComments) {
    const arr = commentsBySession.get(c.sessionId) ?? [];
    arr.push(c);
    commentsBySession.set(c.sessionId, arr);
  }

  const nowStamp = formatIcsUtc(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UE Master IA//Class Calendar//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:UE Master IA (${stream})`,
    "X-WR-TIMEZONE:Europe/Madrid",
  ];

  for (const session of SESSIONS) {
    if (session.status === "cancelled") continue;
    const mod = getModule(session.moduleId);
    const startUtc = madridDateTimeToUtc(session.date, session.startTime);
    const endUtc = madridDateTimeToUtc(session.date, session.endTime);
    const resolved = resolveMeetingLink(
      session,
      stream,
      commentsBySession.get(session.id) ?? [],
    );

    const summary = session.title
      ? `[${stream}] ${session.title}`
      : `[${stream}] ${mod.shortName} · Máster en IA`;

    const professor = mod.professors?.[stream];
    const descParts = [
      `Módulo: ${mod.name}`,
      `Grupo: ${stream}`,
      ...(professor ? [`Profesor/a: ${professor}`] : []),
      `Horario (Madrid): ${session.startTime}–${session.endTime}`,
      ...(session.notesEs ? [`Notas: ${session.notesEs}`] : []),
    ];
    if (resolved) {
      descParts.push(`Enlace Teams: ${resolved.url}`);
    } else {
      descParts.push(
        "Enlace Teams: Pendiente — revisa la web del calendario para ver comentarios.",
      );
    }

    lines.push(
      "BEGIN:VEVENT",
      `UID:${session.id}-${stream.toLowerCase()}@ue-maestria-ia`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${formatIcsUtc(startUtc)}`,
      `DTEND:${formatIcsUtc(endUtc)}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(descParts.join("\n"))}`,
      ...(resolved
        ? [`LOCATION:${escapeIcs(resolved.url)}`, `URL:${resolved.url}`]
        : ["LOCATION:Microsoft Teams (UE Online)"]),
      "END:VEVENT",
    );
  }

  // Include Assignments & Quiz Deadlines matching stream
  for (const a of ASSIGNMENTS) {
    if (a.stream !== "BOTH" && a.stream !== stream) continue;
    const mod = getModule(a.moduleId);
    const dueUtc = madridDateTimeToUtc(a.dueDate, a.dueTime);
    const endUtc = new Date(dueUtc.getTime() + 30 * 60 * 1000);
    const typeLabel = a.type === "quiz" ? "Cuestionario" : "Entrega";
    const descParts = [
      `Módulo: ${mod.name}`,
      `Tipo: ${typeLabel}`,
      ...(a.points ? [`Puntuación: ${a.points} pts`] : []),
      ...(a.notesEs ? [a.notesEs] : []),
    ];

    lines.push(
      "BEGIN:VEVENT",
      `UID:assignment-${a.id}-${stream.toLowerCase()}@ue-maestria-ia`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${formatIcsUtc(dueUtc)}`,
      `DTEND:${formatIcsUtc(endUtc)}`,
      `SUMMARY:${escapeIcs(`📝 [${typeLabel} ${a.dueTime}] ${a.titleEs}`)}`,
      `DESCRIPTION:${escapeIcs(descParts.join("\n"))}`,
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcs(`Entrega mañana ${a.dueTime}: ${a.titleEs}`)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }

  // Include Exams & TFM Milestones as all-day events
  for (const ms of MILESTONES) {
    const dtEndExclusive = addDays(ms.endDate, 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ms.id}@ue-maestria-ia`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;VALUE=DATE:${formatIcsDate(ms.startDate)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(dtEndExclusive)}`,
      `SUMMARY:${escapeIcs(`🎓 ${ms.titleEs}`)}`,
      `DESCRIPTION:${escapeIcs(`${ms.titleEs} / ${ms.titleEn}`)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="ue-master-ia-${stream.toLowerCase()}.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
