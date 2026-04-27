import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../../_helpers";
import { applyWatermark, applyDraftFooter } from "@/lib/pdf/watermark";
import { hasProAccess } from "@/lib/billing";
import {
  MethodStatementPDF,
  type MethodStatementForm,
} from "@/lib/pdf-react/method-statement";
import {
  RiskAssessmentPDF,
  type RiskAssessmentForm,
} from "@/lib/pdf-react/risk-assessment";
import { CoshhPDF, type CoshhForm } from "@/lib/pdf-react/coshh";
import { HavsPDF, type HavsForm } from "@/lib/pdf-react/havs";
import {
  ToolboxTalkPDF,
  type ToolboxTalkForm,
} from "@/lib/pdf-react/toolbox-talk";
import { PermitPDF, type PermitPdfForm } from "@/lib/pdf-react/permit";
import {
  BriefingPDF,
  type BriefingPdfForm,
} from "@/lib/pdf-react/briefing";
import {
  InspectionPDF,
  type InspectionPdfForm,
} from "@/lib/pdf-react/inspection";
import { PlanPDF, type PlanPdfForm } from "@/lib/pdf-react/plan";
import type { PDFContext } from "@/lib/pdf-react/shared";
// Legacy pdf-lib — only used for the Full RAMs builder until ported.
import { renderFullRams } from "@/lib/pdf/templates/full-rams";

/**
 * GET /api/rams/[id]/pdf
 *
 * Renders a builder doc to PDF. Migrating to @react-pdf/renderer template
 * by template — currently:
 *   - method-statement → React-PDF (rich SiteLynx-style layout)
 *   - everything else  → legacy pdf-lib (will be migrated in follow-ups)
 *
 * Tier gate via hasProAccess(): Pro = clean, Free/expired-trial = watermarked.
 * The watermark for the React-PDF path is rendered INSIDE the document
 * (via PDFWatermark component). The legacy pdf-lib path post-processes
 * with applyWatermark().
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctxAuth = await resolveContext();
  if (!ctxAuth)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { data: docRow, error } = await admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, form_data, organisation_id, project_id"
    )
    .eq("id", id)
    .eq("organisation_id", ctxAuth.organisationId)
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
      .eq("id", ctxAuth.organisationId)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at")
      .eq("organisation_id", ctxAuth.organisationId)
      .maybeSingle(),
  ]);

  // Project + client lookup (if doc is linked to a project)
  let projectMeta: PDFContext["meta"] = {};
  if (docRow.project_id) {
    const { data: project } = await admin
      .from("projects")
      .select(
        "name, code, site_address, site_postcode, start_date, end_date, client_id"
      )
      .eq("id", docRow.project_id)
      .eq("organisation_id", ctxAuth.organisationId)
      .maybeSingle();

    if (project) {
      projectMeta = {
        projectName: project.name,
        projectCode: project.code,
        siteAddress: project.site_address,
        sitePostcode: project.site_postcode,
        dateOfWorks: project.start_date,
        endDate: project.end_date,
      };
      if (project.client_id) {
        const { data: client } = await admin
          .from("clients")
          .select("name")
          .eq("id", project.client_id)
          .eq("organisation_id", ctxAuth.organisationId)
          .maybeSingle();
        if (client) projectMeta.clientName = client.name;
      }
    }
  }

  const isPro = hasProAccess(sub);
  const companyName = org?.name || "Your Company";
  const ref = `RAMS-${docRow.id.slice(0, 8).toUpperCase()}`;
  const formData = (docRow.form_data ?? {}) as Record<string, unknown>;

  const pdfCtx: PDFContext = {
    companyName,
    companyInitials: initialsFromName(companyName),
    logoUrl: org?.logo_url ?? null,
    watermark: !isPro,
    reference: ref,
    meta: projectMeta,
  };

  // ── React-PDF dispatcher ──────────────────────────────────────
  // Returns the React element for the matching builder, or null if the
  // builder still uses the legacy pdf-lib path.
  const reactPdfElement = (() => {
    switch (docRow.builder_slug) {
      case "method-statement":
        return React.createElement(MethodStatementPDF, {
          form: formData as MethodStatementForm,
          ctx: pdfCtx,
        });
      case "risk-assessment":
      case "working-at-height":
      case "manual-handling":
      case "hot-works":
      case "confined-space":
      case "lone-working":
      case "dsear":
      case "pregnant-worker":
      case "young-worker":
      case "whole-body-vibration":
        return React.createElement(RiskAssessmentPDF, {
          form: formData as RiskAssessmentForm,
          ctx: pdfCtx,
        });
      case "coshh":
        return React.createElement(CoshhPDF, {
          form: formData as CoshhForm,
          ctx: pdfCtx,
        });
      case "havs":
        return React.createElement(HavsPDF, {
          form: formData as HavsForm,
          ctx: pdfCtx,
        });
      case "toolbox-talk":
        return React.createElement(ToolboxTalkPDF, {
          form: formData as ToolboxTalkForm,
          ctx: pdfCtx,
        });
      // ─── Permits — same PDF component, different document type label ───
      case "permit-to-work":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: "Permit to Work",
        });
      case "hot-works-permit":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: "Hot Works Permit",
        });
      case "permit-to-dig":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: "Permit to Dig",
        });
      case "confined-space-entry":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: "Confined Space Entry Permit",
        });
      case "working-at-height-permit":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: "Working at Height Permit",
        });
      // ─── Briefings — same PDF, different label ───
      case "site-induction":
        return React.createElement(BriefingPDF, {
          form: formData as BriefingPdfForm,
          ctx: pdfCtx,
          documentType: "Site Induction",
        });
      case "daily-activity-briefing":
        return React.createElement(BriefingPDF, {
          form: formData as BriefingPdfForm,
          ctx: pdfCtx,
          documentType: "Daily Activity Briefing",
        });
      case "pre-task-briefing":
        return React.createElement(BriefingPDF, {
          form: formData as BriefingPdfForm,
          ctx: pdfCtx,
          documentType: "Pre-task Briefing",
        });
      // ─── Inspections — same PDF, different label ───
      case "puwer-check":
        return React.createElement(InspectionPDF, {
          form: formData as InspectionPdfForm,
          ctx: pdfCtx,
          documentType: "PUWER Pre-Use Check",
        });
      case "loler-inspection":
        return React.createElement(InspectionPDF, {
          form: formData as InspectionPdfForm,
          ctx: pdfCtx,
          documentType: "LOLER Inspection",
        });
      case "plant-prestart":
        return React.createElement(InspectionPDF, {
          form: formData as InspectionPdfForm,
          ctx: pdfCtx,
          documentType: "Plant Pre-Start Check",
        });
      case "equipment-register":
        return React.createElement(InspectionPDF, {
          form: formData as InspectionPdfForm,
          ctx: pdfCtx,
          documentType: "Equipment Register Entry",
        });
      // ─── Plans / Schedules — same PDF, different label ───
      case "ppe-schedule":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: "PPE Schedule",
        });
      case "first-aid-assessment":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: "First Aid Needs Assessment",
        });
      case "welfare-plan":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: "Welfare Provision Plan",
        });
      case "emergency-action-plan":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: "Emergency Action Plan",
        });
      case "noise":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: "Noise Assessment",
        });
      default:
        return null;
    }
  })();

  if (reactPdfElement) {
    const buffer = await renderToBuffer(
      reactPdfElement as unknown as React.ReactElement<DocumentProps>
    );

    await admin
      .from("rams_documents")
      .update({
        generated_at: new Date().toISOString(),
        is_watermarked: !isPro,
      })
      .eq("id", id);

    const filename = `CNC-${docRow.builder_slug.toUpperCase()}-${docRow.id.slice(0, 8).toUpperCase()}.pdf`;
    const out = new Uint8Array(buffer);
    return new NextResponse(out, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  // ── Legacy pdf-lib path (Full RAMs only — port pending) ──────
  const branding = {
    name: companyName,
    logoUrl: org?.logo_url ?? null,
  };

  let bytes: Uint8Array;
  switch (docRow.builder_slug) {
    case "full":
      bytes = await renderFullRams(
        formData as Parameters<typeof renderFullRams>[0],
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

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    || "CC";
}
