"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Sparkles,
  Upload,
  LayoutGrid,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * NewDocChoiceModal — the SafetyCulture pattern. Four on-ramps, never one.
 *
 *   1. Start from scratch       (the manual override)
 *   2. Describe with AI         (Claude drafts the whole doc from a prompt)
 *   3. Upload existing PDF      (deferred — disabled card with "soon")
 *   4. Pick from library        (opens the trade picker)
 *
 * Each builder shows this on first load if the doc is fresh + empty.
 */
export interface NewDocChoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: string;
  /** Called when user picks "Start from scratch". */
  onScratch: () => void;
  /** Called when user picks "Describe with AI" + supplies a prompt. */
  onAIPrompt?: (prompt: string) => Promise<void> | void;
  /** Called when user picks "Pick from library" — typically same as scratch. */
  onLibrary: () => void;
  /** Disable the AI on-ramp (e.g. builder doesn't support it). */
  aiDisabled?: boolean;
}

type Stage = "choose" | "ai-prompt";

export function NewDocChoiceModal({
  open,
  onOpenChange,
  documentType,
  onScratch,
  onAIPrompt,
  onLibrary,
  aiDisabled,
}: NewDocChoiceProps) {
  const [stage, setStage] = useState<Stage>("choose");
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStage("choose");
    setPrompt("");
    setSubmitting(false);
  }

  async function submitAI() {
    if (!onAIPrompt || !prompt.trim()) return;
    setSubmitting(true);
    try {
      await onAIPrompt(prompt.trim());
      onOpenChange(false);
      reset();
    } catch {
      toast.error("AI draft failed — try scratch or library instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-7 pt-7 pb-4 border-b border-soft">
          <DialogTitle className="font-display font-extrabold uppercase text-2xl tracking-tight">
            New {documentType}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {stage === "choose"
              ? "Pick how you want to start. You can swap approaches any time."
              : "Describe the work in plain English — Claude will draft the whole document for you to review."}
          </DialogDescription>
        </DialogHeader>

        {stage === "choose" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">
            <ChoiceCard
              icon={Sparkles}
              tone="brand"
              eyebrow="Recommended"
              title="Describe with AI"
              body="Tell us about the work in plain English. Claude drafts the full document for you to review and edit."
              disabled={aiDisabled}
              onClick={() => setStage("ai-prompt")}
            />
            <ChoiceCard
              icon={LayoutGrid}
              tone="info"
              title="Pick from library"
              body="Choose your trade — every relevant hazard, control, and method step pre-loads in seconds."
              onClick={() => {
                onLibrary();
                onOpenChange(false);
              }}
            />
            <ChoiceCard
              icon={FileText}
              tone="success"
              title="Start from scratch"
              body="Blank canvas — full manual control. Build the document field-by-field your way."
              onClick={() => {
                onScratch();
                onOpenChange(false);
              }}
            />
            <ChoiceCard
              icon={Upload}
              tone="neutral"
              title="Upload existing PDF"
              body="OCR an existing RAMs/permit and we'll let you edit it inline."
              comingSoon
            />
          </div>
        ) : (
          <div className="p-7 space-y-5">
            <div>
              <Label htmlFor="ai-prompt" className="mb-2 block">
                Describe the work
              </Label>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder={`e.g. ${aiPromptExample(documentType)}`}
                className="resize-none"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Mention the trade, location, duration, and anything specific to your site.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStage("choose")}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-3.5 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={submitAI}
                  disabled={!prompt.trim() || submitting}
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  {submitting ? "Drafting…" : "Draft document"}
                  {!submitting && <ArrowRight className="size-3.5 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ChoiceCardProps {
  icon: typeof FileText;
  tone: "brand" | "info" | "success" | "neutral";
  eyebrow?: string;
  title: string;
  body: string;
  onClick?: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

function ChoiceCard({
  icon: Icon,
  tone,
  eyebrow,
  title,
  body,
  onClick,
  disabled,
  comingSoon,
}: ChoiceCardProps) {
  const stripe: Record<typeof tone, string> = {
    brand: "bg-brand",
    info: "bg-[var(--status-info)]",
    success: "bg-[var(--status-success)]",
    neutral: "bg-foreground/10",
  };
  const tile: Record<typeof tone, string> = {
    brand: "bg-brand text-foreground",
    info: "status-info",
    success: "status-success",
    neutral: "surface-pebble text-muted-foreground",
  };
  const inactive = disabled || comingSoon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inactive}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-soft surface-raised text-left transition-all duration-150 px-5 py-5",
        "shadow-sm-cool hover:shadow-md-cool hover:border-strong hover:-translate-y-0.5",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm-cool"
      )}
    >
      <span
        className={cn("absolute top-0 bottom-0 left-0 w-[3px]", stripe[tone])}
        aria-hidden
      />
      <div className="flex items-start gap-3 mb-2">
        <span
          className={cn(
            "size-9 rounded-lg flex items-center justify-center shrink-0",
            tile[tone]
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </span>
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <span className="text-[9px] uppercase tracking-wider font-bold text-foreground bg-brand rounded px-1.5 py-0.5 inline-block mb-1">
              {eyebrow}
            </span>
          )}
          {comingSoon && (
            <span className="text-[9px] uppercase tracking-wider font-bold surface-pebble text-muted-foreground rounded px-1.5 py-0.5 inline-block mb-1">
              Soon
            </span>
          )}
          <h4 className="font-display font-bold uppercase text-base tracking-tight text-foreground">
            {title}
          </h4>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-12">
        {body}
      </p>
    </button>
  );
}

function aiPromptExample(documentType: string): string {
  const dt = documentType.toLowerCase();
  if (dt.includes("method statement"))
    return "Installing 1.1m mild steel balustrade to mezzanine edge using M12 resin anchors. 3 days, 2 operatives, scissor lift access.";
  if (dt.includes("risk"))
    return "Working at height fixing balustrade panels to mezzanine edge. Public area below, 1-day install.";
  if (dt.includes("coshh"))
    return "Two-pack epoxy primer and zinc-rich paint for steelwork touch-ups, applied indoors.";
  if (dt.includes("hot works"))
    return "MIG welding repairs to balustrade brackets in occupied retail unit.";
  if (dt.includes("permit"))
    return "Cutting a service penetration through 215mm masonry wall in occupied office.";
  if (dt.includes("induction"))
    return "Standard induction for new starters joining a domestic loft conversion site.";
  if (dt.includes("toolbox"))
    return "5-minute briefing on safe use of MEWPs after last week's near-miss.";
  return "Describe the work — trade, location, duration, anything specific.";
}
