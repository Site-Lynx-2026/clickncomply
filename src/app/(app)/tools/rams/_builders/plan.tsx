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
import { Download } from "lucide-react";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { AIFillButton } from "@/components/ai-fill-button";

export interface PlanSection {
  id: string;
  label: string;
  body: string;
}

export interface PlanForm {
  title: string;
  scope: string;
  preparedBy: string;
  preparedByRole: string;
  sections: PlanSection[];
}

export interface PlanBuilderProps {
  slug: string;
  defaultTitle: string;
  intro: string;
  /** Pre-filled section labels with optional default body text. */
  defaultSections: { label: string; body?: string }[];
}

function emptyForm(props: PlanBuilderProps): PlanForm {
  return {
    title: "",
    scope: "",
    preparedBy: "",
    preparedByRole: "",
    sections: props.defaultSections.map((s) => ({
      id: crypto.randomUUID(),
      label: s.label,
      body: s.body ?? "",
    })),
  };
}

/**
 * Generic Plan builder — used for PPE Schedule, First Aid Assessment,
 * Welfare Provision Plan, Emergency Action Plan. All share a "title +
 * scope + named text sections + sign-off" shape; the props inject the
 * sections.
 */
export function PlanBuilder(props: PlanBuilderProps) {
  const { form, update, saving, lastSaved, downloading, manualSave, downloadPdf } =
    useBuilderDocument<PlanForm>({
      builderSlug: props.slug,
      emptyForm: () => emptyForm(props),
      titleFromForm: (f) => f.title || props.defaultTitle,
    });

  function set<K extends keyof PlanForm>(key: K, value: PlanForm[K]) {
    update({ [key]: value } as Partial<PlanForm>);
  }

  function setSection(id: string, body: string) {
    update({
      sections: form.sections.map((s) => (s.id === id ? { ...s, body } : s)),
    });
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
          <CardTitle className="text-base">Document details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
            />
          </div>
          <div>
            <Label htmlFor="scope">Scope</Label>
            <Textarea
              id="scope"
              value={form.scope}
              onChange={(e) => set("scope", e.target.value)}
              rows={3}
              placeholder="What this plan covers — site, project, duration"
            />
          </div>
        </CardContent>
      </Card>

      {form.sections.map((sec, i) => (
        <Card key={sec.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-3">
              <span className="size-6 rounded-md bg-foreground text-background text-xs font-bold inline-flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              {sec.label}
            </CardTitle>
            <AIFillButton
              kind="plan-section"
              context={{
                documentType: props.defaultTitle,
                sectionLabel: sec.label,
                scope: form.scope,
              }}
              onFill={(text) => setSection(sec.id, text)}
              hint={sec.body.trim() ? "Re-draft" : "Draft this section"}
              variant="button"
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={sec.body}
              onChange={(e) => setSection(sec.id, e.target.value)}
              rows={5}
              placeholder={`Detail for ${sec.label.toLowerCase()} — or tap the sparkle for an AI draft.`}
            />
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prepared by</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="preparedBy">Name</Label>
            <Input
              id="preparedBy"
              value={form.preparedBy}
              onChange={(e) => set("preparedBy", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preparedByRole">Role</Label>
            <Input
              id="preparedByRole"
              value={form.preparedByRole}
              onChange={(e) => set("preparedByRole", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
