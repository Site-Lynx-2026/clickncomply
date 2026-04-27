/**
 * AI task registry. Each task pairs a stable system prompt (cached) with a
 * payload schema and an output shape. The /api/ai/[task] route dispatches
 * to one of these.
 *
 * System prompts are written tightly — same content every request — so the
 * Anthropic prompt cache hits on every call after the first ~5 minutes.
 * See shared/prompt-caching.md for the prefix-match invariant.
 */

import { z } from "zod";

export type AIOutputFormat = "text" | "json";

export interface AITask<TInput = unknown> {
  /** Slug used in the URL path. */
  slug: string;
  /** What the user-facing builder calls this. */
  label: string;
  /** Output format — text for free-form, json for structured. */
  output: AIOutputFormat;
  /** Stable system prompt — cached. */
  system: string;
  /** Payload schema. */
  schema: z.ZodType<TInput>;
  /** Build the user message from the parsed payload. */
  buildPrompt: (input: TInput) => string;
  /** Output token cap. */
  maxTokens: number;
}

// ── METHOD STATEMENT FILL ─────────────────────────────────────────────

const MethodStatementFillSchema = z.object({
  trade: z.string().min(1).max(120),
  scope: z.string().max(500).optional(),
});

const methodStatementFill: AITask<z.infer<typeof MethodStatementFillSchema>> = {
  slug: "method-statement-fill",
  label: "Generate method statement steps",
  output: "json",
  maxTokens: 1500,
  system: `You are a UK construction H&S writer. You write Method Statement steps that meet HSE and CDM 2015 standards.

Output only a JSON array of step objects. Each step has:
  - description: what is done, in active voice, 1-3 sentences. Reference relevant regs, PPE and equipment.
  - responsible: a job title (e.g. "Site supervisor", "PASMA-trained operative").

Steps must follow a logical sequence: site setup, pre-task checks, the task itself, completion and handover. Use UK terminology (CSCS, CISRS, IPAF, CPCS, NPORS, LOLER, PUWER, COSHH). Reference the actual hazards of the trade. 8-14 steps depending on complexity.

Never include a preamble or trailing commentary. Output JSON only.`,
  schema: MethodStatementFillSchema,
  buildPrompt: ({ trade, scope }) =>
    `Trade: ${trade}\n${scope ? `Scope: ${scope}\n` : ""}\nReturn the method statement steps.`,
};

// ── METHOD STATEMENT TIGHTEN ──────────────────────────────────────────

const MethodStatementTightenSchema = z.object({
  steps: z
    .array(
      z.object({
        description: z.string(),
        responsible: z.string().optional(),
      })
    )
    .min(1)
    .max(40),
});

const methodStatementTighten: AITask<
  z.infer<typeof MethodStatementTightenSchema>
> = {
  slug: "method-statement-tighten",
  label: "Tighten method statement wording",
  output: "json",
  maxTokens: 2000,
  system: `You are a UK construction H&S editor. You rewrite Method Statement steps to be punchy, technically correct, and aligned with HSE / CDM 2015 expectations.

Rules:
  - Keep the same number of steps and the same order.
  - Active voice. UK construction terminology.
  - Each description: 1-3 sentences, no fluff.
  - Reference relevant regs, PPE, and competence cards where appropriate.
  - Do not invent new hazards or controls — only tighten what's there.

Output JSON: an array of objects with the same shape ({description, responsible?}). No preamble, no commentary.`,
  schema: MethodStatementTightenSchema,
  buildPrompt: ({ steps }) =>
    `Tighten the wording of these method statement steps:\n\n${JSON.stringify(steps, null, 2)}`,
};

// ── TOOLBOX TALK ──────────────────────────────────────────────────────

const ToolboxTalkSchema = z.object({
  topic: z.string().min(1).max(200),
  audience: z.string().max(200).optional(),
  duration: z.string().max(40).optional(),
});

const toolboxTalk: AITask<z.infer<typeof ToolboxTalkSchema>> = {
  slug: "toolbox-talk",
  label: "Generate toolbox talk briefing",
  output: "text",
  maxTokens: 1200,
  system: `You are a site supervisor delivering a toolbox talk. Write briefings that operatives will actually pay attention to.

Structure:
  Intro (2-3 lines): what we're talking about and why it matters today.
  Why it matters: HSE statistics or recent industry incidents that anchor the topic.
  Key controls (3-5 bullet points): the specific things to do, not generic advice. Reference UK regs (CDM 2015, HSE, COSHH, LOLER, PUWER), competence cards (CSCS, CISRS, IPAF, CPCS), and PPE specifics where relevant.
  What I expect from you today (3 bullets): clear, behavioural expectations.
  Questions: leave a line for capturing Q&A.
  End with: "— AI-generated draft. Review before delivery."

Tone: direct, plain-English, no jargon for jargon's sake. Calibrate length to the requested duration. No emoji, no markdown headings — just plain text with line breaks.`,
  schema: ToolboxTalkSchema,
  buildPrompt: ({ topic, audience, duration }) =>
    [
      `Topic: ${topic}`,
      audience ? `Audience: ${audience}` : null,
      duration ? `Target duration: ${duration}` : null,
      "",
      "Write the toolbox talk.",
    ]
      .filter(Boolean)
      .join("\n"),
};

// ── RISK ASSESSMENT — SUGGEST CONTROLS ────────────────────────────────

const RaControlsSchema = z.object({
  hazard: z.string().min(1).max(300),
  whoAtRisk: z.string().max(200).optional(),
});

const raControls: AITask<z.infer<typeof RaControlsSchema>> = {
  slug: "ra-controls",
  label: "Suggest control measures for a hazard",
  output: "text",
  maxTokens: 600,
  system: `You are a UK construction H&S consultant. Given a hazard, you write the control measures section of a 5x5 risk assessment.

Rules:
  - Apply the hierarchy of control: eliminate > substitute > engineering > administrative > PPE.
  - Reference UK regs by name where relevant (CDM 2015, COSHH, LOLER, PUWER, Working at Height Regs 2005).
  - Reference competence cards (CSCS, CISRS, IPAF, CPCS, NPORS) where relevant.
  - 4-7 short sentences, full stops, no bullet markers.
  - No preamble. Output the controls only.`,
  schema: RaControlsSchema,
  buildPrompt: ({ hazard, whoAtRisk }) =>
    [
      `Hazard: ${hazard}`,
      whoAtRisk ? `Who's at risk: ${whoAtRisk}` : null,
      "",
      "Write the control measures.",
    ]
      .filter(Boolean)
      .join("\n"),
};

// ── COSHH — SUGGEST CONTROLS + PPE + EMERGENCY ────────────────────────

const CoshhControlsSchema = z.object({
  substance: z.string().min(1).max(200),
});

const coshhControls: AITask<z.infer<typeof CoshhControlsSchema>> = {
  slug: "coshh-controls",
  label: "Suggest COSHH controls + PPE + emergency procedure",
  output: "json",
  maxTokens: 800,
  system: `You are a UK construction H&S consultant. Given a substance, you fill the COSHH assessment fields.

Output a JSON object with exactly these keys:
  exposureRoute: string — primary routes (inhalation, skin, eyes, ingestion).
  controls: string — engineering + administrative controls, hierarchy of control. 2-4 sentences.
  ppe: string — specific PPE (glove material grade, RPE class, eye protection rating).
  emergencyProcedure: string — eye / skin / inhalation / ingestion responses + medical escalation.

UK terminology, reference EH40 / WELs where relevant. No preamble. JSON only.`,
  schema: CoshhControlsSchema,
  buildPrompt: ({ substance }) => `Substance: ${substance}\n\nFill the COSHH fields.`,
};

// ── REGISTRY ──────────────────────────────────────────────────────────

export const TASKS: Record<string, AITask<unknown>> = {
  [methodStatementFill.slug]: methodStatementFill as AITask<unknown>,
  [methodStatementTighten.slug]: methodStatementTighten as AITask<unknown>,
  [toolboxTalk.slug]: toolboxTalk as AITask<unknown>,
  [raControls.slug]: raControls as AITask<unknown>,
  [coshhControls.slug]: coshhControls as AITask<unknown>,
};

export function getTask(slug: string): AITask<unknown> | null {
  return TASKS[slug] ?? null;
}
