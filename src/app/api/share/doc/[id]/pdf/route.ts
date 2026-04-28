import { NextRequest, NextResponse } from "next/server";
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
 * GET /api/share/doc/[id]/pdf
 *
 * Public PDF endpoint — no auth. Used by the public share page
 * (/share/[slug]) so customers/subbies can download a firm's docs
 * without needing a login.
 *
 * Hardening:
 *   - ONLY status="complete" docs are served. Drafts return 404.
 *   - Verifies the doc still belongs to its org (defence in depth).
 *   - Watermark logic mirrors the authed endpoint: free/expired-trial
 *     orgs get a watermarked PDF, Pro orgs get clean.
 *
 * Doc IDs are UUIDs — practically unguessable. Combined with the
 * status="complete" gate, this is safe for public read-only sharing.
 * If we later want stronger control, add a per-doc share_token column.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = createAdminClient();

  // Doc must exist AND be complete
  const { data: docRow, error } = await admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, status, form_data, organisation_id, project_id"
    )
    .eq("id", id)
    .eq("status", "complete")
    .maybeSingle();

  if (error || !docRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Branding + tier in parallel (org membership not needed — public path)
  const [{ data: org }, { data: sub }] = await Promise.all([
    admin
      .from("organisations")
      .select("name, logo_url, slug")
      .eq("id", docRow.organisation_id)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at")
      .eq("organisation_id", docRow.organisation_id)
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
      .eq("organisation_id", docRow.organisation_id)
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
          .eq("organisation_id", docRow.organisation_id)
          .maybeSingle();
        if (client) projectMeta.clientName = client.name;
      }
    }
  }

  const isPro = hasProAccess(sub);
  const companyName = org?.name || "ClickNComply User";
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

  // Same dispatcher as the authed endpoint
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
      case "permit-to-work":
      case "hot-works-permit":
      case "permit-to-dig":
      case "confined-space-entry":
      case "working-at-height-permit":
        return React.createElement(PermitPDF, {
          form: formData as PermitPdfForm,
          ctx: pdfCtx,
          documentType: docRow.title || "Permit",
        });
      case "site-induction":
      case "daily-activity-briefing":
      case "pre-task-briefing":
        return React.createElement(BriefingPDF, {
          form: formData as BriefingPdfForm,
          ctx: pdfCtx,
          documentType: docRow.title || "Briefing",
        });
      case "puwer-check":
      case "loler-inspection":
      case "plant-prestart":
      case "equipment-register":
        return React.createElement(InspectionPDF, {
          form: formData as InspectionPdfForm,
          ctx: pdfCtx,
          documentType: docRow.title || "Inspection",
        });
      case "ppe-schedule":
      case "first-aid-assessment":
      case "welfare-plan":
      case "emergency-action-plan":
        return React.createElement(PlanPDF, {
          form: formData as PlanPdfForm,
          ctx: pdfCtx,
          documentType: docRow.title || "Plan",
        });
      default:
        return null;
    }
  })();

  let pdfBytes: Uint8Array;

  if (reactPdfElement) {
    const buffer = await renderToBuffer(
      reactPdfElement as unknown as React.ReactElement<DocumentProps>
    );
    pdfBytes = new Uint8Array(buffer);
  } else if (docRow.builder_slug === "full") {
    pdfBytes = await renderFullRams(
      formData as Parameters<typeof renderFullRams>[0],
      { name: companyName, logoUrl: pdfCtx.logoUrl ?? null },
      ref
    );
  } else {
    return NextResponse.json(
      { error: `PDF template for "${docRow.builder_slug}" not yet available.` },
      { status: 501 }
    );
  }

  // Apply watermark / draft footer based on tier (same as authed endpoint)
  if (!isPro) {
    pdfBytes = await applyWatermark(pdfBytes);
  } else {
    pdfBytes = await applyDraftFooter(pdfBytes);
  }

  const buffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(buffer).set(pdfBytes);

  const safeFilename = (docRow.title || ref)
    .replace(/[^a-z0-9-]+/gi, "_")
    .slice(0, 80);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${safeFilename}.pdf"`,
      // Public — but allow short cache so customers can re-download
      // without re-rendering. Five minutes is a sensible balance.
      "Cache-Control": "public, max-age=300",
    },
  });
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
