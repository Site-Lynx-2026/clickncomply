import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * EmptyState — no list page should ever show a bare "no items" line.
 *
 * Pattern stolen from Linear / Cal.com / Loops:
 *   - Mono-line illustration (Lucide icon in tinted tile)
 *   - Two-line body (title + helper sentence)
 *   - Primary CTA + optional secondary "Try a sample" or "Import" link
 *
 * The secondary action is what kills the "dead page" feeling — users can
 * always do *something* useful, even on first load.
 */
export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Optional onClick for non-link CTAs (e.g. "Load a sample"). */
  onPrimary?: () => void;
  onSecondary?: () => void;
  tone?: "neutral" | "brand" | "info" | "success";
  className?: string;
}

const TILE: Record<NonNullable<EmptyStateProps["tone"]>, string> = {
  neutral: "surface-pebble text-foreground border border-soft",
  brand: "bg-brand text-foreground",
  info: "status-info",
  success: "status-success",
};

export function EmptyState({
  icon: Icon,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  onPrimary,
  onSecondary,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  const PrimaryEl = primaryHref ? (
    <Link
      href={primaryHref}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
    >
      {primaryLabel}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onPrimary}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
    >
      {primaryLabel}
    </button>
  );

  const SecondaryEl = secondaryHref ? (
    <Link
      href={secondaryHref}
      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition"
    >
      {secondaryLabel}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onSecondary}
      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition"
    >
      {secondaryLabel}
    </button>
  );

  return (
    <div
      className={cn(
        "border border-dashed border-soft rounded-2xl px-8 py-14 text-center surface-raised shadow-sm-cool",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex size-14 rounded-2xl items-center justify-center mb-5",
          TILE[tone]
        )}
      >
        <Icon className="size-6" strokeWidth={1.6} />
      </div>
      <h3 className="font-display font-bold uppercase text-lg tracking-tight text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        {body}
      </p>
      {(primaryLabel || secondaryLabel) && (
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {primaryLabel && PrimaryEl}
          {secondaryLabel && SecondaryEl}
        </div>
      )}
    </div>
  );
}
