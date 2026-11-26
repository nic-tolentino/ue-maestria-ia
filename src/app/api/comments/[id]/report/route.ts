import { after, NextRequest, NextResponse } from "next/server";
import { reportComment } from "@/lib/comments-store";
import { notifyCommentReported } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ReportReason } from "@/types/calendar";

const VALID_REASONS = new Set<ReportReason>([
  "spam",
  "wrong_link",
  "inappropriate",
  "outdated",
  "other",
]);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const rate = checkRateLimit(request, "comments:report", 10, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many reports — please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const { id } = await context.params;
    const payload = (await request.json()) as {
      reason?: string;
      details?: string;
    };

    const reason: ReportReason = VALID_REASONS.has(
      payload.reason as ReportReason,
    )
      ? (payload.reason as ReportReason)
      : "other";

    const updated = await reportComment(id, reason, payload.details);
    if (!updated) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Fire urgent phone alert to organizer (keeps serverless lambda alive until delivered)
    after(async () => {
      await notifyCommentReported(updated, reason, payload.details);
    });

    return NextResponse.json({ comment: updated });
  } catch (err) {
    console.error("[POST /api/comments/[id]/report]", err);
    return NextResponse.json(
      { error: "Failed to report comment" },
      { status: 500 },
    );
  }
}
