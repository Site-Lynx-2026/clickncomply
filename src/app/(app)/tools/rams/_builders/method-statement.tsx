"use client";

import { useState } from "react";
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
import { GripVertical, Plus, Trash2, Download } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";

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
    steps: [{ id: crypto.randomUUID(), description: "", responsible: "" }],
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
    titleFromForm: (f) => f.title || null,
  });

  const [aiBusy, setAiBusy] = useState(false);

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

  async function aiFillFromTrade() {
    if (!form.trade.trim()) {
      toast.error("Add a trade first — e.g. 'Electrical first fix'.");
      return;
    }
    setAiBusy(true);
    try {
      const res = await fetch(`/api/ai/method-statement-fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade: form.trade, scope: form.scope }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "AI generation failed.");
        return;
      }
      const { data } = await res.json();
      if (!Array.isArray(data)) {
        toast.error("AI returned an unexpected shape.");
        return;
      }
      const newSteps: MethodStep[] = data.map((s: unknown) => {
        const obj = s as { description?: string; responsible?: string };
        return {
          id: crypto.randomUUID(),
          description: obj.description || "",
          responsible: obj.responsible || "",
        };
      });
      update({ steps: newSteps });
      toast.success(`AI generated ${newSteps.length} steps.`);
    } catch {
      toast.error("AI generation failed.");
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <SaveStatus saving={saving} lastSaved={lastSaved} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Method statement title</Label>
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
                placeholder="e.g. Electrical first fix"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scope">Scope of works</Label>
              <Input
                id="scope"
                value={form.scope}
                onChange={(e) => update({ scope: e.target.value })}
                placeholder="Brief description of the works..."
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
              List each step in order. Drag to reorder. AI fills the steps from
              your trade in seconds.
            </p>
          </div>
          <AIButton
            size="sm"
            onClick={aiFillFromTrade}
            loading={aiBusy}
            disabled={!form.trade.trim()}
          >
            AI fill from trade
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
                  placeholder="Responsible (e.g. Site supervisor)"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeStep(step.id)}
                disabled={form.steps.length === 1}
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
