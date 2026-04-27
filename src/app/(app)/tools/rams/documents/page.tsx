import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUILDERS } from "@/lib/rams/builders";
import { FileText, Download, Pencil, Plus } from "lucide-react";
import type { Database } from "@/types/supabase";

export const metadata = {
  title: "Documents — RAMs Builder — ClickNComply",
  description:
    "Every RAMs document you've started — drafts to resume, completed packs to share.",
};

type DocRow = Pick<
  Database["public"]["Tables"]["rams_documents"]["Row"],
  | "id"
  | "builder_slug"
  | "title"
  | "status"
  | "updated_at"
  | "generated_at"
  | "is_watermarked"
>;

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

  const { data: rows } = await admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, status, updated_at, generated_at, is_watermarked"
    )
    .eq("organisation_id", membership.organisation_id)
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(200);

  const docs = (rows ?? []) as DocRow[];

  const grouped = docs.reduce<Record<string, DocRow[]>>((acc, d) => {
    (acc[d.status] ??= []).push(d);
    return acc;
  }, {});

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <header className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Documents
          </h1>
          <p className="text-muted-foreground">
            {docs.length === 0
              ? "Nothing saved yet — start a builder from the sidebar."
              : `${docs.length} document${docs.length === 1 ? "" : "s"} across all RAMs builders.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/tools/rams">
            <Plus className="size-3.5 mr-1.5" />
            New
          </Link>
        </Button>
      </header>

      {docs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          <DocSection title="Drafts" docs={grouped.draft ?? []} />
          <DocSection title="Complete" docs={grouped.complete ?? []} />
        </div>
      )}
    </div>
  );
}

function DocSection({ title, docs }: { title: string; docs: DocRow[] }) {
  if (docs.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">
          {docs.length} {docs.length === 1 ? "document" : "documents"}
        </span>
      </div>
      <div className="border rounded-lg overflow-hidden divide-y bg-card">
        {docs.map((d) => (
          <DocRow key={d.id} doc={d} />
        ))}
      </div>
    </section>
  );
}

function DocRow({ doc }: { doc: DocRow }) {
  const builder = BUILDERS[doc.builder_slug as keyof typeof BUILDERS];
  const Icon = builder?.icon ?? FileText;
  const editHref = `/tools/rams/${doc.builder_slug}?doc=${doc.id}`;
  const pdfHref = `/api/rams/${doc.id}/pdf`;
  const updated = new Date(doc.updated_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/40 transition group">
      <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0">
        <Icon className="size-4" strokeWidth={1.6} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={editHref}
            className="font-semibold tracking-tight truncate hover:underline"
          >
            {doc.title || "(untitled draft)"}
          </Link>
          <Badge variant="outline" className="text-[9px] uppercase shrink-0">
            {builder?.shortName ?? doc.builder_slug}
          </Badge>
          {doc.status === "complete" && (
            <Badge className="text-[9px] uppercase bg-brand text-brand-foreground hover:bg-brand">
              Complete
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {updated}
          {doc.generated_at && " · PDF generated"}
          {doc.is_watermarked && doc.generated_at && " · watermarked"}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button asChild variant="ghost" size="sm">
          <Link href={editHref}>
            <Pencil className="size-3.5 mr-1.5" />
            Edit
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={pdfHref} target="_blank" rel="noreferrer">
            <Download className="size-3.5 mr-1.5" />
            PDF
          </a>
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20">
      <FileText className="size-6 mx-auto mb-3 text-muted-foreground" />
      <h2 className="font-semibold mb-1">No documents yet</h2>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
        Pick a builder from the sidebar — Method Statement, Risk Assessment,
        COSHH, HAVs, or Toolbox Talk — and save your first draft.
      </p>
      <Button asChild variant="outline">
        <Link href="/tools/rams">Browse builders</Link>
      </Button>
    </div>
  );
}
