import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, RGB } from "pdf-lib";

/**
 * Shared PDF rendering primitives for every RAMs Builder template.
 *
 * Visual grammar (rebuilt 27 Apr 2026 to match SiteLynx-quality bar):
 *   - Clean white background
 *   - Dark heading band at top (company + title + ref + dates)
 *   - Numbered dark section badges (small filled square, white number)
 *   - Proper info tables with key/value columns
 *   - Generic table primitive for PPE / plant / RA / etc.
 *   - Emergency callout boxes
 *   - Subtle footer: company · ref · page X
 *
 * No "AI-generated draft" stamps in the body or footer — the legal
 * disclaimer goes into the Document Sign-Off section as professional
 * copy ("named preparer is responsible for review, suitability and
 * competency before use"). The watermark engine handles brand stamping
 * for the free tier separately.
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
  /** Branding + ref captured at header time so footers can repeat them. */
  branding?: CompanyBranding;
  ref?: string;
  /** Track section number for badges. Reset by `resetSectionCounter`. */
  sectionNum?: number;
  /** Page counter for footer. */
  pageNum?: number;
}

const PAGE_MARGIN = 48;

// Palette — clean professional, no lime in the doc body.
const NEAR_BLACK = rgb(0.07, 0.07, 0.07);
const TEXT = rgb(0.15, 0.15, 0.15);
const MUTED = rgb(0.45, 0.45, 0.45);
const RULE = rgb(0.88, 0.88, 0.88);
const TABLE_HEADER_BG = rgb(0.12, 0.12, 0.12);
const TABLE_HEADER_TEXT = rgb(0.98, 0.98, 0.98);
const ROW_ALT = rgb(0.97, 0.97, 0.97);
const CALLOUT_RED_BG = rgb(0.99, 0.95, 0.95);
const CALLOUT_RED_BORDER = rgb(0.85, 0.4, 0.4);
const CALLOUT_RED_TEXT = rgb(0.7, 0.15, 0.15);
const CALLOUT_AMBER_BG = rgb(1, 0.97, 0.92);
const CALLOUT_AMBER_BORDER = rgb(0.9, 0.7, 0.4);
const CALLOUT_AMBER_TEXT = rgb(0.6, 0.4, 0.1);

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
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  return {
    doc,
    page,
    fonts,
    y: height - PAGE_MARGIN,
    width,
    height,
    margin: PAGE_MARGIN,
    sectionNum: 0,
    pageNum: 1,
  };
}

/**
 * Cover header — clean, dark, professional. SiteLynx-style.
 * Eyebrow text → big bold title → optional subtitle → 1px rule.
 */
export function drawHeader(
  ctx: PageContext,
  opts: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    branding?: CompanyBranding;
    ref?: string;
  }
) {
  ctx.branding = opts.branding;
  ctx.ref = opts.ref;

  // Brand mark top right (small text only — no lime, no logo block yet)
  if (opts.branding) {
    const brandText = opts.branding.name;
    const brandWidth = ctx.fonts.bold.widthOfTextAtSize(brandText, 10);
    ctx.page.drawText(brandText, {
      x: ctx.width - ctx.margin - brandWidth,
      y: ctx.height - 36,
      size: 10,
      font: ctx.fonts.bold,
      color: NEAR_BLACK,
    });
  }

  // Eyebrow (uppercase mono-style label)
  let cursor = ctx.height - 80;
  if (opts.eyebrow) {
    ctx.page.drawText(opts.eyebrow.toUpperCase(), {
      x: ctx.margin,
      y: cursor,
      size: 9,
      font: ctx.fonts.bold,
      color: MUTED,
    });
    cursor -= 16;
  }

  // Title (big, bold)
  ctx.page.drawText(opts.title, {
    x: ctx.margin,
    y: cursor - 22,
    size: 24,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });
  cursor -= 38;

  // Subtitle (muted)
  if (opts.subtitle) {
    ctx.page.drawText(opts.subtitle, {
      x: ctx.margin,
      y: cursor,
      size: 11,
      font: ctx.fonts.regular,
      color: MUTED,
    });
    cursor -= 18;
  }

  // 1px rule under header
  cursor -= 8;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: cursor },
    end: { x: ctx.width - ctx.margin, y: cursor },
    thickness: 0.6,
    color: RULE,
  });

  ctx.y = cursor - 24;
}

/**
 * Numbered section heading — dark filled square + heading text.
 * Auto-increments the section counter.
 */
export function drawSectionHeading(ctx: PageContext, label: string) {
  ensureSpace(ctx, 36);
  ctx.sectionNum = (ctx.sectionNum ?? 0) + 1;
  const num = String(ctx.sectionNum);
  const badgeSize = 16;
  const numWidth = ctx.fonts.bold.widthOfTextAtSize(num, 10);

  // Dark square badge
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - badgeSize + 2,
    width: badgeSize,
    height: badgeSize,
    color: NEAR_BLACK,
  });
  ctx.page.drawText(num, {
    x: ctx.margin + (badgeSize - numWidth) / 2,
    y: ctx.y - badgeSize + 6,
    size: 10,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });

  // Heading text to the right of the badge
  ctx.page.drawText(label.toUpperCase(), {
    x: ctx.margin + badgeSize + 8,
    y: ctx.y - 9,
    size: 11,
    font: ctx.fonts.bold,
    color: NEAR_BLACK,
  });

  ctx.y -= badgeSize + 8;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.width - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 14;
}

export function resetSectionCounter(ctx: PageContext) {
  ctx.sectionNum = 0;
}

/** Body paragraph with word wrap. */
export function drawParagraph(
  ctx: PageContext,
  text: string,
  opts: { size?: number; bold?: boolean; color?: RGB } = {}
) {
  if (!text) return;
  const size = opts.size ?? 10;
  const font = opts.bold ? ctx.fonts.bold : ctx.fonts.regular;
  const color = opts.color ?? TEXT;
  const lines = wrapText(text, ctx.width - ctx.margin * 2, font, size);
  const lineHeight = size * 1.45;
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

/**
 * Two-column info table — wraps a labelled set of fields.
 * E.g. Client / Site / Ref / Rev / Date / Prepared By.
 *
 * `columns` is the number of columns to render side-by-side. For a
 * standard meta-block, pass 2 (key/value pairs in two side-by-side cols).
 */
export interface InfoRow {
  label: string;
  value: string | null | undefined;
}

export function drawInfoTable(ctx: PageContext, rows: InfoRow[], columns = 2) {
  const rowHeight = 22;
  const colWidth = (ctx.width - ctx.margin * 2) / columns;
  const labelWidth = 90;
  const rowsPerCol = Math.ceil(rows.length / columns);
  const tableHeight = rowsPerCol * rowHeight;

  ensureSpace(ctx, tableHeight + 4);

  // Soft alternating row backgrounds across all columns
  for (let r = 0; r < rowsPerCol; r++) {
    if (r % 2 === 0) {
      ctx.page.drawRectangle({
        x: ctx.margin,
        y: ctx.y - rowHeight * (r + 1) + 4,
        width: ctx.width - ctx.margin * 2,
        height: rowHeight,
        color: ROW_ALT,
      });
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = ctx.margin + col * colWidth;
    const y = ctx.y - row * rowHeight - 12;
    const value = rows[i].value?.trim() || "—";

    ctx.page.drawText(rows[i].label.toUpperCase(), {
      x: x + 8,
      y,
      size: 7.5,
      font: ctx.fonts.bold,
      color: MUTED,
    });
    // Value — truncate if too wide
    const maxValueWidth = colWidth - labelWidth - 12;
    const truncated = truncateText(value, ctx.fonts.regular, 9.5, maxValueWidth);
    ctx.page.drawText(truncated, {
      x: x + labelWidth,
      y,
      size: 9.5,
      font: ctx.fonts.bold,
      color: NEAR_BLACK,
    });
  }

  ctx.y -= tableHeight + 12;
}

/** Generic two-column key/value row (single-row layout). */
export function drawKeyValue(ctx: PageContext, key: string, value: string) {
  if (!value) return;
  ensureSpace(ctx, 16);
  ctx.page.drawText(key.toUpperCase(), {
    x: ctx.margin,
    y: ctx.y,
    size: 8,
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
      color: TEXT,
    });
    yCursor -= 14;
  }
  ctx.y = yCursor - 6;
}

/** Numbered step block — used by Method Statement steps. */
export function drawNumberedStep(
  ctx: PageContext,
  num: number,
  text: string,
  responsible?: string
) {
  ensureSpace(ctx, 36);
  // Number pill (lighter than section badge — distinct visual)
  ctx.page.drawCircle({
    x: ctx.margin + 9,
    y: ctx.y - 7,
    size: 9,
    color: NEAR_BLACK,
  });
  const numStr = String(num);
  const numWidth = ctx.fonts.bold.widthOfTextAtSize(numStr, 9);
  ctx.page.drawText(numStr, {
    x: ctx.margin + 9 - numWidth / 2,
    y: ctx.y - 10,
    size: 9,
    font: ctx.fonts.bold,
    color: rgb(1, 1, 1),
  });

  const textX = ctx.margin + 28;
  const textWidth = ctx.width - textX - ctx.margin;
  const lines = wrapText(text, textWidth, ctx.fonts.regular, 10);
  let yCursor = ctx.y;
  for (const line of lines) {
    ctx.page.drawText(line, {
      x: textX,
      y: yCursor,
      size: 10,
      font: ctx.fonts.regular,
      color: TEXT,
    });
    yCursor -= 14;
  }
  if (responsible) {
    ctx.page.drawText(`Responsible: ${responsible}`, {
      x: textX,
      y: yCursor,
      size: 8.5,
      font: ctx.fonts.bold,
      color: MUTED,
    });
    yCursor -= 13;
  }
  ctx.y = yCursor - 8;
}

/**
 * Generic table primitive — header row + data rows with alt-row tint.
 *
 * `columns` defines headers + relative widths (proportional). Rows are
 * arrays of cell strings matching column order.
 */
export interface TableColumn {
  header: string;
  /** Relative weight — sum of all weights = total table width. */
  weight: number;
}

export function drawTable(
  ctx: PageContext,
  columns: TableColumn[],
  rows: string[][]
) {
  const totalWeight = columns.reduce((sum, c) => sum + c.weight, 0);
  const tableWidth = ctx.width - ctx.margin * 2;
  const colWidths = columns.map((c) => (c.weight / totalWeight) * tableWidth);
  const headerHeight = 22;
  const rowMinHeight = 20;
  const cellPadX = 8;
  const cellPadY = 6;

  ensureSpace(ctx, headerHeight + 4);

  // Header row (dark)
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - headerHeight + 2,
    width: tableWidth,
    height: headerHeight,
    color: TABLE_HEADER_BG,
  });
  let cursorX = ctx.margin;
  for (let i = 0; i < columns.length; i++) {
    ctx.page.drawText(columns[i].header.toUpperCase(), {
      x: cursorX + cellPadX,
      y: ctx.y - 14,
      size: 8,
      font: ctx.fonts.bold,
      color: TABLE_HEADER_TEXT,
    });
    cursorX += colWidths[i];
  }
  ctx.y -= headerHeight;

  // Body rows
  for (let r = 0; r < rows.length; r++) {
    // Calculate the wrapped lines for each cell to determine row height
    const wrapped = rows[r].map((cell, i) =>
      wrapText(
        cell || "—",
        colWidths[i] - cellPadX * 2,
        ctx.fonts.regular,
        9
      )
    );
    const maxLines = Math.max(...wrapped.map((l) => l.length));
    const rowHeight = Math.max(rowMinHeight, maxLines * 13 + cellPadY * 2);

    ensureSpace(ctx, rowHeight);

    // Alt row background
    if (r % 2 === 1) {
      ctx.page.drawRectangle({
        x: ctx.margin,
        y: ctx.y - rowHeight + 2,
        width: tableWidth,
        height: rowHeight,
        color: ROW_ALT,
      });
    }

    cursorX = ctx.margin;
    for (let i = 0; i < columns.length; i++) {
      let yCursor = ctx.y - cellPadY - 9;
      for (const line of wrapped[i]) {
        ctx.page.drawText(line, {
          x: cursorX + cellPadX,
          y: yCursor,
          size: 9,
          font: ctx.fonts.regular,
          color: TEXT,
        });
        yCursor -= 13;
      }
      cursorX += colWidths[i];
    }
    ctx.y -= rowHeight;
  }

  // Bottom rule
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y - 1 },
    end: { x: ctx.width - ctx.margin, y: ctx.y - 1 },
    thickness: 0.5,
    color: RULE,
  });
  ctx.y -= 16;
}

/** Coloured callout box — used for Emergency / RIDDOR / Warning blocks. */
export function drawCallout(
  ctx: PageContext,
  opts: {
    title: string;
    body: string;
    tone?: "red" | "amber";
  }
) {
  const tone = opts.tone ?? "amber";
  const bg = tone === "red" ? CALLOUT_RED_BG : CALLOUT_AMBER_BG;
  const border = tone === "red" ? CALLOUT_RED_BORDER : CALLOUT_AMBER_BORDER;
  const titleColor = tone === "red" ? CALLOUT_RED_TEXT : CALLOUT_AMBER_TEXT;

  const padding = 12;
  const titleHeight = 14;
  const bodyLines = wrapText(
    opts.body,
    ctx.width - ctx.margin * 2 - padding * 2,
    ctx.fonts.regular,
    9
  );
  const bodyHeight = bodyLines.length * 12;
  const totalHeight = padding * 2 + titleHeight + 4 + bodyHeight;

  ensureSpace(ctx, totalHeight + 8);

  // Box
  ctx.page.drawRectangle({
    x: ctx.margin,
    y: ctx.y - totalHeight,
    width: ctx.width - ctx.margin * 2,
    height: totalHeight,
    color: bg,
    borderColor: border,
    borderWidth: 0.6,
  });

  // Title
  ctx.page.drawText(opts.title.toUpperCase(), {
    x: ctx.margin + padding,
    y: ctx.y - padding - 10,
    size: 9,
    font: ctx.fonts.bold,
    color: titleColor,
  });

  // Body
  let yCursor = ctx.y - padding - titleHeight - 10;
  for (const line of bodyLines) {
    ctx.page.drawText(line, {
      x: ctx.margin + padding,
      y: yCursor,
      size: 9,
      font: ctx.fonts.regular,
      color: TEXT,
    });
    yCursor -= 12;
  }

  ctx.y -= totalHeight + 12;
}

/**
 * Footer drawn on every page — branded but not noisy.
 * Format: company name (left) · ref + page number (right)
 *
 * Back-compat: old templates pass (ctx, branding, ref). New templates use
 * the captured ctx.branding / ctx.ref. Either signature works.
 */
export function drawFooter(
  ctx: PageContext,
  branding?: CompanyBranding,
  ref?: string
) {
  if (branding) ctx.branding = branding;
  if (ref) ctx.ref = ref;
  const footerY = 28;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: footerY + 14 },
    end: { x: ctx.width - ctx.margin, y: footerY + 14 },
    thickness: 0.4,
    color: RULE,
  });

  const left = ctx.branding?.name ?? "";
  ctx.page.drawText(left, {
    x: ctx.margin,
    y: footerY,
    size: 8,
    font: ctx.fonts.bold,
    color: MUTED,
  });

  const right = `${ctx.ref ? `${ctx.ref} · ` : ""}Page ${ctx.pageNum ?? 1}`;
  const rightWidth = ctx.fonts.regular.widthOfTextAtSize(right, 8);
  ctx.page.drawText(right, {
    x: ctx.width - ctx.margin - rightWidth,
    y: footerY,
    size: 8,
    font: ctx.fonts.regular,
    color: MUTED,
  });
}

/**
 * @deprecated — back-compat shim for templates that haven't been rebuilt
 * with the new SiteLynx-style header. Maps to drawHeader with sensible
 * defaults. Once every template uses drawHeader directly, delete.
 */
export function drawCoverBanner(
  ctx: PageContext,
  title: string,
  subtitle?: string
) {
  drawHeader(ctx, {
    title,
    subtitle,
    branding: ctx.branding,
    ref: ctx.ref,
  });
}

/**
 * Document control disclaimer — drop into sign-off section as professional
 * copy. Replaces the in-body "AI-generated draft" stamp.
 */
export const PREPARER_DISCLAIMER =
  "This document was prepared using ClickNComply templates. The named preparer is responsible for review, suitability, and competency before use on site.";

/** Render the disclaimer as a small italic-feel paragraph. */
export function drawPreparerDisclaimer(ctx: PageContext) {
  ensureSpace(ctx, 28);
  drawParagraph(ctx, PREPARER_DISCLAIMER, { size: 8.5, color: MUTED });
}

// ─── internal ───────────────────────────────────────────────────────────

/** Make sure we have headroom for the next block — paginate if not. */
function ensureSpace(ctx: PageContext, needed: number) {
  if (ctx.y - needed < 60) {
    drawFooter(ctx);
    const next = newPage(ctx.doc, ctx.fonts);
    next.branding = ctx.branding;
    next.ref = ctx.ref;
    next.sectionNum = ctx.sectionNum;
    next.pageNum = (ctx.pageNum ?? 1) + 1;
    ctx.page = next.page;
    ctx.y = next.y;
    ctx.pageNum = next.pageNum;
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

/** Truncate text to fit a max width, adding ellipsis if needed. */
function truncateText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let truncated = text;
  while (
    font.widthOfTextAtSize(truncated + "…", size) > maxWidth &&
    truncated.length > 1
  ) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "…";
}
