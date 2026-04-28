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
import {
  Download,
  Plus,
  Trash2,
  Megaphone,
  Users,
  Clock,
  HelpCircle,
  GripVertical,
  ListChecks,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useBuilderDocument } from "../_components/use-builder-document";
import { useIntakePrefill } from "../_components/use-intake-prefill";
import { SendButton } from "../_components/send-button";
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
 * Briefing — feels like a talk-script. Topic banner at top, presenter card
 * inline with audience pills, key points as a numbered talking-points list
 * (the meat of any briefing), questions and intro relegated to secondary.
 *
 * Same form shape across Site Induction / DAB / Pre-task. Default points
 * pre-fill from the slug-specific dispatcher.
 */
export function BriefingBuilder(props: BriefingBuilderProps) {
  const { form, update, saving, lastSaved, downloading, manualSave, downloadPdf, docId } =
    useBuilderDocument<BriefingForm>({
      builderSlug: props.slug,
      emptyForm: () => emptyForm(props),
      titleFromForm: (f) => f.title || props.defaultTitle,
    });

  function set<K extends keyof BriefingForm>(key: K, value: BriefingForm[K]) {
    update({ [key]: value } as Partial<BriefingForm>);
  }

  // Dashboard intake → patch empty title + introduction.
  const intakePrefill = useIntakePrefill();
  const intakeAppliedRef = useRef(false);
  useEffect(() => {
    if (!intakePrefill || intakeAppliedRef.current) return;
    intakeAppliedRef.current = true;
    const patch: Partial<BriefingForm> = {};
    if (!form.title.trim() && intakePrefill.title) patch.title = intakePrefill.title;
    if (!form.introduction.trim() && intakePrefill.scope)
      patch.introduction = intakePrefill.scope;
    if (Object.keys(patch).length > 0) update(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakePrefill, update]);

  function addPoint() {
    update({
      keyPoints: [...form.keyPoints, { id: crypto.randomUUID(), text: "" }],
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

  const presenterReady = !!form.presenter.trim();
  const pointCount = form.keyPoints.filter((p) => p.text.trim()).length;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={manualSave} disabled={saving}>
            Save
          </Button>
          <SendButton docId={docId} docTypeLabel={props.defaultTitle || "Briefing"} />
          <Button size="sm" onClick={downloadPdf} disabled={downloading}>
            <Download className="size-3.5 mr-1.5" />
            {downloading ? "Generating…" : "Download briefing"}
          </Button>
        </div>
      </div>

      {/* Topic banner — speaker card meets briefing brief */}
      <BriefingHeadline
        title={form.title || props.defaultTitle}
        audience={form.audience}
        duration={form.duration}
        pointCount={pointCount}
      />

      {/* Presenter card — front-loaded */}
      <PresenterStrip
        presenter={form.presenter}
        onPresenter={(v) => set("presenter", v)}
        role={form.presenterRole}
        onRole={(v) => set("presenterRole", v)}
        ready={presenterReady}
      />

      {/* Briefing meta — title / audience / duration / intro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Megaphone className="size-4 text-muted-foreground" />
            Topic & audience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-xs">
              Briefing title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
              className="font-medium"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="audience" className="text-xs">
                Audience
              </Label>
              <Input
                id="audience"
                value={form.audience}
                onChange={(e) => set("audience", e.target.value)}
                placeholder="e.g. M&E first-fix crew"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-xs">
                Duration
              </Label>
              <Input
                id="duration"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 10 mins"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="introduction" className="text-xs">
              Why this briefing (intro)
            </Label>
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

      {/* Key points — talking script */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ListChecks className="size-4 text-muted-foreground" />
              Talking points
              {pointCount > 0 && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono ml-1">
                  {pointCount}
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              The meat of the briefing — what you actually say. Aim for 3–7
              focused points.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
            <div className="rounded-lg border border-dashed border-soft surface-pebble px-5 py-8 text-center">
              <p className="text-sm font-medium mb-1">No talking points yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Add 3–7 focused points. Use the AI button to suggest one.
              </p>
              <Button variant="outline" size="sm" onClick={addPoint}>
                <Plus className="size-3.5 mr-1.5" />
                Add first point
              </Button>
            </div>
          ) : (
            form.keyPoints.map((p, i) => (
              <PointRow
                key={p.id}
                index={i + 1}
                value={p.text}
                onChange={(text) => updatePoint(p.id, text)}
                onRemove={() => removePoint(p.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Q&A (secondary) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <HelpCircle className="size-4 text-muted-foreground" />
            Questions raised
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.questions}
            onChange={(e) => set("questions", e.target.value)}
            rows={3}
            placeholder="Any questions raised by attendees + answers given. (You can fill this in after the briefing.)"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function BriefingHeadline({
  title,
  audience,
  duration,
  pointCount,
}: {
  title: string;
  audience: string;
  duration: string;
  pointCount: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool">
      {/* Brand accent stripe — left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" aria-hidden />
      {/* Subtle brand halo */}
      <div
        className="absolute -top-16 -left-16 size-48 rounded-full pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle, var(--brand-soft-bg) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative px-7 py-6">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2 flex items-center gap-2">
          <Megaphone className="size-3" />
          Today&apos;s briefing
        </div>
        <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground leading-tight mb-3">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Chip icon={<Users className="size-3" />}>{audience}</Chip>
          <Chip icon={<Clock className="size-3" />}>{duration}</Chip>
          <Chip icon={<ListChecks className="size-3" />}>
            {pointCount} {pointCount === 1 ? "point" : "points"}
          </Chip>
        </div>
      </div>
    </div>
  );
}

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full surface-pebble border border-soft text-xs font-medium text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}

function PresenterStrip({
  presenter,
  onPresenter,
  role,
  onRole,
  ready,
}: {
  presenter: string;
  onPresenter: (v: string) => void;
  role: string;
  onRole: (v: string) => void;
  ready: boolean;
}) {
  return (
    <div className="rounded-xl surface-raised border border-soft shadow-sm-cool overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-soft surface-pebble">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-md bg-foreground text-background flex items-center justify-center">
            <Megaphone className="size-3.5" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
            Delivered by
          </span>
        </div>
        {ready ? (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full status-success font-bold">
            ● Ready
          </span>
        ) : (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full surface-pebble border border-soft text-muted-foreground font-semibold">
            No presenter
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={presenter}
            onChange={(e) => onPresenter(e.target.value)}
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

function PointRow({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="group flex items-start gap-2 rounded-lg border border-soft surface-raised hover:border-strong transition-colors p-2">
      {/* Drag handle (decorative for now) */}
      <button
        className="text-muted-foreground/40 group-hover:text-muted-foreground mt-2 cursor-grab"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-3.5" />
      </button>
      {/* Number badge */}
      <span className="size-6 rounded bg-foreground text-background flex items-center justify-center text-xs font-bold mt-1.5 shrink-0 tabular-nums">
        {index}
      </span>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={`Point ${index} — what you actually say`}
        className="flex-1 border-0 shadow-none focus-visible:ring-2 focus-visible:ring-brand/30 resize-none bg-transparent"
      />
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
