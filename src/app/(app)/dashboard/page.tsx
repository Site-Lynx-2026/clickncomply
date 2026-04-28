import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { findIndustry } from "@/lib/industries";
import { getBuilder } from "@/lib/rams/builders";
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
import { PageHeader } from "@/components/page-header";
import { ShareLinkCard } from "./_components/share-link-card";
import { IntakeBox } from "./_components/intake-box";

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
    { data: recentDrafts },
    { data: recentCompleted },
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
    // Drafts pinned to the top — these are unfinished docs the user
    // started but didn't complete. The dashboard should nudge them back.
    admin
      .from("rams_documents")
      .select("id, title, builder_slug, project_id, updated_at, status")
      .eq("organisation_id", orgId)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(5),
    // Recently completed — the satisfying pile of finished work.
    admin
      .from("rams_documents")
      .select("id, title, builder_slug, project_id, updated_at, status, generated_at")
      .eq("organisation_id", orgId)
      .eq("status", "complete")
      .order("generated_at", { ascending: false, nullsFirst: false })
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

      <PageHeader
        eyebrow="Dashboard"
        title={`${greeting}, ${firstName}`}
        subtitle={
          <>
            <span>Here&apos;s what&apos;s happening at</span>
            <span className="font-semibold text-foreground">
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
          </>
        }
      />

      <IntakeBox />

      {org?.slug && (
        <ShareLinkCard
          slug={org.slug}
          hasCompletedDocs={(recentCompleted ?? []).length > 0}
        />
      )}

      {/* What needs your attention — drafts pinned + recent completed.
          Surfaced ABOVE the stats grid because for daily use this is what
          the user came here for, not the dashboard summary. */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <section className="lg:col-span-2 space-y-6">
          {recentDrafts && recentDrafts.length > 0 && (
            <DraftsBlock
              drafts={recentDrafts}
              projectById={projectById}
            />
          )}
          <CompletedBlock
            docs={recentCompleted ?? []}
            projectById={projectById}
            hasAnyDrafts={(recentDrafts?.length ?? 0) > 0}
          />
        </section>
        <section className="lg:col-span-1">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Quick actions
          </h2>
          <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden divide-y divide-[var(--border-soft)]">
            <QuickAction
              href="/tools/rams/full"
              title="New full RAMs"
              subtitle="One doc, every section"
              icon={<Sparkles className="size-4" />}
              tone="brand"
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

      {/* Stats grid — demoted from top to ambient context. */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<FileText className="size-4" />}
          label="Docs this week"
          value={docsThisWeek ?? 0}
          href="/tools/rams/documents"
          tone="info"
        />
        <StatCard
          icon={<Folder className="size-4" />}
          label="Active projects"
          value={activeProjectCount ?? 0}
          href="/projects"
          tone="success"
        />
        <StatCard
          icon={<Users className="size-4" />}
          label="Clients"
          value={clientCount ?? 0}
          href="/clients"
          tone="warning"
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
          tone="brand"
        />
      </section>

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

type StatTone = "info" | "success" | "warning" | "brand" | "neutral";

function StatCard({
  icon,
  label,
  value,
  href,
  tone = "neutral",
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
  tone?: StatTone;
  /** legacy boolean — promotes to brand tone */
  accent?: boolean;
}) {
  const effective: StatTone = accent ? "brand" : tone;

  // Stripe colour (left edge, 4px) — semantic per tone.
  const stripeBg: Record<StatTone, string> = {
    info: "bg-[var(--status-info)]",
    success: "bg-[var(--status-success)]",
    warning: "bg-[var(--status-warning)]",
    brand: "bg-brand",
    neutral: "bg-foreground/15",
  };
  // Icon tile — tinted background pill matching the stripe.
  const tileClass: Record<StatTone, string> = {
    info: "status-info",
    success: "status-success",
    warning: "status-warning",
    brand: "bg-brand text-foreground",
    neutral: "surface-pebble text-muted-foreground",
  };
  // Halo gradient — the SL signature: subtle radial wash from the stripe
  // edge fading to white. `radial-gradient` uses CSS variable colour.
  const haloVar: Record<StatTone, string> = {
    info: "var(--status-info-bg)",
    success: "var(--status-success-bg)",
    warning: "var(--status-warning-bg)",
    brand: "oklch(0.95 0.27 119 / 0.30)",
    neutral: "var(--surface-pebble)",
  };

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5 transition-all duration-150 pl-6 pr-5 py-5 min-h-[148px]"
    >
      {/* Left stripe — semantic tone, 4px wide, full height */}
      <span
        className={cn(
          "absolute top-0 bottom-0 left-0 w-[4px]",
          stripeBg[effective]
        )}
        aria-hidden
      />
      {/* Soft radial halo — fades from the stripe corner outward */}
      <span
        className="absolute -top-12 -left-12 size-48 rounded-full pointer-events-none opacity-80"
        style={{
          background: `radial-gradient(circle, ${haloVar[effective]} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
        aria-hidden
      />
      {/* Header row — label left, icon tile right */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-bold pt-1">
          {label}
        </div>
        <span
          className={cn(
            "size-9 rounded-lg flex items-center justify-center shrink-0",
            tileClass[effective]
          )}
        >
          {icon}
        </span>
      </div>
      {/* Big chunky number — Barlow Condensed + mono digit treatment.
          The mono variant gives the "this is data" feel of Vercel/Resend. */}
      <div className="relative font-display font-bold text-foreground text-[56px] leading-none tabular-nums mb-1">
        {value}
      </div>
      {/* Hover hint */}
      <div className="relative flex items-center gap-1 text-[11px] text-muted-foreground/70 group-hover:text-foreground transition-colors mt-1">
        <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
        <span>View</span>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
  icon,
  tone = "neutral",
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone?: "neutral" | "brand";
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3.5 hover:bg-brand-soft transition-colors group"
    >
      <div
        className={cn(
          "size-9 rounded-md flex items-center justify-center shrink-0 transition-colors border",
          tone === "brand"
            ? "bg-brand text-foreground border-brand"
            : "surface-pebble text-muted-foreground border-soft group-hover:text-foreground group-hover:border-strong"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>
      <ArrowRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition" />
    </Link>
  );
}

function RecentEmptyState({ hasAnyDrafts }: { hasAnyDrafts: boolean }) {
  // If they have drafts but no completed docs, the empty state shouldn't
  // shout "no documents" — it should nudge them to finish what they have.
  if (hasAnyDrafts) {
    return (
      <div className="surface-raised border border-dashed border-soft rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nothing finished yet. Wrap a draft above and it&apos;ll appear here.
        </p>
      </div>
    );
  }
  return (
    <div className="surface-raised border border-soft rounded-xl shadow-sm-cool p-10 text-center">
      <div className="size-10 mx-auto mb-3 rounded-lg surface-pebble border border-soft flex items-center justify-center">
        <FileText className="size-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold mb-1">No documents yet.</p>
      <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto">
        Type what you need above, or pick a builder from the right.
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

interface DashboardDoc {
  id: string;
  title: string | null;
  builder_slug: string;
  project_id: string | null;
  updated_at: string;
  status: string;
  generated_at?: string | null;
}

interface DashboardProject {
  id: string;
  name: string;
  code: string | null;
}

/** "Continue drafting" — pinned at the top of the dashboard. The strongest
 *  nudge surface in the app: docs the user started but didn't finish. */
function DraftsBlock({
  drafts,
  projectById,
}: {
  drafts: DashboardDoc[];
  projectById: Map<string, DashboardProject>;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand inline-block" />
          Continue drafting
          <span className="text-foreground/40 font-sans normal-case tracking-normal text-xs">
            · {drafts.length}
          </span>
        </h2>
        <Link
          href="/tools/rams/documents?status=draft"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden divide-y divide-[var(--border-soft)]">
        {drafts.map((doc) => {
          const builder = getBuilder(doc.builder_slug);
          const project = doc.project_id
            ? projectById.get(doc.project_id)
            : null;
          const Icon = builder?.icon ?? FileText;
          return (
            <Link
              key={doc.id}
              href={`/tools/rams/${doc.builder_slug}?doc=${doc.id}`}
              className="flex items-center gap-3 p-4 hover:bg-brand-soft transition-colors group"
            >
              <div className="shrink-0 size-9 rounded-md bg-brand/15 border border-brand-soft flex items-center justify-center">
                <Icon className="size-4 text-foreground" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate mb-0.5">
                  {doc.title || builder?.shortName || "Untitled draft"}
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
                  <span>updated {relativeTime(doc.updated_at)}</span>
                </div>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
                Continue
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** "Recently completed" — the satisfying pile. Renders the empty state
 *  differently when the user has drafts (no point shouting "no docs"). */
function CompletedBlock({
  docs,
  projectById,
  hasAnyDrafts,
}: {
  docs: DashboardDoc[];
  projectById: Map<string, DashboardProject>;
  hasAnyDrafts: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Recently completed
        </h2>
        {docs.length > 0 && (
          <Link
            href="/tools/rams/documents"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
      {docs.length === 0 ? (
        <RecentEmptyState hasAnyDrafts={hasAnyDrafts} />
      ) : (
        <div className="surface-raised border border-soft rounded-xl shadow-sm-cool overflow-hidden divide-y divide-[var(--border-soft)]">
          {docs.map((doc) => {
            const builder = getBuilder(doc.builder_slug);
            const project = doc.project_id
              ? projectById.get(doc.project_id)
              : null;
            const Icon = builder?.icon ?? FileText;
            const completedAt = doc.generated_at ?? doc.updated_at;
            return (
              <Link
                key={doc.id}
                href={`/tools/rams/${doc.builder_slug}?doc=${doc.id}`}
                className="flex items-center gap-3 p-4 hover:bg-brand-soft transition-colors group"
              >
                <div className="shrink-0 size-9 rounded-md surface-pebble border border-soft flex items-center justify-center group-hover:border-brand-soft transition-colors">
                  <Icon className="size-4" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate mb-0.5">
                    {doc.title || builder?.shortName || "Untitled"}
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
                    <span>{relativeTime(completedAt)}</span>
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
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
