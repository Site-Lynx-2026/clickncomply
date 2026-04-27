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
import { AIFillButton } from "@/components/ai-fill-button";

export interface BriefingPoint {
  id: string;
  text: string;
}

export interface BriefingForm {
  title: string;
  audience: string;
  duration: string;
  introduction: string;
  keyPoints: BriefingPoint[];
  questions: string;
  presenter: string;
  presenterRole: string;
}

export interface BriefingBuilderProps {
  slug: string;
  defaultTitle: string;
  intro: string;
  /** Pre-filled key points to seed the briefing. */
  defaultPoints?: string[];
}

function emptyForm(props: BriefingBuilderProps): BriefingForm {
  return {
    title: "",
    audience: "All site operatives",
    duration: "10 mins",
    introduction: "",
    keyPoints: (props.defaultPoints ?? []).map((text) => ({
      id: crypto.randomUUID(),
      text,
    })),
    questions: "",
    presenter: "",
    presenterRole: "",
  };
}

/**
 * Generic Briefing builder — used for Site Induction, Daily Activity
 * Briefing, Pre-task Briefing. Same shape, different prefilled points.
 */
export function BriefingBuilder(props: BriefingBuilderProps) {
  const { form, update, saving, lastSaved, downloading, manualSave, downloadPdf } =
    useBuilderDocument<BriefingForm>({
      builderSlug: props.slug,
      emptyForm: () => emptyForm(props),
      titleFromForm: (f) => f.title || props.defaultTitle,
    });

  function set<K extends keyof BriefingForm>(key: K, value: BriefingForm[K]) {
    update({ [key]: value } as Partial<BriefingForm>);
  }

  function addPoint() {
    update({
      keyPoints: [
        ...form.keyPoints,
        { id: crypto.randomUUID(), text: "" },
      ],
    });
  }

  function updatePoint(id: string, text: string) {
    update({
      keyPoints: form.keyPoints.map((p) => (p.id === id ? { ...p, text } : p)),
    });
  }

  function removePoint(id: string) {
    update({ keyPoints: form.keyPoints.filter((p) => p.id !== id) });
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
          <CardTitle className="text-base">Briefing details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Briefing title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                value={form.audience}
                onChange={(e) => set("audience", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="introduction">Introduction</Label>
            <Textarea
              id="introduction"
              value={form.introduction}
              onChange={(e) => set("introduction", e.target.value)}
              rows={3}
              placeholder="Why this briefing — context, recent incidents, scope of work today"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Key points</CardTitle>
          <div className="flex items-center gap-2">
            <AIFillButton
              kind="briefing-point"
              context={{
                topic: form.title || props.defaultTitle,
                audience: form.audience,
                previousPoints: form.keyPoints
                  .map((p, i) => `${i + 1}. ${p.text}`)
                  .join("\n"),
              }}
              onFill={(text) =>
                update({
                  keyPoints: [
                    ...form.keyPoints,
                    { id: crypto.randomUUID(), text },
                  ],
                })
              }
              hint="AI suggest next"
              variant="button"
            />
            <Button variant="outline" size="sm" onClick={addPoint}>
              <Plus className="size-3.5 mr-1.5" />
              Add point
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {form.keyPoints.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No key points yet. Add at least 3-5.
            </p>
          ) : (
            form.keyPoints.map((p, i) => (
              <div key={p.id} className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground tabular-nums pt-2.5 w-5 shrink-0">
                  {i + 1}.
                </span>
                <Textarea
                  value={p.text}
                  onChange={(e) => updatePoint(p.id, e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePoint(p.id)}
                  className="shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions raised</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.questions}
            onChange={(e) => set("questions", e.target.value)}
            rows={3}
            placeholder="Any questions raised by attendees + answers given"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Delivered by</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="presenter">Name</Label>
            <Input
              id="presenter"
              value={form.presenter}
              onChange={(e) => set("presenter", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="presenterRole">Role</Label>
            <Input
              id="presenterRole"
              value={form.presenterRole}
              onChange={(e) => set("presenterRole", e.target.value)}
              placeholder="e.g. Site Manager"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
