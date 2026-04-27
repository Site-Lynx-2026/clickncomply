import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../rams/_helpers";

/**
 * GET /api/projects
 *
 * List active projects for the current org. Used by the project picker in
 * RAMs builders, future tools, and Documents pages.
 *
 * Filters: archived projects excluded.
 * Auth: org member only (resolveContext).
 */
export async function GET() {
  const ctx = await resolveContext();
  if (!ctx)
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select(
      "id, name, code, client_id, site_address, site_postcode, start_date, end_date, status"
    )
    .eq("organisation_id", ctx.organisationId)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
