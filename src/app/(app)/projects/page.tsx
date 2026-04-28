import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "@/lib/icons";
import { ProjectFormDialog } from "./_components/project-form-dialog";
import { archiveProjectAction } from "./actions";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Projects — ClickNComply",
};

interface SearchParams {
  add?: string;
  edit?: string;
  error?: string;
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
  archived: "outline",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseClient();
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

  const [{ data: projects }, { data: clients }] = await Promise.all([
    admin
      .from("projects")
      .select("*")
      .eq("organisation_id", membership.organisation_id)
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    admin
      .from("clients")
      .select("*")
      .eq("organisation_id", membership.organisation_id)
      .eq("archived", false)
      .order("name", { ascending: true }),
  ]);

  const clientById = new Map((clients ?? []).map((c) => [c.id, c]));
  const error = params.error ? decodeURIComponent(params.error) : null;
  const editingProject =
    params.edit && projects ? projects.find((p) => p.id === params.edit) : null;

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        subtitle="Discrete jobs. Every RAMs / QA you generate can be tied to one — and auto-fills site address, dates, and client details."
        size="md"
        actions={
          <ProjectFormDialog
            open={params.add === "1"}
            mode="create"
            clients={clients ?? []}
          >
            <Button>
              <Plus className="size-4 mr-1" />
              New project
            </Button>
          </ProjectFormDialog>
        }
      />

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {editingProject && (
        <ProjectFormDialog
          mode="edit"
          project={editingProject}
          clients={clients ?? []}
          open
        />
      )}

      {(!projects || projects.length === 0) ? (
        <EmptyState hasClients={(clients?.length ?? 0) > 0} />
      ) : (
        <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-soft surface-pebble">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Name</th>
                <th className="text-left font-medium px-4 py-2.5 hidden sm:table-cell">
                  Code
                </th>
                <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">
                  Client
                </th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
                <th className="text-right font-medium px-4 py-2.5">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const client = p.client_id
                  ? clientById.get(p.client_id)
                  : null;
                return (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">
                      {p.name}
                      {p.site_address && (
                        <div className="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-1">
                          {p.site_address}
                          {p.site_postcode && ` · ${p.site_postcode}`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs">
                      {p.code || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {client?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={STATUS_VARIANT[p.status] ?? "outline"}
                        className="text-[10px] capitalize"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0"
                        >
                          <Link href={`/projects?edit=${p.id}`}>
                            <Pencil className="size-3.5" />
                            <span className="sr-only">Edit {p.name}</span>
                          </Link>
                        </Button>
                        <form action={archiveProjectAction.bind(null, p.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Archive {p.name}</span>
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasClients }: { hasClients: boolean }) {
  return (
    <div className="border border-dashed border-soft rounded-2xl px-8 py-14 text-center surface-raised shadow-sm-cool">
      <div className="inline-flex size-14 rounded-2xl items-center justify-center mb-5 status-success">
        <Plus className="size-6" strokeWidth={1.6} />
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">
        No projects yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        A project is a discrete job — site address, dates, optional client.
        Once set up, every RAMs you build auto-fills the site fields. No
        retyping addresses on doc 50.
      </p>
      {!hasClients && (
        <p className="text-xs text-muted-foreground mb-5">
          Tip: {" "}
          <Link
            href="/clients?add=1"
            className="text-foreground underline underline-offset-2 hover:opacity-70"
          >
            add a client first
          </Link>{" "}
          if you want to link this project to one.
        </p>
      )}
      <ProjectFormDialog mode="create" clients={[]}>
        <Button>
          <Plus className="size-4 mr-1.5" />
          Create your first project
        </Button>
      </ProjectFormDialog>
    </div>
  );
}
