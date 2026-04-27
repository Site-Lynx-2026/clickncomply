"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Download, Activity, ChevronLeft } from "lucide-react";
import { calcHAVSPoints, HAVS_EAV, HAVS_ELV } from "@/lib/rams/config";
import { HAVS_LIBRARY } from "@/lib/rams/library";
import { cn } from "@/lib/utils";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import { toast } from "sonner";

interface Tool {
  id: string;
  name: string;
  magnitude: number;
  hours: number;
}

interface HavsBuilderForm {
  title: string;
  workerName: string;
  tools: Tool[];
}

function emptyForm(): HavsBuilderForm {
  return { title: "", workerName: "", tools: [] };
}

export function HavsBuilder() {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<HavsBuilderForm>({
    builderSlug: "havs",
    emptyForm,
    titleFromForm: (f) =>
      f.title || (f.workerName ? `HAVs — ${f.workerName}` : null),
  });

  const totalPoints = useMemo(
    () =>
      form.tools.reduce(
        (sum, t) => sum + calcHAVSPoints(t.magnitude, t.hours),
        0
      ),
    [form.tools]
  );

  const exposureLevel = useMemo(() => {
    if (totalPoints >= HAVS_ELV)
      return {
        label: "Exposure Limit Value (ELV) exceeded — STOP work",
        color: "#dc2626",
      };
    if (totalPoints >= HAVS_EAV)
      return {
        label: "Exposure Action Value (EAV) reached — controls required",
        color: "#d97706",
      };
    return { label: "Within exposure limits", color: "#16a34a" };
  }, [totalPoints]);

  /**
   * Click a tool from the library — adds a row pre-filled with the typical
   * vibration magnitude. Operator just sets hours.
   */
  function pickTool(libId: string) {
    const lib = HAVS_LIBRARY.find((l) => l.id === libId);
    if (!lib) return;
    update({
      tools: [
        ...form.tools,
        {
          id: crypto.randomUUID(),
          name: lib.tool,
          magnitude: lib.vibrationMag,
          hours: 1,
        },
      ],
    });
    toast.success(`${lib.tool} added (${lib.vibrationMag} m/s²).`);
  }

  function addCustomTool() {
    update({
      tools: [
        ...form.tools,
        { id: crypto.randomUUID(), name: "", magnitude: 0, hours: 0 },
      ],
    });
  }

  function updateTool(id: string, patch: Partial<Tool>) {
    update({
      tools: form.tools.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  }

  function removeTool(id: string) {
    update({ tools: form.tools.filter((t) => t.id !== id) });
  }

  function backToGallery() {
    if (
      form.tools.length > 0 &&
      !confirm("Discard current tools and start a fresh assessment?")
    )
      return;
    update({ tools: [] });
  }

  // ── GALLERY VIEW ──
  if (form.tools.length === 0) {
    return (
      <div className="space-y-6">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Worker</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="havs-title">Task / title (optional)</Label>
              <Input
                id="havs-title"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="e.g. Daily fixings install"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="havs-worker">Worker name (optional)</Label>
              <Input
                id="havs-worker"
                value={form.workerName}
                onChange={(e) => update({ workerName: e.target.value })}
                placeholder="e.g. Scott Kennedy"
              />
            </div>
          </CardContent>
        </Card>
        <LibraryGallery
          heading="Pick the tools used today"
          subheading={`${HAVS_LIBRARY.length} pre-loaded vibration magnitudes. Click a tool to add it; set hours; the calculator does the rest.`}
          searchPlaceholder={`Search ${HAVS_LIBRARY.length} tools…`}
          items={HAVS_LIBRARY.map((t) => ({
            id: t.id,
            title: t.tool,
            subtitle: `Typical use ${t.typicalUse}`,
            meta: `${t.vibrationMag.toFixed(1)} m/s²`,
          }))}
          onPick={(item) => pickTool(item.id)}
          customLabel="Add a custom tool"
          onAddCustom={addCustomTool}
          searchableFields={(item) => [item.title]}
        />
      </div>
    );
  }

  // ── EDITOR VIEW ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={backToGallery}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Pick more tools
        </button>
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Worker</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="havs-title">Title (optional)</Label>
            <Input
              id="havs-title"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. Daily fixings install"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="havs-worker">Worker</Label>
            <Input
              id="havs-worker"
              value={form.workerName}
              onChange={(e) => update({ workerName: e.target.value })}
              placeholder="e.g. Scott Kennedy"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily exposure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Stat label="Total points" value={String(totalPoints)} />
            <Stat label="EAV" value={`${HAVS_EAV} pts`} muted />
            <Stat label="ELV" value={`${HAVS_ELV} pts`} muted />
          </div>
          <div
            className="rounded-md p-3 text-sm font-medium text-white"
            style={{ background: exposureLevel.color }}
          >
            {exposureLevel.label}
          </div>
          <ExposureBar points={totalPoints} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Tools used today
              <span className="ml-2 text-muted-foreground font-normal text-sm">
                ({form.tools.length})
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Set the hours used for each tool. Vibration magnitudes pulled from
              the library — adjust if your tool is different.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={addCustomTool}>
            <Plus className="size-3.5 mr-1.5" />
            Add custom
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_120px_120px_140px_40px] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground px-2">
              <div>Tool</div>
              <div>Magnitude (m/s²)</div>
              <div>Hours / day</div>
              <div className="text-right">Points</div>
              <div></div>
            </div>
            {form.tools.map((t) => (
              <ToolRow
                key={t.id}
                tool={t}
                onUpdate={(patch) => updateTool(t.id, patch)}
                onRemove={() => removeTool(t.id)}
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
          {downloading ? "Generating…" : "Download HAVs PDF"}
        </Button>
      </div>
    </div>
  );
}

function ToolRow({
  tool,
  onUpdate,
  onRemove,
}: {
  tool: Tool;
  onUpdate: (patch: Partial<Tool>) => void;
  onRemove: () => void;
}) {
  const points = calcHAVSPoints(tool.magnitude, tool.hours);
  const colour =
    points >= HAVS_ELV
      ? "#dc2626"
      : points >= HAVS_EAV
        ? "#d97706"
        : "#16a34a";

  return (
    <div className="grid grid-cols-[1fr_120px_120px_140px_40px] gap-2 items-center">
      <Input
        value={tool.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="e.g. SDS Drill"
      />
      <Input
        type="number"
        step="0.1"
        min={0}
        value={tool.magnitude || ""}
        onChange={(e) =>
          onUpdate({ magnitude: parseFloat(e.target.value) || 0 })
        }
        placeholder="0.0"
      />
      <Input
        type="number"
        step="0.25"
        min={0}
        value={tool.hours || ""}
        onChange={(e) => onUpdate({ hours: parseFloat(e.target.value) || 0 })}
        placeholder="0.0"
      />
      <div
        className={cn(
          "h-9 rounded-md flex items-center justify-end px-3 text-sm font-semibold text-white"
        )}
        style={{ background: colour }}
      >
        {points} pts
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "border rounded-md p-3",
        muted && "bg-muted/30 text-muted-foreground"
      )}
    >
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight mt-0.5">
        {value}
      </div>
    </div>
  );
}

function ExposureBar({ points }: { points: number }) {
  const max = HAVS_ELV * 1.25;
  const pct = Math.min(100, (points / max) * 100);
  const eavPct = (HAVS_EAV / max) * 100;
  const elvPct = (HAVS_ELV / max) * 100;
  return (
    <div className="mt-4 relative h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 transition-all"
        style={{
          width: `${pct}%`,
          background:
            points >= HAVS_ELV
              ? "#dc2626"
              : points >= HAVS_EAV
                ? "#d97706"
                : "#16a34a",
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-foreground/30"
        style={{ left: `${eavPct}%` }}
        title="EAV"
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-foreground/30"
        style={{ left: `${elvPct}%` }}
        title="ELV"
      />
    </div>
  );
}
