import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

/**
 * Watermark engine — free tier only.
 *
 * Free tier: subtle "POWERED BY CLICKNCOMPLY" diagonal across each page.
 *            Visible enough to mark provenance and drive marketing,
 *            light enough to not destroy the document's professionalism.
 *
 * Pro tier: completely clean — no marks, no diagonal, no AI-draft stamps.
 *           The PDF is the customer's professional document.
 *
 * Legal disclaimer ("preparer is responsible for review, suitability and
 * competency") lives inside the document's sign-off section as professional
 * copy, NOT as a watermark stamp. See `PREPARER_DISCLAIMER` in render.ts.
 */

export async function applyWatermark(
  pdfBytes: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    // Diagonal faded brand mark — sits behind content
    const diagonalText = "POWERED BY CLICKNCOMPLY";
    const diagonalSize = 32;
    const diagonalWidth = helvetica.widthOfTextAtSize(diagonalText, diagonalSize);
    page.drawText(diagonalText, {
      x: (width - diagonalWidth * 0.7071) / 2,
      y: (height - diagonalSize * 0.7071) / 2,
      size: diagonalSize,
      font: helvetica,
      color: rgb(0.88, 0.88, 0.88),
      rotate: degrees(-30),
      opacity: 0.3,
    });
  }

  return pdfDoc.save();
}

/**
 * Pro tier path — no watermark, no AI-draft stamps. The customer paid for
 * professional output; they get professional output. The disclaimer in
 * the document sign-off section provides the legal cover.
 */
export async function applyDraftFooter(
  pdfBytes: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  // Pass through — Pro tier PDFs are clean.
  return new Uint8Array(pdfBytes instanceof ArrayBuffer ? pdfBytes : pdfBytes);
}

/**
 * @deprecated — alias for applyDraftFooter, kept for back-compat.
 */
export async function unwatermark(
  pdfBytes: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  return applyDraftFooter(pdfBytes);
}
