import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

/**
 * Shared PDF rendering primitives for every RAMs Builder template.
 *
 * Visual grammar matches the ClickNComply design language: pure white
 * background, near-black text, lime accent reserved for cover stripes
 * and section markers. Helvetica throughout (baked into pdf-lib).
 */

export interface CompanyBranding {
  name: string;
  logoUrl?: string | null;
}

export interface PageContext {
  doc: PDFDocument;
  page: PDFPage;
  fonts: { regular: PDFFont; bold: PDFFont };
  /** Cursor measured from the top of the page. */
  y: number;
  width: number;
  height: number;
  margin: number;
}

const PAGE_MARGIN = 48;
const LIME = rgb(0.85, 1, 0); // ~#d4ff00, the brand accent
const NEAR_BLACK = rgb(0.07, 0.07, 0.07);
const MUTED = rgb(0.45, 0.45, 0.45);
const RULE = rgb(0.85, 0.85, 0.85);

export async function newDocument(): Promise<{
  doc: PDFDocument;
  fonts: { regular: PDFFont; bold: PDFFont };
}> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  return { doc, fonts: { regular, bold } };
}

export function newPage(
  doc: PDFDocument,
  fonts: { regular: PDFFont; bold: PDFFont }
): PageContext {
  const page = doc.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();
  return {
    doc,
    page,
    fonts,
    y: height - PAGE_MARGIN,
    width,
    height,
    margin: PAGE_MARGIN,
  };
}

/** Cover banner — light lime tint with a 1px dark rule underneath. */
export function drawCoverBanner(
  ctx: PageContext,
  title: string,
  subtitle?: string
) {
  const bandHeight = 130;
  ctx.page.drawRectangle({
    x: 0,
    y: ctx.height - bandHeight,
    width: ctx.width,
    height: bandHeight,
    color: rgb(0.95, 1, 0.7), // light lime tint, not the saturated brand
  });
  // 1px dark rule under the band
  ctx.page.drawLine({
    start: { x: 0, y: ctx.height - bandHeight },
    end: { x: ctx.width, y: ctx.height - bandHeight },
    thickness: 1,
    color: NEAR_BLACK,
  });
  // Title
  ctx.page.drawText(title, {
    x: ctx.margin,
    y: ctx.height - 56,
    size: 22,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });
  if (subtitle) {
    ctx.page.drawText(subtitle, {
      x: ctx.margin,
      y: ctx.height - 84,
      size: 11,
      font: ctx.fonts.regular,
      color: MUTED,
    });
  }
  // Brand pip on the right edge
  ctx.page.drawCircle({
    x: ctx.width - ctx.margin - 4,
    y: ctx.height - 30,
    size: 4,
    color: LIME,
  });
  ctx.page.drawText("ClickNComply", {
    x: ctx.width - ctx.margin - 90,
    y: ctx.height - 33,
    size: 9,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });
  ctx.y = ctx.height - bandHeight - 24;
}

/** Section heading — small uppercase + thin rule. */
export function drawSectionHeading(ctx: PageContext, label: string) {
  ensureSpace(ctx, 32);
  ctx.page.drawText(label.toUpperCase(), {
    x: ctx.margin,
    y: ctx.y,
    size: 9,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });
  ctx.y -= 6;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 14;
}

/** Body paragraph with word wrap. */
export function drawParagraph(
  ctx: PageContext,
  text: string,
  opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb> } = {}
) {
  if (!text) return;
  const size = opts.size ?? 10;
  const font = opts.bold ? ctx.fonts.bold : ctx.fonts.regular;
  const color = opts.color ?? NEAR_BLACK;
  const lines = wrapText(text, ctx.width - ctx.margin * 2, font, size);
  const lineHeight = size * 1.4;
  for (const line of lines) {
    ensureSpace(ctx, lineHeight);
    ctx.page.drawText(line, {
      x: ctx.margin,
      y: ctx.y,
      size,
      font,
      color,
    });
    ctx.y -= lineHeight;
  }
  ctx.y -= 4;
}

/** Two-column key/value row. */
export function drawKeyValue(
  ctx: PageContext,
  key: string,
  value: string
) {
  if (!value) return;
  ensureSpace(ctx, 14);
  ctx.page.drawText(key, {
    x: ctx.margin,
    y: ctx.y,
    size: 9,
    font: ctx.fonts.bold,
    color: MUTED,
  });
  const lines = wrapText(
    value,
    ctx.width - ctx.margin * 2 - 140,
    ctx.fonts.regular,
    10
  );
  let yCursor = ctx.y;
  for (const line of lines) {
    ctx.page.drawText(line, {
      x: ctx.margin + 140,
      y: yCursor,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    yCursor -= 14;
  }
  ctx.y = yCursor - 6;
}

/** Numbered step block — used by Method Statement steps and procedure lists. */
export function drawNumberedStep(
  ctx: PageContext,
  num: number,
  text: string,
  responsible?: string
) {
  ensureSpace(ctx, 36);
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
  // Text body
  const textX = ctx.margin + 32;
  const textWidth = ctx.width - textX - ctx.margin;
  const lines = wrapText(text, textWidth, ctx.fonts.regular, 10);
  let yCursor = ctx.y;
  for (const line of lines) {
    ctx.page.drawText(line, {
      x: textX,
      y: yCursor,
      size: 10,
      font: ctx.fonts.regular,
      color: NEAR_BLACK,
    });
    yCursor -= 14;
  }
  if (responsible) {
    ctx.page.drawText(`Responsible: ${responsible}`, {
      x: textX,
      y: yCursor,
      size: 9,
      font: ctx.fonts.bold,
      color: MUTED,
    });
    yCursor -= 14;
  }
  ctx.y = yCursor - 8;
}

/** Footer drawn on every page. */
export function drawFooter(ctx: PageContext, branding: CompanyBranding, ref?: string) {
  const footerY = 24;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: footerY + 14 },
    end: { x: ctx.width - ctx.margin, y: footerY + 14 },
    thickness: 0.5,
    color: RULE,
  });
  ctx.page.drawText(branding.name, {
    x: ctx.margin,
    y: footerY,
    size: 8,
    font: ctx.fonts.bold,
    color: MUTED,
  });
  const right = `AI-generated draft${ref ? ` · ${ref}` : ""}`;
  const rightWidth = ctx.fonts.regular.widthOfTextAtSize(right, 8);
  ctx.page.drawText(right, {
    x: ctx.width - ctx.margin - rightWidth,
    y: footerY,
    size: 8,
    font: ctx.fonts.regular,
    color: MUTED,
  });
}

/** Make sure we have headroom for the next block — paginate if not. */
function ensureSpace(ctx: PageContext, needed: number) {
  if (ctx.y - needed < 60) {
    const next = newPage(ctx.doc, ctx.fonts);
    ctx.page = next.page;
    ctx.y = next.y;
  }
}

/** Word-wrap a string to a maximum width in points. */
function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  size: number
): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n+/)) {
    if (!para.trim()) {
      out.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) out.push(line);
        line = word;
      }
    }
    if (line) out.push(line);
  }
  return out;
}
