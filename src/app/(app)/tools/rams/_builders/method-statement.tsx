"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { GripVertical, Plus, Trash2, Download, Check } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";

interface MethodStep {
  id: string;
  description: string;
  responsible: string;
}

interface MethodStatementForm {
  title: string;
  scope: string;
  trade: string;
  steps: MethodStep[];
}

const BUILDER_SLUG = "method-statement";

function emptyForm(): MethodStatementForm {
  return {
    title: "",
    scope: "",
    trade: "",
    steps: [
      { id: crypto.randomUUID(), description: "", responsible: "" },
    ],
  };
}

export function MethodStatementBuilder() {
  const [form, setForm] = useState<MethodStatementForm>(emptyForm);
  const [docId, setDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [aiBusy, setAiBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const dirty = useRef(false);

  // Auto-save 1.5s after last edit.
  const save = useCallback(
    async (next: MethodStatementForm, currentId: string | null) => {
      setSaving(true);
      try {
        const payload = {
          title: next.title || null,
          form_data: next as unknown as Record<string, unknown>,
        };
        let res: Response;
        if (currentId) {
          res = await fetch(`/api/rams/${currentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch(`/api/rams`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ builder_slug: BUILDER_SLUG, ...payload }),
          });
          if (res.ok) {
            const { id } = await res.json();
            setDocId(id);
            window.history.replaceState(
              null,
              "",
              `/tools/rams/${BUILDER_SLUG}?doc=${id}`
            );
          }
        }
        if (!res.ok) throw new Error(await res.text());
        setLastSaved(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        dirty.current = false;
      } catch {
        toast.error("Couldn't save — check your connection.");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  function update(patch: Partial<MethodStatementForm>) {
    setForm((f) => {
      const next = { ...f, ...patch };
      dirty.current = true;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        if (dirty.current) save(next, docId);
      }, 1500);
      return next;
    });
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

  // Load existing doc from ?doc=... if present.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("doc");
    if (!id) return;
    setDocId(id);
    fetch(`/api/rams/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (doc?.form_data) {
          setForm({ ...emptyForm(), ...doc.form_data });
        }
      })
      .catch(() => {});
  }, []);

  // Cleanup pending save on unmount.
  useEffect(
    () => () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    },
    []
  );

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

  async function downloadPdf() {
    if (!docId) {
      toast.error("Save the document first.");
      return;
    }
    setDownloading(true);
    try {
      const res = await fetch(`/api/rams/${docId}/pdf`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "PDF generation failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch {
      toast.error("PDF generation failed.");
    } finally {
      setDownloading(false);
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

      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={() => save(form, docId)}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading || !docId}>
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}

function SaveStatus({
  saving,
  lastSaved,
}: {
  saving: boolean;
  lastSaved: string;
}) {
  if (saving) {
    return (
      <p className="text-xs text-muted-foreground">Saving…</p>
    );
  }
  if (lastSaved) {
    return (
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        <Check className="size-3 text-foreground" />
        Saved at {lastSaved}
      </p>
    );
  }
  return null;
}
