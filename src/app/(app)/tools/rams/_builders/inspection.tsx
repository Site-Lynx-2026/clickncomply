"use client";

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
import { Download, Plus, Trash2 } from "lucide-react";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { cn } from "@/lib/utils";

export type InspectionStatus = "pass" | "fail" | "na";

export interface InspectionItem {
  id: string;
  text: string;
  status: InspectionStatus;
  note: string;
}

export interface InspectionForm {
  title: string;
  itemRef: string; // e.g. plant serial, lifting accessory tag, equipment ID
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
  /** Pre-filled inspection items (the checklist). */
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
 * Generic Inspection builder — used for PUWER pre-use checks, LOLER
 * inspections, Plant pre-start. Same pass/fail/N/A checklist shape, the
 * config injects the default checklist items per inspection class.
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={manualSave} disabled={saving}>
            Save
          </Button>
          <Button size="sm" onClick={downloadPdf} disabled={downloading}>
            <Download className="size-3.5 mr-1.5" />
            {downloading ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{props.intro}</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Item being inspected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Inspection title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="itemRef">Item ref / serial</Label>
              <Input
                id="itemRef"
                value={form.itemRef}
                onChange={(e) => set("itemRef", e.target.value)}
                placeholder="Plant serial, asset tag, etc."
              />
            </div>
            <div>
              <Label htmlFor="inspectionDate">Inspection date</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={form.inspectionDate}
                onChange={(e) => set("inspectionDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Checklist</CardTitle>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-3.5 mr-1.5" />
            Add check
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.items.map((it, i) => (
            <div
              key={it.id}
              className="flex items-start gap-2 p-2 rounded-md border border-soft surface-raised"
            >
              <span className="text-xs text-muted-foreground tabular-nums pt-2.5 w-5 shrink-0">
                {i + 1}.
              </span>
              <div className="flex-1 space-y-1.5">
                <Input
                  value={it.text}
                  onChange={(e) => setItem(it.id, { text: e.target.value })}
                  placeholder="Check item"
                />
                <div className="flex items-center gap-1.5">
                  <StatusToggle
                    label="Pass"
                    active={it.status === "pass"}
                    tone="success"
                    onClick={() => setItem(it.id, { status: "pass" })}
                  />
                  <StatusToggle
                    label="Fail"
                    active={it.status === "fail"}
                    tone="danger"
                    onClick={() => setItem(it.id, { status: "fail" })}
                  />
                  <StatusToggle
                    label="N/A"
                    active={it.status === "na"}
                    tone="muted"
                    onClick={() => setItem(it.id, { status: "na" })}
                  />
                  {it.status === "fail" && (
                    <Input
                      value={it.note}
                      onChange={(e) => setItem(it.id, { note: e.target.value })}
                      placeholder="Note (defect, action required)"
                      className="ml-2 flex-1 h-8 text-xs"
                    />
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(it.id)}
                className="shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label className="w-24">Overall result</Label>
            <StatusToggle
              label="Pass"
              active={form.overallResult === "pass"}
              tone="success"
              onClick={() => set("overallResult", "pass")}
            />
            <StatusToggle
              label="Fail"
              active={form.overallResult === "fail"}
              tone="danger"
              onClick={() => set("overallResult", "fail")}
            />
          </div>
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={form.comments}
              onChange={(e) => set("comments", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="inspector">Inspector</Label>
              <Input
                id="inspector"
                value={form.inspector}
                onChange={(e) => set("inspector", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nextDue">Next inspection due</Label>
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
    success: "bg-[var(--status-success)] text-white border-[var(--status-success)]",
    danger: "bg-[var(--status-danger)] text-white border-[var(--status-danger)]",
    muted: "bg-foreground text-background border-foreground",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition",
        active ? activeClass[tone] : "surface-pebble text-muted-foreground border-soft hover:border-strong"
      )}
    >
      {label}
    </button>
  );
}
