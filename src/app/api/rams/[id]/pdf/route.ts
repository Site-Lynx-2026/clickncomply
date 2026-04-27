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
 * Renders the document to PDF on demand. Hydrates the linked project
 * + client (if any) so the template can fill the info table with real
 * site address, dates, and client name — no more "—" placeholders
 * when a project is picked.
 *
 * Tier gate (single source of truth — `hasProAccess()` in src/lib/billing.ts):
 *   - Pro (paid OR within 5-day trial) → clean PDF, no marks at all
 *   - Free / expired trial            → "POWERED BY CLICKNCOMPLY" diagonal
 *
 * The reference number is the document UUID's first 8 chars — stable +
 * searchable across the system.
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
    .select(
      "id, builder_slug, title, form_data, organisation_id, project_id"
    )
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

  // Project + client lookup (if doc is linked to a project)
  let projectMeta: ProjectMeta = {};
  if (docRow.project_id) {
    const { data: project } = await admin
      .from("projects")
      .select(
        "name, code, site_address, site_postcode, start_date, end_date, client_id"
      )
      .eq("id", docRow.project_id)
      .eq("organisation_id", ctx.organisationId)
      .maybeSingle();

    if (project) {
      projectMeta.projectName = project.name;
      projectMeta.projectCode = project.code;
      projectMeta.siteAddress = project.site_address;
      projectMeta.sitePostcode = project.site_postcode;
      projectMeta.dateOfWorks = project.start_date;
      projectMeta.endDate = project.end_date;

      if (project.client_id) {
        const { data: client } = await admin
          .from("clients")
          .select("name")
          .eq("id", project.client_id)
          .eq("organisation_id", ctx.organisationId)
          .maybeSingle();
        if (client) projectMeta.clientName = client.name;
      }
    }
  }

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
        ref,
        projectMeta
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

  // Pro tier: clean. Free / expired trial: diagonal brand watermark.
  const finalBytes = isPro
    ? await applyDraftFooter(bytes)
    : await applyWatermark(bytes);

  await admin
    .from("rams_documents")
    .update({
      generated_at: new Date().toISOString(),
      is_watermarked: !isPro,
    })
    .eq("id", id);

  const buffer = new ArrayBuffer(finalBytes.byteLength);
  new Uint8Array(buffer).set(finalBytes);

  // Naming: prefer doc title, fall back to ref. Strip non-safe chars.
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

interface ProjectMeta {
  clientName?: string | null;
  projectName?: string | null;
  projectCode?: string | null;
  siteAddress?: string | null;
  sitePostcode?: string | null;
  dateOfWorks?: string | null;
  endDate?: string | null;
}
