"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Download, ChevronLeft } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import {
  COSHH_SUBSTANCES,
  COSHH_CATEGORIES,
  type CoshhSubstanceLibraryItem,
} from "@/lib/rams/coshh-substances";

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
  fromLibrary?: boolean;
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
  return { title: "", scope: "", preparedBy: "", substances: [] };
}

function fromLibrary(lib: CoshhSubstanceLibraryItem): Substance {
  return {
    id: crypto.randomUUID(),
    name: lib.name,
    sdsRef: "",
    exposureRoute: lib.exposureRoute,
    welRef: lib.welRef ?? "",
    riskLevel: lib.riskLevel,
    controls: lib.controls,
    ppe: lib.ppe,
    emergencyProcedure: lib.emergencyProcedure,
    fromLibrary: true,
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
    ppe: "",
    emergencyProcedure: "",
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
  const [showGallery, setShowGallery] = useState(true);

  function pickSubstances(libIds: string[]) {
    const libs = libIds
      .map((id) => COSHH_SUBSTANCES.find((s) => s.id === id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
    if (libs.length === 0) return;
    update({ substances: [...form.substances, ...libs.map(fromLibrary)] });
    toast.success(
      `${libs.length} substance${libs.length === 1 ? "" : "s"} added.`
    );
    setShowGallery(false);
  }

  function addCustomSubstance() {
    update({ substances: [...form.substances, emptySubstance()] });
    setShowGallery(false);
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

  // ── GALLERY VIEW ──
  if (form.substances.length === 0 || showGallery) {
    return (
      <div className="space-y-6">
        {form.substances.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowGallery(false)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ChevronLeft className="size-3.5" />
              Back to {form.substances.length} added substance
              {form.substances.length === 1 ? "" : "s"}
            </button>
            <SaveStatus saving={saving} lastSaved={lastSaved} />
          </div>
        )}
        {form.substances.length === 0 && (
          <SaveStatus saving={saving} lastSaved={lastSaved} />
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project (optional)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="coshh-title">Title</Label>
              <Input
                id="coshh-title"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. M&E first fix — Plot 12"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coshh-scope">Scope</Label>
              <Input
                id="coshh-scope"
                value={form.scope}
                onChange={(e) => update({ scope: e.target.value })}
                placeholder="What this assessment covers..."
              />
            </div>
          </CardContent>
        </Card>
        <LibraryGallery
          heading={
            form.substances.length === 0
              ? "Pick the substances you handle"
              : "Add another substance"
          }
          subheading={`${COSHH_SUBSTANCES.length} pre-built substances with controls, PPE and emergency procedures pre-filled. Click to add — tweak only what's specific to you.`}
          searchPlaceholder={`Search ${COSHH_SUBSTANCES.length} substances…`}
          items={COSHH_SUBSTANCES.map((s) => ({
            id: s.id,
            title: s.name,
            subtitle: s.summary,
            category: s.category,
            icon: s.icon,
            meta: s.riskLevel.toUpperCase(),
          }))}
          categories={COSHH_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPickMany={(picks) => pickSubstances(picks.map((p) => p.id))}
          continueLabel={(n) =>
            `Add ${n} substance${n === 1 ? "" : "s"} to assessment`
          }
          customLabel="Add a custom substance"
          onAddCustom={addCustomSubstance}
          searchableFields={(item) => [item.title, item.subtitle ?? ""]}
        />
      </div>
    );
  }

  // ── EDITOR VIEW ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowGallery(true)}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <Plus className="size-3.5" />
          Add another substance from library
        </button>
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="coshh-title">Title</Label>
            <Input
              id="coshh-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. M&E first fix — Plot 12"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Substances
            <span className="ml-2 text-muted-foreground font-normal text-sm">
              ({form.substances.length})
            </span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Each substance pre-filled from the library. Tick or tweak as
            needed. Use AI to refine for unusual substances.
          </p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading}>
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
        {substance.fromLibrary && (
          <Badge
            variant="outline"
            className="text-[9px] uppercase shrink-0 mt-6"
          >
            Library
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0 mt-6"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {!substance.fromLibrary && (
        <div className="flex justify-end">
          <AIButton size="sm" onClick={onAiFill} loading={aiBusy}>
            AI fill controls + PPE + emergency
          </AIButton>
        </div>
      )}

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
          <Label className="text-xs">WEL reference</Label>
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
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Control measures</Label>
        <Textarea
          value={substance.controls}
          onChange={(e) => onUpdate({ controls: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">PPE required</Label>
        <Input
          value={substance.ppe}
          onChange={(e) => onUpdate({ ppe: e.target.value })}
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
