import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "../_helpers";
import type { Database } from "@/types/supabase";

/**
 * GET    /api/rams/[id] — fetch one
 * PUT    /api/rams/[id] — full update of a document (form_data + title + status)
 * DELETE /api/rams/[id] — soft archive (sets status = 'archived')
 *
 * Auth: org member only. RLS would also enforce this but we use the admin
 * client so we have to gate with organisation_id ourselves.
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rams_documents")
    .select("*")
    .eq("id", id)
    .eq("organisation_id", ctx.organisationId)
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

const UpdateSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  status: z.enum(["draft", "complete", "archived"]).optional(),
  form_data: z.record(z.string(), z.unknown()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const update: Database["public"]["Tables"]["rams_documents"]["Update"] = {
    updated_by: ctx.userId,
  };
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (parsed.data.form_data !== undefined)
    update.form_data = parsed.data.form_data as never;

  const { data, error } = await admin
    .from("rams_documents")
    .update(update)
    .eq("id", id)
    .eq("organisation_id", ctx.organisationId)
    .select("id, status, updated_at")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;

  const admin = createAdminClient();
  const { error } = await admin
    .from("rams_documents")
    .update({ status: "archived", updated_by: ctx.userId })
    .eq("id", id)
    .eq("organisation_id", ctx.organisationId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
