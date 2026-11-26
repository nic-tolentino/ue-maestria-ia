import { after, NextRequest, NextResponse } from "next/server";
import { createComment, listComments } from "@/lib/comments-store";
import { notifyNewComment } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import { extractFirstUrl, sanitizeHttpUrl } from "@/lib/schedule";
import type { CommentStream } from "@/types/calendar";

const VALID_STREAMS = new Set<CommentStream>(["M11", "M12", "BOTH"]);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId") ?? undefined;
  const comments = await listComments(sessionId);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, "comments:post", 10, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many comments — please wait a moment and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const payload = (await request.json()) as {
      sessionId?: string;
      authorName?: string;
      stream?: string;
      body?: string;
      sharedUrl?: string;
      /** Hidden honeypot field — humans leave this empty */
      website?: string;
    };

    // Silently ignore automated bots that fill the hidden honeypot field
    if (payload.website && payload.website.trim().length > 0) {
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }

    const sessionId = payload.sessionId?.trim();
    const authorName = payload.authorName?.trim();
    const rawBody = payload.body?.trim() ?? "";
    const stream = payload.stream as CommentStream;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 },
      );
    }
    if (!authorName || authorName.length < 1) {
      return NextResponse.json(
        { error: "authorName is required" },
        { status: 400 },
      );
    }
    if (!VALID_STREAMS.has(stream)) {
      return NextResponse.json({ error: "Invalid stream" }, { status: 400 });
    }

    // Use explicit sharedUrl if valid, otherwise auto-detect URL pasted inside the message
    const explicitUrl = sanitizeHttpUrl(payload.sharedUrl);
    const detectedUrl = sanitizeHttpUrl(extractFirstUrl(rawBody));
    const sharedUrl = explicitUrl ?? detectedUrl;

    if (!rawBody && !sharedUrl) {
      return NextResponse.json(
        { error: "body or sharedUrl is required" },
        { status: 400 },
      );
    }

    const body = rawBody || (sharedUrl ? `Shared class link: ${sharedUrl}` : "");

    const comment = await createComment({
      sessionId,
      authorName,
      stream,
      body,
      sharedUrl,
    });

    // Run push notification after response finishes (keeps serverless lambda alive until sent)
    after(async () => {
      await notifyNewComment(comment);
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return NextResponse.json(
      { error: "Failed to save comment" },
      { status: 500 },
    );
  }
}
