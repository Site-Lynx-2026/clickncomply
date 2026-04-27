import {
  CompanyBranding,
  drawCoverBanner,
  drawFooter,
  drawKeyValue,
  drawNumberedStep,
  drawParagraph,
  drawSectionHeading,
  newDocument,
  newPage,
} from "../render";

export interface MethodStatementForm {
  title?: string;
  scope?: string;
  steps?: { description: string; responsible?: string }[];
  preparedBy?: string;
  preparedByRole?: string;
}

/**
 * Render a Method Statement PDF from form data.
 *
 * Returns the raw bytes; downstream callers decide whether to apply the
 * watermark (free tier) or return as-is (paid tier).
 */
export async function renderMethodStatement(
  form: MethodStatementForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  const ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.title || "Method Statement",
    branding.name
  );

  // ── Project block ─────────────────────────────────────────────
  drawSectionHeading(ctx, "Project");
  drawKeyValue(ctx, "Title", form.title || "—");
  drawKeyValue(ctx, "Scope of works", form.scope || "—");
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

  // ── Sequence of work ──────────────────────────────────────────
  drawSectionHeading(ctx, "Sequence of work");

  const steps = form.steps ?? [];
  if (steps.length === 0) {
    drawParagraph(ctx, "No steps recorded.");
  } else {
    steps.forEach((step, i) => {
      if (step.description) {
        drawNumberedStep(ctx, i + 1, step.description, step.responsible);
      }
    });
  }

  // ── Sign-off block ────────────────────────────────────────────
  drawSectionHeading(ctx, "Prepared by");
  drawKeyValue(ctx, "Name", form.preparedBy || "—");
  drawKeyValue(ctx, "Role", form.preparedByRole || "—");
  drawParagraph(ctx, " ");
  drawParagraph(
    ctx,
    "This Method Statement is an AI-generated draft. The named preparer is responsible for review, suitability and competency before use on site."
  );

  // ── Footer on every page ──────────────────────────────────────
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    drawFooter(
      {
        doc,
        page,
        fonts,
        y: 0,
        width,
        height,
        margin: 48,
      },
      branding,
      ref
    );
  }

  return doc.save();
}
