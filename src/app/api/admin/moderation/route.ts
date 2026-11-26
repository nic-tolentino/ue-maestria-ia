import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { listAdminModerationData } from "@/lib/comments-store";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.configured) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured on this server." },
      { status: 503 },
    );
  }
  if (!auth.valid) {
    const rate = checkRateLimit(request, "admin:verify", 10, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await listAdminModerationData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/admin/moderation]", err);
    return NextResponse.json(
      { error: "Failed to load moderation data" },
      { status: 500 },
    );
  }
}
