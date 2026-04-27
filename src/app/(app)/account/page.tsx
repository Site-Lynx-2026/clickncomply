import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRY_GROUPS } from "@/lib/industries";
import { trialState, trialDaysRemaining } from "@/lib/billing";
import { DeleteAccountDialog } from "./_components/delete-account-dialog";
import {
  updateProfileAction,
  updateOrgAction,
  changePasswordAction,
} from "./actions";

export const metadata = {
  title: "Account — ClickNComply",
};

interface SearchParams {
  ok?: string;
  error?: string;
}

const OK_MESSAGES: Record<string, string> = {
  profile: "Profile updated.",
  org: "Organisation updated.",
  password: "Password updated.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [{ data: profile }, { data: membership }] = await Promise.all([
    admin.from("profiles").select("*").eq("id", user.id).single(),
    admin
      .from("organisation_members")
      .select("organisation_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle(),
  ]);

  if (!membership) redirect("/onboarding");

  const [{ data: org }, { data: subscription }] = await Promise.all([
    admin
      .from("organisations")
      .select("*")
      .eq("id", membership.organisation_id)
      .single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at, current_period_end")
      .eq("organisation_id", membership.organisation_id)
      .maybeSingle(),
  ]);

  const params = await searchParams;
  const okMessage = params.ok ? OK_MESSAGES[params.ok] : null;
  const error = params.error ? decodeURIComponent(params.error) : null;
  const isAdmin = membership.role === "owner" || membership.role === "admin";
  const billingTier = trialState(subscription);
  const daysLeft = trialDaysRemaining(subscription?.trial_ends_at ?? null);

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Account</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your profile, organisation, password, and account.
      </p>

      {okMessage && (
        <div className="mb-6 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm">
          {okMessage}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* PROFILE */}
      <section className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-1">Profile</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Your name and email. Email change comes later — contact us if you
          need it changed today.
        </p>
        <form action={updateProfileAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={profile?.email ?? user.email ?? ""}
              disabled
              className="bg-muted/40"
            />
          </div>
          <Button type="submit" size="sm">
            Save profile
          </Button>
        </form>
      </section>

      {/* ORGANISATION */}
      <section className="border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold">Organisation</h2>
          {!isAdmin && (
            <Badge variant="outline" className="text-[10px]">
              read-only
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {isAdmin
            ? "These are used across every PDF you generate."
            : "Only owners can edit. Ask the owner to make changes."}
        </p>
        <form action={updateOrgAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="org_name">Company name</Label>
            <Input
              id="org_name"
              name="name"
              defaultValue={org?.name ?? ""}
              required
              autoComplete="organization"
              disabled={!isAdmin}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Select
              name="industry"
              defaultValue={org?.industry ?? undefined}
              disabled={!isAdmin}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Pick the closest match" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {INDUSTRY_GROUPS.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.industries.map((industry) => (
                      <SelectItem key={industry.slug} value={industry.slug}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="employee_band">Team size</Label>
            <Select
              name="employee_band"
              defaultValue={org?.employee_band ?? undefined}
              disabled={!isAdmin}
            >
              <SelectTrigger id="employee_band">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Just me</SelectItem>
                <SelectItem value="2-10">2 – 10</SelectItem>
                <SelectItem value="11-50">11 – 50</SelectItem>
                <SelectItem value="51-250">51 – 250</SelectItem>
                <SelectItem value="250+">250+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isAdmin && (
            <Button type="submit" size="sm">
              Save organisation
            </Button>
          )}
        </form>
      </section>

      {/* BILLING */}
      <section className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-1">Billing</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Plan, trial state and next steps. Stripe wiring lands soon —
          for now this is read-only.
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-muted-foreground">Plan</span>
            <Badge
              variant={billingTier === "paid" ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wider"
            >
              {billingTier === "paid"
                ? "Pro"
                : billingTier === "active"
                ? "Trial"
                : billingTier === "expired"
                ? "Free (trial expired)"
                : "Free"}
            </Badge>
          </div>
          {billingTier === "active" && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Trial ends in</span>
              <span className="font-medium">
                {daysLeft} day{daysLeft === 1 ? "" : "s"}
              </span>
            </div>
          )}
          {billingTier === "paid" && subscription?.current_period_end && (
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Renews</span>
              <span className="font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            </div>
          )}
          <div className="pt-1">
            {billingTier === "paid" ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/account/billing">Manage subscription</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/account/billing">Upgrade to Pro · £2/month</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* PASSWORD */}
      <section className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-1">Change password</h2>
        <p className="text-xs text-muted-foreground mb-4">
          At least 8 characters. We never email this back.
        </p>
        <form action={changePasswordAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Update password
          </Button>
        </form>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="border border-destructive/30 bg-destructive/5 rounded-lg p-6">
        <h2 className="font-semibold mb-1">Delete account</h2>
        <p className="text-xs text-muted-foreground mb-4 max-w-md">
          Permanently delete your account and scrub your personal data
          (UK GDPR Article 17). This can&apos;t be undone.
        </p>
        <DeleteAccountDialog email={user.email ?? ""} />
      </section>
    </div>
  );
}
