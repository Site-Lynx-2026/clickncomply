import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

/**
 * Apply a "Powered by ClickNComply" watermark to every page of a PDF.
 *
 * This is the viral mechanic for the free tier — every output a free
 * customer generates carries the brand. Pro tier outputs skip this.
 *
 * Strategy: discreet footer-right text + diagonal faded watermark across
 * each page. Visible enough to be noticed, not aggressive enough to make
 * the document unusable.
 */
export async function applyWatermark(pdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    // Footer right — clickable-feeling brand mark
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

    // Diagonal faded watermark, centred
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
 * Removes any prior watermark and returns clean PDF.
 * For Pro-tier outputs.
 */
export async function unwatermark(pdfBytes: Uint8Array | ArrayBuffer): Promise<Uint8Array> {
  // Pro outputs are generated clean from source — no need to strip.
  // This function exists as an explicit pass-through for clarity in callsites.
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return pdfDoc.save();
}
