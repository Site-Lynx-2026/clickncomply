"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RAMS_STEPS, createEmptyRAMS, type RAMSFormData } from "@/lib/rams/config";
import { Check, ArrowLeft, ArrowRight, Save, BookOpen } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { cn } from "@/lib/utils";

/**
 * One-Click Full RAMs builder skeleton.
 *
 * 12-step flow ported from SiteLynx (Gary's spec). Each step renders into
 * the same panel — left rail shows step progress, right pane shows the
 * active step's form. Auto-save lands once the API route is wired.
 *
 * Step components are stubbed inline for now — they get replaced with the
 * full SL implementations as we port them across.
 */
export function FullRamsBuilder() {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<RAMSFormData>(createEmptyRAMS());
  const step = RAMS_STEPS[stepIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      {/* Step rail */}
      <aside className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground px-2 pb-2">
          Steps
        </div>
        {RAMS_STEPS.map((s, i) => {
          const active = i === stepIdx;
          const done = i < stepIdx;
          return (
            <button
              key={s.num}
              onClick={() => setStepIdx(i)}
              className={cn(
                "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "size-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0",
                  active
                    ? "bg-background text-foreground"
                    : done
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {done ? <Check className="size-3" /> : s.num}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Active step pane */}
      <div className="border rounded-lg p-6 bg-card min-h-[480px] flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Step {step.num} of {RAMS_STEPS.length}
            </div>
            <h2 className="text-lg font-semibold tracking-tight mt-0.5">
              {step.label}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <AIButton size="sm">AI fill this step</AIButton>
            <Button variant="outline" size="sm">
              <BookOpen className="size-3.5 mr-1.5" />
              Library
            </Button>
            <Button variant="outline" size="sm">
              <Save className="size-3.5 mr-1.5" />
              Save draft
            </Button>
          </div>
        </div>

        <div className="flex-1 mb-6">
          <StepPlaceholder
            stepNum={step.num}
            stepLabel={step.label}
            form={form}
            setForm={setForm}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            Back
          </Button>
          <Button
            disabled={stepIdx === RAMS_STEPS.length - 1}
            onClick={() => setStepIdx((i) => Math.min(RAMS_STEPS.length - 1, i + 1))}
          >
            {stepIdx === RAMS_STEPS.length - 1 ? "Generate PDF" : "Next"}
            {stepIdx !== RAMS_STEPS.length - 1 && (
              <ArrowRight className="size-3.5 ml-1.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepPlaceholder({
  stepNum,
  stepLabel,
}: {
  stepNum: number;
  stepLabel: string;
  form: RAMSFormData;
  setForm: (f: RAMSFormData) => void;
}) {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20 h-full flex flex-col items-center justify-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        Step {stepNum}
      </div>
      <h3 className="font-semibold mb-1">{stepLabel}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Step UI being ported from SiteLynx. The 12-step flow, library picker,
        AI fill-in and PDF output land here next.
      </p>
    </div>
  );
}
