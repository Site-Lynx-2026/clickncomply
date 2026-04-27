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

export interface CoshhSubstance {
  name: string;
  sdsRef?: string;
  exposureRoute?: string;
  welRef?: string;
  riskLevel?: "low" | "medium" | "high";
  controls?: string;
  ppe?: string;
  emergencyProcedure?: string;
}

export interface CoshhForm {
  title?: string;
  scope?: string;
  preparedBy?: string;
  substances?: CoshhSubstance[];
}

const RISK_HEX: Record<NonNullable<CoshhSubstance["riskLevel"]>, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
};

export async function renderCoshh(
  form: CoshhForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  const ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.title || "COSHH Assessment",
    branding.name
  );

  drawSectionHeading(ctx, "Project");
  drawKeyValue(ctx, "Title", form.title || "—");
  drawKeyValue(ctx, "Scope", form.scope || "—");
  drawKeyValue(ctx, "Reference", ref);
  drawKeyValue(ctx, "Prepared by", form.preparedBy || "—");
  drawKeyValue(
    ctx,
    "Date prepared",
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );

  drawSectionHeading(ctx, `Substances (${form.substances?.length ?? 0})`);

  const subs = form.substances ?? [];
  if (subs.length === 0) {
    drawParagraph(ctx, "No substances recorded.");
  } else {
    subs.forEach((s, i) => drawSubstanceCard(ctx, i + 1, s));
  }

  drawParagraph(ctx, " ");
  drawParagraph(
    ctx,
    "This COSHH assessment is an AI-generated draft. The named preparer is responsible for review against current SDS and HSE guidance before use."
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

function drawSubstanceCard(ctx: PageContext, num: number, s: CoshhSubstance) {
  const ESTIMATED_HEIGHT = 200;
  if (ctx.y - ESTIMATED_HEIGHT < 60) {
    const next = newPage(ctx.doc, ctx.fonts);
    ctx.page = next.page;
    ctx.y = next.y;
  }

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

  // Substance name + risk pill
  ctx.page.drawText(truncate(s.name || "(unnamed substance)", 60), {
    x: ctx.margin + 32,
    y: ctx.y - 4,
    size: 12,
    font: ctx.fonts.bold,
    color: rgb(0.07, 0.07, 0.07),
  });
  if (s.riskLevel) {
    const c = parseHex(RISK_HEX[s.riskLevel]);
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

  ctx.y -= 26;

  if (s.sdsRef) drawKeyValue(ctx, "SDS reference", s.sdsRef);
  if (s.welRef) drawKeyValue(ctx, "WEL reference", s.welRef);
  if (s.exposureRoute) drawKeyValue(ctx, "Exposure routes", s.exposureRoute);
  if (s.controls) drawKeyValue(ctx, "Controls", s.controls);
  if (s.ppe) drawKeyValue(ctx, "PPE required", s.ppe);
  if (s.emergencyProcedure)
    drawKeyValue(ctx, "Emergency procedure", s.emergencyProcedure);

  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: rgb(0.92, 0.92, 0.92),
  });
  ctx.y -= 14;
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
