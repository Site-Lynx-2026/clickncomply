"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GripVertical, Plus, Trash2, Download, ChevronLeft } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { AIFillButton } from "@/components/ai-fill-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import { useProjectAutofill } from "../_components/use-project-autofill";
import { useIntakePrefill } from "../_components/use-intake-prefill";
import type { ProjectRow } from "../_components/projects-context";
import { RAMS_TRADES, TRADE_CATEGORIES } from "@/lib/rams/library";

interface MethodStep {
  id: string;
  description: string;
  responsible: string;
}

interface MethodStatementForm {
  title: string;
  scope: string;
  trade: string;
  preparedBy: string;
  preparedByRole: string;
  steps: MethodStep[];
}

function emptyForm(): MethodStatementForm {
  return {
    title: "",
    scope: "",
    trade: "",
    preparedBy: "",
    preparedByRole: "",
    steps: [],
  };
}

/** Map a picked project to Method Statement field defaults.
 *  Module-level for stable identity. Hook only fills EMPTY fields. */
function methodStatementAutofill(
  project: ProjectRow
): Partial<MethodStatementForm> {
  return {
    title: `Method Statement — ${project.name}`,
  };
}

export function MethodStatementBuilder() {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<MethodStatementForm>({
    builderSlug: "method-statement",
    emptyForm,
    titleFromForm: (f) => f.title || (f.trade ? `Method Statement — ${f.trade}` : null),
  });

  // Project picker → title auto-populates if empty
  useProjectAutofill({ form, update, map: methodStatementAutofill });

  // One-shot intake → if the dashboard sent us here with a trade,
  // try to load that trade's pre-built steps automatically. Otherwise
  // just patch any empty title/scope/trade fields.
  const intakePrefill = useIntakePrefill();
  const intakeAppliedRef = useRef(false);
  useEffect(() => {
    if (!intakePrefill || intakeAppliedRef.current) return;
    if (form.steps.length > 0) {
      // User already has a doc going — don't clobber.
      intakeAppliedRef.current = true;
      return;
    }
    intakeAppliedRef.current = true;

    // Try to match the trade against the library by name (case-insensitive).
    const tradeQuery = intakePrefill.trade.trim().toLowerCase();
    const matched = tradeQuery
      ? RAMS_TRADES.find(
          (t) =>
            t.trade.toLowerCase() === tradeQuery ||
            t.trade.toLowerCase().includes(tradeQuery) ||
            tradeQuery.includes(t.trade.toLowerCase())
        )
      : undefined;

    if (matched) {
      // Auto-pick the matched trade — drops user straight into editor with
      // 8 steps loaded. Title/scope from intake override the trade defaults
      // when present (intake prose is usually more specific).
      update({
        trade: matched.trade,
        title: intakePrefill.title || `Method Statement — ${matched.trade}`,
        scope: intakePrefill.scope || matched.description,
        steps: matched.msSteps.map((description) => ({
          id: crypto.randomUUID(),
          description,
          responsible: "",
        })),
      });
      toast.success(
        `Loaded ${matched.msSteps.length}-step ${matched.trade} method statement.`
      );
      return;
    }

    // No matching trade — patch empty fields only, leave user in gallery.
    const patch: Partial<MethodStatementForm> = {};
    if (!form.title.trim() && intakePrefill.title) patch.title = intakePrefill.title;
    if (!form.scope.trim() && intakePrefill.scope) patch.scope = intakePrefill.scope;
    if (!form.trade.trim() && intakePrefill.trade) patch.trade = intakePrefill.trade;
    if (Object.keys(patch).length > 0) update(patch);
    // form intentionally omitted — single-shot intake.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakePrefill, update]);

  const [aiBusy, setAiBusy] = useState(false);

  /**
   * Click-to-build: a trade pick auto-fills 8 method statement steps + sets
   * the trade and a sensible default title. Zero typing path.
   */
  function pickTrade(tradeId: string) {
    const t = RAMS_TRADES.find((x) => x.id === tradeId);
    if (!t) return;
    update({
      trade: t.trade,
      title: form.title || `Method Statement — ${t.trade}`,
      scope: form.scope || t.description,
      steps: t.msSteps.map((description) => ({
        id: crypto.randomUUID(),
        description,
        responsible: "",
      })),
    });
    toast.success(`Loaded ${t.msSteps.length}-step ${t.trade} method statement.`);
  }

  function startBlank() {
    update({
      steps: [{ id: crypto.randomUUID(), description: "", responsible: "" }],
      trade: form.trade || "Custom",
    });
  }

  function backToGallery() {
    if (
      form.steps.length > 0 &&
      !confirm("Discard the current method statement and pick a different trade?")
    )
      return;
    update({ steps: [], trade: "" });
  }

  function updateStep(id: string, patch: Partial<MethodStep>) {
    update({
      steps: form.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function addStep() {
    update({
      steps: [
        ...form.steps,
        { id: crypto.randomUUID(), description: "", responsible: "" },
      ],
    });
  }

  function removeStep(id: string) {
    update({ steps: form.steps.filter((s) => s.id !== id) });
  }

  async function aiTighten() {
    if (form.steps.length === 0) return;
    setAiBusy(true);
    try {
      const res = await fetch(`/api/ai/method-statement-tighten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steps: form.steps.map((s) => ({
            description: s.description,
            responsible: s.responsible,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "AI tighten failed.");
        return;
      }
      const { data } = await res.json();
      if (!Array.isArray(data)) {
        toast.error("AI returned an unexpected shape.");
        return;
      }
      update({
        steps: data.map((d: unknown, i: number) => {
          const obj = d as { description?: string; responsible?: string };
          return {
            id: form.steps[i]?.id ?? crypto.randomUUID(),
            description: obj.description || form.steps[i]?.description || "",
            responsible:
              obj.responsible ?? form.steps[i]?.responsible ?? "",
          };
        }),
      });
      toast.success("Tightened.");
    } catch {
      toast.error("AI tighten failed.");
    } finally {
      setAiBusy(false);
    }
  }

  // ── GALLERY VIEW (no steps yet) ──
  if (form.steps.length === 0) {
    return (
      <div className="space-y-6">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <LibraryGallery
          heading="Pick your trade"
          subheading={`${RAMS_TRADES.length} pre-built method statements. Click any trade to load an 8-step draft you can customise.`}
          searchPlaceholder={`Search ${RAMS_TRADES.length} trades…`}
          items={RAMS_TRADES.map((t) => ({
            id: t.id,
            title: t.trade,
            subtitle: t.description,
            category: t.category,
            icon: t.icon,
            meta: `${t.msSteps.length} steps`,
          }))}
          categories={TRADE_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPick={(item) => pickTrade(item.id)}
          customLabel="Start blank"
          onAddCustom={startBlank}
          searchableFields={(item) => [item.title, item.subtitle ?? ""]}
        />
      </div>
    );
  }

  // ── EDITOR VIEW (steps loaded) ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={backToGallery}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Pick a different trade
        </button>
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. First fix electrical — Plot 12, Lyme Wood"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="trade">Trade / discipline</Label>
              <Input
                id="trade"
                value={form.trade}
                onChange={(e) => update({ trade: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="scope">Scope of works</Label>
                <AIFillButton
                  kind="scope"
                  context={{
                    documentType: "Method Statement",
                    trade: form.trade,
                    title: form.title,
                  }}
                  onFill={(text) => update({ scope: text })}
                  hint="Draft scope"
                  variant="icon"
                  disabled={!form.trade.trim()}
                />
              </div>
              <Input
                id="scope"
                value={form.scope}
                onChange={(e) => update({ scope: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Sequence of work</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {form.steps.length} steps loaded from the {form.trade} template.
              Edit, reorder, or use AI to tighten the wording.
            </p>
          </div>
          <AIButton size="sm" onClick={aiTighten} loading={aiBusy}>
            AI tighten wording
          </AIButton>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-start gap-2 border rounded-md p-3 bg-card"
            >
              <button
                className="text-muted-foreground hover:text-foreground mt-2 cursor-grab"
                aria-label="Drag to reorder"
              >
                <GripVertical className="size-4" />
              </button>
              <div className="size-6 rounded bg-muted flex items-center justify-center text-xs font-semibold mt-1.5 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-2">
                <Textarea
                  value={step.description}
                  onChange={(e) =>
                    updateStep(step.id, { description: e.target.value })
                  }
                  placeholder={`Step ${idx + 1} description...`}
                  rows={2}
                  className="resize-none"
                />
                <Input
                  value={step.responsible}
                  onChange={(e) =>
                    updateStep(step.id, { responsible: e.target.value })
                  }
                  placeholder="Responsible"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeStep(step.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

          <Button onClick={addStep} variant="outline" className="w-full">
            <Plus className="size-3.5 mr-1.5" />
            Add step
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prepared by</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="preparedBy">Name</Label>
            <Input
              id="preparedBy"
              value={form.preparedBy}
              onChange={(e) => update({ preparedBy: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preparedByRole">Role</Label>
            <Input
              id="preparedByRole"
              value={form.preparedByRole}
              onChange={(e) => update({ preparedByRole: e.target.value })}
              placeholder="e.g. Site Supervisor"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading}>
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
