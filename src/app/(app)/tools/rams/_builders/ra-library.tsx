"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RA_CATEGORIES,
  RA_LIBRARY,
  type RALibraryItem,
} from "@/lib/rams/library";
import { riskScore, LIKELIHOOD_LABELS, SEVERITY_LABELS } from "@/lib/rams/config";
import { Search, Copy, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RaLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return RA_LIBRARY.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.hazard.toLowerCase().includes(q) ||
        item.whoAtRisk.toLowerCase().includes(q) ||
        item.controls.toLowerCase().includes(q) ||
        item.consequences.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: RA_LIBRARY.length };
    for (const item of RA_LIBRARY) {
      c[item.category] = (c[item.category] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <div className="space-y-5">
      {/* Filter rail */}
      <div className="border rounded-lg p-4 bg-card space-y-4">
        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${RA_LIBRARY.length} pre-built risk assessments...`}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label={`All (${counts.all || 0})`}
            active={category === "all"}
            onClick={() => setCategory("all")}
          />
          {RA_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={`${c.icon} ${c.label} (${counts[c.id] || 0})`}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filtered.length} of {RA_LIBRARY.length}
        {category !== "all" &&
          ` · ${RA_CATEGORIES.find((c) => c.id === category)?.label}`}
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <LibraryRow
            key={item.id}
            item={item}
            expanded={expanded === item.id}
            onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="border-2 border-dashed rounded-md p-10 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">
              No matches. Try clearing filters or another search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LibraryRow({
  item,
  expanded,
  onToggle,
}: {
  item: RALibraryItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const initial = riskScore(item.initialL, item.initialS);
  const residual = riskScore(item.residualL, item.residualS);
  const cat = RA_CATEGORIES.find((c) => c.id === item.category);

  return (
    <div className="border rounded-md bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-3 hover:bg-muted/40 transition flex items-start gap-3"
      >
        <span className="text-muted-foreground mt-0.5">
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {cat && (
              <Badge variant="outline" className="text-[9px] uppercase shrink-0">
                {cat.icon} {cat.label}
              </Badge>
            )}
            <Badge variant="secondary" className="text-[9px] font-mono shrink-0">
              {item.id}
            </Badge>
          </div>
          <div className="text-sm font-medium truncate">{item.hazard}</div>
          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.whoAtRisk}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <RiskPill score={initial} prefix="I" />
          <RiskPill score={residual} prefix="R" />
        </div>
      </button>

      {expanded && (
        <div className="border-t p-4 space-y-4 bg-muted/20">
          <Field label="Hazard" value={item.hazard} />
          <Field label="Who's at risk" value={item.whoAtRisk} />
          <Field label="Consequences" value={item.consequences} />
          <Field label="Controls" value={item.controls} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Initial risk
              </div>
              <div className="text-xs space-y-0.5">
                <div>L: {LIKELIHOOD_LABELS[item.initialL]} ({item.initialL})</div>
                <div>S: {SEVERITY_LABELS[item.initialS]} ({item.initialS})</div>
              </div>
              <RiskBlock score={initial} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Residual risk (after controls)
              </div>
              <div className="text-xs space-y-0.5">
                <div>L: {LIKELIHOOD_LABELS[item.residualL]} ({item.residualL})</div>
                <div>S: {SEVERITY_LABELS[item.residualS]} ({item.residualS})</div>
              </div>
              <RiskBlock score={residual} />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button size="sm">
              <Copy className="size-3.5 mr-1.5" />
              Use in builder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Hazard: ${item.hazard}\nWho's at risk: ${item.whoAtRisk}\nConsequences: ${item.consequences}\nControls: ${item.controls}\nInitial risk: ${initial.score} (${initial.level})\nResidual risk: ${residual.score} (${residual.level})`
                );
              }}
            >
              <Copy className="size-3.5 mr-1.5" />
              Copy as text
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-sm leading-relaxed">{value}</div>
    </div>
  );
}

function RiskPill({
  score,
  prefix,
}: {
  score: { score: number; level: string; color: string };
  prefix: string;
}) {
  return (
    <div
      className="text-[10px] font-mono font-semibold text-white px-1.5 py-0.5 rounded"
      style={{ background: score.color }}
      title={`${prefix === "I" ? "Initial" : "Residual"} — ${score.level}`}
    >
      {prefix}:{score.score}
    </div>
  );
}

function RiskBlock({
  score,
}: {
  score: { score: number; level: string; color: string };
}) {
  return (
    <div
      className="mt-1.5 inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs text-white font-semibold"
      style={{ background: score.color }}
    >
      <span>{score.score}</span>
      <span className="opacity-90">{score.level}</span>
    </div>
  );
}

function FilterChip({
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
