import { createClient, createAdminClient } from "@/lib/supabase/server";

export interface RamsContext {
  userId: string;
  organisationId: string;
  email: string;
}

/**
 * Resolve the authenticated user + their organisation in one helper.
 * Returns null if either is missing — route handlers turn that into 401.
 */
export async function resolveContext(): Promise<RamsContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) return null;

  return {
    userId: user.id,
    organisationId: membership.organisation_id,
    email: user.email ?? "",
  };
}
