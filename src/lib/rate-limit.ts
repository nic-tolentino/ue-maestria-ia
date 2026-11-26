import type { NextRequest } from "next/server";

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/**
 * Lightweight in-memory sliding-window rate limiter per client IP + scope.
 * Keeps bots from flooding comments/reports without adding friction for classmates.
 */
export function checkRateLimit(
  request: NextRequest,
  scope: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip =
    forwarded?.split(",")[0]?.trim() || realIp?.trim() || "local-unknown";
  const key = `${scope}:${ip}`;

  const now = Date.now();
  const cutoff = now - windowMs;

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  if (bucket.timestamps.length >= maxRequests) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000),
    );
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  // Prevent unbounded memory growth on long-lived processes
  if (buckets.size > 1000) {
    for (const [k, b] of buckets.entries()) {
      if (b.timestamps.every((ts) => ts <= cutoff)) {
        buckets.delete(k);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
