import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUILDERS } from "@/lib/rams/builders";
import { FileText, Download, Pencil, Plus, Folder, ArrowRight } from "@/lib/icons";
import { X } from "lucide-react";
import type { Database } from "@/types/supabase";
import { PageHeader } from "@/components/page-header";

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
  | "project_id"
>;

type ProjectRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  "id" | "name" | "code" | "client_id"
>;

type ClientRow = Pick<
  Database["public"]["Tables"]["clients"]["Row"],
  "id" | "name"
>;

interface SearchParams {
  project?: string;
  client?: string;
  status?: "draft" | "complete";
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
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
  const orgId = membership.organisation_id;
  const params = await searchParams;

  // Pre-resolve client filter → project IDs (for the WHERE clause)
  let clientProjectIds: string[] | null = null;
  if (params.client) {
    const { data: clientProjects } = await admin
      .from("projects")
      .select("id")
      .eq("organisation_id", orgId)
      .eq("client_id", params.client);
    clientProjectIds = (clientProjects ?? []).map((p) => p.id);
  }

  // Build the docs query with optional filters
  let docsQ = admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, status, updated_at, generated_at, is_watermarked, project_id"
    )
    .eq("organisation_id", orgId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(500);

  if (params.project === "_none") {
    docsQ = docsQ.is("project_id", null);
  } else if (params.project) {
    docsQ = docsQ.eq("project_id", params.project);
  }
  if (params.status === "draft" || params.status === "complete") {
    docsQ = docsQ.eq("status", params.status);
  }
  if (clientProjectIds !== null) {
    if (clientProjectIds.length === 0) {
      // Client has no projects → return zero docs
      docsQ = docsQ.eq("id", "00000000-0000-0000-0000-000000000000");
    } else {
      docsQ = docsQ.in("project_id", clientProjectIds);
    }
  }

  const [{ data: docRows }, { data: projectRows }, { data: clientRows }] = await Promise.all([
    docsQ,
    admin
      .from("projects")
      .select("id, name, code, client_id")
      .eq("organisation_id", orgId)
      .neq("status", "archived")
      .order("name", { ascending: true }),
    admin
      .from("clients")
      .select("id, name")
      .eq("organisation_id", orgId)
      .eq("archived", false)
      .order("name", { ascending: true }),
  ]);

  const docs = (docRows ?? []) as DocRow[];
  const projects = (projectRows ?? []) as ProjectRow[];
  const clients = (clientRows ?? []) as ClientRow[];
  const projectById = new Map(projects.map((p) => [p.id, p]));
  const clientById = new Map(clients.map((c) => [c.id, c]));

  const filterActive =
    !!params.project || !!params.client || !!params.status;
  const activeProject = params.project && params.project !== "_none"
    ? projectById.get(params.project)
    : null;
  const activeClient = params.client ? clientById.get(params.client) : null;

  // Group docs by project (with "No project" bucket)
  const groupedByProject = new Map<string | null, DocRow[]>();
  for (const d of docs) {
    const key = d.project_id ?? null;
    const arr = groupedByProject.get(key) ?? [];
    arr.push(d);
    groupedByProject.set(key, arr);
  }

  // Sort: real projects first (by name), "No project" last
  const projectGroups = Array.from(groupedByProject.entries()).sort((a, b) => {
    if (a[0] === null) return 1;
    if (b[0] === null) return -1;
    const pa = projectById.get(a[0])?.name ?? "";
    const pb = projectById.get(b[0])?.name ?? "";
    return pa.localeCompare(pb);
  });

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Safety"
        title="My Documents"
        subtitle={
          docs.length === 0
            ? filterActive
              ? "Nothing matches those filters."
              : "Nothing saved yet — start a builder from the sidebar."
            : `${docs.length} document${docs.length === 1 ? "" : "s"}${
                filterActive ? " (filtered)" : " across all RAMs builders"
              }.`
        }
        size="md"
        actions={
          <Button asChild>
            <Link href="/tools/rams">
              <Plus className="size-3.5 mr-1.5" />
              New
            </Link>
          </Button>
        }
      />

      {/* Filters bar */}
      {(projects.length > 0 || clients.length > 0) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterPills
            params={params}
            activeProject={activeProject}
            activeClient={activeClient}
          />
          <FilterMenus
            params={params}
            projects={projects}
            clients={clients}
            hasUnassigned={docs.some((d) => d.project_id === null)}
          />
        </div>
      )}

      {docs.length === 0 ? (
        <EmptyState filterActive={filterActive} />
      ) : (
        <div className="space-y-8">
          {projectGroups.map(([projectId, projectDocs]) => {
            const project = projectId ? projectById.get(projectId) : null;
            const client = project?.client_id
              ? clientById.get(project.client_id)
              : null;
            return (
              <section key={projectId ?? "_none"}>
                <ProjectHeader
                  project={project ?? null}
                  client={client ?? null}
                  count={projectDocs.length}
                />
                <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden divide-y divide-[var(--border-soft)]">
                  {projectDocs.map((d) => (
                    <DocRowItem key={d.id} doc={d} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── components ─────────────────────────────────────────────────────────

function ProjectHeader({
  project,
  client,
  count,
}: {
  project: ProjectRow | null;
  client: ClientRow | null;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <Folder className="size-3.5 text-muted-foreground shrink-0" />
        <h2 className="text-sm font-semibold tracking-tight truncate">
          {project ? project.name : "No project"}
        </h2>
        {project?.code && (
          <span className="font-mono text-xs text-muted-foreground">
            {project.code}
          </span>
        )}
        {client && (
          <span className="text-xs text-muted-foreground truncate">
            · {client.name}
          </span>
        )}
        {project && (
          <Link
            href={`/projects?edit=${project.id}`}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 ml-1"
          >
            edit
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
      <span className="text-xs text-muted-foreground shrink-0">
        {count} doc{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function FilterPills({
  params,
  activeProject,
  activeClient,
}: {
  params: SearchParams;
  activeProject: ProjectRow | null | undefined;
  activeClient: ClientRow | null | undefined;
}) {
  const pills: { label: string; clearHref: string }[] = [];

  if (params.client && activeClient) {
    pills.push({
      label: `Client: ${activeClient.name}`,
      clearHref: hrefWithout(params, "client"),
    });
  }
  if (params.project === "_none") {
    pills.push({
      label: "No project",
      clearHref: hrefWithout(params, "project"),
    });
  } else if (params.project && activeProject) {
    pills.push({
      label: `Project: ${activeProject.name}`,
      clearHref: hrefWithout(params, "project"),
    });
  }
  if (params.status) {
    pills.push({
      label: params.status === "draft" ? "Drafts only" : "Complete only",
      clearHref: hrefWithout(params, "status"),
    });
  }

  if (pills.length === 0) return null;

  return (
    <>
      {pills.map((p) => (
        <Link
          key={p.label}
          href={p.clearHref}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs hover:bg-muted/70 transition"
        >
          {p.label}
          <X className="size-3" />
        </Link>
      ))}
      {pills.length > 1 && (
        <Link
          href="/tools/rams/documents"
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Clear all
        </Link>
      )}
    </>
  );
}

function FilterMenus({
  params,
  projects,
  clients,
  hasUnassigned,
}: {
  params: SearchParams;
  projects: ProjectRow[];
  clients: ClientRow[];
  hasUnassigned: boolean;
}) {
  return (
    <div className="ml-auto flex items-center gap-2 text-xs">
      {projects.length > 0 && (
        <select
          defaultValue={params.project ?? ""}
          className="bg-background border rounded-md px-2 py-1 text-xs"
          // Server-component-friendly: navigate via form on change isn't
          // available, but a tiny inline script handles it.
          // For now, the user can use the FilterPills to clear & re-pick.
          // V2: replace with shadcn Select inside a small client component.
          onChange={undefined}
        >
          <option value="">All projects</option>
          {hasUnassigned && <option value="_none">— no project —</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      {clients.length > 0 && (
        <select
          defaultValue={params.client ?? ""}
          className="bg-background border rounded-md px-2 py-1 text-xs"
          onChange={undefined}
        >
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      {/* Status filter as plain links — server-component-safe */}
      <FilterStatusLinks params={params} />
    </div>
  );
}

function FilterStatusLinks({ params }: { params: SearchParams }) {
  const base = hrefWithout(params, "status");
  const draftHref = withParam(params, "status", "draft");
  const completeHref = withParam(params, "status", "complete");

  return (
    <div className="inline-flex border rounded-md overflow-hidden">
      <Link
        href={base}
        className={`px-2 py-1 text-xs ${
          !params.status
            ? "bg-foreground text-background"
            : "hover:bg-muted/50"
        }`}
      >
        All
      </Link>
      <Link
        href={draftHref}
        className={`px-2 py-1 text-xs border-l ${
          params.status === "draft"
            ? "bg-foreground text-background"
            : "hover:bg-muted/50"
        }`}
      >
        Drafts
      </Link>
      <Link
        href={completeHref}
        className={`px-2 py-1 text-xs border-l ${
          params.status === "complete"
            ? "bg-foreground text-background"
            : "hover:bg-muted/50"
        }`}
      >
        Complete
      </Link>
    </div>
  );
}

function DocRowItem({ doc }: { doc: DocRow }) {
  const builder = BUILDERS[doc.builder_slug as keyof typeof BUILDERS];
  const Icon = builder?.icon ?? FileText;
  const editHref = `/tools/rams/${doc.builder_slug}?doc=${doc.id}`;
  const pdfHref = `/api/rams/${doc.id}/pdf`;
  const updated = relativeTime(doc.updated_at);

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
          {doc.status === "draft" && (
            <Badge variant="secondary" className="text-[9px] uppercase">
              Draft
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>Updated</span>
          <span className="font-mono-num text-foreground/70">{updated}</span>
          {doc.generated_at && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span>PDF generated</span>
            </>
          )}
          {doc.is_watermarked && doc.generated_at && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span>watermarked</span>
            </>
          )}
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

function EmptyState({ filterActive }: { filterActive: boolean }) {
  if (filterActive) {
    return (
      <div className="border border-dashed border-soft rounded-2xl px-8 py-14 text-center surface-raised shadow-sm-cool">
        <div className="inline-flex size-14 rounded-2xl items-center justify-center mb-5 surface-pebble border border-soft">
          <FileText className="size-6" strokeWidth={1.6} />
        </div>
        <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">
          No matching documents
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
          Try removing a filter, or pick a different project / client.
        </p>
        <Link
          href="/tools/rams/documents"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
        >
          Clear filters
        </Link>
      </div>
    );
  }
  return (
    <div className="border border-dashed border-soft rounded-2xl px-8 py-14 text-center surface-raised shadow-sm-cool">
      <div className="inline-flex size-14 rounded-2xl items-center justify-center mb-5 status-info">
        <FileText className="size-6" strokeWidth={1.6} />
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">
        No documents yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        Generate your first compliance document in under five minutes. Pick a
        trade and the AI drafts a full RAMS, ready to brand and download.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/tools/rams/full"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
        >
          Build with AI
        </Link>
        <Link
          href="/tools/rams"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition"
        >
          Browse all builders
        </Link>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────

function withParam(
  params: SearchParams,
  key: keyof SearchParams,
  value: string
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v as string);
  }
  sp.set(key, value);
  return `/tools/rams/documents?${sp.toString()}`;
}

function hrefWithout(params: SearchParams, key: keyof SearchParams): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === key || !v) continue;
    sp.set(k, v as string);
  }
  const q = sp.toString();
  return q ? `/tools/rams/documents?${q}` : "/tools/rams/documents";
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (diff < min) return "just now";
  if (diff < hr) return `${Math.floor(diff / min)}m ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
