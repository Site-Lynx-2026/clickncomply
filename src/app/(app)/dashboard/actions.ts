"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { TOOLS, type ToolSlug } from "@/tools";

/**
 * Activate a tool for the current user's organisation.
 * Free-tier behaviour: lets them activate one tool at a time.
 * Pro-tier (Suite): activates everything.
 *
 * Stored in the `framework_activations` table — the slug column holds either
 * a tool slug ("rams") or framework slug ("iso-9001"). The Compliance Suite
 * tool, when activated, also activates all underlying framework slugs.
 */
export async function activateToolAction(toolSlug: ToolSlug) {
  const tool = TOOLS[toolSlug];
  if (!tool) redirect("/dashboard?error=Unknown%20tool");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Find user's first org
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

  // Activate tool slug
  const { error: toolErr } = await admin
    .from("framework_activations")
    .upsert(
      {
        organisation_id: membership.organisation_id,
        framework_slug: tool.slug,
      },
      { onConflict: "organisation_id,framework_slug" }
    );

  if (toolErr) {
    redirect(`/dashboard?error=${encodeURIComponent(toolErr.message)}`);
  }

  // If tool is the Suite, also activate every underlying framework
  if (tool.frameworks.length > 0) {
    const rows = tool.frameworks.map((frameworkSlug) => ({
      organisation_id: membership.organisation_id,
      framework_slug: frameworkSlug,
    }));
    await admin
      .from("framework_activations")
      .upsert(rows, { onConflict: "organisation_id,framework_slug" });
  }

  revalidatePath("/dashboard");
  redirect(tool.appPath);
}
