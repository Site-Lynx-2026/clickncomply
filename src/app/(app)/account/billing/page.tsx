import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trialState, trialDaysRemaining } from "@/lib/billing";
import { ArrowLeft, Sparkles } from "@/lib/icons";
import { UpgradeButton, ManageSubscriptionButton } from "./_components/billing-buttons";

export const metadata = {
  title: "Billing — ClickNComply",
};

interface SearchParams {
  upgraded?: string;
  cancelled?: string;
  error?: string;
}

export default async function BillingPage({
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
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect("/onboarding");

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("*")
    .eq("organisation_id", membership.organisation_id)
    .maybeSingle();

  const params = await searchParams;
  const tier = trialState(subscription);
  const daysLeft = trialDaysRemaining(subscription?.trial_ends_at ?? null);
  const isPaid = tier === "paid";
  const banner = params.upgraded
    ? "Welcome to Pro. Watermarks gone, all features unlocked."
    : params.cancelled
    ? "No worries — you weren't charged."
    : params.error
    ? decodeURIComponent(params.error)
    : null;

  return (
    <div className="container mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Account
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight mb-1">Billing</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Your plan, and how to change it.
      </p>

      {banner && (
        <div
          className={
            params.error
              ? "mb-6 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              : "mb-6 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 text-sm"
          }
        >
          {banner}
        </div>
      )}

      {/* Current plan card */}
      <section className="border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Current plan</h2>
          <Badge
            variant={isPaid ? "default" : "secondary"}
            className="text-[10px] uppercase tracking-wider"
          >
            {isPaid
              ? "Pro"
              : tier === "active"
              ? "Trial"
              : tier === "expired"
              ? "Free (trial expired)"
              : "Free"}
          </Badge>
        </div>

        <div className="space-y-3 text-sm">
          {tier === "active" && (
            <Row label="Trial ends in" value={`${daysLeft} day${daysLeft === 1 ? "" : "s"}`} />
          )}
          {isPaid && subscription?.current_period_end && (
            <Row
              label={subscription.cancel_at_period_end ? "Ends" : "Renews"}
              value={formatDate(subscription.current_period_end)}
            />
          )}
          {isPaid && subscription?.cancel_at_period_end && (
            <p className="text-xs text-muted-foreground">
              Subscription cancelled. Pro access continues until the end of the
              current period, then you drop to free.
            </p>
          )}
        </div>
      </section>

      {/* Upgrade or manage */}
      {isPaid ? (
        <section className="border rounded-lg p-6">
          <h2 className="font-semibold mb-1">Manage subscription</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Update your payment method, download invoices, change plan, or
            cancel — all in one place via Stripe&apos;s billing portal.
          </p>
          <ManageSubscriptionButton />
        </section>
      ) : (
        <section className="border rounded-lg p-6">
          <h2 className="font-semibold mb-1">Upgrade to Pro</h2>
          <p className="text-xs text-muted-foreground mb-6">
            £2 / month per user. Removes watermarks, unlocks projects, clients,
            send-to-client, save-as-template. Cancel any time, one click.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <PlanCard
              title="Monthly"
              price="£2"
              cadence="per user, per month"
              priceKey="monthly"
            />
            <PlanCard
              title="Annual"
              price="£20"
              cadence="per user, per year"
              note="2 months free vs monthly"
              priceKey="annual"
              accent
            />
          </div>

          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 mt-6 text-center">
            Secured by Stripe. We don&apos;t see your card details.
          </p>
        </section>
      )}
    </div>
  );
}

function PlanCard({
  title,
  price,
  cadence,
  note,
  priceKey,
  accent,
}: {
  title: string;
  price: string;
  cadence: string;
  note?: string;
  priceKey: "monthly" | "annual";
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "border-2 border-brand rounded-lg p-5 bg-brand/5"
          : "border rounded-lg p-5"
      }
    >
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-semibold">{title}</h3>
        {accent && (
          <Badge variant="outline" className="text-[10px]">
            <Sparkles className="size-3 mr-1" />
            Best value
          </Badge>
        )}
      </div>
      <p className="text-3xl font-semibold tracking-tight mb-1">{price}</p>
      <p className="text-xs text-muted-foreground mb-2">{cadence}</p>
      {note && (
        <p className="text-xs text-muted-foreground italic mb-3">{note}</p>
      )}
      <UpgradeButton priceKey={priceKey} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
