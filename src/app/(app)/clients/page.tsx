import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "@/lib/icons";
import { ClientFormDialog } from "./_components/client-form-dialog";
import { archiveClientAction } from "./actions";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Clients — ClickNComply",
};

interface SearchParams {
  add?: string;
  edit?: string;
  error?: string;
}

export default async function ClientsPage({
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

  const { data: clients } = await admin
    .from("clients")
    .select("*")
    .eq("organisation_id", membership.organisation_id)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  // Project counts per client
  const { data: projects } = await admin
    .from("projects")
    .select("id, client_id, status")
    .eq("organisation_id", membership.organisation_id)
    .neq("status", "archived");
  const projectCountByClient = new Map<string, number>();
  (projects ?? []).forEach((p) => {
    if (!p.client_id) return;
    projectCountByClient.set(
      p.client_id,
      (projectCountByClient.get(p.client_id) ?? 0) + 1
    );
  });

  const editingClient =
    params.edit && clients
      ? clients.find((c) => c.id === params.edit)
      : null;

  const error = params.error ? decodeURIComponent(params.error) : null;

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        subtitle="Companies you deliver work for. Each can have multiple projects."
        size="md"
        actions={
          <ClientFormDialog open={params.add === "1"} mode="create">
            <Button>
              <Plus className="size-4 mr-1" />
              Add client
            </Button>
          </ClientFormDialog>
        }
      />

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {editingClient && (
        <ClientFormDialog mode="edit" client={editingClient} open />
      )}

      {(!clients || clients.length === 0) ? (
        <EmptyState />
      ) : (
        <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-soft surface-pebble">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Name</th>
                <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left font-medium px-4 py-2.5 hidden md:table-cell">
                  Email
                </th>
                <th className="text-right font-medium px-4 py-2.5">Projects</th>
                <th className="text-right font-medium px-4 py-2.5">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {c.contact_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {c.contact_email || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant="secondary" className="text-[10px]">
                      {projectCountByClient.get(c.id) ?? 0}
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
                        <Link href={`/clients?edit=${c.id}`}>
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Edit {c.name}</span>
                        </Link>
                      </Button>
                      <form action={archiveClientAction.bind(null, c.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="size-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Archive {c.name}</span>
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-soft rounded-2xl px-8 py-14 text-center surface-raised shadow-sm-cool">
      <div className="inline-flex size-14 rounded-2xl items-center justify-center mb-5 status-warning">
        <Plus className="size-6" strokeWidth={1.6} />
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">
        No clients yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        Add the companies you deliver work for. Then attach projects to each
        one — and every RAMs / QA you generate auto-fills with the right details.
      </p>
      <ClientFormDialog mode="create">
        <Button>
          <Plus className="size-4 mr-1.5" />
          Add your first client
        </Button>
      </ClientFormDialog>
    </div>
  );
}
