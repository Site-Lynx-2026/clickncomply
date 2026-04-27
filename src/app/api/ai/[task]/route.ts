import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic, DEFAULT_MODEL } from "@/lib/anthropic/client";
import { resolveContext } from "../../rams/_helpers";
import { getTask } from "@/lib/anthropic/tasks";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/ai/[task]
 *
 * Body shape depends on the task slug — validated against the task's Zod
 * schema. Returns either { text } for free-form tasks or { data } for JSON
 * tasks. Anthropic prompt-caches the system prompt across calls.
 *
 * Protections:
 *   - Auth required (resolveContext)
 *   - Rate limit: 30 requests per user per minute
 *     (generous for normal use, blocks runaway automation)
 *   - Per-call usage forwarded to client + logged for cost tracking
 */

const AI_RATE_LIMIT_PER_MINUTE = 30;
const AI_RATE_LIMIT_WINDOW_MS = 60 * 1000;

// Force Node runtime (rate-limit Map is in-memory, only safe outside Edge)
export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ task: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  // Rate limit per user (not per org — protects per-user runaway)
  const rl = checkRateLimit(
    `ai:${ctx.userId}`,
    AI_RATE_LIMIT_PER_MINUTE,
    AI_RATE_LIMIT_WINDOW_MS
  );
  if (!rl.allowed) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((rl.resetAtMs - Date.now()) / 1000)
    );
    return NextResponse.json(
      {
        error: `Slow down — you're hitting the AI a lot. Try again in ${retryAfterSec}s.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(AI_RATE_LIMIT_PER_MINUTE),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rl.resetAtMs),
        },
      }
    );
  }

  const { task: slug } = await params;
  const task = getTask(slug);
  if (!task)
    return NextResponse.json({ error: "Unknown task" }, { status: 404 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI not configured. Set ANTHROPIC_API_KEY in .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = task.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const userMessage = task.buildPrompt(parsed.data);

  try {
    // System prompt as a cacheable text block — every call after the first
    // hits the prompt cache for ~5 minutes (see shared/prompt-caching.md).
    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: task.maxTokens,
      system: [
        {
          type: "text",
          text: task.system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    // Lightweight cost tracking — log to stdout so Vercel captures it.
    // When usage goes meaningful, replace with a `ai_usage` table insert.
    if (message.usage) {
      console.log(
        JSON.stringify({
          ev: "ai_usage",
          task: slug,
          user: ctx.userId,
          org: ctx.organisationId,
          input: message.usage.input_tokens,
          output: message.usage.output_tokens,
          cache_read: message.usage.cache_read_input_tokens ?? 0,
          cache_create: message.usage.cache_creation_input_tokens ?? 0,
        })
      );
    }

    const text = extractText(message);
    if (!text) {
      return NextResponse.json(
        { error: "AI returned no usable content" },
        { status: 502 }
      );
    }

    if (task.output === "json") {
      try {
        const data = JSON.parse(stripCodeFences(text));
        return NextResponse.json({ data, usage: message.usage });
      } catch {
        return NextResponse.json(
          { error: "AI returned invalid JSON", raw: text },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ text, usage: message.usage });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "AI is rate limited. Try again in a few seconds." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "AI auth failed. Check ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI error: ${err.message}` },
        { status: err.status ?? 500 }
      );
    }
    return NextResponse.json(
      { error: "Unexpected AI error" },
      { status: 500 }
    );
  }
}

function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/** Strip ```json ... ``` fences if Haiku decided to wrap its output. */
function stripCodeFences(text: string): string {
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : text;
}
