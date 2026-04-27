import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_TOOLS, formatPricing, type ToolSlug } from "@/tools";
import { findIndustry } from "@/lib/industries";
import { activateToolAction } from "./actions";
import { ArrowRight, Sparkles, Clock } from "@/lib/icons";
import { trialState, trialDaysRemaining } from "@/lib/billing";

export const metadata = {
  title: "Dashboard — ClickNComply",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // User's first org membership
  const { data: membership } = await admin
    .from("organisation_members")
    .select("organisation_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/onboarding");
  }

  const { data: org } = await admin
    .from("organisations")
    .select("*")
    .eq("id", membership.organisation_id)
    .single();

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("tier, status, trial_ends_at")
    .eq("organisation_id", membership.organisation_id)
    .maybeSingle();

  const { data: activations } = await admin
    .from("framework_activations")
    .select("framework_slug")
    .eq("organisation_id", membership.organisation_id);

  const activatedSlugs = new Set(
    (activations ?? []).map((a) => a.framework_slug)
  );

  const activeTools = ALL_TOOLS.filter((t) => activatedSlugs.has(t.slug));
  const availableTools = ALL_TOOLS.filter((t) => !activatedSlugs.has(t.slug));

  const industry = org?.industry ? findIndustry(org.industry) : null;

  const tier = trialState(subscription);
  const daysLeft = trialDaysRemaining(subscription?.trial_ends_at ?? null);

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10">
      <TrialBanner tier={tier} daysLeft={daysLeft} />

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {org?.name || "Your workspace"}
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant={tier === "paid" ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wider"
            >
              {tier === "paid"
                ? "Pro"
                : tier === "active"
                ? "Trial"
                : "Free"}
            </Badge>
            {industry && <span>· {industry.label}</span>}
            {org?.employee_band && <span>· {org.employee_band}</span>}
          </div>
        </div>
      </div>

      {/* Active tools */}
      {activeTools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Your tools
          </h2>
          <div className="border rounded-lg overflow-hidden divide-y">
            {activeTools.map((tool) => (
              <ToolRow
                key={tool.slug}
                tool={tool}
                state="active"
              />
            ))}
          </div>
        </section>
      )}

      {/* Available tools */}
      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
          {activeTools.length === 0 ? "Pick your first tool" : "More tools"}
        </h2>
        <div className="border rounded-lg overflow-hidden divide-y">
          {availableTools.map((tool) => (
            <ToolRow
              key={tool.slug}
              tool={tool}
              state="inactive"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrialBanner({
  tier,
  daysLeft,
}: {
  tier: "active" | "expired" | "paid" | "none";
  daysLeft: number;
}) {
  if (tier === "paid" || tier === "none") return null;

  if (tier === "expired") {
    return (
      <div className="mb-6 border border-destructive/30 bg-destructive/5 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="size-4 text-destructive shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Your trial has ended.</span>
            <span className="text-muted-foreground ml-1">
              PDFs are now watermarked. Upgrade to remove the watermark and
              unlock projects, send-to-client and more.
            </span>
          </div>
        </div>
        <Button size="sm" asChild>
          <Link href="/account/billing">Upgrade · £2/mo</Link>
        </Button>
      </div>
    );
  }

  // active trial
  const dayWord = daysLeft === 1 ? "day" : "days";
  return (
    <div className="mb-6 border bg-brand/10 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="size-2 rounded-full bg-brand shrink-0" />
        <div className="text-sm">
          <span className="font-medium">
            {daysLeft} {dayWord} left in your trial.
          </span>
          <span className="text-muted-foreground ml-1">
            All Pro features unlocked. After that PDFs go watermarked unless
            you upgrade.
          </span>
        </div>
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href="/account/billing">Upgrade now</Link>
      </Button>
    </div>
  );
}

function ToolRow({
  tool,
  state,
}: {
  tool: (typeof ALL_TOOLS)[number];
  state: "active" | "inactive";
}) {
  const Icon = tool.icon;
  const isPlanned = tool.status === "planned";
  const isWaitlist = tool.status === "waitlist";
  const canActivate = !isPlanned && !isWaitlist;

  return (
    <div className="flex items-center gap-6 p-5">
      <div className="shrink-0 size-12 rounded-md bg-muted flex items-center justify-center">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold tracking-tight">{tool.name}</h3>
          {tool.status === "wip" && (
            <Badge variant="secondary" className="text-[10px]">
              building
            </Badge>
          )}
          {tool.status === "planned" && (
            <Badge variant="outline" className="text-[10px]">
              soon
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {tool.tagline}
        </p>
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <p className="text-sm font-medium">{formatPricing(tool)}</p>
      </div>
      {state === "active" ? (
        <Button asChild size="sm" variant="outline">
          <Link href={tool.appPath}>
            Open
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      ) : canActivate ? (
        <ActivateButton slug={tool.slug} />
      ) : (
        <Button size="sm" variant="ghost" asChild>
          <Link href={tool.landingPath}>Learn more</Link>
        </Button>
      )}
    </div>
  );
}

function ActivateButton({ slug }: { slug: ToolSlug }) {
  return (
    <form action={activateToolAction.bind(null, slug)}>
      <Button size="sm" type="submit">
        <Sparkles className="size-3.5 mr-1" />
        Activate
      </Button>
    </form>
  );
}
