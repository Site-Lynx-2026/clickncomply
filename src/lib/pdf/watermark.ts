import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

/**
 * Universal AI-generated-draft footer applied to EVERY PDF
 * (free + paid). Legal hygiene — under PUWER / CDM / ISO scrutiny we
 * never want a ClickNComply doc presented as a finalised compliance
 * document without a clear "draft, review before delivery" mark.
 */
const AI_DRAFT_NOTICE = "AI-generated draft · Review before delivery · ClickNComply";
const AI_DRAFT_SIZE = 7;

/**
 * Apply BOTH:
 *   1. Universal AI-draft footer (every page) — for free AND paid output
 *   2. "Powered by ClickNComply" diagonal + branded footer right — free only
 *
 * Pro outputs go through `applyDraftFooter()` instead — same draft notice,
 * no watermark, no brand stamp.
 */
export async function applyWatermark(pdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    // 1. Universal AI-draft notice (applies to free + paid alike)
    drawAiDraftNotice(page, helveticaRegular);

    // 2. Free-tier brand footer right
    const footerText = "Generated free with ClickNComply.app";
    const footerSize = 8;
    const footerWidth = helvetica.widthOfTextAtSize(footerText, footerSize);
    page.drawText(footerText, {
      x: width - footerWidth - 24,
      y: 16,
      size: footerSize,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    // 3. Diagonal faded "Powered by ClickNComply" across each page
    const diagonalText = "Powered by ClickNComply";
    const diagonalSize = 36;
    const diagonalWidth = helvetica.widthOfTextAtSize(diagonalText, diagonalSize);
    page.drawText(diagonalText, {
      x: (width - diagonalWidth * 0.7071) / 2,
      y: (height - diagonalSize * 0.7071) / 2,
      size: diagonalSize,
      font: helvetica,
      color: rgb(0.85, 0.85, 0.85),
      rotate: degrees(-30),
      opacity: 0.25,
    });
  }

  return pdfDoc.save();
}

/**
 * Pro-tier path: universal AI-draft footer ONLY — no watermark, no
 * brand stamp. Replaces the old `unwatermark()` no-op so the AI-draft
 * disclaimer is universal across every output the platform produces.
 */
export async function applyDraftFooter(
  pdfBytes: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    drawAiDraftNotice(page, helvetica);
  }

  return pdfDoc.save();
}

/**
 * Internal helper — draw the AI-generated-draft notice in the page footer-left.
 * Subtle grey, small, never obstructs content.
 */
function drawAiDraftNotice(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any,
  font: import("pdf-lib").PDFFont
) {
  page.drawText(AI_DRAFT_NOTICE, {
    x: 24,
    y: 16,
    size: AI_DRAFT_SIZE,
    font,
    color: rgb(0.55, 0.55, 0.55),
  });
}

/**
 * @deprecated — use `applyDraftFooter()` instead. Kept for back-compat
 * with any existing callsites; still applies the AI-draft notice.
 */
export async function unwatermark(pdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  return applyDraftFooter(pdfBytes);
}
