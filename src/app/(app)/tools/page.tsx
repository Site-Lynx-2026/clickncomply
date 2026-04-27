import Link from "next/link";
import {
  ScrollText,
  ShieldCheck,
  ClipboardCheck,
  Megaphone,
  HardHat,
  FlaskConical,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Tools — ClickNComply",
  description:
    "Every compliance module ClickNComply ships with. RAMs, QA, audits, permits, briefings, plant inspections — pay only for what you use.",
};

/**
 * /tools — the universal module catalog. Top-level entry point off the main
 * nav. Surfaces every product line in CNC, even ones that aren't shipped
 * yet, so prospects browsing a trial see the roadmap up-front.
 */

interface Module {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  status: "live" | "soon";
  href: string;
  tone: "info" | "success" | "warning" | "brand";
  priceFrom?: string;
}

const MODULES: Module[] = [
  {
    slug: "rams",
    name: "RAMs Builder",
    tagline: "Risk Assessments + Method Statements + permits",
    description:
      "300+ pre-written risk lines, 80+ COSHH substances, 60+ HAVs tools. Method statements per trade. Permits to work. Toolbox talks. Branded PDF in under five minutes.",
    icon: ScrollText,
    status: "live",
    href: "/tools/rams",
    tone: "brand",
    priceFrom: "£2 / mo",
  },
  {
    slug: "qa",
    name: "QA Audits",
    tagline: "Quality inspections, signed off on the phone",
    description:
      "Pre-built inspection templates for steel, brickwork, MEP, finishes. Photo evidence per item, defect register, branded handover report.",
    icon: ShieldCheck,
    status: "soon",
    href: "/tools",
    tone: "success",
    priceFrom: "£4 / mo",
  },
  {
    slug: "permits",
    name: "Permits Module",
    tagline: "Hot works, confined space, dig, height",
    description:
      "Issue permits from the phone. Auto-expire. QR-code sign-on. Site team scans, signs, you get a log.",
    icon: ClipboardCheck,
    status: "soon",
    href: "/tools",
    tone: "warning",
    priceFrom: "£2 / mo",
  },
  {
    slug: "briefings",
    name: "Toolbox Talks",
    tagline: "5-minute briefings with sign-off sheets",
    description:
      "100+ pre-built topics. Daily activity briefings. Pre-task briefings. Site induction. AI writes a punchy briefing on any topic in 10 seconds.",
    icon: Megaphone,
    status: "soon",
    href: "/tools",
    tone: "info",
    priceFrom: "£2 / mo",
  },
  {
    slug: "plant",
    name: "Plant Inspections",
    tagline: "PUWER, LOLER, pre-start checks",
    description:
      "Daily plant pre-start checks. PUWER inspections. LOLER 6-monthly. Lifting accessory register. Defect log.",
    icon: HardHat,
    status: "soon",
    href: "/tools",
    tone: "warning",
    priceFrom: "£2 / mo",
  },
  {
    slug: "coshh",
    name: "COSHH Library",
    tagline: "80+ substance assessments, ready to brand",
    description:
      "Cement, silica, isocyanates, epoxies, solvents, all pre-loaded. SDS reference, exposure routes, control hierarchy, emergency procedures. One click to PDF.",
    icon: FlaskConical,
    status: "live",
    href: "/tools/rams/coshh",
    tone: "info",
    priceFrom: "Included",
  },
];

export default function ToolsCatalogPage() {
  const live = MODULES.filter((m) => m.status === "live");
  const soon = MODULES.filter((m) => m.status === "soon");

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      {/* Hero — Barlow Condensed uppercase, SL signature */}
      <div className="mb-12">
        <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-bold mb-2">
          Compliance Suite
        </div>
        <h1 className="font-display font-extrabold uppercase text-[44px] md:text-[56px] leading-[0.95] tracking-tight text-foreground mb-3">
          Every Tool, One Login
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          One simple login. Every compliance document your business hands an
          auditor. Pay only for the modules you actually use — never the whole
          suite.
        </p>
      </div>

      {/* Live modules */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-foreground">
            Available now
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {live.length} {live.length === 1 ? "module" : "modules"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {live.map((m) => (
            <ModuleCard key={m.slug} module={m} />
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-foreground">
            Building next
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {soon.length} {soon.length === 1 ? "module" : "modules"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {soon.map((m) => (
            <ComingSoonCard key={m.slug} module={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ModuleCard({ module: m }: { module: Module }) {
  const Icon = m.icon;
  const stripeBg: Record<Module["tone"], string> = {
    info: "bg-[var(--status-info)]",
    success: "bg-[var(--status-success)]",
    warning: "bg-[var(--status-warning)]",
    brand: "bg-brand",
  };
  const tileClass: Record<Module["tone"], string> = {
    info: "status-info",
    success: "status-success",
    warning: "status-warning",
    brand: "bg-brand text-foreground",
  };
  const haloVar: Record<Module["tone"], string> = {
    info: "var(--status-info-bg)",
    success: "var(--status-success-bg)",
    warning: "var(--status-warning-bg)",
    brand: "oklch(0.95 0.27 119 / 0.30)",
  };

  return (
    <Link
      href={m.href}
      className="group relative block overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5 transition-all duration-150 pl-7 pr-6 py-6"
    >
      <span
        className={`absolute top-0 bottom-0 left-0 w-[4px] ${stripeBg[m.tone]}`}
        aria-hidden
      />
      <span
        className="absolute -top-16 -left-16 size-56 rounded-full pointer-events-none opacity-80"
        style={{
          background: `radial-gradient(circle, ${haloVar[m.tone]} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        <span
          className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${tileClass[m.tone]}`}
        >
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold uppercase text-xl tracking-tight text-foreground">
              {m.name}
            </h3>
            {m.priceFrom && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded surface-pebble text-muted-foreground font-bold">
                {m.priceFrom}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground/90 mb-2">
            {m.tagline}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {m.description}
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
            Open module
            <ArrowRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ComingSoonCard({ module: m }: { module: Module }) {
  const Icon = m.icon;
  return (
    <div className="relative block overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool p-5 opacity-90">
      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full surface-pebble text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
        <Sparkles className="size-3" />
        Soon
      </span>
      <div className="flex items-start gap-3 mb-3">
        <span className="size-10 rounded-lg surface-pebble border border-soft flex items-center justify-center shrink-0 text-muted-foreground">
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </span>
        <div className="flex-1 min-w-0 pr-12">
          <h3 className="font-display font-bold uppercase text-base tracking-tight text-foreground mb-0.5">
            {m.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {m.tagline}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {m.description}
      </p>
      {m.priceFrom && (
        <div className="mt-3 pt-3 border-t border-soft text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
          From {m.priceFrom}
        </div>
      )}
    </div>
  );
}
