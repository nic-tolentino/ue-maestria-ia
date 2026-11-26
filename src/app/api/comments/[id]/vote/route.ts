import { NextRequest, NextResponse } from "next/server";
import { voteComment } from "@/lib/comments-store";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { delta?: number };
    const delta = payload.delta === -1 ? -1 : 1;

    const updated = await voteComment(id, delta);
    if (!updated) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment: updated });
  } catch (err) {
    console.error("[POST /api/comments/[id]/vote]", err);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
