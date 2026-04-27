import {
  CompanyBranding,
  drawHeader,
  drawFooter,
  drawInfoTable,
  drawNumberedStep,
  drawParagraph,
  drawPreparerDisclaimer,
  drawSectionHeading,
  newDocument,
  newPage,
} from "../render";

export interface MethodStatementForm {
  title?: string;
  scope?: string;
  trade?: string;
  steps?: { description: string; responsible?: string }[];
  preparedBy?: string;
  preparedByRole?: string;
}

/**
 * Project + client metadata pulled from the linked project record (if any)
 * by the PDF route. Used for the info table at the top of the document.
 */
export interface DocumentMeta {
  clientName?: string | null;
  projectName?: string | null;
  projectCode?: string | null;
  siteAddress?: string | null;
  sitePostcode?: string | null;
  dateOfWorks?: string | null;
  endDate?: string | null;
}

/**
 * Render a Method Statement PDF. SiteLynx-class output: clean dark header,
 * info table, numbered section badges, professional footer + page numbers.
 *
 * Returns raw bytes; downstream callers decide whether to apply the
 * watermark (free tier) or pass through clean (paid tier).
 */
export async function renderMethodStatement(
  form: MethodStatementForm,
  branding: CompanyBranding,
  ref: string,
  meta: DocumentMeta = {}
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  const ctx = newPage(doc, fonts);

  const title = form.title || "Method Statement";
  const subtitle = form.trade
    ? `${form.trade}${meta.projectName ? ` · ${meta.projectName}` : ""}`
    : meta.projectName ?? undefined;

  drawHeader(ctx, {
    eyebrow: "Method Statement",
    title,
    subtitle,
    branding,
    ref,
  });

  // ── Info table ─────────────────────────────────────────────────
  // Two-column key/value grid summarising the document context.
  drawInfoTable(ctx, [
    { label: "Client", value: meta.clientName ?? null },
    { label: "Reference", value: ref },
    { label: "Project", value: meta.projectName ?? null },
    { label: "Revision", value: "1" },
    { label: "Site address", value: combineAddress(meta) },
    {
      label: "Date prepared",
      value: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    },
    { label: "Date of works", value: formatDateOrNull(meta.dateOfWorks) },
    { label: "Prepared by", value: form.preparedBy ?? null },
    { label: "Trade / discipline", value: form.trade ?? null },
    { label: "Role", value: form.preparedByRole ?? null },
  ]);

  // ── Description / scope ───────────────────────────────────────
  if (form.scope) {
    drawSectionHeading(ctx, "Description of works");
    drawParagraph(ctx, form.scope);
  }

  // ── Sequence of work ──────────────────────────────────────────
  drawSectionHeading(ctx, "Sequence of work — safe system of work");
  const steps = form.steps ?? [];
  if (steps.length === 0) {
    drawParagraph(ctx, "No method steps defined.");
  } else {
    steps.forEach((step, i) => {
      if (step.description) {
        drawNumberedStep(ctx, i + 1, step.description, step.responsible);
      }
    });
  }

  // ── Sign-off ──────────────────────────────────────────────────
  drawSectionHeading(ctx, "Document sign-off");
  drawInfoTable(
    ctx,
    [
      { label: "Prepared by", value: form.preparedBy ?? null },
      { label: "Approved by", value: "Awaiting approval" },
      { label: "Role", value: form.preparedByRole ?? null },
      { label: "Approval date", value: null },
      {
        label: "Signature date",
        value: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      },
      { label: "Document status", value: "Controlled" },
    ],
    2
  );

  drawPreparerDisclaimer(ctx);

  // Final-page footer (every other page got one via ensureSpace already)
  drawFooter(ctx);

  return doc.save();
}

// ─── helpers ────────────────────────────────────────────────────────────

function combineAddress(meta: DocumentMeta): string | null {
  const parts: string[] = [];
  if (meta.siteAddress) parts.push(meta.siteAddress);
  if (meta.sitePostcode) parts.push(meta.sitePostcode);
  return parts.length > 0 ? parts.join(", ") : null;
}

function formatDateOrNull(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
