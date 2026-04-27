import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  buildersBySection,
  SECTIONS,
  type Builder,
  type BuilderSection,
} from "@/lib/rams/builders";
import { Sparkles, ArrowRight } from "lucide-react";

const SECTION_ORDER: BuilderSection[] = [
  "documents",
  "specialist",
  "permits",
  "briefings",
  "plant",
  "ppe",
  "library",
];

export const metadata = {
  title: "RAMs Builder — ClickNComply",
  description:
    "Build risk assessments, method statements, COSHH, HAVs, noise, permits, toolbox talks and more. 300+ pre-built RAs, 80+ COSHH substances, 60+ HAVs tools.",
};

export default function RAMsLandingPage() {
  const grouped = buildersBySection();
  const fullRams = grouped.build[0];

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      {/* Hero — Barlow Condensed uppercase, SL signature */}
      <div className="mb-10">
        <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-bold mb-2">
          Safety
        </div>
        <h1 className="font-display font-extrabold uppercase text-[44px] md:text-[56px] leading-[0.95] tracking-tight text-foreground mb-3">
          RAMs Builder
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Risk assessments, method statements, COSHH, HAVs, noise, permits,
          toolbox talks. Pick a builder, fill the gaps, download a branded PDF.
        </p>
      </div>

      {/* One-Click Full RAMs hero tile */}
      {fullRams && <FullRamsHero builder={fullRams} />}

      {/* Sections */}
      {SECTION_ORDER.map((sectionKey) => {
        const builders = grouped[sectionKey];
        if (!builders || builders.length === 0) return null;
        const section = SECTIONS[sectionKey];
        return (
          <section key={sectionKey} className="mt-12">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {section.label}
              </h2>
              <span className="text-xs text-muted-foreground">
                {builders.length} {builders.length === 1 ? "tool" : "tools"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {builders.map((b) => (
                <BuilderTile key={b.slug} builder={b} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function FullRamsHero({ builder }: { builder: Builder }) {
  const Icon = builder.icon;
  return (
    <Link
      href={`/tools/rams/${builder.slug}`}
      className="group relative block overflow-hidden rounded-xl surface-raised border border-soft shadow-md-cool hover:shadow-lg-cool hover:border-strong transition-all duration-200"
    >
      {/* Subtle brand gradient halo — top-right */}
      <div
        className="absolute -top-24 -right-24 size-72 rounded-full opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--brand) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      {/* Brand accent stripe — left */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand" aria-hidden />

      <div className="relative p-7 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
        <div className="size-14 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-sm-cool">
          <Icon className="size-7" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-tinted border border-soft mb-3">
            <Sparkles className="size-3 text-foreground" />
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">
              Most popular
            </span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-2 text-foreground">
            {builder.name}
          </h2>
          <p className="text-muted-foreground mb-5 max-w-xl text-sm leading-relaxed">
            {builder.description}
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

function BuilderTile({ builder }: { builder: Builder }) {
  const Icon = builder.icon;
  const planned = builder.status === "planned";
  return (
    <Link
      href={`/tools/rams/${builder.slug}`}
      className="group relative block border border-soft rounded-lg p-4 surface-raised shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg surface-pebble border border-soft flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold tracking-tight truncate">
              {builder.name}
            </h3>
            {builder.status === "wip" && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded status-info font-semibold shrink-0">
                building
              </span>
            )}
            {planned && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded surface-pebble text-muted-foreground font-semibold shrink-0">
                soon
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {builder.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
