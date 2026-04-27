"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";

async function getCtx() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: m } = await admin
    .from("organisation_members")
    .select("organisation_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!m) return null;
  return { userId: user.id, orgId: m.organisation_id, role: m.role };
}

/** PROFILE — full_name only (email change is a separate, riskier flow) */
export async function updateProfileAction(formData: FormData) {
  const ctx = await getCtx();
  if (!ctx) redirect("/login");
  const fullName = String(formData.get("full_name") || "").trim();
  if (!fullName) {
    redirect("/account?error=Please%20enter%20your%20name");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", ctx.userId);

  if (error) {
    redirect(`/account?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/account");
  redirect("/account?ok=profile");
}

/** ORG — name + industry (admins only) */
const OrgSchema = z.object({
  name: z.string().min(1).max(120),
  industry: z.string().max(120).optional().nullable(),
  employee_band: z.string().max(20).optional().nullable(),
});

export async function updateOrgAction(formData: FormData) {
  const ctx = await getCtx();
  if (!ctx) redirect("/login");
  if (ctx.role !== "owner" && ctx.role !== "admin") {
    redirect("/account?error=Only%20owners%20can%20edit%20organisation%20details");
  }

  const parsed = OrgSchema.safeParse({
    name: formData.get("name") || "",
    industry: formData.get("industry") || null,
    employee_band: formData.get("employee_band") || null,
  });
  if (!parsed.success) {
    redirect(`/account?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid org details")}`);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("organisations")
    .update({
      name: parsed.data.name,
      industry: parsed.data.industry || null,
      employee_band: parsed.data.employee_band || null,
    })
    .eq("id", ctx.orgId);

  if (error) {
    redirect(`/account?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/account");
  revalidatePath("/dashboard");
  redirect("/account?ok=org");
}

/** PASSWORD CHANGE — uses authenticated session (Supabase verifies) */
export async function changePasswordAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    redirect("/account?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/account?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/account?ok=password");
}

/**
 * DELETE ACCOUNT — GDPR right-to-erasure (Article 17).
 *
 * V1 approach:
 *   1. Anonymise the profile row (name → "Deleted user", avatar nulled)
 *   2. Delete the auth.user (Supabase admin SDK). Cascades remove the
 *      profiles row + organisation_members rows.
 *   3. Org rows + their docs remain (they belong to the org, not the user).
 *      `created_by` FKs with NO ACTION remain dangling pointers — to be
 *      addressed by a future migration that adds ON DELETE SET NULL.
 *   4. Sign out + redirect to landing.
 *
 * If the user is the sole member of an org with paid subscription, this
 * leaves the org orphaned. V2 will handle "delete me & destroy the org" /
 * "transfer ownership" flows. For now we scrub PII, the org becomes a
 * ghost the user can no longer see — sufficient for V1 GDPR baseline.
 */
export async function deleteAccountAction() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // 1. Scrub PII on the profile row before deletion (defence in depth — even
  //    if cascade fails for some reason, no name/email is left around).
  await admin
    .from("profiles")
    .update({
      full_name: "Deleted user",
      avatar_url: null,
    })
    .eq("id", user.id);

  // 2. Delete auth user (cascades to profiles + organisation_members)
  const { error: authErr } = await admin.auth.admin.deleteUser(user.id);
  if (authErr) {
    // Hard fall-back: at least kill the active session so they can't keep
    // using the app, even if auth.admin.deleteUser fails (FK constraint etc).
    await supabase.auth.signOut();
    redirect(
      `/?error=${encodeURIComponent(
        "Account scrubbed but couldn't fully delete — email hello@clickncomply.co.uk to confirm removal."
      )}`
    );
  }

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
