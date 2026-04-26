import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Default model for cheap, fast template generation.
 * Haiku 4.5 — designed for high-volume generation at low cost.
 */
export const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

/**
 * Higher-quality model for the AI advisor / chat features
 * (Pro tier only — keep generation costs predictable).
 */
export const ADVISOR_MODEL = "claude-sonnet-4-6";
