"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * AI action button — visual cue that the action calls AI.
 *
 * Lime gradient background (brand colour) with subtle hover lift.
 * Used everywhere a Claude / Haiku call is triggered: AI tighten,
 * AI write, AI fill, AI suggest controls.
 *
 * Distinct from primary (which is near-black) and outline.
 */
type Size = "default" | "sm" | "lg";

interface AIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  loading?: boolean;
  hideIcon?: boolean;
}

const sizeClasses: Record<Size, string> = {
  default: "h-9 px-3.5 text-sm gap-2",
  sm: "h-8 px-2.5 text-xs gap-1.5",
  lg: "h-10 px-5 text-sm gap-2",
};

export const AIButton = forwardRef<HTMLButtonElement, AIButtonProps>(
  function AIButton(
    {
      className,
      size = "default",
      loading,
      hideIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // base shape
          "relative inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap transition-all select-none shrink-0",
          // hover + active
          "hover:shadow-[0_0_0_3px_rgb(212_255_0/0.25)] active:translate-y-px",
          // disabled
          "disabled:opacity-60 disabled:pointer-events-none",
          // bg — lime brand with a subtle gradient + dark border for contrast
          "bg-[linear-gradient(135deg,oklch(0.95_0.27_119)_0%,oklch(0.92_0.25_115)_100%)]",
          "text-foreground border border-foreground/15",
          // size
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {!hideIcon && (
          <Sparkles
            className={cn(
              size === "sm" ? "size-3.5" : "size-4",
              loading && "animate-pulse"
            )}
            strokeWidth={2}
          />
        )}
        <span>{loading ? "Thinking…" : children}</span>
      </button>
    );
  }
);
