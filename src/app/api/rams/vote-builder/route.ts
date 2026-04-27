import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../_helpers";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/rams/vote-builder
 *
 * Captures a vote-to-build email for a planned/wip RAMs builder.
 * Surfaces real demand for the 31 stub builders so we can prioritise.
 *
 * Auth: requires a session (so we know which org/user voted).
 * Rate limit: 5 votes per user per hour (prevents spam, allows correcting typos).
 *
 * Body: { slug: string, email: string }
 * Inserts into builder_votes (created in migration 0004).
 *
 * 27 Apr 2026.
 */

const VoteSchema = z.object({
  slug: z.string().min(1).max(64),
  email: z.string().email().max(254),
});

export async function POST(req: NextRequest) {
  const ctx = await resolveContext();
  if (!ctx)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  // Rate limit: 5 votes per user per hour
  const rl = checkRateLimit(`vote-builder:${ctx.userId}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many votes. Try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = VoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("builder_votes").insert({
    builder_slug: parsed.data.slug,
    email: parsed.data.email.toLowerCase(),
    organisation_id: ctx.organisationId,
    user_id: ctx.userId,
  });

  if (error) {
    // Unique-violation = same user voted for same builder twice — silent OK
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyVoted: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
