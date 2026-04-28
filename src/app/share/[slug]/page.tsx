import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BUILDERS } from "@/lib/rams/builders";
import { Download, FileText, ShieldCheck, ExternalLink } from "lucide-react";
import type { Database } from "@/types/supabase";

/* ──────────────────────────────────────────────────────────────────────
 * Public share page — no auth, no login.
 *
 * The "touchless surface". A solo trader / small firm gets a single URL
 * (e.g. clickncomply.app/share/bob-electrical) that they can WhatsApp /
 * SMS to a customer or main contractor when asked "send me your RAMs and
 * insurance". Customer hits the URL on their phone, sees the firm's name,
 * logo, contact info, and downloads completed documents in one tap.
 *
 * No login required for viewers. Branded with the firm's logo. Updates
 * automatically as the firm completes new documents.
 *
 * This is the differentiating feature for the 1–5 audience — no other
 * compliance tool in the £2–19/month bracket has this. It also acts as
 * a quiet marketing surface: every share = the firm's URL goes in front
 * of another tradesperson.
 * ────────────────────────────────────────────────────────────────────── */

type ShareDoc = Pick<
  Database["public"]["Tables"]["rams_documents"]["Row"],
  "id" | "builder_slug" | "title" | "updated_at" | "generated_at"
>;

export const revalidate = 60; // Cache for 1 minute — fresh-ish

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organisations")
    .select("name")
    .eq("slug", slug)
    .maybeSingle();

  if (!org) return { title: "Not found — ClickNComply" };
  return {
    title: `${org.name} — Compliance documents`,
    description: `Public compliance documents and certificates for ${org.name}.`,
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: org } = await admin
    .from("organisations")
    .select("id, name, slug, logo_url, description, industry")
    .eq("slug", slug)
    .maybeSingle();

  if (!org) notFound();

  // Recent completed docs only — never expose drafts
  const { data: docs } = await admin
    .from("rams_documents")
    .select("id, builder_slug, title, updated_at, generated_at")
    .eq("organisation_id", org.id)
    .eq("status", "complete")
    .order("generated_at", { ascending: false, nullsFirst: false })
    .limit(20);

  const recentDocs = (docs ?? []) as ShareDoc[];

  return (
    <div className="min-h-screen surface-canvas">
      {/* Soft brand halo top-left */}
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top left, var(--brand-soft-bg) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <main className="relative max-w-3xl mx-auto px-6 py-12 sm:py-16">
        {/* Brand identity card */}
        <header className="rounded-2xl surface-raised border border-soft shadow-md-cool overflow-hidden mb-10">
          {/* Lime stripe at top */}
          <div className="h-1.5 bg-brand" aria-hidden />
          <div className="px-7 py-7 sm:flex sm:items-center sm:gap-6">
            {/* Logo */}
            <div className="size-16 sm:size-20 rounded-xl surface-pebble border border-soft flex items-center justify-center shrink-0 mb-4 sm:mb-0 overflow-hidden">
              {org.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={org.logo_url}
                  alt={org.name}
                  className="size-full object-cover"
                />
              ) : (
                <span className="font-display font-bold text-2xl text-foreground/60">
                  {org.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="size-3 text-foreground" />
                Compliance documents
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground leading-none mb-2">
                {org.name}
              </h1>
              {org.industry && (
                <p className="text-sm text-muted-foreground capitalize">
                  {org.industry}
                </p>
              )}
            </div>
          </div>
          {org.description && (
            <div className="px-7 pb-6 -mt-2">
              <p className="text-sm leading-relaxed text-foreground/80">
                {org.description}
              </p>
            </div>
          )}
        </header>

        {/* Documents */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Available documents
            </h2>
            <span className="text-xs text-muted-foreground">
              {recentDocs.length}
              {recentDocs.length === 20 && "+"}
            </span>
          </div>

          {recentDocs.length === 0 ? (
            <EmptyDocs />
          ) : (
            <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden divide-y divide-[var(--border-soft)]">
              {recentDocs.map((doc) => (
                <DocRow key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </section>

        {/* Footer card — powered by + how to share */}
        <footer className="rounded-xl border border-soft surface-pebble px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-muted-foreground leading-relaxed">
            Documents prepared with{" "}
            <Link
              href="/"
              className="font-semibold text-foreground hover:underline underline-offset-2"
            >
              ClickNComply
            </Link>
            . Compliance for solo traders &amp; small firms.
          </div>
          <Link
            href="/"
            className="text-xs text-foreground inline-flex items-center gap-1 hover:underline underline-offset-2"
          >
            Get your own share page
            <ExternalLink className="size-3" />
          </Link>
        </footer>
      </main>
    </div>
  );
}

/* ─── Components ──────────────────────────────────────────────────── */

function DocRow({ doc }: { doc: ShareDoc }) {
  const builder = BUILDERS[doc.builder_slug as keyof typeof BUILDERS];
  const Icon = builder?.icon ?? FileText;
  const completedAt = doc.generated_at ?? doc.updated_at;
  const dateLabel = new Date(completedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-brand-soft transition-colors group">
      <div className="shrink-0 size-10 rounded-lg surface-pebble border border-soft flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
        <Icon className="size-4" strokeWidth={1.6} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold tracking-tight truncate">
          {doc.title || builder?.shortName || "Document"}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {builder?.shortName || doc.builder_slug} · {dateLabel}
        </div>
      </div>
      <Button asChild size="sm" variant="outline">
        <a
          href={`/api/share/doc/${doc.id}/pdf`}
          target="_blank"
          rel="noreferrer"
        >
          <Download className="size-3.5 mr-1.5" />
          PDF
        </a>
      </Button>
    </div>
  );
}

function EmptyDocs() {
  return (
    <div className="rounded-xl border border-dashed border-soft surface-pebble px-6 py-10 text-center">
      <FileText className="size-5 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm font-semibold mb-1">No public documents yet.</p>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        Documents will appear here once they&apos;re marked complete by the
        firm.
      </p>
    </div>
  );
}
