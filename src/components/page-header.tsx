import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * PageHeader — the SL/WL signature header used across every page.
 *
 *  - Tiny uppercase eyebrow ("DASHBOARD" / "SAFETY" / "BILLING")
 *  - Chunky Barlow Condensed uppercase title ("WORKING LATE, AMY")
 *  - Subtle subtitle line in muted text
 *  - Optional icon tile on the left
 *  - Optional `actions` slot on the right (buttons, status pills)
 *
 * Used by every interior page. One source of truth for visual hierarchy.
 */
export interface PageHeaderProps {
  /** Tiny uppercase tag above the title (e.g. "DASHBOARD"). */
  eyebrow?: string;
  /** Main title — rendered in Barlow Condensed uppercase. */
  title: string;
  /** Optional subtitle line below the title. */
  subtitle?: React.ReactNode;
  /** Optional Lucide icon shown in a tinted tile to the left. */
  icon?: LucideIcon;
  /** Tone of the icon tile. */
  iconTone?: "neutral" | "brand" | "info" | "success" | "warning";
  /** Right-side actions (buttons, status badges). */
  actions?: React.ReactNode;
  /** Override default size — "lg" is the dashboard-sized hero, "md" tighter. */
  size?: "lg" | "md";
  className?: string;
}

const TILE_CLASS: Record<NonNullable<PageHeaderProps["iconTone"]>, string> = {
  neutral: "surface-pebble text-foreground border border-soft",
  brand: "bg-brand text-foreground",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  iconTone = "neutral",
  actions,
  size = "lg",
  className,
}: PageHeaderProps) {
  const titleSize =
    size === "lg"
      ? "text-[44px] md:text-[56px] leading-[0.95]"
      : "text-[32px] md:text-[40px] leading-[0.95]";

  return (
    <div className={cn("flex items-start justify-between gap-6 mb-8", className)}>
      <div className="flex items-start gap-4 min-w-0">
        {Icon && (
          <span
            className={cn(
              "size-12 rounded-xl flex items-center justify-center shrink-0",
              TILE_CLASS[iconTone]
            )}
          >
            <Icon className="size-5" strokeWidth={1.6} />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] font-bold mb-2">
              {eyebrow}
            </div>
          )}
          <h1
            className={cn(
              "font-display font-extrabold uppercase tracking-tight text-foreground",
              titleSize
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <div className="text-sm text-muted-foreground mt-3 flex items-center gap-2 flex-wrap">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
