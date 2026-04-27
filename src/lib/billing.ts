/**
 * Billing helpers — single source of truth for "does this org have Pro access?"
 *
 * Pro access = (paid subscription active) OR (still inside the 5-day free trial)
 *
 * Trial is set on signup (onboarding action). After 5 days the gate trips
 * and PDF generation falls back to watermarked output.
 *
 * 27 Apr 2026.
 */

export const TRIAL_DURATION_DAYS = 5;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface SubscriptionLike {
  tier: string | null;
  status: string | null;
  trial_ends_at: string | null;
}

/**
 * Returns true if the org should currently get Pro features (clean PDFs,
 * unlimited AI, send-to-client, etc.).
 */
export function hasProAccess(sub: SubscriptionLike | null | undefined): boolean {
  if (!sub) return false;

  // Paid + active subscription
  if (
    sub.tier === "pro" &&
    (sub.status === "active" || sub.status === "trialing")
  ) {
    if (sub.status === "active") return true;
    // For 'trialing' status, also check the trial hasn't lapsed
    return isWithinTrial(sub.trial_ends_at);
  }

  // Pure trial (tier may still be 'free' if Stripe hasn't kicked in but trial is live)
  if (sub.status === "trialing" && isWithinTrial(sub.trial_ends_at)) {
    return true;
  }

  return false;
}

/**
 * Returns true if there's a `trial_ends_at` and it's in the future.
 */
export function isWithinTrial(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false;
  const ends = new Date(trialEndsAt).getTime();
  if (Number.isNaN(ends)) return false;
  return ends > Date.now();
}

/**
 * Whole days remaining in the trial. Returns 0 if expired or no trial set.
 */
export function trialDaysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const ends = new Date(trialEndsAt).getTime();
  if (Number.isNaN(ends)) return 0;
  const ms = ends - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * Compute the trial end timestamp for a fresh signup.
 * Called once during onboarding when creating the first subscription row.
 */
export function newTrialEndsAt(now: Date = new Date()): string {
  return new Date(now.getTime() + TRIAL_DURATION_MS).toISOString();
}

/**
 * Returns a short human-readable trial state for UI banners.
 *  - "active" — trial running, X days left
 *  - "expired" — trial finished, no Pro
 *  - "paid" — has paid Pro subscription
 *  - "none" — no subscription row at all (shouldn't happen post-onboarding)
 */
export function trialState(
  sub: SubscriptionLike | null | undefined
): "active" | "expired" | "paid" | "none" {
  if (!sub) return "none";
  if (sub.tier === "pro" && sub.status === "active") return "paid";
  if (isWithinTrial(sub.trial_ends_at)) return "active";
  if (sub.trial_ends_at) return "expired";
  return "none";
}
