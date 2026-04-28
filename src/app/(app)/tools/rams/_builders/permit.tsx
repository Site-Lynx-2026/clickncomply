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
  Clock,
  ShieldCheck,
  ShieldAlert,
  CalendarClock,
  UserCircle,
  HardHat,
  AlertTriangle,
  Lock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { useIntakePrefill } from "../_components/use-intake-prefill";
import { AIFillButton } from "@/components/ai-fill-button";

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
  intro: string;
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

type ValidityState = "draft" | "upcoming" | "live" | "expired";

interface ValidityInfo {
  state: ValidityState;
  /** Human caption for the banner. */
  caption: string;
  /** Tail-end caption — e.g. "expires in 4 hours". */
  detail: string;
  /** Countdown if active, distance if upcoming, time-since if expired. */
  ms: number;
}

function computeValidity(from: string, to: string): ValidityInfo {
  if (!from || !to) {
    return {
      state: "draft",
      caption: "Draft",
      detail: "Set the validity window to issue this permit",
      ms: 0,
    };
  }
  const now = Date.now();
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return {
      state: "draft",
      caption: "Draft",
      detail: "Validity dates are invalid",
      ms: 0,
    };
  }
  if (now < start) {
    return {
      state: "upcoming",
      caption: "Issued — not yet active",
      detail: `Active in ${formatDistance(start - now)}`,
      ms: start - now,
    };
  }
  if (now > end) {
    return {
      state: "expired",
      caption: "Expired",
      detail: `Expired ${formatDistance(now - end)} ago`,
      ms: now - end,
    };
  }
  return {
    state: "live",
    caption: "Live — work in progress",
    detail: `Expires in ${formatDistance(end - now)}`,
    ms: end - now,
  };
}

function formatDistance(ms: number): string {
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (ms < min) return "less than a minute";
  if (ms < hr) return `${Math.round(ms / min)} min`;
  if (ms < day) return `${Math.round(ms / hr)} hr`;
  return `${Math.round(ms / day)} day${Math.round(ms / day) === 1 ? "" : "s"}`;
}

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

  // Dashboard intake → patch empty title + work description.
  const intakePrefill = useIntakePrefill();
  const intakeAppliedRef = useRef(false);
  useEffect(() => {
    if (!intakePrefill || intakeAppliedRef.current) return;
    intakeAppliedRef.current = true;
    const patch: Partial<PermitForm> = {};
    if (!form.title.trim() && intakePrefill.title) patch.title = intakePrefill.title;
    if (!form.workDescription.trim() && intakePrefill.scope)
      patch.workDescription = intakePrefill.scope;
    if (Object.keys(patch).length > 0) update(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakePrefill, update]);

  const validity = useMemo(
    () => computeValidity(form.validFrom, form.validTo),
    [form.validFrom, form.validTo]
  );

  const issuerSigned = !!form.issuedBy.trim();
  const holderSigned = !!form.holder.trim();

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
            {downloading ? "Generating…" : "Download permit"}
          </Button>
        </div>
      </div>

      {/* Permit identity strip — looks like the front of a real permit */}
      <PermitIdentityStrip
        title={form.title || props.defaultTitle}
        location={form.location}
        intro={props.intro}
      />

      {/* Validity status — traffic-light banner */}
      <ValidityBanner validity={validity} />

      {/* Two-card row: Issuer + Holder identity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IdentityCard
          tone="issuer"
          label="Issued by"
          icon={<UserCircle className="size-4" />}
          name={form.issuedBy}
          onName={(v) => set("issuedBy", v)}
          subtitle={form.issuedByRole}
          onSubtitle={(v) => set("issuedByRole", v)}
          subtitlePlaceholder="e.g. Site Manager"
          signed={issuerSigned}
        />
        <IdentityCard
          tone="holder"
          label="Permit holder"
          icon={<HardHat className="size-4" />}
          name={form.holder}
          onName={(v) => set("holder", v)}
          subtitle={form.holderCompany}
          onSubtitle={(v) => set("holderCompany", v)}
          subtitlePlaceholder="Company / trade"
          signed={holderSigned}
        />
      </div>

      {/* Validity window — visual time strip with start/end */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CalendarClock className="size-4 text-muted-foreground" />
            Validity window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="validFrom" className="text-xs">
                Valid from
              </Label>
              <Input
                id="validFrom"
                type="datetime-local"
                value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="validTo" className="text-xs">
                Valid to
              </Label>
              <Input
                id="validTo"
                type="datetime-local"
                value={form.validTo}
                onChange={(e) => set("validTo", e.target.value)}
              />
            </div>
          </div>
          {/* Visual strip — shows where 'now' sits in the window */}
          {form.validFrom && form.validTo && (
            <ValidityStrip from={form.validFrom} to={form.validTo} />
          )}
        </CardContent>
      </Card>

      {/* Work description — what's being permitted */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-muted-foreground" />
            Description of work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-xs">
              Permit reference / title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={props.defaultTitle}
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-xs">
              Exact location
            </Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Block C, Level 3, plant room"
            />
          </div>
          <div>
            <Label htmlFor="workDescription" className="text-xs">
              What is being done
            </Label>
            <Textarea
              id="workDescription"
              value={form.workDescription}
              onChange={(e) => set("workDescription", e.target.value)}
              rows={3}
              placeholder="What is being done, with what equipment, by whom"
            />
          </div>
        </CardContent>
      </Card>

      {/* Precautions — the heart of the permit. AI fills from work desc. */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="size-4 text-[var(--status-warning)]" />
            Precautions required
          </CardTitle>
          <AIFillButton
            kind="permit-precaution"
            context={{
              documentType: props.defaultTitle,
              work: form.workDescription,
            }}
            onFill={(text) => set("precautions", text)}
            hint="Draft precautions"
            variant="button"
            disabled={!form.workDescription.trim()}
          />
        </CardHeader>
        <CardContent>
          <Textarea
            id="precautions"
            value={form.precautions}
            onChange={(e) => set("precautions", e.target.value)}
            rows={5}
            placeholder="What must be in place before work starts. Tap the sparkle to draft from the work description."
          />
        </CardContent>
      </Card>

      {/* Isolations + Conditions — secondary controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock className="size-4 text-muted-foreground" />
              Isolations / lock-outs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="isolations"
              value={form.isolations}
              onChange={(e) => set("isolations", e.target.value)}
              rows={4}
              placeholder="Power, gas, water, services isolated"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="size-4 text-muted-foreground" />
              Additional conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="conditions"
              value={form.conditions}
              onChange={(e) => set("conditions", e.target.value)}
              rows={4}
              placeholder="Site-specific conditions for this permit"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */

function PermitIdentityStrip({
  title,
  location,
  intro,
}: {
  title: string;
  location: string;
  intro: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-soft surface-raised shadow-sm-cool">
      {/* Top accent bar — corporate-permit feel */}
      <div className="h-1 bg-foreground" aria-hidden />
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mb-2">
            Permit to Work
          </div>
          <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground leading-tight">
            {title}
          </h2>
          {location && (
            <p className="text-xs text-muted-foreground mt-2 truncate">
              📍 {location}
            </p>
          )}
        </div>
        <p className="hidden md:block text-xs text-muted-foreground max-w-xs leading-relaxed shrink-0">
          {intro}
        </p>
      </div>
    </div>
  );
}

function ValidityBanner({ validity }: { validity: ValidityInfo }) {
  const { state, caption, detail } = validity;
  const config = {
    draft: {
      Icon: FileText,
      tone: "surface-pebble border-soft text-muted-foreground",
      iconClass: "text-muted-foreground",
      pip: "bg-muted-foreground/40",
    },
    upcoming: {
      Icon: Clock,
      tone: "status-info border-[var(--status-info)]/30",
      iconClass: "text-[var(--status-info)]",
      pip: "bg-[var(--status-info)]",
    },
    live: {
      Icon: ShieldCheck,
      tone: "status-success border-[var(--status-success)]/30",
      iconClass: "text-[var(--status-success)]",
      pip: "bg-[var(--status-success)] animate-pulse",
    },
    expired: {
      Icon: ShieldAlert,
      tone: "status-danger border-[var(--status-danger)]/30",
      iconClass: "text-[var(--status-danger)]",
      pip: "bg-[var(--status-danger)]",
    },
  } as const;
  const c = config[state];
  const { Icon } = c;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 flex items-center gap-3",
        c.tone
      )}
    >
      <div className="size-9 rounded-lg surface-raised border border-soft flex items-center justify-center shrink-0">
        <Icon className={cn("size-4", c.iconClass)} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full shrink-0", c.pip)} />
          <span className="text-sm font-semibold tracking-tight">
            {caption}
          </span>
        </div>
        <p className="text-xs opacity-90 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

function ValidityStrip({ from, to }: { from: string; to: string }) {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  const now = Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  const total = end - start;
  const elapsed = Math.max(0, Math.min(total, now - start));
  const pct = (elapsed / total) * 100;
  const isActive = now >= start && now <= end;

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full overflow-hidden surface-pebble border border-soft">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all",
            isActive ? "bg-[var(--status-success)]" : "bg-foreground/30"
          )}
          style={{ width: `${pct}%` }}
        />
        {isActive && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground"
            style={{ left: `${pct}%` }}
            aria-label="Now"
          />
        )}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        <span>{formatDateTime(from)}</span>
        <span>{formatDateTime(to)}</span>
      </div>
    </div>
  );
}

function IdentityCard({
  tone,
  label,
  icon,
  name,
  onName,
  subtitle,
  onSubtitle,
  subtitlePlaceholder,
  signed,
}: {
  tone: "issuer" | "holder";
  label: string;
  icon: React.ReactNode;
  name: string;
  onName: (v: string) => void;
  subtitle: string;
  onSubtitle: (v: string) => void;
  subtitlePlaceholder: string;
  signed: boolean;
}) {
  return (
    <div className="rounded-xl surface-raised border border-soft shadow-sm-cool overflow-hidden flex flex-col">
      {/* Top bar with label + signed pill */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-soft surface-pebble">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-7 rounded-md flex items-center justify-center border",
              tone === "issuer"
                ? "bg-foreground text-background border-foreground"
                : "bg-brand text-foreground border-brand"
            )}
          >
            {icon}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">
            {label}
          </span>
        </div>
        {signed ? (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full status-success font-bold">
            ● Signed
          </span>
        ) : (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full surface-pebble border border-soft text-muted-foreground font-semibold">
            Unsigned
          </span>
        )}
      </div>
      <div className="px-4 py-4 space-y-3">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Full name"
            className="font-medium"
          />
        </div>
        <div>
          <Label className="text-xs">
            {tone === "issuer" ? "Role" : "Company"}
          </Label>
          <Input
            value={subtitle}
            onChange={(e) => onSubtitle(e.target.value)}
            placeholder={subtitlePlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
