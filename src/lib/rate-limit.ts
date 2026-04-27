/**
 * In-memory rate limiter — sliding window per identifier.
 *
 * Single-instance only — when we deploy to Vercel with multiple regions or
 * scale beyond one node, swap this for Upstash Redis. For now, ClickNComply
 * runs as a single Next.js process so an in-memory Map is enough to stop
 * AI burn from a misbehaving client.
 *
 * Usage:
 *   const rl = checkRateLimit("ai:" + userId, 20, 60_000);
 *   if (!rl.allowed) return 429;
 *
 * 27 Apr 2026.
 */

interface BucketEntry {
  hits: number[]; // ms timestamps within the window
}

const buckets = new Map<string, BucketEntry>();

// Periodic cleanup so unused keys don't leak memory across days.
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
function ensureCleanup(maxAgeMs: number) {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const cutoff = Date.now() - maxAgeMs;
    for (const [key, entry] of buckets) {
      const fresh = entry.hits.filter((t) => t > cutoff);
      if (fresh.length === 0) buckets.delete(key);
      else entry.hits = fresh;
    }
  }, 60_000);
  // Don't keep the process alive just for cleanup
  if (typeof cleanupInterval === "object" && "unref" in cleanupInterval) {
    (cleanupInterval as { unref: () => void }).unref();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

/**
 * Returns whether the request should be allowed under a sliding-window limit.
 *
 * @param key       unique identifier (e.g. `ai:userId`)
 * @param max       maximum allowed hits in the window
 * @param windowMs  window size in ms
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  ensureCleanup(windowMs * 2);

  const now = Date.now();
  const cutoff = now - windowMs;

  const entry = buckets.get(key) ?? { hits: [] };
  // Drop hits that fell out of the window
  entry.hits = entry.hits.filter((t) => t > cutoff);

  if (entry.hits.length >= max) {
    const resetAtMs = entry.hits[0] + windowMs;
    buckets.set(key, entry);
    return { allowed: false, remaining: 0, resetAtMs };
  }

  entry.hits.push(now);
  buckets.set(key, entry);
  return {
    allowed: true,
    remaining: max - entry.hits.length,
    resetAtMs: now + windowMs,
  };
}

/**
 * Clears a key — useful in tests or for manual reset.
 */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
