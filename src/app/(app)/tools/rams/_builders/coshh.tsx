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
import { Plus, Trash2, Download, FlaskConical } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";

type RiskLevel = "low" | "medium" | "high";

interface Substance {
  id: string;
  name: string;
  sdsRef: string;
  exposureRoute: string;
  welRef: string;
  riskLevel: RiskLevel;
  controls: string;
  ppe: string;
  emergencyProcedure: string;
}

interface CoshhBuilderForm {
  title: string;
  scope: string;
  preparedBy: string;
  substances: Substance[];
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
};

function emptyForm(): CoshhBuilderForm {
  return {
    title: "",
    scope: "",
    preparedBy: "",
    substances: [],
  };
}

function emptySubstance(): Substance {
  return {
    id: crypto.randomUUID(),
    name: "",
    sdsRef: "",
    exposureRoute: "Inhalation, skin contact",
    welRef: "",
    riskLevel: "medium",
    controls: "",
    ppe: "Nitrile gloves, safety glasses, FFP3 mask",
    emergencyProcedure:
      "Eye contact: rinse with water for 15 min. Skin: wash with soap and water. Inhalation: move to fresh air. Seek medical advice if symptoms persist.",
  };
}

export function CoshhBuilder() {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<CoshhBuilderForm>({
    builderSlug: "coshh",
    emptyForm,
    titleFromForm: (f) => f.title || null,
  });

  const [aiBusyFor, setAiBusyFor] = useState<string | null>(null);

  function addSubstance() {
    update({ substances: [...form.substances, emptySubstance()] });
  }

  function updateSubstance(id: string, patch: Partial<Substance>) {
    update({
      substances: form.substances.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    });
  }

  function removeSubstance(id: string) {
    update({ substances: form.substances.filter((s) => s.id !== id) });
  }

  async function aiFillControlsFor(id: string) {
    const s = form.substances.find((x) => x.id === id);
    if (!s || !s.name.trim()) {
      toast.error("Add the substance name first.");
      return;
    }
    setAiBusyFor(id);
    try {
      const res = await fetch(`/api/ai/coshh-controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ substance: s.name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "AI suggestion failed.");
        return;
      }
      const { data } = await res.json();
      const patch: Partial<Substance> = {};
      if (typeof data?.exposureRoute === "string")
        patch.exposureRoute = data.exposureRoute;
      if (typeof data?.controls === "string") patch.controls = data.controls;
      if (typeof data?.ppe === "string") patch.ppe = data.ppe;
      if (typeof data?.emergencyProcedure === "string")
        patch.emergencyProcedure = data.emergencyProcedure;
      updateSubstance(id, patch);
      toast.success("Controls suggested.");
    } catch {
      toast.error("AI suggestion failed.");
    } finally {
      setAiBusyFor(null);
    }
  }

  return (
    <div className="space-y-6">
      <SaveStatus saving={saving} lastSaved={lastSaved} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">COSHH Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="coshh-title">Title</Label>
            <Input
              id="coshh-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. M&E first fix — Plot 12"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="coshh-scope">Scope</Label>
              <Input
                id="coshh-scope"
                value={form.scope}
                onChange={(e) => update({ scope: e.target.value })}
                placeholder="What this assessment covers..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coshh-prep">Prepared by</Label>
              <Input
                id="coshh-prep"
                value={form.preparedBy}
                onChange={(e) => update({ preparedBy: e.target.value })}
                placeholder="Name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Substances
              {form.substances.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({form.substances.length})
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Each substance assessed individually with control hierarchy and
              emergency procedure. AI fills controls + PPE + emergency in one
              click.
            </p>
          </div>
          <Button size="sm" onClick={addSubstance}>
            <Plus className="size-3.5 mr-1.5" />
            Add substance
          </Button>
        </CardHeader>
        <CardContent>
          {form.substances.length === 0 ? (
            <div className="border-2 border-dashed rounded-md p-10 text-center bg-muted/20">
              <FlaskConical className="size-6 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                No substances added yet.
              </p>
              <Button variant="outline" size="sm" onClick={addSubstance}>
                <Plus className="size-3.5 mr-1.5" />
                Add first substance
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {form.substances.map((s) => (
                <SubstanceRow
                  key={s.id}
                  substance={s}
                  aiBusy={aiBusyFor === s.id}
                  onUpdate={(patch) => updateSubstance(s.id, patch)}
                  onRemove={() => removeSubstance(s.id)}
                  onAiFill={() => aiFillControlsFor(s.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button
          onClick={downloadPdf}
          disabled={downloading || form.substances.length === 0}
        >
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download COSHH PDF"}
        </Button>
      </div>
    </div>
  );
}

function SubstanceRow({
  substance,
  aiBusy,
  onUpdate,
  onRemove,
  onAiFill,
}: {
  substance: Substance;
  aiBusy: boolean;
  onUpdate: (patch: Partial<Substance>) => void;
  onRemove: () => void;
  onAiFill: () => void;
}) {
  return (
    <div className="border rounded-md p-4 bg-card space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs">Substance name</Label>
          <Input
            value={substance.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. Cement, MDI Foam, White Spirit"
            className="font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Risk level</Label>
          <select
            value={substance.riskLevel}
            onChange={(e) =>
              onUpdate({ riskLevel: e.target.value as RiskLevel })
            }
            className="border rounded-md h-9 px-2 text-sm bg-background"
            style={{ borderColor: RISK_COLORS[substance.riskLevel] }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0 mt-6"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="flex justify-end">
        <AIButton size="sm" onClick={onAiFill} loading={aiBusy}>
          AI fill controls + PPE + emergency
        </AIButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">SDS reference</Label>
          <Input
            value={substance.sdsRef}
            onChange={(e) => onUpdate({ sdsRef: e.target.value })}
            placeholder="e.g. SDS-SIK-001 (Sika 1)"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">WEL reference (if applicable)</Label>
          <Input
            value={substance.welRef}
            onChange={(e) => onUpdate({ welRef: e.target.value })}
            placeholder="e.g. EH40/2005"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Exposure routes</Label>
        <Input
          value={substance.exposureRoute}
          onChange={(e) => onUpdate({ exposureRoute: e.target.value })}
          placeholder="Inhalation, skin contact, ingestion, eye contact"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Control measures</Label>
        <Textarea
          value={substance.controls}
          onChange={(e) => onUpdate({ controls: e.target.value })}
          rows={2}
          placeholder="Engineering controls, ventilation, substitution, exposure limits..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">PPE required</Label>
        <Input
          value={substance.ppe}
          onChange={(e) => onUpdate({ ppe: e.target.value })}
          placeholder="Glove grade, RPE, eye protection..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Emergency procedure</Label>
        <Textarea
          value={substance.emergencyProcedure}
          onChange={(e) => onUpdate({ emergencyProcedure: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}
