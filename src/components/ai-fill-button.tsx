"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * AIFillButton — the sparkle that lives next to every empty field.
 *
 * Pattern (Coda AI Column / Notion AI inline):
 *   - Sparkle icon, monochrome by default, brand-coloured on hover
 *   - On click, posts to /api/ai/fill with `kind` + `context`
 *   - Shows a soft pulse on the field while loading (caller wires the
 *     pulse via `loading` callback if they want it)
 *   - On success, calls `onFill(text)` so the caller can patch state
 *   - Errors land as a toast, the button returns to idle
 *
 * No modal, no side panel. The field IS the canvas.
 */
export interface AIFillButtonProps {
  /** Prompt template kind matching /api/ai/fill route. */
  kind: string;
  /** Free-form context object the prompt template reads from. */
  context: Record<string, unknown>;
  /** Called with the AI text on success. Caller patches their state. */
  onFill: (text: string) => void;
  /** Optional callback so caller can show their own loading state. */
  onLoadingChange?: (loading: boolean) => void;
  /** Hint text shown on the tooltip / button. Defaults to "AI fill". */
  hint?: string;
  /** Visual variant. */
  variant?: "icon" | "button";
  /** Disable button (e.g. when required upstream context is missing). */
  disabled?: boolean;
  /** Custom className for outermost button. */
  className?: string;
}

export function AIFillButton({
  kind,
  context,
  onFill,
  onLoadingChange,
  hint = "AI fill",
  variant = "icon",
  disabled,
  className,
}: AIFillButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading || disabled) return;
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const res = await fetch("/api/ai/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, context }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          upgrade?: boolean;
        };
        if (body.upgrade) {
          toast.error(body.error ?? "Upgrade for unlimited AI", {
            action: {
              label: "Upgrade",
              onClick: () => {
                window.location.href = "/account/billing";
              },
            },
          });
        } else {
          toast.error(body.error ?? "AI fill failed");
        }
        return;
      }
      const { text } = (await res.json()) as { text: string };
      if (text?.trim()) {
        onFill(text.trim());
      }
    } catch {
      toast.error("AI fill failed — try again in a sec");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider",
          "border border-soft surface-raised text-foreground hover:border-strong",
          "transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          loading && "ai-pulse",
          className
        )}
        title={hint}
      >
        <Sparkles
          className={cn(
            "size-3.5 transition-transform",
            loading && "animate-pulse text-brand"
          )}
          strokeWidth={loading ? 2 : 1.6}
        />
        <span>{loading ? "Drafting…" : hint}</span>
      </button>
    );
  }

  // Icon variant — lives at the corner of an empty field
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      className={cn(
        "inline-flex items-center justify-center size-7 rounded-md",
        "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        loading && "text-brand",
        className
      )}
      title={hint}
      aria-label={hint}
    >
      <Sparkles
        className={cn("size-4 transition-transform", loading && "animate-pulse")}
        strokeWidth={loading ? 2 : 1.6}
      />
    </button>
  );
}
