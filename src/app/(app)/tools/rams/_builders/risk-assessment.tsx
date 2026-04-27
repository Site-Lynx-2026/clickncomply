"use client";

import { useState, useMemo } from "react";
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
  type RALibraryItem,
} from "@/lib/rams/library";
import { riskScore } from "@/lib/rams/config";
import { BookOpen, Plus, Search, Trash2, Download, X } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { cn } from "@/lib/utils";

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

export function RiskAssessmentBuilder() {
  const [title, setTitle] = useState("");
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  function addLibraryItem(item: RALibraryItem) {
    setHazards((h) => [
      ...h,
      {
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
      },
    ]);
  }

  function addBlank() {
    setHazards((h) => [
      ...h,
      {
        id: crypto.randomUUID(),
        hazard: "",
        whoAtRisk: "",
        consequences: "",
        initialL: 3,
        initialS: 3,
        controls: "",
        residualL: 1,
        residualS: 3,
      },
    ]);
  }

  function update(id: string, patch: Partial<Hazard>) {
    setHazards((h) => h.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function remove(id: string) {
    setHazards((h) => h.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="ra-title">Title</Label>
            <Input
              id="ra-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Roofing works — Plot 12"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Hazards
              {hazards.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({hazards.length})
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              5×5 matrix. Pick from the library of {RA_LIBRARY.length}+
              pre-built hazards or add custom.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AIButton size="sm">AI suggest from trade</AIButton>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLibrary(true)}
            >
              <BookOpen className="size-3.5 mr-1.5" />
              From library
            </Button>
            <Button size="sm" onClick={addBlank}>
              <Plus className="size-3.5 mr-1.5" />
              Custom hazard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hazards.length === 0 ? (
            <div className="border-2 border-dashed rounded-md p-10 text-center bg-muted/20">
              <p className="text-sm text-muted-foreground mb-3">
                No hazards added yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLibrary(true)}
              >
                <BookOpen className="size-3.5 mr-1.5" />
                Browse library
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {hazards.map((h) => (
                <HazardRow
                  key={h.id}
                  hazard={h}
                  onUpdate={(patch) => update(h.id, patch)}
                  onRemove={() => remove(h.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline">Save draft</Button>
        <Button disabled={hazards.length === 0}>
          <Download className="size-3.5 mr-1.5" />
          Generate Risk Assessment PDF
        </Button>
      </div>

      {showLibrary && (
        <LibraryPicker
          onPick={(item) => {
            addLibraryItem(item);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

function HazardRow({
  hazard,
  onUpdate,
  onRemove,
}: {
  hazard: Hazard;
  onUpdate: (patch: Partial<Hazard>) => void;
  onRemove: () => void;
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
            placeholder="e.g. Operatives, public"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Consequences</Label>
          <Input
            value={hazard.consequences}
            onChange={(e) => onUpdate({ consequences: e.target.value })}
            placeholder="What could happen if uncontrolled"
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
        <Label className="text-xs">Control measures</Label>
        <Textarea
          value={hazard.controls}
          onChange={(e) => onUpdate({ controls: e.target.value })}
          rows={3}
          placeholder="What you do to reduce the risk..."
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

function LibraryPicker({
  onPick,
  onClose,
}: {
  onPick: (item: RALibraryItem) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return RA_LIBRARY.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.hazard.toLowerCase().includes(q) ||
        item.whoAtRisk.toLowerCase().includes(q) ||
        item.controls.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg border shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold">Risk Assessment Library</h2>
            <p className="text-xs text-muted-foreground">
              {RA_LIBRARY.length} pre-built hazards
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </header>

        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hazards, controls..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <CategoryChip
              label="All"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {RA_CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                label={`${c.icon} ${c.label}`}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hazards match.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onPick(item)}
                    className="w-full text-left p-3 border rounded-md hover:border-foreground hover:bg-muted/50 transition"
                  >
                    <div className="text-sm font-medium mb-0.5">
                      {item.hazard}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {item.controls}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-xs px-2.5 py-1 rounded-full border transition",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
