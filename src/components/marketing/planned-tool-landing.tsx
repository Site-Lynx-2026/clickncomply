import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "@/lib/icons";
import { TOOLS, formatPricing, type ToolSlug } from "@/tools";

/**
 * Shared landing page for tools that haven't shipped yet (status = planned/wip
 * but no in-app implementation). Used by /qa, /hr, /lift-plans, /suite —
 * these were 404s flagged in the audit.
 *
 * The page deliberately doesn't have its own email-capture endpoint — the
 * sign-up flow IS the capture. Lower friction + reuses existing auth.
 */
export function PlannedToolLanding({ slug }: { slug: ToolSlug }) {
  const tool = TOOLS[slug];
  if (!tool) return null;

  const Icon = tool.icon;

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="container mx-auto max-w-3xl px-6 pt-24 pb-12">
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-6 font-mono text-[10px] uppercase tracking-widest"
          >
            Coming next
          </Badge>
          <div className="size-16 rounded-md bg-muted flex items-center justify-center mx-auto mb-6">
            <Icon className="size-7" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 leading-[1.1]">
            {tool.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            {tool.tagline}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium">
            {formatPricing(tool)}
          </div>
        </div>
      </section>

      {/* Description + sign up */}
      <section className="container mx-auto max-w-2xl px-6 pb-16">
        <div className="border rounded-lg p-8 text-center bg-muted/20">
          <h2 className="font-semibold mb-2">
            We&apos;re building this next.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            {tool.description}
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Sign up free now — you&apos;ll be first to know the day this lands,
            and you can use{" "}
            <Link href="/rams" className="underline underline-offset-2 hover:text-foreground">
              RAMs Builder
            </Link>{" "}
            (already live) in the meantime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild>
              <Link href="/signup">
                Start free <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">See all tools</Link>
            </Button>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 mt-6">
            We don&apos;t pester you. One email when it ships, that&apos;s it.
          </p>
        </div>
      </section>
    </main>
  );
}
