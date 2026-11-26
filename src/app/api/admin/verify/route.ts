import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
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

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      secret?: string;
    };
    const auth = verifyAdminSecret(
      payload.secret ?? request.headers.get("x-admin-secret"),
    );

    if (!auth.configured) {
      return NextResponse.json(
        { error: "ADMIN_SECRET is not configured on this server." },
        { status: 503 },
      );
    }

    if (!auth.valid) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      isDevFallback: Boolean(auth.isDevFallback),
    });
  } catch (err) {
    console.error("[POST /api/admin/verify]", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 },
    );
  }
}
