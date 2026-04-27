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
import { HAVS_EAV, HAVS_ELV, calcHAVSPoints } from "../../rams/config";

export interface HavsTool {
  name: string;
  magnitude: number;
  hours: number;
}

export interface HavsForm {
  title?: string;
  workerName?: string;
  hazards?: never;
  tools?: HavsTool[];
}

export async function renderHavs(
  form: HavsForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  let ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.title || "HAVs Daily Exposure Assessment",
    branding.name
  );

  drawSectionHeading(ctx, "Worker / task");
  drawKeyValue(ctx, "Title", form.title || "—");
  drawKeyValue(ctx, "Worker", form.workerName || "—");
  drawKeyValue(ctx, "Reference", ref);
  drawKeyValue(
    ctx,
    "Date",
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );

  // Total exposure summary
  const tools = form.tools ?? [];
  const totalPoints = tools.reduce(
    (sum, t) => sum + calcHAVSPoints(t.magnitude, t.hours),
    0
  );
  const exposureColor =
    totalPoints >= HAVS_ELV
      ? "#dc2626"
      : totalPoints >= HAVS_EAV
        ? "#d97706"
        : "#16a34a";
  const exposureLabel =
    totalPoints >= HAVS_ELV
      ? "Exposure Limit Value (ELV) exceeded — STOP work"
      : totalPoints >= HAVS_EAV
        ? "Exposure Action Value (EAV) reached — controls required"
        : "Within exposure limits";

  drawSectionHeading(ctx, "Daily exposure summary");
  drawExposureBlock(ctx, totalPoints, exposureColor, exposureLabel);

  drawSectionHeading(ctx, `Tools used (${tools.length})`);
  if (tools.length === 0) {
    drawParagraph(ctx, "No tools logged.");
  } else {
    drawToolTable(ctx, tools);
  }

  drawSectionHeading(ctx, "Health surveillance");
  drawParagraph(
    ctx,
    "Operatives whose daily exposure regularly exceeds the EAV (100 points) require health surveillance under the Control of Vibration at Work Regulations 2005. Operatives reaching the ELV (400 points) must stop and rotate to alternative work."
  );

  drawSectionHeading(ctx, "Controls");
  drawParagraph(
    ctx,
    "Substitute lower-vibration tools where available. Limit trigger time per tool. Rotate operatives. Maintain tools regularly. Issue anti-vibration gloves where appropriate. Brief operatives on symptoms (numbness, tingling, blanching) and reporting route."
  );

  drawParagraph(ctx, " ");
  drawParagraph(
    ctx,
    "This HAVs assessment is an AI-generated draft. The named preparer is responsible for review against current HSE guidance before use."
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

function drawExposureBlock(
  ctx: PageContext,
  totalPoints: number,
  color: string,
  label: string
) {
  const c = parseHex(color);
  const blockHeight = 60;

  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - blockHeight,
    width: ctx.width - ctx.margin * 2,
    height: blockHeight,
    color: rgb(c.r, c.g, c.b),
  });

  ctx.page.drawText(`${totalPoints}`, {
    x: ctx.margin + 16,
    y: ctx.y - 36,
    size: 28,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });
  ctx.page.drawText("daily exposure points", {
    x: ctx.margin + 16,
    y: ctx.y - 50,
    size: 9,
    font: ctx.fonts.regular,
    color: rgb(1, 1, 1),
  });

  ctx.page.drawText(label, {
    x: ctx.margin + 180,
    y: ctx.y - 30,
    size: 11,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });
  ctx.page.drawText(`EAV: ${HAVS_EAV} pts · ELV: ${HAVS_ELV} pts`, {
    x: ctx.margin + 180,
    y: ctx.y - 46,
    size: 9,
    font: ctx.fonts.regular,
    color: rgb(1, 1, 1),
  });

  ctx.y -= blockHeight + 14;
}

function drawToolTable(ctx: PageContext, tools: HavsTool[]) {
  // Column layout
  const cols = [
    { label: "Tool", x: ctx.margin, w: 220 },
    { label: "Magnitude (m/s²)", x: ctx.margin + 230, w: 100 },
    { label: "Hours", x: ctx.margin + 340, w: 60 },
    { label: "Points", x: ctx.margin + 410, w: 90 },
  ];

  // Header
  for (const c of cols) {
    ctx.page.drawText(c.label.toUpperCase(), {
      x: c.x,
      y: ctx.y,
      size: 8,
      font: ctx.fonts.bold,
      color: rgb(0.45, 0.45, 0.45),
    });
  }
  ctx.y -= 6;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  ctx.y -= 14;

  for (const t of tools) {
    if (ctx.y < 100) {
      const next = newPage(ctx.doc, ctx.fonts);
      ctx.page = next.page;
      ctx.y = next.y;
    }
    const points = calcHAVSPoints(t.magnitude, t.hours);
    const color =
      points >= HAVS_ELV ? "#dc2626" : points >= HAVS_EAV ? "#d97706" : "#16a34a";

    ctx.page.drawText(truncate(t.name || "—", 38), {
      x: cols[0].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: rgb(0.07, 0.07, 0.07),
    });
    ctx.page.drawText(t.magnitude.toFixed(1), {
      x: cols[1].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: rgb(0.07, 0.07, 0.07),
    });
    ctx.page.drawText(t.hours.toFixed(2), {
      x: cols[2].x,
      y: ctx.y,
      size: 10,
      font: ctx.fonts.regular,
      color: rgb(0.07, 0.07, 0.07),
    });

    const pillC = parseHex(color);
    ctx.page.drawRectangle({
      x: cols[3].x,
      y: ctx.y - 4,
      width: 70,
      height: 14,
      color: rgb(pillC.r, pillC.g, pillC.b),
    });
    const label = `${points} pts`;
    const lblW = ctx.fonts.bold.widthOfTextAtSize(label, 9);
    ctx.page.drawText(label, {
      x: cols[3].x + (70 - lblW) / 2,
      y: ctx.y,
      size: 9,
      font: ctx.fonts.bold,
      color: rgb(1, 1, 1),
    });

    ctx.y -= 18;
  }

  ctx.y -= 8;
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
