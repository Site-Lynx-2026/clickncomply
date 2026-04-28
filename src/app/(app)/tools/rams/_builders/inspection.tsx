"use client";

import { useMemo } from "react";
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
import {
  Download,
  Plus,
  Trash2,
  ClipboardCheck,
  CalendarClock,
  UserCircle,
  CheckCircle2,
  XCircle,
  CircleSlash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";

export type InspectionStatus = "pass" | "fail" | "na";

export interface InspectionItem {
  id: string;
  text: string;
  status: InspectionStatus;
  note: string;
}

export interface InspectionForm {
  title: string;
  itemRef: string;
  inspectionDate: string;
  inspector: string;
  inspectorRole: string;
  items: InspectionItem[];
  overallResult: "pass" | "fail" | "";
  comments: string;
  nextDue: string;
}

export interface InspectionBuilderProps {
  slug: string;
  defaultTitle: string;
  intro: string;
  defaultItems: string[];
}

function emptyForm(props: InspectionBuilderProps): InspectionForm {
  return {
    title: "",
    itemRef: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspector: "",
    inspectorRole: "",
    items: props.defaultItems.map((text) => ({
      id: crypto.randomUUID(),
      text,
      status: "pass" as InspectionStatus,
      note: "",
    })),
    overallResult: "",
    comments: "",
    nextDue: "",
  };
}

/**
 * Inspection — feels like a real pre-use checklist. Live pass/fail count
 * banner, inspection-cert-style header, ref + dates as chips, failed
 * items get red gutter, big stamp at the bottom for the overall result.
 */
export function InspectionBuilder(props: InspectionBuilderProps) {
  const { form, update, saving, lastSaved, downloading, manualSave, downloadPdf } =
    useBuilderDocument<InspectionForm>({
      builderSlug: props.slug,
      emptyForm: () => emptyForm(props),
      titleFromForm: (f) => f.title || props.defaultTitle,
    });

  function set<K extends keyof InspectionForm>(key: K, value: InspectionForm[K]) {
    update({ [key]: value } as Partial<InspectionForm>);
  }

  function setItem(id: string, patch: Partial<InspectionItem>) {
    update({
      items: form.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }

  function addItem() {
    update({
      items: [
        ...form.items,
        { id: crypto.randomUUID(), text: "", status: "pass", note: "" },
      ],
    });
  }

  function removeItem(id: string) {
    update({ items: form.items.filter((it) => it.id !== id) });
  }

  const counts = useMemo(() => {
    let pass = 0;
    let fail = 0;
    let na = 0;
    for (const it of form.items) {
      if (!it.text.trim()) continue;
      if (it.status === "pass") pass++;
      else if (it.status === "fail") fail++;
      else if (it.status === "na") na++;
    }
    return { pass, fail, na, total: pass + fail + na };
  }, [form.items]);

  const inspectorReady = !!form.inspector.trim();

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={manualSave} disabled={saving}>
            Save
          </Button>
          <Button size="sm" onClick={downloadPdf} disabled={downloading}>
            <Download className="size-3.5 mr-1.5" />
            {downloading ? "Generating…" : "Download report"}
          </Button>
        </div>
      </div>

      {/* Inspection-cert header */}
      <InspectionHeader
        title={form.title || props.defaultTitle}
        ref={form.itemRef}
        date={form.inspectionDate}
        nextDue={form.nextDue}
      />

      {/* Live status banner — pass/fail/na count */}
      <CountBanner counts={counts} />

      {/* Inspector card */}
      <InspectorStrip
        inspector={form.inspector}
        onInspector={(v) => set("inspector", v)}
        role={form.inspectorRole}
        onRole={(v) => set("inspectorRole", v)}
        ready={inspectorReady}
      />

      {/* Subject of inspection — ref + dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardCheck className="size-4 text-muted-foreground" />
            Item being inspected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-xs">
              Inspection title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
              className="font-medium"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="itemRef" className="text-xs">
                Item ref / serial
              </Label>
              <Input
                id="itemRef"
                value={form.itemRef}
                onChange={(e) => set("itemRef", e.target.value)}
                placeholder="Plant serial, asset tag"
              />
            </div>
            <div>
              <Label htmlFor="inspectionDate" className="text-xs">
                Inspection date
              </Label>
              <Input
                id="inspectionDate"
                type="date"
                value={form.inspectionDate}
                onChange={(e) => set("inspectionDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nextDue" className="text-xs">
                Next due
              </Label>
              <Input
                id="nextDue"
                type="date"
                value={form.nextDue}
                onChange={(e) => set("nextDue", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ClipboardCheck className="size-4 text-muted-foreground" />
              Checklist
              {counts.total > 0 && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono ml-1">
                  {counts.total}
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Tick each item. Fail items get a note for the defect register.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-3.5 mr-1.5" />
            Add check
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-soft surface-pebble px-5 py-8 text-center">
              <p className="text-sm font-medium mb-1">
                No checklist items yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Add items to inspect against.
              </p>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="size-3.5 mr-1.5" />
                Add first item
              </Button>
            </div>
          ) : (
            form.items.map((it, i) => (
              <ChecklistRow
                key={it.id}
                index={i + 1}
                item={it}
                onText={(text) => setItem(it.id, { text })}
                onStatus={(status) => setItem(it.id, { status })}
                onNote={(note) => setItem(it.id, { note })}
                onRemove={() => removeItem(it.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Outcome — the stamp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            Overall result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResultStamp
            value={form.overallResult}
            onChange={(v) => set("overallResult", v)}
          />
          <div>
            <Label htmlFor="comments" className="text-xs">
              Comments
            </Label>
            <Textarea
              id="comments"
              value={form.comments}
              onChange={(e) => set("comments", e.target.value)}
              rows={3}
              placeholder="Defects observed, actions required, follow-up details"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function InspectionHeader({
  title,
  ref,
  date,
  nextDue,
}: {
  title: string;
  ref: string;
  date: string;
  nextDue: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool">
      {/* Subtle stripe pattern — inspection cert vibe */}
      <div className="absolute inset-x-0 top-0 h-1 bg-foreground" aria-hidden />
      <div className="px-7 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2 flex items-center gap-2">
            <ClipboardCheck className="size-3" />
            Inspection report
          </div>
          <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground leading-tight mb-3">
            {title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {ref && <Chip>REF · {ref}</Chip>}
            {date && (
              <Chip icon={<CalendarClock className="size-3" />}>
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Chip>
            )}
            {nextDue && (
              <Chip icon={<CalendarClock className="size-3" />}>
                Next due{" "}
                {new Date(nextDue).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Chip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CountBanner({
  counts,
}: {
  counts: { pass: number; fail: number; na: number; total: number };
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <CountTile
        label="Pass"
        value={counts.pass}
        tone="success"
        Icon={CheckCircle2}
      />
      <CountTile
        label="Fail"
        value={counts.fail}
        tone="danger"
        Icon={XCircle}
      />
      <CountTile
        label="N/A"
        value={counts.na}
        tone="muted"
        Icon={CircleSlash}
      />
    </div>
  );
}

function CountTile({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "muted";
  Icon: typeof CheckCircle2;
}) {
  const config = {
    success: {
      tile: "status-success border-[var(--status-success)]/30",
      icon: "text-[var(--status-success)]",
      stripe: "bg-[var(--status-success)]",
    },
    danger: {
      tile: "status-danger border-[var(--status-danger)]/30",
      icon: "text-[var(--status-danger)]",
      stripe: "bg-[var(--status-danger)]",
    },
    muted: {
      tile: "surface-pebble border-soft text-muted-foreground",
      icon: "text-muted-foreground",
      stripe: "bg-muted-foreground/40",
    },
  } as const;
  const c = config[tone];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border px-4 py-4 flex items-center gap-3",
        c.tile
      )}
    >
      <div
        className={cn("absolute top-0 bottom-0 left-0 w-1", c.stripe)}
        aria-hidden
      />
      <Icon className={cn("size-5 shrink-0", c.icon)} strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold opacity-90">
          {label}
        </div>
        <div className="font-display font-bold text-2xl tabular-nums leading-none mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

function InspectorStrip({
  inspector,
  onInspector,
  role,
  onRole,
  ready,
}: {
  inspector: string;
  onInspector: (v: string) => void;
  role: string;
  onRole: (v: string) => void;
  ready: boolean;
}) {
  return (
    <div className="rounded-xl surface-raised border border-soft shadow-sm-cool overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-soft surface-pebble">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-md bg-foreground text-background flex items-center justify-center">
            <UserCircle className="size-3.5" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
            Inspected by
          </span>
        </div>
        {ready ? (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full status-success font-bold">
            ● Signed
          </span>
        ) : (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full surface-pebble border border-soft text-muted-foreground font-semibold">
            Unsigned
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={inspector}
            onChange={(e) => onInspector(e.target.value)}
            placeholder="Full name"
            className="font-medium"
          />
        </div>
        <div>
          <Label className="text-xs">Role</Label>
          <Input
            value={role}
            onChange={(e) => onRole(e.target.value)}
            placeholder="e.g. Competent person, Site Engineer"
          />
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({
  index,
  item,
  onText,
  onStatus,
  onNote,
  onRemove,
}: {
  index: number;
  item: InspectionItem;
  onText: (v: string) => void;
  onStatus: (v: InspectionStatus) => void;
  onNote: (v: string) => void;
  onRemove: () => void;
}) {
  const failed = item.status === "fail";
  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 rounded-lg border surface-raised p-3 transition-colors",
        failed
          ? "border-[var(--status-danger)]/40 ring-1 ring-[var(--status-danger)]/15"
          : "border-soft hover:border-strong"
      )}
    >
      {failed && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-[var(--status-danger)]"
          aria-hidden
        />
      )}
      <span className="size-6 rounded surface-pebble border border-soft flex items-center justify-center text-xs font-bold text-muted-foreground mt-1 shrink-0 tabular-nums">
        {index}
      </span>
      <div className="flex-1 space-y-2 min-w-0">
        <Input
          value={item.text}
          onChange={(e) => onText(e.target.value)}
          placeholder="Check item"
          className="font-medium"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusToggle
            label="Pass"
            active={item.status === "pass"}
            tone="success"
            onClick={() => onStatus("pass")}
          />
          <StatusToggle
            label="Fail"
            active={item.status === "fail"}
            tone="danger"
            onClick={() => onStatus("fail")}
          />
          <StatusToggle
            label="N/A"
            active={item.status === "na"}
            tone="muted"
            onClick={() => onStatus("na")}
          />
          {failed && (
            <Input
              value={item.note}
              onChange={(e) => onNote(e.target.value)}
              placeholder="Defect / action required"
              className="ml-2 flex-1 min-w-[200px]"
            />
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function ResultStamp({
  value,
  onChange,
}: {
  value: "pass" | "fail" | "";
  onChange: (v: "pass" | "fail") => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange("pass")}
        className={cn(
          "flex-1 rounded-xl border-2 px-5 py-4 text-left transition-all",
          value === "pass"
            ? "border-[var(--status-success)] surface-raised shadow-sm-cool"
            : "border-soft surface-pebble hover:border-strong"
        )}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            className={cn(
              "size-6",
              value === "pass"
                ? "text-[var(--status-success)]"
                : "text-muted-foreground"
            )}
            strokeWidth={2}
          />
          <div>
            <div className="font-display font-bold uppercase tracking-tight text-base">
              Pass
            </div>
            <div className="text-[11px] text-muted-foreground">
              Equipment safe to use
            </div>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onChange("fail")}
        className={cn(
          "flex-1 rounded-xl border-2 px-5 py-4 text-left transition-all",
          value === "fail"
            ? "border-[var(--status-danger)] surface-raised shadow-sm-cool"
            : "border-soft surface-pebble hover:border-strong"
        )}
      >
        <div className="flex items-center gap-3">
          <XCircle
            className={cn(
              "size-6",
              value === "fail"
                ? "text-[var(--status-danger)]"
                : "text-muted-foreground"
            )}
            strokeWidth={2}
          />
          <div>
            <div className="font-display font-bold uppercase tracking-tight text-base">
              Fail
            </div>
            <div className="text-[11px] text-muted-foreground">
              Quarantine — defect noted
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function StatusToggle({
  label,
  active,
  tone,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: "success" | "danger" | "muted";
  onClick: () => void;
}) {
  const activeClass: Record<typeof tone, string> = {
    success:
      "bg-[var(--status-success)] text-white border-[var(--status-success)]",
    danger:
      "bg-[var(--status-danger)] text-white border-[var(--status-danger)]",
    muted: "bg-foreground text-background border-foreground",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition",
        active
          ? activeClass[tone]
          : "surface-pebble text-muted-foreground border-soft hover:border-strong"
      )}
    >
      {label}
    </button>
  );
}

function Chip({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-pebble border border-soft text-xs font-medium text-muted-foreground tabular-nums">
      {icon}
      {children}
    </span>
  );
}
