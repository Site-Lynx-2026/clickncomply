import { NextRequest, NextResponse } from "next/server";
import { anthropic, DEFAULT_MODEL } from "@/lib/anthropic/client";
import { resolveContext } from "../../rams/_helpers";
import { hasProAccess } from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/ai/fill
 *
 * Universal "fill this field with AI" endpoint. The same route powers every
 * sparkle button across every builder — Risk Assessment controls, Method
 * Statement steps, COSHH controls, Permit precautions, Briefing key points,
 * Plan sections.
 *
 * The client posts:
 *   {
 *     kind: "ra-control" | "ra-consequence" | "ms-step" | "coshh-control" |
 *           "coshh-emergency" | "permit-precaution" | "briefing-point" |
 *           "plan-section" | "scope" | "title-suggest" | "doc-draft",
 *     context: Record<string, unknown>  // anything the prompt needs
 *   }
 *
 * Server picks the right prompt template, calls Haiku 4.5 with prompt
 * caching, returns plain text. Streaming is left to the client to upgrade
 * later — for V1 we wait for the full response (~600-1200 ms typical).
 */

const RATE_LIMIT_PER_MINUTE = 30;

interface FillRequest {
  kind: string;
  context: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  // Rate limit per user — 30 fills/minute is generous; protects against
  // a stuck button.
  const minuteCheck = checkRateLimit(`ai-fill:${ctx.userId}`, RATE_LIMIT_PER_MINUTE, 60_000);
  if (!minuteCheck.allowed) {
    return NextResponse.json(
      { error: "Slow down — too many AI fills in a minute." },
      { status: 429 }
    );
  }

  const body = (await req.json()) as FillRequest;
  if (!body?.kind) return NextResponse.json({ error: "Missing kind" }, { status: 400 });

  // Trial / Pro gating — free tier gets 5/day after trial expires.
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

  const prompt = buildPrompt(body.kind, body.context ?? {});
  if (!prompt) {
    return NextResponse.json({ error: `Unknown kind: ${body.kind}` }, { status: 400 });
  }

  try {
    const res = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: prompt.maxTokens,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
    });
    const text = res.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { text: string }).text)
      .join("\n")
      .trim();
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[ai/fill] anthropic call failed", err);
    return NextResponse.json(
      { error: "AI temporarily unavailable. Try again in a sec." },
      { status: 502 }
    );
  }
}

interface PromptDef {
  system: string;
  user: string;
  maxTokens: number;
}

const SYSTEM_BASE = `You are a UK-qualified construction health and safety writer at ClickNComply.
Write in plain British English (UK spellings: organise, recognise, behaviour, colour). Keep it concise, professional, and on-site practical.
Reference UK standards where relevant (HSE, CDM 2015, COSHH 2002, PUWER 1998, LOLER 1998, Working at Height Regs 2005).
Never invent product brand names or fake regulation numbers. If you don't know a specific value, write "as per manufacturer / site spec".
Output ONLY the requested field text — no preamble, no markdown headers, no quotation marks.`;

function buildPrompt(kind: string, ctx: Record<string, unknown>): PromptDef | null {
  const get = (k: string, d = "") => (typeof ctx[k] === "string" ? (ctx[k] as string) : d);

  switch (kind) {
    case "ra-control": {
      const hazard = get("hazard");
      const consequences = get("consequences");
      const trade = get("trade");
      return {
        system: SYSTEM_BASE,
        maxTokens: 240,
        user: `Write the control measures for this hazard on a UK construction site.
Hazard: ${hazard || "(not specified)"}
Consequences: ${consequences || "(not specified)"}
Trade context: ${trade || "general construction"}

Return 3-5 specific, on-site practical control measures, separated by full stops. Mention PPE, training, supervision and any UK regulation that bears on it.`,
      };
    }

    case "ra-consequence": {
      const hazard = get("hazard");
      return {
        system: SYSTEM_BASE,
        maxTokens: 120,
        user: `Describe the realistic consequences if this hazard is not controlled, on a UK construction site.
Hazard: ${hazard || "(not specified)"}

Return 1-2 sentences. Mention severity (e.g. fatal, RIDDOR-reportable, lost time injury) where appropriate.`,
      };
    }

    case "ms-step": {
      const stepNumber = get("stepNumber", "next");
      const previousStep = get("previousStep");
      const trade = get("trade");
      const scope = get("scope");
      return {
        system: SYSTEM_BASE,
        maxTokens: 160,
        user: `Write step ${stepNumber} of a method statement for the following work.
Trade: ${trade || "general construction"}
Scope: ${scope || "(not specified)"}
Previous step: ${previousStep || "(this is the first step)"}

Return one clear, sequential instruction (1-2 sentences). Be specific about the action, equipment, and any check or sign-off required.`,
      };
    }

    case "coshh-control": {
      const substance = get("substance");
      const route = get("route");
      return {
        system: SYSTEM_BASE,
        maxTokens: 200,
        user: `Write the control measures for handling this substance under COSHH 2002.
Substance: ${substance || "(not specified)"}
Exposure route: ${route || "inhalation, skin contact"}

Return 3-4 controls following the hierarchy: elimination, substitution, engineering, admin, PPE. Be specific about extraction, PPE EN standards, and exposure limits where relevant.`,
      };
    }

    case "coshh-emergency": {
      const substance = get("substance");
      return {
        system: SYSTEM_BASE,
        maxTokens: 180,
        user: `Write the emergency procedures for accidental exposure to this substance.
Substance: ${substance || "(not specified)"}

Return 3-4 sentences covering: skin/eye contact, inhalation, ingestion, when to call 999. Reference SDS Section 4.`,
      };
    }

    case "permit-precaution": {
      const documentType = get("documentType", "Permit to Work");
      const work = get("work");
      return {
        system: SYSTEM_BASE,
        maxTokens: 250,
        user: `Write the precautions required for this permit before work begins.
Permit type: ${documentType}
Description of work: ${work || "(not specified)"}

Return 5-7 bullet-style precautions (one per line, prefix each with "• "). Be specific about isolations, fire watch, atmospheric testing or weather as relevant to the permit type.`,
      };
    }

    case "briefing-point": {
      const topic = get("topic");
      const audience = get("audience", "site operatives");
      const previousPoints = get("previousPoints");
      return {
        system: SYSTEM_BASE,
        maxTokens: 120,
        user: `Write the next key point for a ${topic || "site"} briefing to ${audience}.
Previous points covered: ${previousPoints || "(none yet)"}

Return one clear, briefing-ready key point (1-2 sentences). Be punchy and actionable.`,
      };
    }

    case "plan-section": {
      const documentType = get("documentType");
      const sectionLabel = get("sectionLabel");
      const scope = get("scope");
      return {
        system: SYSTEM_BASE,
        maxTokens: 280,
        user: `Write the "${sectionLabel}" section of a "${documentType}" for a UK construction site.
Project scope: ${scope || "(not specified)"}

Return 3-5 sentences. Be specific and reference the relevant CDM 2015 / HSE guidance where appropriate.`,
      };
    }

    case "scope": {
      const documentType = get("documentType");
      const trade = get("trade");
      const project = get("project");
      return {
        system: SYSTEM_BASE,
        maxTokens: 180,
        user: `Write the scope of works for this document.
Document: ${documentType}
Trade: ${trade || "general construction"}
Project context: ${project || "(not specified)"}

Return 2-3 sentences describing what work is being done, where, and over what duration. Plain factual prose.`,
      };
    }

    case "title-suggest": {
      const trade = get("trade");
      const documentType = get("documentType");
      const project = get("project");
      return {
        system: SYSTEM_BASE,
        maxTokens: 40,
        user: `Suggest a clear, professional title for this document.
Document type: ${documentType}
Trade: ${trade || ""}
Project: ${project || ""}

Return only the title (max 8 words). No quotes.`,
      };
    }

    default:
      return null;
  }
}
