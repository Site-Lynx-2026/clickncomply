import { NextRequest, NextResponse } from "next/server";
import { anthropic, DEFAULT_MODEL } from "@/lib/anthropic/client";
import { resolveContext } from "../../rams/_helpers";
import { hasProAccess } from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { BUILDERS, type BuilderSlug } from "@/lib/rams/builders";

/**
 * POST /api/ai/intake
 *
 * One-shot intake. The user types a single sentence on the dashboard:
 *   "first fix electrical at plot 12 lyme wood tomorrow"
 *
 * The model picks the best builder, drafts a title and scope, and (where
 * relevant) the trade. The dashboard then routes the user straight into
 * that builder with the form already pre-populated via URL params.
 *
 * This is the highest-magic surface in the app — the moment a non-engaged
 * solo trader thinks "wait, this actually understood me."
 */

const RATE_LIMIT_PER_MINUTE = 20;

interface IntakeRequest {
  text: string;
}

interface IntakeResult {
  builderSlug: BuilderSlug;
  title: string;
  scope: string;
  trade: string | null;
  rationale: string;
}

export async function POST(req: NextRequest) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const minuteCheck = checkRateLimit(
    `ai-intake:${ctx.userId}`,
    RATE_LIMIT_PER_MINUTE,
    60_000
  );
  if (!minuteCheck.allowed) {
    return NextResponse.json(
      { error: "Slow down — too many intake requests in a minute." },
      { status: 429 }
    );
  }

  const body = (await req.json()) as IntakeRequest;
  const text = (body?.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "Empty input" }, { status: 400 });
  }
  if (text.length > 600) {
    return NextResponse.json(
      { error: "Keep it under 600 characters." },
      { status: 400 }
    );
  }

  // Free tier daily quota — share with /api/ai/fill (same bucket).
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("tier, status, trial_ends_at")
    .eq("organisation_id", ctx.organisationId)
    .maybeSingle();
  const isPro = hasProAccess(sub);
  if (!isPro) {
    const dayCheck = checkRateLimit(
      `ai-fill-day:${ctx.organisationId}`,
      5,
      24 * 60 * 60 * 1000
    );
    if (!dayCheck.allowed) {
      return NextResponse.json(
        {
          error: "Free tier daily AI limit reached. Upgrade to keep going.",
          upgrade: true,
        },
        { status: 402 }
      );
    }
  }

  const candidateLines = Object.values(BUILDERS)
    .filter((b) => b.section !== "library" && b.status !== "planned")
    .map((b) => `- ${b.slug} — ${b.shortName}: ${b.tagline}`)
    .join("\n");

  const system = `You are the intake brain for ClickNComply, a UK construction compliance app.
A solo trader has typed a single sentence describing what they need. Pick the single best builder for them and draft sensible starter fields. UK British English (organise, behaviour, colour). Reference UK regs only when natural.

You MUST return valid JSON ONLY (no preamble, no markdown fence) matching this exact shape:
{"builderSlug": "<one of the slugs below>", "title": "<8 words max, professional>", "scope": "<1-2 sentence scope of works>", "trade": "<trade name or null>", "rationale": "<one short sentence>"}

Available builders:
${candidateLines}

Rules:
- builderSlug MUST be exactly one of the slugs above. Never invent slugs.
- For method statements pick "method-statement". For specific permits pick the specific permit slug (e.g. "hot-works-permit", "permit-to-dig"). For generic permits use "permit-to-work".
- For toolbox talks / morning briefings pick "toolbox-talk", "daily-activity-briefing" or "site-induction" as appropriate.
- For COSHH-substance work pick "coshh". For vibration tools pick "havs".
- "trade" should be null for non-trade documents (briefings, permits, plans).`;

  const user = `User intake: ${text}`;

  try {
    const res = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: user }],
    });

    const raw = res.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { text: string }).text)
      .join("\n")
      .trim();

    const json = extractJson(raw);
    if (!json) {
      console.error("[ai/intake] no JSON in response:", raw);
      return NextResponse.json(
        { error: "AI returned an unexpected shape. Try rephrasing." },
        { status: 502 }
      );
    }

    const result = validate(json);
    if (!result) {
      return NextResponse.json(
        { error: "AI picked an unknown builder. Try rephrasing." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[ai/intake] anthropic call failed", err);
    return NextResponse.json(
      { error: "AI temporarily unavailable. Try again in a sec." },
      { status: 502 }
    );
  }
}

function extractJson(s: string): unknown | null {
  // Tolerate the model wrapping in ```json ... ``` or adding noise around it.
  const fenced = s.match(/```json\s*([\s\S]+?)\s*```/i);
  const inner = fenced ? fenced[1] : s;
  const start = inner.indexOf("{");
  const end = inner.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(inner.slice(start, end + 1));
  } catch {
    return null;
  }
}

function validate(obj: unknown): IntakeResult | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  const slug = typeof o.builderSlug === "string" ? o.builderSlug : "";
  if (!(slug in BUILDERS)) return null;
  return {
    builderSlug: slug as BuilderSlug,
    title: typeof o.title === "string" ? o.title.slice(0, 120) : "",
    scope: typeof o.scope === "string" ? o.scope.slice(0, 600) : "",
    trade:
      typeof o.trade === "string" && o.trade.trim().length > 0
        ? o.trade.slice(0, 60)
        : null,
    rationale: typeof o.rationale === "string" ? o.rationale.slice(0, 200) : "",
  };
}
