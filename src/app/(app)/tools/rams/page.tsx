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
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          RAMs Builder
        </h1>
        <p className="text-muted-foreground max-w-2xl">
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
      className="group block relative overflow-hidden rounded-lg border bg-foreground text-background hover:border-foreground transition"
    >
      <div className="absolute top-0 right-0 h-1 w-full bg-brand" />
      <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6">
        <div className="size-14 rounded-md bg-background/10 flex items-center justify-center shrink-0">
          <Icon className="size-7 text-background" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-3.5 text-brand" />
            <span className="text-[10px] uppercase tracking-[0.12em] text-brand font-semibold">
              Most popular
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            {builder.name}
          </h2>
          <p className="text-background/70 mb-4 max-w-xl">
            {builder.description}
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
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
      className="group block border rounded-lg p-4 hover:border-foreground hover:shadow-sm transition bg-card"
    >
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
          <Icon className="size-4" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold tracking-tight truncate">
              {builder.name}
            </h3>
            {builder.status === "wip" && (
              <Badge variant="secondary" className="text-[9px] uppercase">
                building
              </Badge>
            )}
            {planned && (
              <Badge variant="outline" className="text-[9px] uppercase">
                soon
              </Badge>
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
