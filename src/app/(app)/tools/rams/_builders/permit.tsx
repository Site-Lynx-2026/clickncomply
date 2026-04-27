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

export interface PermitForm {
  title: string;
  workDescription: string;
  location: string;
  validFrom: string;
  validTo: string;
  issuedBy: string;
  issuedByRole: string;
  holder: string;
  holderCompany: string;
  conditions: string;
  precautions: string;
  isolations: string;
}

export interface PermitBuilderProps {
  slug: string;
  defaultTitle: string;
  /** Permit-specific copy shown in the section help text. */
  intro: string;
  /** Pre-filled precautions block (e.g. fire-watch durations for hot works). */
  defaultPrecautions?: string;
}

function emptyForm(props: PermitBuilderProps): PermitForm {
  return {
    title: "",
    workDescription: "",
    location: "",
    validFrom: "",
    validTo: "",
    issuedBy: "",
    issuedByRole: "",
    holder: "",
    holderCompany: "",
    conditions: "",
    precautions: props.defaultPrecautions ?? "",
    isolations: "",
  };
}

/**
 * Generic Permit-to-Work builder. Same form shape across every permit type;
 * the props inject the slug, default title, intro copy, and any sensible
 * pre-filled precautions text per permit class (Hot Works, Dig, etc.).
 */
export function PermitBuilder(props: PermitBuilderProps) {
  const { form, update, saving, lastSaved, downloading, manualSave, downloadPdf } =
    useBuilderDocument<PermitForm>({
      builderSlug: props.slug,
      emptyForm: () => emptyForm(props),
      titleFromForm: (f) => f.title || props.defaultTitle,
    });

  function set<K extends keyof PermitForm>(key: K, value: PermitForm[K]) {
    update({ [key]: value } as Partial<PermitForm>);
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
          <CardTitle className="text-base">Permit details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Permit title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
            />
          </div>
          <div>
            <Label htmlFor="workDescription">Description of work</Label>
            <Textarea
              id="workDescription"
              value={form.workDescription}
              onChange={(e) => set("workDescription", e.target.value)}
              rows={3}
              placeholder="What is being done, with what equipment, by whom"
            />
          </div>
          <div>
            <Label htmlFor="location">Exact location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Block C, Level 3, plant room"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="validFrom">Valid from</Label>
              <Input
                id="validFrom"
                type="datetime-local"
                value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="validTo">Valid to</Label>
              <Input
                id="validTo"
                type="datetime-local"
                value={form.validTo}
                onChange={(e) => set("validTo", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls & precautions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="precautions">Precautions required</Label>
            <Textarea
              id="precautions"
              value={form.precautions}
              onChange={(e) => set("precautions", e.target.value)}
              rows={4}
              placeholder="What must be in place before work starts"
            />
          </div>
          <div>
            <Label htmlFor="isolations">Isolations / lock-outs</Label>
            <Textarea
              id="isolations"
              value={form.isolations}
              onChange={(e) => set("isolations", e.target.value)}
              rows={3}
              placeholder="Power, gas, water, services isolated"
            />
          </div>
          <div>
            <Label htmlFor="conditions">Additional conditions</Label>
            <Textarea
              id="conditions"
              value={form.conditions}
              onChange={(e) => set("conditions", e.target.value)}
              rows={3}
              placeholder="Site-specific conditions for this permit"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Issue & holder</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="issuedBy">Issued by (name)</Label>
            <Input
              id="issuedBy"
              value={form.issuedBy}
              onChange={(e) => set("issuedBy", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="issuedByRole">Issuer role</Label>
            <Input
              id="issuedByRole"
              value={form.issuedByRole}
              onChange={(e) => set("issuedByRole", e.target.value)}
              placeholder="e.g. Site Manager"
            />
          </div>
          <div>
            <Label htmlFor="holder">Permit holder (name)</Label>
            <Input
              id="holder"
              value={form.holder}
              onChange={(e) => set("holder", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="holderCompany">Holder&apos;s company</Label>
            <Input
              id="holderCompany"
              value={form.holderCompany}
              onChange={(e) => set("holderCompany", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
