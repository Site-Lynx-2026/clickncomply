import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export interface UmbrellaItem {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

interface UmbrellaPickerProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: UmbrellaItem[];
}

/**
 * Shared umbrella picker — renders a tile grid of variants under a single
 * concept (e.g. "Permit" → 5 specific permit types). Each tile links to
 * the underlying builder slug. This is the consolidation surface for the
 * 4 builders that share one component but have multiple typed variants.
 */
export function UmbrellaPicker({
  eyebrow,
  title,
  subtitle,
  items,
}: UmbrellaPickerProps) {
  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.slug}
              href={`/tools/rams/${item.slug}`}
              className="group relative block border border-soft rounded-xl p-5 surface-raised shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-lg surface-pebble border border-soft flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-colors">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <h3 className="text-base font-semibold tracking-tight truncate">
                      {item.name}
                    </h3>
                    <ArrowRight className="size-3.5 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
