import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../../_helpers";
import { applyWatermark } from "@/lib/pdf/watermark";
import { renderMethodStatement } from "@/lib/pdf/templates/method-statement";

/**
 * GET /api/rams/[id]/pdf
 *
 * Renders the document to PDF on demand. Free tier outputs go through the
 * watermark engine; paid tier outputs are returned clean. The reference
 * number is the document UUID's first 8 chars, so it's stable + searchable.
 *
 * Templates per builder live in src/lib/pdf/templates/. Right now only
 * Method Statement is wired — the rest fall through to a 501 until they
 * land in subsequent commits.
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

  // Tier — paid tier skips the watermark.
  const [{ data: org }, { data: sub }] = await Promise.all([
    admin
      .from("organisations")
      .select("name, logo_url")
      .eq("id", ctx.organisationId)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status")
      .eq("organisation_id", ctx.organisationId)
      .maybeSingle(),
  ]);

  const isPaid =
    sub?.tier === "pro" &&
    (sub?.status === "active" || sub?.status === "trialing");
  const branding = {
    name: org?.name || "Your Company",
    logoUrl: org?.logo_url ?? null,
  };
  const ref = `RAMS-${docRow.id.slice(0, 8).toUpperCase()}`;

  let bytes: Uint8Array;
  switch (docRow.builder_slug) {
    case "method-statement":
      bytes = await renderMethodStatement(
        (docRow.form_data ?? {}) as Parameters<typeof renderMethodStatement>[0],
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

  const finalBytes = isPaid ? bytes : await applyWatermark(bytes);

  // Mark generation timestamp + watermark flag (best-effort, non-blocking).
  await admin
    .from("rams_documents")
    .update({
      generated_at: new Date().toISOString(),
      is_watermarked: !isPaid,
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
