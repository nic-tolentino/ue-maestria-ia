import type { ReportReason, SessionComment } from "@/types/calendar";

interface NotifyPayload {
  title: string;
  message: string;
  priority: "default" | "urgent";
  tags: string[];
  clickUrl?: string;
}

/**
 * Sends instant phone push notifications to the organizer.
 * Supports:
 *  1. ntfy.sh (easiest: install ntfy app on iOS/Android, set NTFY_TOPIC env var)
 *  2. Telegram Bot (set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID)
 *  3. Generic Webhook (set NOTIFY_WEBHOOK_URL for Discord/Slack/etc.)
 *
 * Never throws so user actions succeed even if notification delivery fails.
 */
async function dispatchNotification(payload: NotifyPayload): Promise<void> {
  const ntfyTopic = process.env.NTFY_TOPIC?.trim();
  const ntfyServer = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(
    /\/+$/,
    "",
  );
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL?.trim();

  // Always log in server console so you can verify alerts during local dev
  console.info(
    `[NOTIFY:${payload.priority.toUpperCase()}] ${payload.title} — ${payload.message}`,
  );

  const tasks: Promise<unknown>[] = [];

  if (ntfyTopic) {
    const headers: Record<string, string> = {
      Title: payload.title,
      Priority: payload.priority === "urgent" ? "5" : "3",
      Tags: payload.tags.join(","),
    };
    if (payload.clickUrl) {
      headers.Click = payload.clickUrl;
    }
    tasks.push(
      fetch(`${ntfyServer}/${encodeURIComponent(ntfyTopic)}`, {
        method: "POST",
        headers,
        body: payload.message,
        signal: AbortSignal.timeout(4000),
      }).catch((err) => console.error("[notify:ntfy]", err)),
    );
  }

  if (telegramToken && telegramChatId) {
    const prefix = payload.priority === "urgent" ? "🚨 " : "💬 ";
    const text = `${prefix}*${escapeTelegram(payload.title)}*\n${escapeTelegram(payload.message)}${
      payload.clickUrl ? `\n${payload.clickUrl}` : ""
    }`;
    tasks.push(
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: "Markdown",
        }),
        signal: AbortSignal.timeout(4000),
      }).catch((err) => console.error("[notify:telegram]", err)),
    );
  }

  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Works out of the box for Slack (`text`) & Discord (`content`)
          text: `**${payload.title}**\n${payload.message}`,
          content: `**${payload.title}**\n${payload.message}`,
          priority: payload.priority,
          clickUrl: payload.clickUrl,
        }),
        signal: AbortSignal.timeout(4000),
      }).catch((err) => console.error("[notify:webhook]", err)),
    );
  }

  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }
}

function escapeTelegram(s: string): string {
  return s.replace(/[_*`[\]]/g, "\\$&");
}

function buildSessionUrl(sessionId: string): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercelPreview = process.env.VERCEL_URL?.trim();

  const rawBase = explicit || vercelProd || vercelPreview;
  if (!rawBase) return undefined;

  const normalized = /^https?:\/\//i.test(rawBase)
    ? rawBase.replace(/\/+$/, "")
    : `https://${rawBase.replace(/\/+$/, "")}`;

  return `${normalized}/?session=${encodeURIComponent(sessionId)}`;
}

export async function notifyNewComment(comment: SessionComment): Promise<void> {
  const linkNote = comment.sharedUrl ? `\nLink: ${comment.sharedUrl}` : "";
  await dispatchNotification({
    title: `New comment [${comment.stream}] · ${comment.sessionId}`,
    message: `${comment.authorName}: ${comment.body}${linkNote}`,
    priority: "default",
    tags: comment.sharedUrl ? ["link", "speech_balloon"] : ["speech_balloon"],
    clickUrl: buildSessionUrl(comment.sessionId),
  });
}

export async function notifyCommentReported(
  comment: SessionComment,
  reason: ReportReason,
  details?: string,
): Promise<void> {
  const detailLine = details ? `\nDetails: ${details}` : "";
  await dispatchNotification({
    title: `REPORTED comment (${comment.reportCount}x) · ${comment.sessionId}`,
    message: `Reason: ${reason}${detailLine}\nAuthor: ${comment.authorName} [${comment.stream}]\nText: "${comment.body}"`,
    priority: "urgent",
    tags: ["rotating_light", "warning"],
    clickUrl: buildSessionUrl(comment.sessionId),
  });
}
