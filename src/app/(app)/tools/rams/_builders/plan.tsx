"use client";

import { useEffect, useMemo, useRef } from "react";
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
  FileText,
  UserCircle,
  ListChecks,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { useIntakePrefill } from "../_components/use-intake-prefill";
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
 * Plan builder — feels like a chaptered policy document.
 *
 * Headline banner, preparer strip, contents-style sticky TOC sidebar,
 * sections rendered as numbered chapters with completion indicators
 * (filled = done, hollow = empty). AI-fill on every section.
 *
 * Used for PPE Schedule, First Aid Assessment, Welfare Provision Plan,
 * Emergency Action Plan.
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

  // Dashboard intake → patch empty title + scope.
  const intakePrefill = useIntakePrefill();
  const intakeAppliedRef = useRef(false);
  useEffect(() => {
    if (!intakePrefill || intakeAppliedRef.current) return;
    intakeAppliedRef.current = true;
    const patch: Partial<PlanForm> = {};
    if (!form.title.trim() && intakePrefill.title) patch.title = intakePrefill.title;
    if (!form.scope.trim() && intakePrefill.scope) patch.scope = intakePrefill.scope;
    if (Object.keys(patch).length > 0) update(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakePrefill, update]);

  const counts = useMemo(() => {
    const total = form.sections.length;
    const done = form.sections.filter((s) => s.body.trim().length > 0).length;
    return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  }, [form.sections]);

  const preparerReady = !!form.preparedBy.trim();

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
            {downloading ? "Generating…" : "Download plan"}
          </Button>
        </div>
      </div>

      {/* Headline banner */}
      <PlanHeadline
        title={form.title || props.defaultTitle}
        intro={props.intro}
        counts={counts}
      />

      {/* Preparer strip */}
      <PreparerStrip
        preparer={form.preparedBy}
        onPreparer={(v) => set("preparedBy", v)}
        role={form.preparedByRole}
        onRole={(v) => set("preparedByRole", v)}
        ready={preparerReady}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        {/* Contents — sticky TOC on the left */}
        <ContentsSidebar sections={form.sections} />

        {/* Document body */}
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="size-4 text-muted-foreground" />
                Document details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs">
                  Title
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={props.defaultTitle}
                  className="font-medium"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="scope" className="text-xs">
                    Scope
                  </Label>
                  <AIFillButton
                    kind="scope"
                    context={{
                      documentType: props.defaultTitle,
                      title: form.title,
                    }}
                    onFill={(text) => set("scope", text)}
                    hint="Draft scope"
                    variant="icon"
                    disabled={!form.title.trim()}
                  />
                </div>
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
            <SectionCard
              key={sec.id}
              index={i + 1}
              section={sec}
              onChange={(body) => setSection(sec.id, body)}
              context={{
                documentType: props.defaultTitle,
                sectionLabel: sec.label,
                scope: form.scope,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function PlanHeadline({
  title,
  intro,
  counts,
}: {
  title: string;
  intro: string;
  counts: { total: number; done: number; pct: number };
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-foreground" aria-hidden />
      <div className="px-7 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2 flex items-center gap-2">
            <FileText className="size-3" />
            Plan document
          </div>
          <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground leading-tight mb-3">
            {title}
          </h2>
          <p className="hidden md:block text-xs text-muted-foreground max-w-xl leading-relaxed">
            {intro}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
            Sections completed
          </div>
          <div className="font-display font-bold text-2xl tabular-nums leading-none">
            {counts.done}{" "}
            <span className="text-muted-foreground">/ {counts.total}</span>
          </div>
          <div className="w-32 h-1.5 rounded-full surface-pebble overflow-hidden">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${counts.pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreparerStrip({
  preparer,
  onPreparer,
  role,
  onRole,
  ready,
}: {
  preparer: string;
  onPreparer: (v: string) => void;
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
            Prepared by
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
            value={preparer}
            onChange={(e) => onPreparer(e.target.value)}
            placeholder="Full name"
            className="font-medium"
          />
        </div>
        <div>
          <Label className="text-xs">Role</Label>
          <Input
            value={role}
            onChange={(e) => onRole(e.target.value)}
            placeholder="e.g. Site Manager, H&S Advisor"
          />
        </div>
      </div>
    </div>
  );
}

function ContentsSidebar({ sections }: { sections: PlanSection[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-4 space-y-1.5">
        <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold mb-2 flex items-center gap-2 px-2">
          <ListChecks className="size-3" />
          Contents
        </div>
        <nav className="space-y-0.5">
          {sections.map((sec, i) => {
            const filled = sec.body.trim().length > 0;
            return (
              <a
                key={sec.id}
                href={`#section-${sec.id}`}
                className={cn(
                  "flex items-start gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                  filled
                    ? "text-foreground hover:bg-brand-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {filled ? (
                  <CheckCircle2
                    className="size-3.5 shrink-0 text-[var(--status-success)] mt-0.5"
                    strokeWidth={2}
                  />
                ) : (
                  <Circle
                    className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5"
                    strokeWidth={2}
                  />
                )}
                <span className="flex-1 truncate">
                  <span className="font-mono text-muted-foreground tabular-nums mr-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {sec.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function SectionCard({
  index,
  section,
  onChange,
  context,
}: {
  index: number;
  section: PlanSection;
  onChange: (body: string) => void;
  context: Record<string, unknown>;
}) {
  const filled = section.body.trim().length > 0;
  return (
    <Card
      id={`section-${section.id}`}
      className={cn(
        "scroll-mt-4 transition-colors",
        filled && "border-soft"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3 text-sm">
          <span
            className={cn(
              "size-7 rounded-md text-xs font-bold inline-flex items-center justify-center tabular-nums border",
              filled
                ? "bg-foreground text-background border-foreground"
                : "surface-pebble text-muted-foreground border-soft"
            )}
          >
            {String(index).padStart(2, "0")}
          </span>
          <span className="flex-1">{section.label}</span>
          {filled && (
            <CheckCircle2
              className="size-4 text-[var(--status-success)]"
              strokeWidth={2}
            />
          )}
        </CardTitle>
        <AIFillButton
          kind="plan-section"
          context={context}
          onFill={onChange}
          hint={filled ? "Re-draft" : "Draft this section"}
          variant="button"
        />
      </CardHeader>
      <CardContent>
        <Textarea
          value={section.body}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder={`Detail for ${section.label.toLowerCase()} — or tap the sparkle for an AI draft.`}
        />
      </CardContent>
    </Card>
  );
}
