"use server";

import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { newTrialEndsAt } from "@/lib/billing";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function onboardingAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const orgName = String(formData.get("org_name") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const employeeBand = String(formData.get("employee_band") || "").trim();

  if (!orgName) {
    redirect("/onboarding?error=Please%20enter%20a%20company%20name");
  }
  if (!industry) {
    redirect("/onboarding?error=Please%20pick%20what%20you%20do");
  }

  const admin = createAdminClient();
  const baseSlug = slugify(orgName);
  let finalSlug = baseSlug;
  let suffix = 0;

  // Find a unique slug
  while (true) {
    const { data: existing } = await admin
      .from("organisations")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();
    if (!existing) break;
    suffix += 1;
    finalSlug = `${baseSlug}-${suffix}`;
  }

  // Create org
  const { data: org, error: orgErr } = await admin
    .from("organisations")
    .insert({
      name: orgName,
      slug: finalSlug,
      industry,
      employee_band: employeeBand,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (orgErr || !org) {
    redirect(
      `/onboarding?error=${encodeURIComponent(orgErr?.message || "Could not create organisation")}`
    );
    return; // unreachable but helps TS narrow
  }

  // Add user as owner
  const { error: memberErr } = await admin.from("organisation_members").insert({
    organisation_id: org.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberErr) {
    redirect(`/onboarding?error=${encodeURIComponent(memberErr.message)}`);
  }

  // Create subscription with 5-day Pro trial active.
  // After trial expires, hasProAccess() flips to false and PDF route
  // returns watermarked output. A future cron will flip the status field
  // from 'trialing' → 'canceled' for tidier reporting; for now the
  // trial_ends_at timestamp is the source of truth.
  await admin.from("subscriptions").insert({
    organisation_id: org.id,
    tier: "pro",
    status: "trialing",
    trial_ends_at: newTrialEndsAt(),
  });

  // Mark profile onboarded
  await admin
    .from("profiles")
    .update({ onboarded_at: new Date().toISOString() })
    .eq("id", user.id);

  redirect("/dashboard");
}
