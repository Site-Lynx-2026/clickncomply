import { rgb } from "pdf-lib";
import {
  CompanyBranding,
  PageContext,
  drawCoverBanner,
  drawFooter,
  drawKeyValue,
  drawParagraph,
  drawSectionHeading,
  newDocument,
  newPage,
} from "../render";
import { riskScore } from "../../rams/config";

export interface RAHazard {
  hazard: string;
  whoAtRisk?: string;
  consequences?: string;
  initialL: number;
  initialS: number;
  controls?: string;
  residualL: number;
  residualS: number;
}

export interface RiskAssessmentForm {
  title?: string;
  scope?: string;
  preparedBy?: string;
  preparedByRole?: string;
  hazards?: RAHazard[];
}

/**
 * Render a Risk Assessment PDF.
 *
 * Structured as one card per hazard so the layout reads well even with
 * 30+ hazards. Each card shows the matrix score (initial → residual) as
 * coloured pills, then the controls.
 */
export async function renderRiskAssessment(
  form: RiskAssessmentForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  let ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.title || "Risk Assessment",
    branding.name
  );

  drawSectionHeading(ctx, "Project");
  drawKeyValue(ctx, "Title", form.title || "—");
  drawKeyValue(ctx, "Scope", form.scope || "—");
  drawKeyValue(ctx, "Reference", ref);
  drawKeyValue(
    ctx,
    "Date prepared",
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );
  drawKeyValue(ctx, "Prepared by", form.preparedBy || "—");
  drawKeyValue(ctx, "Role", form.preparedByRole || "—");

  // Risk matrix legend
  drawSectionHeading(ctx, "Risk matrix");
  drawParagraph(
    ctx,
    "5×5 matrix. Score = Likelihood × Severity. Initial risk is before controls; Residual risk is after.",
    { size: 9 }
  );
  drawParagraph(ctx, " ", { size: 6 });

  // Hazards
  drawSectionHeading(ctx, `Hazards (${form.hazards?.length ?? 0})`);

  const hazards = form.hazards ?? [];
  if (hazards.length === 0) {
    drawParagraph(ctx, "No hazards recorded.");
  } else {
    hazards.forEach((h, i) => {
      drawHazardCard(ctx, i + 1, h);
    });
  }

  // Sign-off note
  drawParagraph(ctx, " ");
  drawParagraph(
    ctx,
    "This Risk Assessment is an AI-generated draft. The named preparer is responsible for review, suitability and competency before use on site."
  );

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    drawFooter(
      { doc, page, fonts, y: 0, width, height, margin: 48 },
      branding,
      ref
    );
  }

  return doc.save();
}

/** Per-hazard card renderer — handles its own page-break. */
function drawHazardCard(
  ctx: PageContext,
  num: number,
  h: RAHazard
) {
  // Estimate space needed: ~120pt for a hazard card.
  const ESTIMATED_HEIGHT = 130;
  if (ctx.y - ESTIMATED_HEIGHT < 60) {
    const next = newPage(ctx.doc, ctx.fonts);
    ctx.page = next.page;
    ctx.y = next.y;
  }

  const initial = riskScore(h.initialL, h.initialS);
  const residual = riskScore(h.residualL, h.residualS);

  // Number pill
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - 14,
    width: 22,
    height: 22,
    color: rgb(0.07, 0.07, 0.07),
  });
  const numStr = String(num);
  const numWidth = ctx.fonts.bold.widthOfTextAtSize(numStr, 11);
  ctx.page.drawText(numStr, {
    x: ctx.margin + (22 - numWidth) / 2,
    y: ctx.y - 9,
    size: 11,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });

  // Hazard heading
  ctx.page.drawText(truncate(h.hazard || "(no hazard)", 90), {
    x: ctx.margin + 32,
    y: ctx.y - 4,
    size: 11,
    font: ctx.fonts.bold,
    color: rgb(0.07, 0.07, 0.07),
  });

  ctx.y -= 26;

  // Risk score pills aligned right
  drawScorePill(ctx, ctx.width - ctx.margin - 75, ctx.y + 26, "I", initial);
  drawScorePill(ctx, ctx.width - ctx.margin - 75, ctx.y, "R", residual);

  if (h.whoAtRisk) {
    drawKeyValue(ctx, "Who's at risk", h.whoAtRisk);
  }
  if (h.consequences) {
    drawKeyValue(ctx, "Consequences", h.consequences);
  }
  if (h.controls) {
    drawKeyValue(ctx, "Controls", h.controls);
  }

  // Separator rule
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: rgb(0.92, 0.92, 0.92),
  });
  ctx.y -= 14;
}

function drawScorePill(
  ctx: PageContext,
  x: number,
  y: number,
  prefix: string,
  score: { score: number; level: string; color: string }
) {
  // Parse the hex-ish color string from riskScore()
  const c = parseHex(score.color);
  ctx.page.drawRectangle({
    x,
    y: y - 4,
    width: 70,
    height: 16,
    color: rgb(c.r, c.g, c.b),
  });
  const label = `${prefix}: ${score.score} ${score.level}`;
  const labelWidth = ctx.fonts.bold.widthOfTextAtSize(label, 8);
  ctx.page.drawText(label, {
    x: x + (70 - labelWidth) / 2,
    y: y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return { r: 0.5, g: 0.5, b: 0.5 };
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
  };
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
