import { Resend } from "resend";

/**
 * Email — Resend client + send helpers.
 *
 * Used by:
 *   - /api/docs/[id]/send — emailing PDFs to clients/customers
 *
 * Config:
 *   RESEND_API_KEY      — required
 *   RESEND_FROM_EMAIL   — sender (default "hello@clickncomply.app")
 *   RESEND_REPLY_TO     — reply-to (default falls back to from)
 *
 * In dev without an API key the send helper is a no-op that returns a
 * faked success — so the send dialog flow can be exercised without
 * needing a Resend account. In production a missing key throws.
 */

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@clickncomply.app";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? FROM;

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export interface SendDocEmailParams {
  to: string;
  /** Recipient name — used in the salutation if provided. */
  toName?: string | null;
  /** "From <Acme Builders>" — defaults to brand name. */
  fromName: string;
  subject: string;
  /** Personal message from the user (plain text, optional). */
  message: string | null;
  pdfFilename: string;
  pdfBytes: Uint8Array;
  /** Document title (e.g. "Method Statement — First Fix Electrical"). */
  docTitle: string;
  /** Friendly doc type label (e.g. "Method Statement"). */
  docTypeLabel: string;
  /** Public share URL the recipient can use to grab future docs too. */
  shareUrl: string | null;
}

export interface SendDocEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  /** True when no API key is configured and we returned a fake success. */
  simulated?: boolean;
}

export async function sendDocumentEmail(
  params: SendDocEmailParams
): Promise<SendDocEmailResult> {
  if (!isValidEmail(params.to)) {
    return { ok: false, error: "Invalid recipient email." };
  }

  const html = renderEmailHtml(params);
  const text = renderEmailText(params);

  const c = getClient();
  if (!c) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Email is not configured on the server." };
    }
    // Dev fallback — log and pretend it sent.
    console.log("[email/dev-fallback] would send:", {
      to: params.to,
      subject: params.subject,
      pdfBytes: params.pdfBytes.byteLength,
    });
    return { ok: true, id: "dev-fallback", simulated: true };
  }

  try {
    const fromHeader = `${escapeForFromHeader(params.fromName)} <${FROM}>`;
    const res = await c.emails.send({
      from: fromHeader,
      to: params.to,
      replyTo: REPLY_TO,
      subject: params.subject,
      html,
      text,
      attachments: [
        {
          filename: params.pdfFilename,
          content: Buffer.from(params.pdfBytes),
        },
      ],
    });
    if (res.error) {
      return { ok: false, error: res.error.message ?? "Send failed." };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    console.error("[email/send] failed", err);
    return { ok: false, error: "Email provider rejected the message." };
  }
}

function isValidEmail(s: string): boolean {
  // Simple sanity — Resend will reject bad ones authoritatively.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function escapeForFromHeader(name: string): string {
  // Strip anything that could break the From header. Quote the display name
  // so " Bob's Building Co " is safe.
  const cleaned = name.replace(/["\r\n]/g, "").trim();
  return `"${cleaned}"`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailHtml(p: SendDocEmailParams): string {
  const salutation = p.toName ? `Hi ${escapeHtml(p.toName)},` : "Hi,";
  const message = p.message?.trim();
  const messageBlock = message
    ? `<p style="margin:0 0 18px 0;color:#111;font-size:15px;line-height:1.5;">${escapeHtml(
        message
      ).replace(/\n/g, "<br/>")}</p>`
    : "";
  const shareLink = p.shareUrl
    ? `<p style="margin:24px 0 0 0;color:#666;font-size:13px;line-height:1.5;">Need our other documents too? View them all here: <a href="${escapeHtml(
        p.shareUrl
      )}" style="color:#000;">${escapeHtml(p.shareUrl)}</a></p>`
    : "";
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:32px 20px;">
    <div style="background:#fff;border:1px solid #e5e5e0;border-radius:12px;padding:28px;">
      <p style="margin:0 0 18px 0;color:#111;font-size:15px;">${salutation}</p>
      ${messageBlock}
      <p style="margin:0 0 18px 0;color:#111;font-size:15px;line-height:1.5;">
        Please find attached the <strong>${escapeHtml(p.docTypeLabel)}</strong> for your records:<br/>
        <span style="color:#666;">${escapeHtml(p.docTitle)}</span>
      </p>
      <p style="margin:24px 0 0 0;color:#666;font-size:13px;line-height:1.5;">
        Sent by ${escapeHtml(p.fromName)} via <a href="https://clickncomply.app" style="color:#000;text-decoration:none;font-weight:600;">ClickNComply</a>.
      </p>
      ${shareLink}
    </div>
  </div>
</body></html>`;
}

function renderEmailText(p: SendDocEmailParams): string {
  const salutation = p.toName ? `Hi ${p.toName},` : "Hi,";
  const message = p.message?.trim() ? `${p.message.trim()}\n\n` : "";
  const share = p.shareUrl
    ? `\n\nNeed our other documents too? View them all here:\n${p.shareUrl}`
    : "";
  return `${salutation}

${message}Please find attached the ${p.docTypeLabel} for your records:
${p.docTitle}

Sent by ${p.fromName} via ClickNComply (https://clickncomply.app).${share}`;
}
