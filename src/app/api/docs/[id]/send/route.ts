import { NextRequest, NextResponse } from "next/server";
import { resolveContext } from "../../../rams/_helpers";
import { createAdminClient } from "@/lib/supabase/server";
import { renderDocumentPdf, isRenderError } from "@/lib/pdf-react/render-doc";
import { sendDocumentEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { getBuilder } from "@/lib/rams/builders";

/**
 * POST /api/docs/[id]/send
 *
 * "Send to client" — generates the doc PDF, attaches it to a Resend email,
 * and logs the send in document_sends for audit. The recipient gets a
 * branded email with the firm's name in the From, an optional one-line
 * personal message from the user, and a link back to the firm's public
 * share page so they can grab future docs without bothering the firm.
 *
 * Rate-limited to 30/min per user (generous; protects against a stuck
 * button) and 200/day per organisation (Resend free tier ceiling).
 */

const RATE_LIMIT_PER_MINUTE = 30;
const RATE_LIMIT_PER_DAY = 200;

interface SendRequest {
  to: string;
  toName?: string;
  message?: string;
  /** Optional client id — when set we associate the send for the audit row. */
  clientId?: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const minuteCheck = checkRateLimit(
    `doc-send-min:${ctx.userId}`,
    RATE_LIMIT_PER_MINUTE,
    60_000
  );
  if (!minuteCheck.allowed) {
    return NextResponse.json(
      { error: "Slow down — too many sends in a minute." },
      { status: 429 }
    );
  }

  const dayCheck = checkRateLimit(
    `doc-send-day:${ctx.organisationId}`,
    RATE_LIMIT_PER_DAY,
    24 * 60 * 60 * 1000
  );
  if (!dayCheck.allowed) {
    return NextResponse.json(
      { error: "Daily send limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as SendRequest;
  const to = (body.to ?? "").trim();
  const toName = (body.toName ?? "").trim() || null;
  const message = (body.message ?? "").trim() || null;
  const clientId = body.clientId ?? null;

  if (!to) {
    return NextResponse.json({ error: "Missing recipient." }, { status: 400 });
  }
  if (message && message.length > 1000) {
    return NextResponse.json(
      { error: "Message too long (max 1000 chars)." },
      { status: 400 }
    );
  }

  // Render PDF (auth + ownership baked into the helper via organisation_id).
  const rendered = await renderDocumentPdf(id, ctx.organisationId);
  if (isRenderError(rendered)) {
    return NextResponse.json(
      { error: rendered.error },
      { status: rendered.status }
    );
  }

  const admin = createAdminClient();

  // Branding for the From header + share link.
  const { data: org } = await admin
    .from("organisations")
    .select("name, slug")
    .eq("id", ctx.organisationId)
    .single();

  const fromName = org?.name || "ClickNComply User";
  const builder = getBuilder(rendered.doc.builder_slug);
  const docTypeLabel = builder?.shortName ?? "Compliance document";
  const docTitle = rendered.doc.title || docTypeLabel;
  const subject = `${docTypeLabel}: ${docTitle}`;
  const shareUrl = org?.slug
    ? `${baseUrl(req)}/share/${org.slug}`
    : null;

  const result = await sendDocumentEmail({
    to,
    toName,
    fromName,
    subject,
    message,
    pdfFilename: rendered.doc.filename,
    pdfBytes: rendered.bytes,
    docTitle,
    docTypeLabel,
    shareUrl,
  });

  // Audit row — best-effort. If Resend errored we still record the attempt.
  await admin.from("document_sends").insert({
    organisation_id: ctx.organisationId,
    document_id: id,
    client_id: clientId,
    recipient_email: to,
    recipient_name: toName,
    subject,
    message,
    pdf_filename: rendered.doc.filename,
    resend_message_id: result.id ?? null,
    status: result.simulated ? "simulated" : result.ok ? "sent" : "failed",
    error: result.ok ? null : (result.error ?? "Unknown error"),
    sent_by: ctx.userId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Send failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    simulated: !!result.simulated,
    id: result.id,
  });
}

function baseUrl(req: NextRequest): string {
  // Prefer the configured public origin; fall back to the request host.
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const host = req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://clickncomply.app";
}
