import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ALL_TOOLS, formatPricing } from "@/tools";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Shield,
  PoundSterling,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 surface-canvas">
      {/* ─── Top nav strip ─── */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-foreground/70 transition"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            ClickNComply
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#tools" className="hover:text-foreground transition">
              Tools
            </Link>
            <Link href="#pricing" className="hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="#why" className="hover:text-foreground transition">
              Why us
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Brand glow halo */}
        <span
          className="absolute -top-32 -right-32 size-[480px] rounded-full pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden
        />
        <div className="container relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 mb-7 px-3 py-1 rounded-full surface-tinted border border-soft text-[11px] uppercase tracking-widest font-bold text-foreground">
            <Sparkles className="size-3" />
            From £2/month · No card needed
          </span>
          <h1 className="font-display font-extrabold uppercase text-foreground tracking-tight leading-[0.92] text-[64px] md:text-[96px] lg:text-[112px] mb-7">
            Compliance
            <br />
            <span className="text-foreground/55">that doesn&apos;t</span>
            <br />
            pester you.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Pick the tool. Fill the gaps. Download the PDF. No phone calls,
            no upsells, no weekly nudges. The compliance consultant lives in
            your laptop now &mdash; and bills you what a coffee costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="text-base h-12 px-7">
              <Link href="/signup">
                Start free
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-7">
              <Link href="#tools">See every tool</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-5 font-mono uppercase tracking-wider">
            5-day free trial · every tool unlocked · cancel anytime
          </p>
        </div>
      </section>

      {/* ─── Why us — feature row ─── */}
      <section
        id="why"
        className="container mx-auto max-w-6xl px-6 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Zap}
            tone="info"
            title="Document in five minutes"
            body="300+ pre-built risk lines, 80+ COSHH substances, 60+ HAVs tools, 100+ toolbox topics. Pick a trade and a full RAMs lands in seconds."
          />
          <FeatureCard
            icon={PoundSterling}
            tone="brand"
            title="£2 a month, per tool"
            body="No bundle traps. Use only RAMs? Pay only for RAMs. Want HR + Lift Plans too? Add them, drop them. Fair pricing for solo trades."
          />
          <FeatureCard
            icon={Shield}
            tone="success"
            title="No-pester promise"
            body="No phone calls. No upsell emails. No 'success manager'. Self-serve from start to finish — you only hear from us when something breaks."
          />
        </div>
      </section>

      {/* ─── Tools grid ─── */}
      <section
        id="tools"
        className="container mx-auto max-w-6xl px-6 pb-16"
      >
        <div className="text-center mb-10">
          <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-bold mb-2">
            Compliance Suite
          </div>
          <h2 className="font-display font-extrabold uppercase text-foreground text-[40px] md:text-[56px] leading-[0.95] tracking-tight mb-3">
            Every tool, one login
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Each tool stands alone. Pay only for what you use. Add more as you
            grow, drop them when you don&apos;t.
          </p>
        </div>

        <div className="border border-soft rounded-xl surface-raised shadow-sm-cool overflow-hidden divide-y divide-soft">
          {ALL_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.landingPath}
                className="flex items-center gap-5 px-6 py-5 hover:bg-muted/40 transition group"
              >
                <div className="shrink-0 size-12 rounded-xl surface-pebble border border-soft flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold uppercase text-lg tracking-tight">
                      {tool.name}
                    </h3>
                    {tool.status === "wip" && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded status-info font-bold">
                        building
                      </span>
                    )}
                    {tool.status === "planned" && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded surface-pebble text-muted-foreground font-bold">
                        soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {tool.tagline}
                  </p>
                </div>
                <div className="shrink-0 text-right hidden sm:block">
                  <p className="text-sm font-bold tabular-nums">
                    {formatPricing(tool)}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Pricing strip ─── */}
      <section
        id="pricing"
        className="container mx-auto max-w-5xl px-6 py-16"
      >
        <div className="border border-soft rounded-2xl surface-raised shadow-md-cool relative overflow-hidden">
          <span
            className="absolute -top-24 -left-24 size-72 rounded-full pointer-events-none opacity-70"
            style={{
              background:
                "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            aria-hidden
          />
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand" aria-hidden />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-10">
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-bold mb-2">
                Pricing
              </div>
              <h2 className="font-display font-extrabold uppercase text-foreground text-[36px] md:text-[44px] leading-[0.95] mb-4">
                One coffee a month
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Most contractors walk away from compliance consultants paying
                £200/month for documents they could write themselves. We charge
                what they spend on coffee in a week.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-[64px] leading-none tabular-nums text-foreground">
                  £2
                </span>
                <span className="text-sm text-muted-foreground">
                  / tool / month
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "5-day free trial — every tool unlocked",
                "No card required to start",
                "Pay-on-spot per tool, never bundled",
                "Cancel any tool any time",
                "All PDFs branded with your logo",
                "No upsells, no calls, no emails",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <Check className="size-4 text-status-success mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{line}</span>
                </div>
              ))}
              <div className="pt-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/signup">
                    Start your free trial
                    <ArrowRight className="size-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-soft mt-8 surface-raised">
        <div className="container mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <Link
            href="/"
            className="font-mono uppercase tracking-widest text-foreground inline-flex items-center gap-1.5"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            ClickNComply
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition">
            Terms
          </Link>
          <a href="mailto:info@clickncomply.co.uk" className="hover:text-foreground transition">
            info@clickncomply.co.uk
          </a>
          <span className="ml-auto">© {new Date().getFullYear()} Site Lynx Group Ltd</span>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  tone,
  title,
  body,
}: {
  icon: typeof Zap;
  tone: "info" | "success" | "warning" | "brand";
  title: string;
  body: string;
}) {
  const stripe: Record<typeof tone, string> = {
    info: "bg-[var(--status-info)]",
    success: "bg-[var(--status-success)]",
    warning: "bg-[var(--status-warning)]",
    brand: "bg-brand",
  };
  const tile: Record<typeof tone, string> = {
    info: "status-info",
    success: "status-success",
    warning: "status-warning",
    brand: "bg-brand text-foreground",
  };
  const halo: Record<typeof tone, string> = {
    info: "var(--status-info-bg)",
    success: "var(--status-success-bg)",
    warning: "var(--status-warning-bg)",
    brand: "oklch(0.95 0.27 119 / 0.30)",
  };
  return (
    <div className="relative overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool p-6">
      <span className={`absolute top-0 bottom-0 left-0 w-[4px] ${stripe[tone]}`} aria-hidden />
      <span
        className="absolute -top-12 -left-12 size-44 rounded-full pointer-events-none opacity-80"
        style={{
          background: `radial-gradient(circle, ${halo[tone]} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
        aria-hidden
      />
      <div className="relative">
        <span
          className={`size-10 rounded-xl flex items-center justify-center shrink-0 mb-4 ${tile[tone]}`}
        >
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
        <h3 className="font-display font-bold uppercase text-lg tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
