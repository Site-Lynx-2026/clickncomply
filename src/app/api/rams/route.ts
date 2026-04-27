import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveContext } from "./_helpers";

/**
 * GET  /api/rams                         — list documents for the org
 * GET  /api/rams?builder=method-statement — filter by builder slug
 * GET  /api/rams?status=draft            — filter by status
 * POST /api/rams                         — create a new document (returns id)
 */

export async function GET(req: NextRequest) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const builder = params.get("builder");
  const status = params.get("status");

  const admin = createAdminClient();
  let q = admin
    .from("rams_documents")
    .select(
      "id, builder_slug, title, status, updated_at, created_at, generated_at, is_watermarked, pdf_storage_path"
    )
    .eq("organisation_id", ctx.organisationId)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (builder) q = q.eq("builder_slug", builder);
  if (status === "draft" || status === "complete" || status === "archived") {
    q = q.eq("status", status);
  } else {
    q = q.neq("status", "archived");
  }

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

const CreateSchema = z.object({
  builder_slug: z.string().min(1).max(64),
  title: z.string().max(200).optional(),
  form_data: z.record(z.string(), z.unknown()).optional(),
  project_id: z.string().uuid().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const ctx = await resolveContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rams_documents")
    .insert({
      organisation_id: ctx.organisationId,
      builder_slug: parsed.data.builder_slug,
      title: parsed.data.title ?? null,
      form_data: (parsed.data.form_data ?? {}) as never,
      status: "draft",
      project_id: parsed.data.project_id ?? null,
      created_by: ctx.userId,
      updated_by: ctx.userId,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id }, { status: 201 });
}
