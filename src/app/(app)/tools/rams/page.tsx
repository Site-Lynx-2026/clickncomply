import Link from "next/link";
import {
  FileStack,
  ScrollText,
  ShieldAlert,
  FlaskConical,
  Activity,
  Volume2,
  ClipboardCheck,
  Megaphone,
  Wrench,
  Shirt,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "RAMs Builder — ClickNComply",
  description:
    "Risk assessments, method statements, COSHH, HAVs, noise, permits, toolbox talks, inspections and plans — all in one tool.",
};

interface Tile {
  href: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
}

const DOC_TILES: Tile[] = [
  {
    href: "/tools/rams/method-statement",
    name: "Method Statement",
    blurb: "Sequence of work, ready to send up the chain. Trade picker → 8 steps loaded.",
    icon: ScrollText,
  },
  {
    href: "/tools/rams/risk-assessment",
    name: "Risk Assessment",
    blurb: "Hazards + controls + 5×5 matrix. Includes WAH, manual handling, lone working and 6 more specialist types.",
    icon: ShieldAlert,
  },
  {
    href: "/tools/rams/coshh",
    name: "COSHH Assessment",
    blurb: "Substance-by-substance hazard control plan. 80+ pre-loaded substances.",
    icon: FlaskConical,
  },
  {
    href: "/tools/rams/havs",
    name: "HAVs Assessment",
    blurb: "Hand-arm vibration log. Auto-calculated EAV / ELV from 60+ pre-loaded tools.",
    icon: Activity,
  },
  {
    href: "/tools/rams/noise",
    name: "Noise Assessment",
    blurb: "Daily noise dose calculator. Lower / Upper EAV thresholds flagged.",
    icon: Volume2,
  },
];

const WORKFLOW_TILES: Tile[] = [
  {
    href: "/tools/rams/permits",
    name: "Permit",
    blurb: "Issue a permit — to work, hot works, dig, confined space, working at height.",
    icon: ClipboardCheck,
  },
  {
    href: "/tools/rams/briefings",
    name: "Briefing",
    blurb: "Toolbox talk, site induction, daily activity briefing, pre-task briefing.",
    icon: Megaphone,
  },
  {
    href: "/tools/rams/inspections",
    name: "Inspection",
    blurb: "PUWER pre-use, LOLER, plant pre-start, equipment register entry.",
    icon: Wrench,
  },
  {
    href: "/tools/rams/plans",
    name: "Plan",
    blurb: "PPE schedule, first aid assessment, welfare plan, emergency action plan.",
    icon: Shirt,
  },
];

export default function RAMsLandingPage() {
  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Safety"
        title="RAMs Builder"
        subtitle="Pick a builder, fill the gaps, download a branded PDF. Or type what you need on the dashboard and we'll route you."
      />

      {/* Hero — Full RAMs */}
      <FullRamsHero />

      {/* Documents */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Single documents
          </h2>
          <span className="text-xs text-muted-foreground">5 builders</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOC_TILES.map((t) => (
            <BuilderTile key={t.href} tile={t} />
          ))}
        </div>
      </section>

      {/* Workflow umbrellas */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Workflow
          </h2>
          <span className="text-xs text-muted-foreground">4 categories</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WORKFLOW_TILES.map((t) => (
            <BuilderTile key={t.href} tile={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FullRamsHero() {
  return (
    <Link
      href="/tools/rams/full"
      className="group relative block overflow-hidden rounded-xl surface-raised border border-soft shadow-md-cool hover:shadow-lg-cool hover:border-strong transition-all duration-200 mt-2"
    >
      <div
        className="absolute -top-24 -right-24 size-72 rounded-full opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--brand) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand" aria-hidden />

      <div className="relative p-7 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
        <div className="size-14 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-sm-cool">
          <FileStack className="size-7" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-tinted border border-soft mb-3">
            <Sparkles className="size-3 text-foreground" />
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">
              Most popular
            </span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-2 text-foreground">
            One-Click Full RAMs
          </h2>
          <p className="text-muted-foreground mb-5 max-w-xl text-sm leading-relaxed">
            The complete Risk Assessment & Method Statement document — every section in one signable PDF. AI fills the long-form text from your tool selections.
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium group-hover:translate-x-0.5 transition-transform">
            Start building
            <ArrowRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function BuilderTile({ tile }: { tile: Tile }) {
  const Icon = tile.icon;
  return (
    <Link
      href={tile.href}
      className="group relative block border border-soft rounded-lg p-4 surface-raised shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg surface-pebble border border-soft flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold tracking-tight truncate mb-1">
            {tile.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tile.blurb}
          </p>
        </div>
      </div>
    </Link>
  );
}
