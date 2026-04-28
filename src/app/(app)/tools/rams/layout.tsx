import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { RAMsSidebar, RAMsSidebarMobileTrigger } from "./_components/sidebar";
import { ProjectsProvider } from "./_components/projects-context";
import type { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export const metadata = {
  title: "RAMs Builder — ClickNComply",
};

async function fetchProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const admin = createAdminClient();
  const { data: m } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!m) return [];

  const { data } = await admin
    .from("projects")
    .select("*")
    .eq("organisation_id", m.organisation_id)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function RAMsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const projects = await fetchProjects();

  return (
    <ProjectsProvider initialProjects={projects}>
      <div className="flex flex-1 min-h-screen">
        <RAMsSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <RAMsSidebarMobileTrigger />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ProjectsProvider>
  );
}
