"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";

async function getOrgId(): Promise<{ orgId: string; userId: string } | null> {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: m } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!m) return null;
  return { orgId: m.organisation_id, userId: user.id };
}

const ProjectSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().max(40).optional().nullable(),
  client_id: z.string().uuid().optional().nullable(),
  site_address: z.string().max(500).optional().nullable(),
  site_postcode: z.string().max(20).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z
    .enum(["active", "paused", "completed", "archived"])
    .default("active"),
  notes: z.string().max(2000).optional().nullable(),
});

function nullEmpty(v: FormDataEntryValue | null): string | null {
  if (!v) return null;
  const s = String(v).trim();
  // "_none" is a UI sentinel for "no value picked" — Radix Select doesn't allow
  // an empty-string SelectItem so we use this and treat it as null server-side.
  if (s.length === 0 || s === "_none") return null;
  return s;
}

export async function createProjectAction(formData: FormData) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const parsed = ProjectSchema.safeParse({
    name: formData.get("name") || "",
    code: nullEmpty(formData.get("code")),
    client_id: nullEmpty(formData.get("client_id")),
    site_address: nullEmpty(formData.get("site_address")),
    site_postcode: nullEmpty(formData.get("site_postcode")),
    start_date: nullEmpty(formData.get("start_date")),
    end_date: nullEmpty(formData.get("end_date")),
    status: (formData.get("status") as string) || "active",
    notes: nullEmpty(formData.get("notes")),
  });

  if (!parsed.success) {
    redirect(
      `/projects?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid project details"
      )}`
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from("projects").insert({
    organisation_id: ctx.orgId,
    name: data.name,
    code: data.code ?? null,
    client_id: data.client_id ?? null,
    site_address: data.site_address ?? null,
    site_postcode: data.site_postcode ?? null,
    start_date: data.start_date ?? null,
    end_date: data.end_date ?? null,
    status: data.status,
    notes: data.notes ?? null,
    created_by: ctx.userId,
  });

  if (error) {
    redirect(`/projects?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  redirect("/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const parsed = ProjectSchema.safeParse({
    name: formData.get("name") || "",
    code: nullEmpty(formData.get("code")),
    client_id: nullEmpty(formData.get("client_id")),
    site_address: nullEmpty(formData.get("site_address")),
    site_postcode: nullEmpty(formData.get("site_postcode")),
    start_date: nullEmpty(formData.get("start_date")),
    end_date: nullEmpty(formData.get("end_date")),
    status: (formData.get("status") as string) || "active",
    notes: nullEmpty(formData.get("notes")),
  });

  if (!parsed.success) {
    redirect(
      `/projects?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid project details"
      )}`
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({
      name: data.name,
      code: data.code ?? null,
      client_id: data.client_id ?? null,
      site_address: data.site_address ?? null,
      site_postcode: data.site_postcode ?? null,
      start_date: data.start_date ?? null,
      end_date: data.end_date ?? null,
      status: data.status,
      notes: data.notes ?? null,
    })
    .eq("id", id)
    .eq("organisation_id", ctx.orgId);

  if (error) {
    redirect(`/projects?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/projects");
  revalidatePath("/clients");
  redirect("/projects");
}

export async function archiveProjectAction(id: string) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const admin = createAdminClient();
  await admin
    .from("projects")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("organisation_id", ctx.orgId);

  revalidatePath("/projects");
  redirect("/projects");
}
