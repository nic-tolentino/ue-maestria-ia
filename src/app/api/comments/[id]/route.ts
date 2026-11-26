import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  clearCommentReports,
  deleteComment,
  setCommentPinned,
} from "@/lib/comments-store";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminRequest(request);
  if (!auth.configured) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured on this server." },
      { status: 503 },
    );
  }
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as {
      isPinned?: boolean;
      clearReports?: boolean;
    };

    let updated = null;

    if (typeof payload.isPinned === "boolean") {
      updated = await setCommentPinned(id, payload.isPinned);
      if (!updated) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }
    }

    if (payload.clearReports) {
      updated = await clearCommentReports(id);
      if (!updated) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 },
        );
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Provide isPinned or clearReports" },
        { status: 400 },
      );
    }

    return NextResponse.json({ comment: updated });
  } catch (err) {
    console.error("[PATCH /api/comments/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminRequest(request);
  if (!auth.configured) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured on this server." },
      { status: 503 },
    );
  }
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteComment(id);
    if (!deleted) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true, id });
  } catch (err) {
    console.error("[DELETE /api/comments/[id]]", err);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
