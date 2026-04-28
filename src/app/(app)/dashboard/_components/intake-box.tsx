"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * One-shot intake — the highest-magic surface in the app.
 *
 * The user types a single sentence (e.g. "first fix electrical at plot 12
 * lyme wood tomorrow") and the dashboard routes them straight into the
 * right builder with title/scope/trade already populated. No nav, no
 * picking, no typing twice.
 *
 * This is the moment a non-engaged solo trader thinks "wait, this
 * actually understood me". Latency target ~700-1500ms via Haiku 4.5.
 */
export function IntakeBox() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Couldn't read that — try rephrasing.");
        return;
      }
      const { result } = await res.json();
      const params = new URLSearchParams();
      if (result.title) params.set("ai_title", result.title);
      if (result.scope) params.set("ai_scope", result.scope);
      if (result.trade) params.set("ai_trade", result.trade);
      const qs = params.toString();
      router.push(
        `/tools/rams/${result.builderSlug}${qs ? `?${qs}` : ""}`
      );
      toast.success(`Routing you into ${result.builderSlug.replace(/-/g, " ")}…`);
    } catch {
      toast.error("AI didn't reach. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-8 rounded-xl border border-soft surface-raised shadow-sm-cool overflow-hidden relative">
      {/* Soft brand halo top-right */}
      <div
        className="absolute -top-16 -right-16 size-56 rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle, var(--brand-soft-bg) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        aria-hidden
      />
      <div className="relative px-5 py-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="size-7 rounded-md bg-brand text-foreground flex items-center justify-center shrink-0">
            <Sparkles className="size-3.5" strokeWidth={2} />
          </span>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
            Make a thing
          </div>
          <span className="ml-auto hidden sm:inline text-[10px] text-muted-foreground/70">
            Press <kbd className="px-1 py-0.5 rounded surface-pebble border border-soft text-[9px] font-mono">↵</kbd>{" "}
            to go
          </span>
        </div>
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="e.g. first fix electrical at plot 12 lyme wood tomorrow"
            disabled={busy}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none px-1 py-2 text-base placeholder:text-muted-foreground/60",
              "focus-visible:ring-0 disabled:opacity-50"
            )}
            autoComplete="off"
            spellCheck={false}
          />
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={!text.trim() || busy}
            className="shrink-0 self-center"
          >
            {busy ? (
              <>
                <Loader2 className="size-3.5 mr-1 animate-spin" />
                Routing…
              </>
            ) : (
              <>
                Go
                <ArrowRight className="size-3.5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
