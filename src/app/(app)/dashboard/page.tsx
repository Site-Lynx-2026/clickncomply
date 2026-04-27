import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_TOOLS, formatPricing, type ToolSlug } from "@/tools";
import { findIndustry } from "@/lib/industries";
import { getBuilder } from "@/lib/rams/builders";
import { activateToolAction } from "./actions";
import {
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  Folder,
  Users,
  Plus,
} from "@/lib/icons";
import { trialState, trialDaysRemaining } from "@/lib/billing";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard — ClickNComply",
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [{ data: profile }, { data: membership }] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", user.id).single(),
    admin
      .from("organisation_members")
      .select("organisation_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle(),
  ]);

  if (!membership) redirect("/onboarding");

  const orgId = membership.organisation_id;

  // Parallelise every dashboard query.
  // Date.now() is fine in a server component — fresh per-request, not a render impurity.
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = new Date(Date.now() - ONE_WEEK_MS).toISOString();
  const [
    { data: org },
    { data: subscription },
    { data: activations },
    { data: recentDocs },
    { count: docsThisWeek },
    { count: activeProjectCount },
    { count: clientCount },
    { data: projects },
  ] = await Promise.all([
    admin.from("organisations").select("*").eq("id", orgId).single(),
    admin
      .from("subscriptions")
      .select("tier, status, trial_ends_at")
      .eq("organisation_id", orgId)
      .maybeSingle(),
    admin
      .from("framework_activations")
      .select("framework_slug")
      .eq("organisation_id", orgId),
    admin
      .from("rams_documents")
      .select("id, title, builder_slug, project_id, updated_at, status")
      .eq("organisation_id", orgId)
      .neq("status", "archived")
      .order("updated_at", { ascending: false })
      .limit(5),
    admin
      .from("rams_documents")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", orgId)
      .neq("status", "archived")
      .gte("created_at", sevenDaysAgo),
    admin
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", orgId)
      .eq("status", "active"),
    admin
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("organisation_id", orgId)
      .eq("archived", false),
    admin
      .from("projects")
      .select("id, name, code")
      .eq("organisation_id", orgId)
      .neq("status", "archived"),
  ]);

  const activatedSlugs = new Set(
    (activations ?? []).map((a) => a.framework_slug)
  );
  const activeTools = ALL_TOOLS.filter((t) => activatedSlugs.has(t.slug));
  const availableTools = ALL_TOOLS.filter((t) => !activatedSlugs.has(t.slug));
  const industry = org?.industry ? findIndustry(org.industry) : null;
  const tier = trialState(subscription);
  const daysLeft = trialDaysRemaining(subscription?.trial_ends_at ?? null);

  const projectById = new Map((projects ?? []).map((p) => [p.id, p]));
  const greeting = greetingForHour(new Date().getHours());
  const firstName =
    profile?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      <TrialBanner tier={tier} daysLeft={daysLeft} />

      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-1">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <span>Here&apos;s what&apos;s happening at</span>
          <span className="font-medium text-foreground">
            {org?.name || "your workspace"}
          </span>
          <span>·</span>
          <Badge
            variant={tier === "paid" ? "default" : "secondary"}
            className="text-[10px] uppercase tracking-wider"
          >
            {tier === "paid"
              ? "Pro"
              : tier === "active"
              ? "Trial"
              : tier === "expired"
              ? "Free"
              : "Free"}
          </Badge>
          {industry && <span className="hidden sm:inline">· {industry.label}</span>}
        </p>
      </div>

      {/* Stats grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard
          icon={<FileText className="size-4" />}
          label="Docs this week"
          value={docsThisWeek ?? 0}
          href="/tools/rams/documents"
          accent={(docsThisWeek ?? 0) > 0}
        />
        <StatCard
          icon={<Folder className="size-4" />}
          label="Active projects"
          value={activeProjectCount ?? 0}
          href="/projects"
        />
        <StatCard
          icon={<Users className="size-4" />}
          label="Clients"
          value={clientCount ?? 0}
          href="/clients"
        />
        <StatCard
          icon={<Clock className="size-4" />}
          label={
            tier === "active"
              ? "Days in trial"
              : tier === "paid"
              ? "Plan"
              : "Status"
          }
          value={
            tier === "active"
              ? daysLeft
              : tier === "paid"
              ? "Pro"
              : tier === "expired"
              ? "Free"
              : "—"
          }
          href="/account/billing"
          accent={tier === "active"}
        />
      </section>

      {/* Two-column: recent activity + active tools */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* Recent activity (2/3 width on large screens) */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Recent activity
            </h2>
            {(recentDocs?.length ?? 0) > 0 && (
              <Link
                href="/tools/rams/documents"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          {!recentDocs || recentDocs.length === 0 ? (
            <RecentEmptyState />
          ) : (
            <div className="border rounded-lg overflow-hidden divide-y">
              {recentDocs.map((doc) => {
                const builder = getBuilder(doc.builder_slug);
                const project = doc.project_id
                  ? projectById.get(doc.project_id)
                  : null;
                const Icon = builder?.icon ?? FileText;
                return (
                  <Link
                    key={doc.id}
                    href={`/tools/rams/${doc.builder_slug}?doc=${doc.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-muted/30 transition group"
                  >
                    <div className="shrink-0 size-9 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="size-4" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm truncate">
                          {doc.title || builder?.shortName || "Untitled"}
                        </span>
                        {doc.status === "draft" && (
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase shrink-0"
                          >
                            draft
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                        <span>{builder?.shortName || doc.builder_slug}</span>
                        {project && (
                          <>
                            <span>·</span>
                            <span className="truncate">{project.name}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{relativeTime(doc.updated_at)}</span>
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick actions (1/3 width) */}
        <section className="lg:col-span-1">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Quick actions
          </h2>
          <div className="border rounded-lg overflow-hidden divide-y">
            <QuickAction
              href="/tools/rams/full"
              title="New full RAMs"
              subtitle="One doc, every section"
              icon={<Sparkles className="size-4" />}
            />
            <QuickAction
              href="/tools/rams/method-statement"
              title="Method statement"
              subtitle="Trade picker → AI fill"
              icon={<FileText className="size-4" />}
            />
            <QuickAction
              href="/projects?add=1"
              title="Add a project"
              subtitle="Auto-fill site fields"
              icon={<Folder className="size-4" />}
            />
            <QuickAction
              href="/clients?add=1"
              title="Add a client"
              subtitle="Group projects + docs"
              icon={<Users className="size-4" />}
            />
          </div>
        </section>
      </div>

      {/* Active tools */}
      {activeTools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Your tools
          </h2>
          <div className="border rounded-lg overflow-hidden divide-y">
            {activeTools.map((tool) => (
              <ToolRow key={tool.slug} tool={tool} state="active" />
            ))}
          </div>
        </section>
      )}

      {/* Available tools */}
      {availableTools.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            {activeTools.length === 0 ? "Pick your first tool" : "More tools"}
          </h2>
          <div className="border rounded-lg overflow-hidden divide-y">
            {availableTools.map((tool) => (
              <ToolRow key={tool.slug} tool={tool} state="inactive" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── components ─────────────────────────────────────────────────────────

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
              PDFs are now watermarked. Add the tools you actually need.
            </span>
          </div>
        </div>
        <Button size="sm" asChild>
          <Link href="/account/billing">See pricing</Link>
        </Button>
      </div>
    );
  }

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
            Every tool unlocked. After that you pay only for what you use.
          </span>
        </div>
      </div>
      <Button size="sm" variant="outline" asChild>
        <Link href="/account/billing">See pricing</Link>
      </Button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border rounded-lg p-4 hover:bg-muted/30 transition group flex flex-col gap-2",
        accent && "border-brand/40"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-muted-foreground",
            accent && "text-brand-foreground bg-brand rounded p-1"
          )}
        >
          {icon}
        </span>
        <ArrowRight className="size-3 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition" />
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
          {label}
        </div>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3.5 hover:bg-muted/30 transition group"
    >
      <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground transition">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>
      <ArrowRight className="size-3 text-muted-foreground/50 group-hover:translate-x-0.5 transition" />
    </Link>
  );
}

function RecentEmptyState() {
  return (
    <div className="border rounded-lg p-8 text-center bg-muted/10">
      <FileText className="size-5 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm font-medium mb-1">No documents yet.</p>
      <p className="text-xs text-muted-foreground mb-4">
        Pick a builder from the right and your first doc shows up here.
      </p>
      <Button asChild size="sm">
        <Link href="/tools/rams/full">
          <Plus className="size-3.5 mr-1" />
          Build a RAMs
        </Link>
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

// ─── helpers ────────────────────────────────────────────────────────────

function greetingForHour(hour: number): string {
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Working late";
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (diff < min) return "just now";
  if (diff < hr) return `${Math.floor(diff / min)}m ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
