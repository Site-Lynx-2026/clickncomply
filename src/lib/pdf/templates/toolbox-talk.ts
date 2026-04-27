import { rgb } from "pdf-lib";
import {
  CompanyBranding,
  drawCoverBanner,
  drawFooter,
  drawKeyValue,
  drawParagraph,
  drawSectionHeading,
  newDocument,
  newPage,
} from "../render";

export interface ToolboxTalkForm {
  topic?: string;
  audience?: string;
  duration?: string;
  generated?: string;
}

/**
 * Render a Toolbox Talk PDF.
 *
 * Single-page brief plus an attendance / sign-off table on the back.
 * The talk body is the AI-generated text held in form.generated; if it's
 * empty (user opened the builder and downloaded blind) we still render a
 * usable empty briefing template.
 */
export async function renderToolboxTalk(
  form: ToolboxTalkForm,
  branding: CompanyBranding,
  ref: string
): Promise<Uint8Array> {
  const { doc, fonts } = await newDocument();
  const ctx = newPage(doc, fonts);

  drawCoverBanner(
    ctx,
    form.topic ? `Toolbox Talk — ${form.topic}` : "Toolbox Talk",
    branding.name
  );

  drawSectionHeading(ctx, "Briefing details");
  drawKeyValue(ctx, "Topic", form.topic || "—");
  drawKeyValue(ctx, "Audience", form.audience || "—");
  drawKeyValue(ctx, "Duration", form.duration || "—");
  drawKeyValue(ctx, "Reference", ref);
  drawKeyValue(
    ctx,
    "Date delivered",
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );

  drawSectionHeading(ctx, "Briefing");
  if (form.generated && form.generated.trim()) {
    drawParagraph(ctx, form.generated);
  } else {
    drawParagraph(
      ctx,
      "No briefing recorded. Use the AI write button in the builder, or write the briefing here before delivery."
    );
  }

  drawSectionHeading(ctx, "Attendance & sign-off");
  drawParagraph(
    ctx,
    "Operatives confirm by signing below that they understood the briefing and have the opportunity to ask questions."
  );

  // Simple sign-off rows — name / signature / date
  const colY = ctx.y;
  const rowHeight = 26;
  const cols = [
    { label: "Name (PRINT)", x: ctx.margin, w: 200 },
    { label: "Signature", x: ctx.margin + 210, w: 180 },
    { label: "Date", x: ctx.margin + 400, w: 100 },
  ];

  // Header
  for (const c of cols) {
    ctx.page.drawText(c.label.toUpperCase(), {
      x: c.x,
      y: colY,
      size: 8,
      font: ctx.fonts.bold,
      color: rgb(0.45, 0.45, 0.45),
    });
  }
  ctx.y = colY - 10;

  // 8 empty rows
  for (let i = 0; i < 8; i++) {
    const rowY = ctx.y;
    for (const c of cols) {
      ctx.page.drawLine({
        start: { x: c.x, y: rowY - 4 },
        end: { x: c.x + c.w, y: rowY - 4 },
        thickness: 0.5,
        color: rgb(0.85, 0.85, 0.85),
      });
    }
    ctx.y -= rowHeight;
  }

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
