import { rgb } from "pdf-lib";
import {
  CompanyBranding,
  PageContext,
  drawCoverBanner,
  drawFooter,
  drawKeyValue,
  drawNumberedStep,
  drawParagraph,
  drawSectionHeading,
  newDocument,
  newPage,
} from "../render";
import {
  HAVS_EAV,
  HAVS_ELV,
  calcHAVSPoints,
  riskScore,
} from "../../rams/config";
import { PPE_ITEMS } from "../../rams/tools";

export interface FullRamsForm {
  title?: string;
  trade?: string;
  scope?: string;
  siteName?: string;
  siteAddress?: string;
  dateOfWorks?: string;
  duration?: string;
  methodSteps?: { description: string; responsible?: string }[];
  ppe?: string[];
  hazards?: {
    hazard: string;
    whoAtRisk?: string;
    consequences?: string;
    initialL: number;
    initialS: number;
    controls?: string;
    residualL: number;
    residualS: number;
  }[];
  coshh?: {
    name: string;
    riskLevel?: "low" | "medium" | "high";
    controls?: string;
    ppe?: string;
    emergencyProcedure?: string;
  }[];
  havsTools?: { name: string; magnitude: number; hours: number }[];
  noise?: { activity: string; typicalDb: number; hours: number }[];
  firstAid?: string;
  fireProc?: string;
  assemblyPoint?: string;
  nearestAE?: string;
  emergencyContacts?: string;
  welfare?: string;
  environmental?: string;
  preparedBy?: string;
  preparedByRole?: string;
}

const NEAR_BLACK = rgb(0.07, 0.07, 0.07);
const RULE = rgb(0.92, 0.92, 0.92);

/**
 * Render the comprehensive Full RAMs PDF — every section in one document.
 *
 * Cover page banner shows the trade. Each subsequent section is a
 * numbered chapter with a clear heading. Risk assessment, COSHH and
 * HAVs each get their own table-ish layout because they have multiple
 * entries.
 */
export async function renderFullRams(
  form: FullRamsForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  const ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.title || "Risk Assessment & Method Statement",
    [form.trade, branding.name].filter(Boolean).join(" · ") || branding.name
  );

  // ── 1. PROJECT INFO ──
  drawSectionHeading(ctx, "1. Project info");
  drawKeyValue(ctx, "Title", form.title || "—");
  drawKeyValue(ctx, "Trade", form.trade || "—");
  drawKeyValue(ctx, "Scope", form.scope || "—");
  drawKeyValue(ctx, "Site", form.siteName || "—");
  if (form.siteAddress) drawKeyValue(ctx, "Site address", form.siteAddress);
  drawKeyValue(ctx, "Date of works", form.dateOfWorks || "—");
  drawKeyValue(ctx, "Duration", form.duration || "—");
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

  // ── 2. METHOD STATEMENT ──
  drawSectionHeading(
    ctx,
    `2. Method statement (${form.methodSteps?.length ?? 0} steps)`
  );
  if (!form.methodSteps || form.methodSteps.length === 0) {
    drawParagraph(ctx, "No method steps recorded.");
  } else {
    form.methodSteps.forEach((step, i) => {
      if (step.description) {
        drawNumberedStep(ctx, i + 1, step.description, step.responsible);
      }
    });
  }

  // ── 3. PPE ──
  drawSectionHeading(ctx, "3. PPE");
  if (!form.ppe || form.ppe.length === 0) {
    drawParagraph(ctx, "No PPE specified.");
  } else {
    const ppeLines = form.ppe.map((id) => {
      const item = PPE_ITEMS.find((p) => p.id === id);
      return item ? `• ${item.label}${item.enStandard ? ` (${item.enStandard})` : ""}` : null;
    }).filter(Boolean) as string[];
    drawParagraph(ctx, ppeLines.join("\n"));
  }

  // ── 4. RISK ASSESSMENT ──
  drawSectionHeading(
    ctx,
    `4. Risk assessment (${form.hazards?.length ?? 0} hazards)`
  );
  if (!form.hazards || form.hazards.length === 0) {
    drawParagraph(ctx, "No hazards recorded.");
  } else {
    form.hazards.forEach((h, i) => drawHazardCard(ctx, i + 1, h));
  }

  // ── 5. COSHH ──
  drawSectionHeading(
    ctx,
    `5. COSHH (${form.coshh?.length ?? 0} substances)`
  );
  if (!form.coshh || form.coshh.length === 0) {
    drawParagraph(ctx, "No substances recorded.");
  } else {
    form.coshh.forEach((s, i) => drawCoshhCard(ctx, i + 1, s));
  }

  // ── 6. HAVs ──
  drawSectionHeading(ctx, "6. HAVs daily exposure");
  drawHavsBlock(ctx, form.havsTools ?? []);

  // ── 7. NOISE ──
  drawSectionHeading(ctx, "7. Noise");
  drawNoiseBlock(ctx, form.noise ?? []);

  // ── 8. EMERGENCY ──
  drawSectionHeading(ctx, "8. Emergency procedures");
  drawKeyValue(ctx, "First aid", form.firstAid || "—");
  drawKeyValue(ctx, "Fire procedure", form.fireProc || "—");
  drawKeyValue(ctx, "Assembly point", form.assemblyPoint || "—");
  drawKeyValue(ctx, "Nearest A&E", form.nearestAE || "—");
  drawKeyValue(ctx, "Emergency contacts", form.emergencyContacts || "—");

  // ── 9. WELFARE & ENVIRONMENT ──
  drawSectionHeading(ctx, "9. Welfare & environment");
  drawKeyValue(ctx, "Welfare provision", form.welfare || "—");
  drawKeyValue(ctx, "Environmental controls", form.environmental || "—");

  // ── 10. SIGN-OFF ──
  drawSectionHeading(ctx, "10. Prepared by");
  drawKeyValue(ctx, "Name", form.preparedBy || "—");
  drawKeyValue(ctx, "Role", form.preparedByRole || "—");
  drawParagraph(ctx, " ");
  drawParagraph(
    ctx,
    "This Risk Assessment & Method Statement is an AI-generated draft. The named preparer is responsible for review, suitability and competency before use on site."
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

/* ─────── Per-section sub-renderers ─────── */

function drawHazardCard(
  ctx: PageContext,
  num: number,
  h: NonNullable<FullRamsForm["hazards"]>[number]
) {
  if (ctx.y - 110 < 60) {
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
    color: NEAR_BLACK,
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

  ctx.page.drawText(truncate(h.hazard || "(no hazard)", 80), {
    x: ctx.margin + 32,
    y: ctx.y - 4,
    size: 11,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });

  drawScorePill(ctx, ctx.width - ctx.margin - 75, ctx.y + 22, "I", initial);
  drawScorePill(ctx, ctx.width - ctx.margin - 75, ctx.y + 4, "R", residual);

  ctx.y -= 26;

  if (h.whoAtRisk) drawKeyValue(ctx, "Who's at risk", h.whoAtRisk);
  if (h.controls) drawKeyValue(ctx, "Controls", h.controls);

  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 12;
}

function drawCoshhCard(
  ctx: PageContext,
  num: number,
  s: NonNullable<FullRamsForm["coshh"]>[number]
) {
  if (ctx.y - 80 < 60) {
    const next = newPage(ctx.doc, ctx.fonts);
    ctx.page = next.page;
    ctx.y = next.y;
  }
  const riskColor =
    s.riskLevel === "high"
      ? "#dc2626"
      : s.riskLevel === "medium"
        ? "#d97706"
        : "#16a34a";

  ctx.page.drawText(`${num}. ${truncate(s.name || "(unnamed)", 60)}`, {
    x: ctx.margin,
    y: ctx.y - 4,
    size: 11,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });

  // Risk pill
  if (s.riskLevel) {
    const c = parseHex(riskColor);
    ctx.page.drawRectangle({
      x: ctx.width - ctx.margin - 70,
      y: ctx.y - 8,
      width: 70,
      height: 16,
      color: rgb(c.r, c.g, c.b),
    });
    const label = `${s.riskLevel.toUpperCase()} RISK`;
    const lblW = ctx.fonts.bold.widthOfTextAtSize(label, 8);
    ctx.page.drawText(label, {
      x: ctx.width - ctx.margin - 70 + (70 - lblW) / 2,
      y: ctx.y - 4,
      size: 8,
      font: ctx.fonts.bold,
      color: rgb(1, 1, 1),
    });
  }

  ctx.y -= 22;

  if (s.controls) drawKeyValue(ctx, "Controls", s.controls);
  if (s.ppe) drawKeyValue(ctx, "PPE", s.ppe);
  if (s.emergencyProcedure)
    drawKeyValue(ctx, "Emergency", s.emergencyProcedure);

  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 12;
}

function drawHavsBlock(
  ctx: PageContext,
  tools: NonNullable<FullRamsForm["havsTools"]>
) {
  if (tools.length === 0) {
    drawParagraph(ctx, "No HAVs tools recorded.");
    return;
  }

  const total = tools.reduce(
    (s, t) => s + calcHAVSPoints(t.magnitude, t.hours),
    0
  );
  const status =
    total >= HAVS_ELV
      ? { label: "ELV exceeded", color: "#dc2626" }
      : total >= HAVS_EAV
        ? { label: "EAV reached", color: "#d97706" }
        : { label: "Within limits", color: "#16a34a" };

  // Summary block
  const c = parseHex(status.color);
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - 36,
    width: ctx.width - ctx.margin * 2,
    height: 36,
    color: rgb(c.r, c.g, c.b),
  });
  ctx.page.drawText(`${total} pts`, {
    x: ctx.margin + 12,
    y: ctx.y - 22,
    size: 16,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });
  ctx.page.drawText(`${status.label} · EAV ${HAVS_EAV} · ELV ${HAVS_ELV}`, {
    x: ctx.margin + 80,
    y: ctx.y - 22,
    size: 10,
    font: ctx.fonts.regular,
    color: rgb(1, 1, 1),
  });
  ctx.y -= 44;

  // Per-tool table
  const cols = [
    { x: ctx.margin, w: 240 },
    { x: ctx.margin + 250, w: 80 },
    { x: ctx.margin + 340, w: 60 },
    { x: ctx.margin + 410, w: 80 },
  ];
  ctx.page.drawText("TOOL", {
    x: cols[0].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.page.drawText("MAG (m/s²)", {
    x: cols[1].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.page.drawText("HRS", {
    x: cols[2].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.page.drawText("PTS", {
    x: cols[3].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.y -= 14;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 8;

  for (const t of tools) {
    if (ctx.y < 80) {
      const next = newPage(ctx.doc, ctx.fonts);
      ctx.page = next.page;
      ctx.y = next.y;
    }
    const points = calcHAVSPoints(t.magnitude, t.hours);
    ctx.page.drawText(truncate(t.name || "—", 40), {
      x: cols[0].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.page.drawText(t.magnitude.toFixed(1), {
      x: cols[1].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.page.drawText(t.hours.toFixed(2), {
      x: cols[2].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.page.drawText(`${points}`, {
      x: cols[3].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.bold,
      color: NEAR_BLACK,
    });
    ctx.y -= 14;
  }
  ctx.y -= 4;
}

function drawNoiseBlock(
  ctx: PageContext,
  noise: NonNullable<FullRamsForm["noise"]>
) {
  if (noise.length === 0) {
    drawParagraph(ctx, "No noise sources recorded.");
    return;
  }
  const cols = [
    { x: ctx.margin, w: 280 },
    { x: ctx.margin + 290, w: 80 },
    { x: ctx.margin + 380, w: 80 },
  ];
  ctx.page.drawText("ACTIVITY", {
    x: cols[0].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.page.drawText("dB(A)", {
    x: cols[1].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.page.drawText("HOURS", {
    x: cols[2].x,
    y: ctx.y,
    size: 8,
    font: ctx.fonts.bold,
    color: rgb(0.45, 0.45, 0.45),
  });
  ctx.y -= 14;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 8;

  for (const n of noise) {
    if (ctx.y < 80) {
      const next = newPage(ctx.doc, ctx.fonts);
      ctx.page = next.page;
      ctx.y = next.y;
    }
    ctx.page.drawText(truncate(n.activity || "—", 50), {
      x: cols[0].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.page.drawText(`${n.typicalDb}`, {
      x: cols[1].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.page.drawText(`${n.hours.toFixed(2)}`, {
      x: cols[2].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    ctx.y -= 14;
  }
  ctx.y -= 4;
}

function drawScorePill(
  ctx: PageContext,
  x: number,
  y: number,
  prefix: string,
  score: { score: number; level: string; color: string }
) {
  const c = parseHex(score.color);
  ctx.page.drawRectangle({
    x,
    y: y - 4,
    width: 70,
    height: 14,
    color: rgb(c.r, c.g, c.b),
  });
  const label = `${prefix}: ${score.score} ${score.level}`;
  const lblW = ctx.fonts.bold.widthOfTextAtSize(label, 8);
  ctx.page.drawText(label, {
    x: x + (70 - lblW) / 2,
    y,
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
