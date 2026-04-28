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
import {
  RA_CATEGORIES,
  RA_LIBRARY,
  RAMS_TRADES,
  TRADE_CATEGORIES,
  type RALibraryItem,
} from "@/lib/rams/library";
import { riskScore } from "@/lib/rams/config";
import { Plus, Trash2, Download, ChevronLeft } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import { CommandPicker } from "@/components/command-picker";
import { AIFillButton } from "@/components/ai-fill-button";

interface Hazard {
  id: string;
  hazard: string;
  whoAtRisk: string;
  consequences: string;
  initialL: number;
  initialS: number;
  controls: string;
  residualL: number;
  residualS: number;
  fromLibrary?: boolean;
}

interface RiskAssessmentForm {
  title: string;
  scope: string;
  preparedBy: string;
  preparedByRole: string;
  hazards: Hazard[];
}

type Mode = "by-trade" | "by-hazard" | "editing";

function emptyForm(): RiskAssessmentForm {
  return {
    title: "",
    scope: "",
    preparedBy: "",
    preparedByRole: "",
    hazards: [],
  };
}

function fromLibrary(item: RALibraryItem): Hazard {
  return {
    id: crypto.randomUUID(),
    hazard: item.hazard,
    whoAtRisk: item.whoAtRisk,
    consequences: item.consequences,
    initialL: item.initialL,
    initialS: item.initialS,
    controls: item.controls,
    residualL: item.residualL,
    residualS: item.residualS,
    fromLibrary: true,
  };
}

function blankHazard(): Hazard {
  return {
    id: crypto.randomUUID(),
    hazard: "",
    whoAtRisk: "",
    consequences: "",
    initialL: 3,
    initialS: 3,
    controls: "",
    residualL: 1,
    residualS: 3,
  };
}

export interface RiskAssessmentBuilderProps {
  /** Override the builder slug (so this same component can back specialist
   * assessments like Working at Height, Manual Handling, etc.) */
  slug?: string;
  /** Pre-filter trade list to a single category id (e.g. "wah", "mh"). */
  categoryFilter?: string;
  /** Default title prefix used when prefilling. */
  defaultTitle?: string;
}

export function RiskAssessmentBuilder({
  slug = "risk-assessment",
  categoryFilter,
  defaultTitle,
}: RiskAssessmentBuilderProps = {}) {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<RiskAssessmentForm>({
    builderSlug: slug,
    emptyForm,
    titleFromForm: (f) => f.title || null,
  });

  const [mode, setMode] = useState<Mode>("by-trade");
  const [aiBusyFor, setAiBusyFor] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  /**
   * Pick a trade — instantly loads every relevant hazard from its raItems
   * list. One click and you have a full RA draft.
   */
  function pickTrade(tradeId: string) {
    const trade = RAMS_TRADES.find((t) => t.id === tradeId);
    if (!trade) return;
    const items = trade.raItems
      .map((id) => RA_LIBRARY.find((h) => h.id === id))
      .filter((x): x is RALibraryItem => Boolean(x));
    update({
      title: form.title || `Risk Assessment — ${trade.trade}`,
      scope: form.scope || trade.description,
      hazards: items.map(fromLibrary),
    });
    toast.success(
      `Loaded ${items.length} hazards for ${trade.trade}. Add or remove as needed.`
    );
    setMode("editing");
  }

  function pickHazards(libIds: string[]) {
    const items = libIds
      .map((id) => RA_LIBRARY.find((x) => x.id === id))
      .filter((x): x is RALibraryItem => Boolean(x));
    if (items.length === 0) return;
    update({ hazards: [...form.hazards, ...items.map(fromLibrary)] });
    toast.success(
      `${items.length} hazard${items.length === 1 ? "" : "s"} added.`
    );
    setMode("editing");
  }

  function addBlank() {
    update({ hazards: [...form.hazards, blankHazard()] });
    setMode("editing");
  }

  function updateHazard(id: string, patch: Partial<Hazard>) {
    update({
      hazards: form.hazards.map((h) =>
        h.id === id ? { ...h, ...patch } : h
      ),
    });
  }

  function removeHazard(id: string) {
    update({ hazards: form.hazards.filter((h) => h.id !== id) });
  }

  async function aiSuggestControls(hazardId: string) {
    const h = form.hazards.find((x) => x.id === hazardId);
    if (!h || !h.hazard.trim()) {
      toast.error("Add the hazard description first.");
      return;
    }
    setAiBusyFor(hazardId);
    try {
      const res = await fetch(`/api/ai/ra-controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hazard: h.hazard, whoAtRisk: h.whoAtRisk }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "AI suggestion failed.");
        return;
      }
      const { text } = await res.json();
      if (!text) return;
      updateHazard(hazardId, { controls: text });
      toast.success("Controls suggested.");
    } catch {
      toast.error("AI suggestion failed.");
    } finally {
      setAiBusyFor(null);
    }
  }

  // ── INITIAL VIEW: BY TRADE (default — fastest path) ──
  if (mode === "by-trade" && form.hazards.length === 0) {
    return (
      <div className="space-y-6">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <ModeSwitch mode={mode} onChange={setMode} />
        <LibraryGallery
          heading="Pick your trade — full RA loads instantly"
          subheading={`${RAMS_TRADES.length} trades, each pre-mapped to ${RA_LIBRARY.length}+ hazards. One click and you're 90% done.`}
          searchPlaceholder={`Search ${RAMS_TRADES.length} trades…`}
          items={RAMS_TRADES.map((t) => ({
            id: t.id,
            title: t.trade,
            subtitle: t.description,
            category: t.category,
            icon: t.icon,
            meta: `${t.raItems.length} hazards`,
          }))}
          categories={TRADE_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPick={(item) => pickTrade(item.id)}
          customLabel="Build hazard-by-hazard instead"
          onAddCustom={() => setMode("by-hazard")}
        />
      </div>
    );
  }

  // ── HAZARD-BY-HAZARD GALLERY ──
  if (mode === "by-hazard") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {form.hazards.length > 0 ? (
            <button
              onClick={() => setMode("editing")}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ChevronLeft className="size-3.5" />
              Back to {form.hazards.length} added hazard
              {form.hazards.length === 1 ? "" : "s"}
            </button>
          ) : (
            <span />
          )}
          <SaveStatus saving={saving} lastSaved={lastSaved} />
        </div>
        <ModeSwitch mode={mode} onChange={setMode} />
        <LibraryGallery
          heading="Browse hazards by category"
          subheading={`${RA_LIBRARY.length} pre-built hazards across ${RA_CATEGORIES.length} categories. Click to add to your assessment.`}
          searchPlaceholder={`Search ${RA_LIBRARY.length} hazards…`}
          items={RA_LIBRARY.map((h) => {
            const score = riskScore(h.initialL, h.initialS);
            return {
              id: h.id,
              title: h.hazard,
              subtitle: h.controls,
              category: h.category,
              meta: score.level,
            };
          })}
          categories={RA_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPickMany={(picks) => pickHazards(picks.map((p) => p.id))}
          continueLabel={(n) =>
            `Add ${n} hazard${n === 1 ? "" : "s"} to assessment`
          }
          customLabel="Add a custom hazard"
          onAddCustom={addBlank}
          searchableFields={(item) => [item.title, item.subtitle ?? ""]}
        />
      </div>
    );
  }

  // ── EDITOR ──
  // Existing hazard ids — used to suggest the user pick something they
  // haven't already added when they re-open the picker.
  const existingHazardSlugs = new Set(form.hazards.map((h) => h.hazard));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPickerOpen(true)}
        >
          <Plus className="size-3.5 mr-1.5" />
          Add hazards (⌘K)
        </Button>
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>

      {/* CommandPicker — fast multi-select for repeat adds. The initial
          by-trade / by-hazard galleries are still the discovery path. */}
      <CommandPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        title="Add hazards"
        subtitle={`${RA_LIBRARY.length} pre-built hazards across ${RA_CATEGORIES.length} categories`}
        searchPlaceholder="Search hazards..."
        items={RA_LIBRARY.filter((h) => !existingHazardSlugs.has(h.hazard)).map(
          (h) => {
            const score = riskScore(h.initialL, h.initialS);
            const cat = RA_CATEGORIES.find((c) => c.id === h.category);
            return {
              id: h.id,
              title: h.hazard,
              subtitle: h.controls,
              category: h.category,
              meta: cat ? `${cat.icon} ${score.level}` : score.level,
              metaTone:
                score.level === "Critical"
                  ? ("danger" as const)
                  : score.level === "High"
                    ? ("warning" as const)
                    : score.level === "Medium"
                      ? ("info" as const)
                      : ("success" as const),
              keywords: [h.whoAtRisk, h.consequences],
            };
          }
        )}
        categories={RA_CATEGORIES.map((c) => ({
          id: c.id,
          label: `${c.icon} ${c.label}`,
        }))}
        onPickMany={(picks) => {
          pickHazards(picks.map((p) => p.id));
          setPickerOpen(false);
        }}
        continueLabel={(n) =>
          `Add ${n} hazard${n === 1 ? "" : "s"} to assessment`
        }
        onCreate={(text) => {
          const blank = blankHazard();
          blank.hazard = text;
          update({ hazards: [...form.hazards, blank] });
          setPickerOpen(false);
          toast.success("Custom hazard added — fill in the controls.");
        }}
        createLabel={(t) => `+ Custom hazard: "${t}"`}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ra-title">Title</Label>
            <Input
              id="ra-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. Roofing works — Plot 12"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="ra-scope">Scope</Label>
                <AIFillButton
                  kind="scope"
                  context={{
                    documentType: "Risk Assessment",
                    title: form.title,
                  }}
                  onFill={(text) => update({ scope: text })}
                  hint="Draft scope"
                  variant="icon"
                  disabled={!form.title.trim()}
                />
              </div>
              <Input
                id="ra-scope"
                value={form.scope}
                onChange={(e) => update({ scope: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ra-prep">Prepared by</Label>
              <Input
                id="ra-prep"
                value={form.preparedBy}
                onChange={(e) => update({ preparedBy: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Hazards
            <span className="ml-2 text-muted-foreground font-normal text-sm">
              ({form.hazards.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.hazards.map((h) => (
            <HazardRow
              key={h.id}
              hazard={h}
              aiBusy={aiBusyFor === h.id}
              onUpdate={(patch) => updateHazard(h.id, patch)}
              onRemove={() => removeHazard(h.id)}
              onAiSuggest={() => aiSuggestControls(h.id)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading}>
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download Risk Assessment PDF"}
        </Button>
      </div>
    </div>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 border rounded-lg p-0.5 bg-muted/30">
      <button
        onClick={() => onChange("by-trade")}
        className={`text-xs px-3 py-1.5 rounded font-medium transition ${
          mode === "by-trade"
            ? "bg-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        By trade (fastest)
      </button>
      <button
        onClick={() => onChange("by-hazard")}
        className={`text-xs px-3 py-1.5 rounded font-medium transition ${
          mode === "by-hazard"
            ? "bg-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        By hazard (custom)
      </button>
    </div>
  );
}

function HazardRow({
  hazard,
  aiBusy,
  onUpdate,
  onRemove,
  onAiSuggest,
}: {
  hazard: Hazard;
  aiBusy: boolean;
  onUpdate: (patch: Partial<Hazard>) => void;
  onRemove: () => void;
  onAiSuggest: () => void;
}) {
  const initial = riskScore(hazard.initialL, hazard.initialS);
  const residual = riskScore(hazard.residualL, hazard.residualS);

  return (
    <div className="border rounded-md p-4 bg-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Input
            value={hazard.hazard}
            onChange={(e) => onUpdate({ hazard: e.target.value })}
            placeholder="Hazard description"
            className="font-medium"
          />
        </div>
        {hazard.fromLibrary && (
          <Badge variant="outline" className="text-[9px] uppercase shrink-0">
            Library
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Who&apos;s at risk</Label>
          <Input
            value={hazard.whoAtRisk}
            onChange={(e) => onUpdate({ whoAtRisk: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Consequences</Label>
          <Input
            value={hazard.consequences}
            onChange={(e) => onUpdate({ consequences: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ScoreSelect
          label="Initial L"
          value={hazard.initialL}
          onChange={(v) => onUpdate({ initialL: v })}
        />
        <ScoreSelect
          label="Initial S"
          value={hazard.initialS}
          onChange={(v) => onUpdate({ initialS: v })}
        />
        <div className="col-span-2 md:col-span-2 flex items-end">
          <ScoreBadge label="Initial" score={initial} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Control measures</Label>
          {!hazard.fromLibrary && (
            <AIButton size="sm" onClick={onAiSuggest} loading={aiBusy}>
              AI suggest
            </AIButton>
          )}
        </div>
        <Textarea
          value={hazard.controls}
          onChange={(e) => onUpdate({ controls: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ScoreSelect
          label="Residual L"
          value={hazard.residualL}
          onChange={(v) => onUpdate({ residualL: v })}
        />
        <ScoreSelect
          label="Residual S"
          value={hazard.residualS}
          onChange={(v) => onUpdate({ residualS: v })}
        />
        <div className="col-span-2 md:col-span-2 flex items-end">
          <ScoreBadge label="Residual" score={residual} />
        </div>
      </div>
    </div>
  );
}

function ScoreSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full border rounded-md h-9 px-2 text-sm bg-background"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScoreBadge({
  label,
  score,
}: {
  label: string;
  score: { score: number; level: string; color: string };
}) {
  return (
    <div className="text-xs">
      <div className="text-muted-foreground mb-1">{label} risk</div>
      <div
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-white text-xs font-semibold"
        style={{ background: score.color }}
      >
        <span>{score.score}</span>
        <span className="opacity-90">{score.level}</span>
      </div>
    </div>
  );
}
