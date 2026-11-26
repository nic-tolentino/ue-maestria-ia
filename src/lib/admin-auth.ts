import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export interface AdminAuthResult {
  configured: boolean;
  valid: boolean;
  isDevFallback?: boolean;
}

/**
 * Verifies the organizer's admin secret using timing-safe comparison.
 *
 * - In production: requires `ADMIN_SECRET` env var to be set and match exactly.
 * - In local `development` (`next dev`): if `ADMIN_SECRET` is not set, accepts `"dev"`
 *   so contributors can test admin moderation locally without extra setup.
 */
export function verifyAdminSecret(candidate: string | null | undefined): AdminAuthResult {
  const configuredSecret = process.env.ADMIN_SECRET?.trim();
  const input = candidate?.trim() ?? "";

  if (!configuredSecret) {
    if (process.env.NODE_ENV === "development") {
      return {
        configured: true,
        valid: input === "dev",
        isDevFallback: true,
      };
    }
    return { configured: false, valid: false };
  }

  if (!input) {
    return { configured: true, valid: false };
  }

  const a = Buffer.from(configuredSecret, "utf8");
  const b = Buffer.from(input, "utf8");
  if (a.length !== b.length) {
    return { configured: true, valid: false };
  }

  return {
    configured: true,
    valid: crypto.timingSafeEqual(a, b),
  };
}

export function verifyAdminRequest(request: NextRequest): AdminAuthResult {
  const header = request.headers.get("x-admin-secret");
  return verifyAdminSecret(header);
}
