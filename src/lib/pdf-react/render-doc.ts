import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { createAdminClient } from "@/lib/supabase/server";
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
import { renderFullRams } from "@/lib/pdf/templates/full-rams";

/**
 * Shared document → PDF renderer.
 *
 * Three callers use this:
 *   1. GET /api/rams/[id]/pdf       — authed download
 *   2. GET /api/share/doc/[id]/pdf  — public share page
 *   3. POST /api/docs/[id]/send     — email-to-client attachment
 *
 * Caller is responsible for the auth + ownership check before invoking
 * (the helper just trusts that the doc id + organisation_id pair is OK).
 *
 * Returns the rendered PDF bytes plus the doc metadata callers commonly
 * need (title for filename, builder_slug, org name for branding).
 */

export interface RenderDocResult {
  bytes: Uint8Array;
  doc: {
    id: string;
    builder_slug: string;
    title: string | null;
    is_pro_render: boolean;
    reference: string;
    filename: string;
  };
  org: {
    name: string;
    logoUrl: string | null;
  };
}

export interface RenderDocError {
  error: string;
  status: number;
}

export type RenderDocOutcome = RenderDocResult | RenderDocError;

export function isRenderError(o: RenderDocOutcome): o is RenderDocError {
  return "error" in o;
}

/**
 * Render a doc to PDF bytes. Handles tier gating (watermark on free/expired),
 * builder dispatch (React-PDF + the legacy pdf-lib path for "full"), and
 * project/client lookup for the PDF context.
 *
 * `options.requireComplete` — if true, only renders docs with status=complete
 * (used by the public share endpoint).
 */
export async function renderDocumentPdf(
  docId: string,
  organisationId: string,
  options: { requireComplete?: boolean } = {}
): Promise<RenderDocOutcome> {
  const admin = createAdminClient();

  let docQuery = admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, status, form_data, organisation_id, project_id"
    )
    .eq("id", docId)
    .eq("organisation_id", organisationId);
  if (options.requireComplete) docQuery = docQuery.eq("status", "complete");

  const { data: docRow, error } = await docQuery.maybeSingle();
  if (error) return { error: error.message, status: 500 };
  if (!docRow) return { error: "Not found", status: 404 };

  const [{ data: org }, { data: sub }] = await Promise.all([
    admin
      .from("organisations")
      .select("name, logo_url")
      .eq("id", organisationId)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at")
      .eq("organisation_id", organisationId)
      .maybeSingle(),
  ]);

  // Project + client lookup (for PDF header/footer meta).
  let projectMeta: PDFContext["meta"] = {};
  if (docRow.project_id) {
    const { data: project } = await admin
      .from("projects")
      .select(
        "name, code, site_address, site_postcode, start_date, end_date, client_id"
      )
      .eq("id", docRow.project_id)
      .eq("organisation_id", organisationId)
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
          .eq("organisation_id", organisationId)
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

  const reactPdfElement = dispatchReactPdf(
    docRow.builder_slug,
    formData,
    pdfCtx,
    docRow.title
  );

  let bytes: Uint8Array;
  if (reactPdfElement) {
    const buffer = await renderToBuffer(
      reactPdfElement as unknown as React.ReactElement<DocumentProps>
    );
    bytes = new Uint8Array(buffer);
  } else if (docRow.builder_slug === "full") {
    // Legacy pdf-lib path — Full RAMs hasn't been ported yet.
    const legacyBytes = await renderFullRams(
      formData as Parameters<typeof renderFullRams>[0],
      { name: companyName, logoUrl: pdfCtx.logoUrl ?? null },
      ref
    );
    bytes = isPro
      ? await applyDraftFooter(legacyBytes)
      : await applyWatermark(legacyBytes);
  } else {
    return {
      error: `PDF template for "${docRow.builder_slug}" not yet implemented.`,
      status: 501,
    };
  }

  const filename = `CNC-${docRow.builder_slug.toUpperCase()}-${docRow.id
    .slice(0, 8)
    .toUpperCase()}.pdf`;

  return {
    bytes,
    doc: {
      id: docRow.id,
      builder_slug: docRow.builder_slug,
      title: docRow.title,
      is_pro_render: isPro,
      reference: ref,
      filename,
    },
    org: {
      name: companyName,
      logoUrl: org?.logo_url ?? null,
    },
  };
}

function dispatchReactPdf(
  builderSlug: string,
  formData: Record<string, unknown>,
  ctx: PDFContext,
  title: string | null
): React.ReactElement | null {
  switch (builderSlug) {
    case "method-statement":
      return React.createElement(MethodStatementPDF, {
        form: formData as MethodStatementForm,
        ctx,
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
        ctx,
      });
    case "coshh":
      return React.createElement(CoshhPDF, {
        form: formData as CoshhForm,
        ctx,
      });
    case "havs":
      return React.createElement(HavsPDF, {
        form: formData as HavsForm,
        ctx,
      });
    case "toolbox-talk":
      return React.createElement(ToolboxTalkPDF, {
        form: formData as ToolboxTalkForm,
        ctx,
      });
    case "permit-to-work":
    case "hot-works-permit":
    case "permit-to-dig":
    case "confined-space-entry":
    case "working-at-height-permit":
      return React.createElement(PermitPDF, {
        form: formData as PermitPdfForm,
        ctx,
        documentType: title || labelForPermit(builderSlug),
      });
    case "site-induction":
    case "daily-activity-briefing":
    case "pre-task-briefing":
      return React.createElement(BriefingPDF, {
        form: formData as BriefingPdfForm,
        ctx,
        documentType: title || labelForBriefing(builderSlug),
      });
    case "puwer-check":
    case "loler-inspection":
    case "plant-prestart":
    case "equipment-register":
      return React.createElement(InspectionPDF, {
        form: formData as InspectionPdfForm,
        ctx,
        documentType: title || labelForInspection(builderSlug),
      });
    case "ppe-schedule":
    case "first-aid-assessment":
    case "welfare-plan":
    case "emergency-action-plan":
      return React.createElement(PlanPDF, {
        form: formData as PlanPdfForm,
        ctx,
        documentType: title || labelForPlan(builderSlug),
      });
    case "noise":
      return React.createElement(PlanPDF, {
        form: formData as PlanPdfForm,
        ctx,
        documentType: title || "Noise Assessment",
      });
    default:
      return null;
  }
}

function labelForPermit(slug: string): string {
  switch (slug) {
    case "hot-works-permit":
      return "Hot Works Permit";
    case "permit-to-dig":
      return "Permit to Dig";
    case "confined-space-entry":
      return "Confined Space Entry Permit";
    case "working-at-height-permit":
      return "Working at Height Permit";
    default:
      return "Permit to Work";
  }
}

function labelForBriefing(slug: string): string {
  switch (slug) {
    case "site-induction":
      return "Site Induction";
    case "daily-activity-briefing":
      return "Daily Activity Briefing";
    case "pre-task-briefing":
      return "Pre-task Briefing";
    default:
      return "Briefing";
  }
}

function labelForInspection(slug: string): string {
  switch (slug) {
    case "loler-inspection":
      return "LOLER Inspection";
    case "plant-prestart":
      return "Plant Pre-Start Check";
    case "equipment-register":
      return "Equipment Register Entry";
    default:
      return "PUWER Pre-Use Check";
  }
}

function labelForPlan(slug: string): string {
  switch (slug) {
    case "first-aid-assessment":
      return "First Aid Needs Assessment";
    case "welfare-plan":
      return "Welfare Provision Plan";
    case "emergency-action-plan":
      return "Emergency Action Plan";
    default:
      return "PPE Schedule";
  }
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
}
