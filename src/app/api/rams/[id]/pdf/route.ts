import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../../_helpers";
import { applyWatermark, applyDraftFooter } from "@/lib/pdf/watermark";
import { hasProAccess } from "@/lib/billing";
import { renderMethodStatement } from "@/lib/pdf/templates/method-statement";
import { renderRiskAssessment } from "@/lib/pdf/templates/risk-assessment";
import { renderToolboxTalk } from "@/lib/pdf/templates/toolbox-talk";
import { renderCoshh } from "@/lib/pdf/templates/coshh";
import { renderHavs } from "@/lib/pdf/templates/havs";
import { renderFullRams } from "@/lib/pdf/templates/full-rams";

/**
 * GET /api/rams/[id]/pdf
 *
 * Renders the document to PDF on demand.
 *
 * Tier gate (single source of truth — `hasProAccess()` in src/lib/billing.ts):
 *   - Pro (paid OR within 5-day trial) → clean PDF + universal AI-draft footer
 *   - Free / expired trial            → watermarked PDF + universal AI-draft footer
 *
 * The reference number is the document UUID's first 8 chars, so it's stable
 * + searchable.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: docRow, error } = await admin
    .from("rams_documents")
    .select("id, builder_slug, title, form_data, organisation_id")
    .eq("id", id)
    .eq("organisation_id", ctx.organisationId)
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!docRow)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Branding + tier in parallel
  const [{ data: org }, { data: sub }] = await Promise.all([
    admin
      .from("organisations")
      .select("name, logo_url")
      .eq("id", ctx.organisationId)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at")
      .eq("organisation_id", ctx.organisationId)
      .maybeSingle(),
  ]);

  const isPro = hasProAccess(sub);
  const branding = {
    name: org?.name || "Your Company",
    logoUrl: org?.logo_url ?? null,
  };
  const ref = `RAMS-${docRow.id.slice(0, 8).toUpperCase()}`;

  const formData = (docRow.form_data ?? {}) as Record<string, unknown>;
  let bytes: Uint8Array;
  switch (docRow.builder_slug) {
    case "full":
      bytes = await renderFullRams(
        formData as Parameters<typeof renderFullRams>[0],
        branding,
        ref
      );
      break;
    case "method-statement":
      bytes = await renderMethodStatement(
        formData as Parameters<typeof renderMethodStatement>[0],
        branding,
        ref
      );
      break;
    case "risk-assessment":
      bytes = await renderRiskAssessment(
        formData as Parameters<typeof renderRiskAssessment>[0],
        branding,
        ref
      );
      break;
    case "toolbox-talk":
      bytes = await renderToolboxTalk(
        formData as Parameters<typeof renderToolboxTalk>[0],
        branding,
        ref
      );
      break;
    case "coshh":
      bytes = await renderCoshh(
        formData as Parameters<typeof renderCoshh>[0],
        branding,
        ref
      );
      break;
    case "havs":
      bytes = await renderHavs(
        formData as Parameters<typeof renderHavs>[0],
        branding,
        ref
      );
      break;
    default:
      return NextResponse.json(
        {
          error: `PDF template for "${docRow.builder_slug}" not yet implemented.`,
        },
        { status: 501 }
      );
  }

  // Pro tier: clean + draft footer. Free / expired trial: full watermark.
  const finalBytes = isPro
    ? await applyDraftFooter(bytes)
    : await applyWatermark(bytes);

  // Mark generation timestamp + watermark flag (best-effort, non-blocking).
  await admin
    .from("rams_documents")
    .update({
      generated_at: new Date().toISOString(),
      is_watermarked: !isPro,
    })
    .eq("id", id);

  // Build the body as a Uint8Array view of an ArrayBuffer so it satisfies
  // the WHATWG BodyInit type (which excludes SharedArrayBuffer-backed views).
  const buffer = new ArrayBuffer(finalBytes.byteLength);
  new Uint8Array(buffer).set(finalBytes);

  const filename = `${(docRow.title || ref).replace(/[^a-z0-9-]+/gi, "_")}.pdf`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
