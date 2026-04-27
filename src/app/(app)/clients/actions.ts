"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Server actions for the Clients spine.
 *
 * Naming note: avoiding a `createClient` collision with the Supabase
 * server client by suffixing all client/project actions with `Action`.
 */

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

const ClientSchema = z.object({
  name: z.string().min(1).max(120),
  contact_name: z.string().max(120).optional().nullable(),
  contact_email: z.string().email().max(254).optional().or(z.literal("")).nullable(),
  contact_phone: z.string().max(40).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function createClientAction(formData: FormData) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const parsed = ClientSchema.safeParse({
    name: formData.get("name") || "",
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    contact_phone: formData.get("contact_phone") || null,
    address: formData.get("address") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    redirect(
      `/clients?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid client details"
      )}`
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from("clients").insert({
    organisation_id: ctx.orgId,
    name: data.name,
    contact_name: data.contact_name || null,
    contact_email: data.contact_email || null,
    contact_phone: data.contact_phone || null,
    address: data.address || null,
    notes: data.notes || null,
    created_by: ctx.userId,
  });

  if (error) {
    redirect(`/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clients");
  revalidatePath("/projects");
  redirect("/clients");
}

export async function updateClientAction(id: string, formData: FormData) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const parsed = ClientSchema.safeParse({
    name: formData.get("name") || "",
    contact_name: formData.get("contact_name") || null,
    contact_email: formData.get("contact_email") || null,
    contact_phone: formData.get("contact_phone") || null,
    address: formData.get("address") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    redirect(
      `/clients?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid client details"
      )}`
    );
  }

  const data = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin
    .from("clients")
    .update({
      name: data.name,
      contact_name: data.contact_name || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      address: data.address || null,
      notes: data.notes || null,
    })
    .eq("id", id)
    .eq("organisation_id", ctx.orgId);

  if (error) {
    redirect(`/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clients");
  revalidatePath("/projects");
  redirect("/clients");
}

export async function archiveClientAction(id: string) {
  const ctx = await getOrgId();
  if (!ctx) redirect("/login");

  const admin = createAdminClient();
  await admin
    .from("clients")
    .update({ archived: true })
    .eq("id", id)
    .eq("organisation_id", ctx.orgId);

  revalidatePath("/clients");
  redirect("/clients");
}
