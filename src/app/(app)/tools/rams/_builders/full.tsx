"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronLeft, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import {
  RAMS_TRADES,
  TRADE_CATEGORIES,
  RA_LIBRARY,
  HAVS_LIBRARY,
  NOISE_LIBRARY,
  type RALibraryItem,
} from "@/lib/rams/library";
import { COSHH_SUBSTANCES } from "@/lib/rams/coshh-substances";
import { PPE_ITEMS } from "@/lib/rams/tools";
import {
  HAVS_EAV,
  HAVS_ELV,
  calcHAVSPoints,
  riskScore,
} from "@/lib/rams/config";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
 * FULL RAMS — picker-first, single scrolling page editor.
 *
 * Pick a trade → all 12 sections populate from the trade template.
 * Then scroll, review each section, tweak, and download a comprehensive
 * branded PDF. No wizard, no tabs, no rail — everything visible.
 * ────────────────────────────────────────────────────────────────────── */

interface MethodStep {
  id: string;
  description: string;
  responsible: string;
}

interface RAHazard {
  id: string;
  hazard: string;
  whoAtRisk: string;
  consequences: string;
  initialL: number;
  initialS: number;
  controls: string;
  residualL: number;
  residualS: number;
}

interface CoshhEntry {
  id: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  controls: string;
  ppe: string;
  emergencyProcedure: string;
}

interface HavsTool {
  id: string;
  name: string;
  magnitude: number;
  hours: number;
}

interface NoiseEntry {
  id: string;
  activity: string;
  typicalDb: number;
  hours: number;
}

interface FullRamsForm {
  // Project
  title: string;
  trade: string;
  scope: string;
  siteName: string;
  siteAddress: string;
  dateOfWorks: string;
  duration: string;
  // Method statement
  methodSteps: MethodStep[];
  // PPE
  ppe: string[];
  // Risk assessment
  hazards: RAHazard[];
  // COSHH
  coshh: CoshhEntry[];
  // HAVs
  havsTools: HavsTool[];
  // Noise
  noise: NoiseEntry[];
  // Emergency
  firstAid: string;
  fireProc: string;
  assemblyPoint: string;
  nearestAE: string;
  emergencyContacts: string;
  // Welfare & environmental
  welfare: string;
  environmental: string;
  // Sign-off
  preparedBy: string;
  preparedByRole: string;
}

function emptyForm(): FullRamsForm {
  return {
    title: "",
    trade: "",
    scope: "",
    siteName: "",
    siteAddress: "",
    dateOfWorks: "",
    duration: "",
    methodSteps: [],
    ppe: ["ppe-hardhat", "ppe-boots", "ppe-hivis", "ppe-gloves"],
    hazards: [],
    coshh: [],
    havsTools: [],
    noise: [],
    firstAid:
      "Qualified first aider on site at all times. First aid kit located in the site office.",
    fireProc:
      "Raise the alarm, evacuate via nearest safe route to the assembly point. Do not attempt to fight the fire unless trained. Call 999.",
    assemblyPoint: "As designated on site induction plan.",
    nearestAE: "",
    emergencyContacts: "",
    welfare:
      "Welfare facilities provided on site including: toilet, washing facilities with hot and cold water, drying room, rest area with seating, drinking water, and heating facilities for food.",
    environmental:
      "All waste segregated on site. Licensed waste carrier for removal. No burning of materials. Work limited to agreed hours. Water suppression and damping down as required.",
    preparedBy: "",
    preparedByRole: "",
  };
}

export function FullRamsBuilder() {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<FullRamsForm>({
    builderSlug: "full",
    emptyForm,
    titleFromForm: (f) => f.title || (f.trade ? `Full RAMs — ${f.trade}` : null),
  });

  /**
   * Trade pick — fills every relevant section of the document in one shot.
   * Method steps, hazards, COSHH, HAVs, noise, PPE all loaded.
   */
  function pickTrade(tradeId: string) {
    const trade = RAMS_TRADES.find((t) => t.id === tradeId);
    if (!trade) return;

    const hazards = trade.raItems
      .map((id) => RA_LIBRARY.find((h) => h.id === id))
      .filter((x): x is RALibraryItem => Boolean(x))
      .map((item) => ({
        id: crypto.randomUUID(),
        hazard: item.hazard,
        whoAtRisk: item.whoAtRisk,
        consequences: item.consequences,
        initialL: item.initialL,
        initialS: item.initialS,
        controls: item.controls,
        residualL: item.residualL,
        residualS: item.residualS,
      }));

    const havsTools = trade.havsItems
      .map((id) => HAVS_LIBRARY.find((h) => h.id === id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .map((h) => ({
        id: crypto.randomUUID(),
        name: h.tool,
        magnitude: h.vibrationMag,
        hours: 1,
      }));

    const noise = trade.noiseItems
      .map((id) => NOISE_LIBRARY.find((n) => n.id === id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .map((n) => ({
        id: crypto.randomUUID(),
        activity: n.activity,
        typicalDb: n.typicalDb,
        hours: 1,
      }));

    update({
      trade: trade.trade,
      title: form.title || `RAMs — ${trade.trade}`,
      scope: form.scope || trade.description,
      methodSteps: trade.msSteps.map((description) => ({
        id: crypto.randomUUID(),
        description,
        responsible: "",
      })),
      ppe: trade.ppe.length > 0 ? trade.ppe : form.ppe,
      hazards,
      havsTools,
      noise,
      // COSHH from trade is referenced by id; we don't have a direct mapping
      // for the trade.coshhItems format vs our library — leave for the user
      // to pick from the COSHH library section below.
      coshh: form.coshh,
    });

    toast.success(
      `Loaded ${hazards.length} hazards, ${trade.msSteps.length} steps, ${havsTools.length} tools.`
    );
  }

  function backToGallery() {
    if (
      form.methodSteps.length > 0 &&
      !confirm("Discard current RAMs and pick a different trade?")
    )
      return;
    Object.assign(form, emptyForm());
    update(emptyForm());
  }

  // ── GALLERY VIEW ──
  if (!form.trade) {
    return (
      <div className="space-y-6">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <LibraryGallery
          heading="Pick your trade — full RAMs loads instantly"
          subheading={`${RAMS_TRADES.length} trades, each with method statement, hazards, HAVs tools, noise sources and PPE pre-loaded. One click and you have a complete RAMs draft.`}
          searchPlaceholder={`Search ${RAMS_TRADES.length} trades…`}
          items={RAMS_TRADES.map((t) => ({
            id: t.id,
            title: t.trade,
            subtitle: t.description,
            category: t.category,
            icon: t.icon,
            meta: `${t.msSteps.length}+${t.raItems.length}`,
          }))}
          categories={TRADE_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPick={(item) => pickTrade(item.id)}
        />
      </div>
    );
  }

  // ── EDITOR VIEW ──
  return (
    <div className="space-y-4 pb-24">
      {/* Sticky header */}
      <div className="sticky top-14 z-20 -mx-8 px-8 py-3 bg-background/90 backdrop-blur border-b flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={backToGallery}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="size-3.5" />
            Pick different trade
          </button>
          <span className="text-muted-foreground text-xs">·</span>
          <div className="text-sm font-semibold tracking-tight truncate">
            {form.title || form.trade}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <SaveStatus saving={saving} lastSaved={lastSaved} />
          <Button onClick={downloadPdf} disabled={downloading} size="sm">
            <Download className="size-3.5 mr-1.5" />
            {downloading ? "Generating…" : "Download PDF"}
          </Button>
        </div>
      </div>

      <SectionScroller
        sections={[
          { id: "project", label: "Project info" },
          { id: "method", label: "Method statement" },
          { id: "ppe", label: "PPE" },
          { id: "hazards", label: "Risk assessment" },
          { id: "coshh", label: "COSHH" },
          { id: "havs", label: "HAVs" },
          { id: "noise", label: "Noise" },
          { id: "emergency", label: "Emergency" },
          { id: "welfare", label: "Welfare & environment" },
          { id: "signoff", label: "Sign-off" },
        ]}
      />

      <Section id="project" title="1. Project info" summary="Site, dates, scope">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="RAMs title"
            value={form.title}
            onChange={(v) => update({ title: v })}
          />
          <Field
            label="Trade / discipline"
            value={form.trade}
            onChange={(v) => update({ trade: v })}
          />
          <FieldArea
            label="Scope of works"
            value={form.scope}
            onChange={(v) => update({ scope: v })}
          />
          <Field
            label="Site name"
            value={form.siteName}
            onChange={(v) => update({ siteName: v })}
          />
          <FieldArea
            label="Site address"
            value={form.siteAddress}
            onChange={(v) => update({ siteAddress: v })}
          />
          <Field
            label="Date of works"
            value={form.dateOfWorks}
            onChange={(v) => update({ dateOfWorks: v })}
            placeholder="e.g. Mon 5 May 2026"
          />
          <Field
            label="Duration"
            value={form.duration}
            onChange={(v) => update({ duration: v })}
            placeholder="e.g. 4 weeks"
          />
        </div>
      </Section>

      <Section
        id="method"
        title="2. Method statement"
        summary={`${form.methodSteps.length} steps loaded`}
      >
        <div className="space-y-2">
          {form.methodSteps.map((s, i) => (
            <div key={s.id} className="flex items-start gap-2 border rounded-md p-3">
              <div className="size-6 rounded bg-foreground text-background flex items-center justify-center text-xs font-semibold mt-1.5 shrink-0">
                {i + 1}
              </div>
              <Textarea
                value={s.description}
                onChange={(e) =>
                  update({
                    methodSteps: form.methodSteps.map((x) =>
                      x.id === s.id ? { ...x, description: e.target.value } : x
                    ),
                  })
                }
                rows={2}
                className="resize-none flex-1"
              />
              <Input
                value={s.responsible}
                onChange={(e) =>
                  update({
                    methodSteps: form.methodSteps.map((x) =>
                      x.id === s.id ? { ...x, responsible: e.target.value } : x
                    ),
                  })
                }
                placeholder="Responsible"
                className="w-44"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  update({
                    methodSteps: form.methodSteps.filter((x) => x.id !== s.id),
                  })
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update({
                methodSteps: [
                  ...form.methodSteps,
                  { id: crypto.randomUUID(), description: "", responsible: "" },
                ],
              })
            }
          >
            + Add step
          </Button>
        </div>
      </Section>

      <Section
        id="ppe"
        title="3. PPE"
        summary={`${form.ppe.length} items selected`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {PPE_ITEMS.map((item) => {
            const active = form.ppe.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() =>
                  update({
                    ppe: active
                      ? form.ppe.filter((x) => x !== item.id)
                      : [...form.ppe, item.id],
                  })
                }
                className={cn(
                  "text-left p-3 rounded-md border transition flex items-center gap-2",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card hover:border-foreground/40"
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded shrink-0 flex items-center justify-center",
                    active ? "bg-background/20" : "border"
                  )}
                >
                  {active && <Check className="size-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.label}
                  </div>
                  {item.enStandard && (
                    <div
                      className={cn(
                        "text-[10px] truncate",
                        active ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {item.enStandard}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        id="hazards"
        title="4. Risk assessment"
        summary={`${form.hazards.length} hazards`}
        defaultCollapsed
      >
        <div className="space-y-2">
          {form.hazards.map((h) => {
            const initial = riskScore(h.initialL, h.initialS);
            const residual = riskScore(h.residualL, h.residualS);
            return (
              <div
                key={h.id}
                className="border rounded-md p-3 bg-card flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1">{h.hazard}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {h.controls}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <RiskPill score={initial} prefix="I" />
                  <RiskPill score={residual} prefix="R" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    update({
                      hazards: form.hazards.filter((x) => x.id !== h.id),
                    })
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            );
          })}
          {form.hazards.length === 0 && (
            <div className="text-xs text-muted-foreground italic">
              No hazards loaded — pick a trade or add hazards from the Risk
              Assessment standalone tool.
            </div>
          )}
        </div>
      </Section>

      <Section
        id="coshh"
        title="5. COSHH"
        summary={`${form.coshh.length} substances`}
        defaultCollapsed
      >
        <CoshhPicker
          substances={form.coshh}
          onChange={(coshh) => update({ coshh })}
        />
      </Section>

      <Section
        id="havs"
        title="6. HAVs"
        summary={(() => {
          const total = form.havsTools.reduce(
            (s, t) => s + calcHAVSPoints(t.magnitude, t.hours),
            0
          );
          const status =
            total >= HAVS_ELV ? "ELV" : total >= HAVS_EAV ? "EAV" : "OK";
          return `${form.havsTools.length} tools · ${total} pts · ${status}`;
        })()}
        defaultCollapsed
      >
        <div className="space-y-2">
          {form.havsTools.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_100px_100px_80px_36px] gap-2 items-center"
            >
              <Input
                value={t.name}
                onChange={(e) =>
                  update({
                    havsTools: form.havsTools.map((x) =>
                      x.id === t.id ? { ...x, name: e.target.value } : x
                    ),
                  })
                }
              />
              <Input
                type="number"
                step="0.1"
                value={t.magnitude || ""}
                onChange={(e) =>
                  update({
                    havsTools: form.havsTools.map((x) =>
                      x.id === t.id
                        ? { ...x, magnitude: parseFloat(e.target.value) || 0 }
                        : x
                    ),
                  })
                }
              />
              <Input
                type="number"
                step="0.25"
                value={t.hours || ""}
                onChange={(e) =>
                  update({
                    havsTools: form.havsTools.map((x) =>
                      x.id === t.id
                        ? { ...x, hours: parseFloat(e.target.value) || 0 }
                        : x
                    ),
                  })
                }
              />
              <div className="text-right text-sm font-mono font-semibold">
                {calcHAVSPoints(t.magnitude, t.hours)} pts
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  update({
                    havsTools: form.havsTools.filter((x) => x.id !== t.id),
                  })
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
          {form.havsTools.length === 0 && (
            <div className="text-xs text-muted-foreground italic">
              No tools loaded — pick a trade or use the standalone HAVs tool.
            </div>
          )}
        </div>
      </Section>

      <Section
        id="noise"
        title="7. Noise"
        summary={`${form.noise.length} sources`}
        defaultCollapsed
      >
        <div className="space-y-2">
          {form.noise.map((n) => (
            <div
              key={n.id}
              className="grid grid-cols-[1fr_100px_100px_36px] gap-2 items-center"
            >
              <Input
                value={n.activity}
                onChange={(e) =>
                  update({
                    noise: form.noise.map((x) =>
                      x.id === n.id ? { ...x, activity: e.target.value } : x
                    ),
                  })
                }
              />
              <Input
                type="number"
                value={n.typicalDb || ""}
                onChange={(e) =>
                  update({
                    noise: form.noise.map((x) =>
                      x.id === n.id
                        ? { ...x, typicalDb: parseFloat(e.target.value) || 0 }
                        : x
                    ),
                  })
                }
                placeholder="dB"
              />
              <Input
                type="number"
                step="0.25"
                value={n.hours || ""}
                onChange={(e) =>
                  update({
                    noise: form.noise.map((x) =>
                      x.id === n.id
                        ? { ...x, hours: parseFloat(e.target.value) || 0 }
                        : x
                    ),
                  })
                }
                placeholder="hrs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  update({
                    noise: form.noise.filter((x) => x.id !== n.id),
                  })
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section id="emergency" title="8. Emergency procedures" summary="First aid, fire, A&E">
        <div className="space-y-3">
          <FieldArea
            label="First aid arrangements"
            value={form.firstAid}
            onChange={(v) => update({ firstAid: v })}
          />
          <FieldArea
            label="Fire procedure"
            value={form.fireProc}
            onChange={(v) => update({ fireProc: v })}
          />
          <Field
            label="Assembly point"
            value={form.assemblyPoint}
            onChange={(v) => update({ assemblyPoint: v })}
          />
          <Field
            label="Nearest A&E hospital"
            value={form.nearestAE}
            onChange={(v) => update({ nearestAE: v })}
            placeholder="Hospital name + address"
          />
          <FieldArea
            label="Emergency contacts"
            value={form.emergencyContacts}
            onChange={(v) => update({ emergencyContacts: v })}
            placeholder="Site manager, project manager, H&S advisor..."
          />
        </div>
      </Section>

      <Section
        id="welfare"
        title="9. Welfare & environment"
        summary="Site provisions"
      >
        <div className="space-y-3">
          <FieldArea
            label="Welfare provision"
            value={form.welfare}
            onChange={(v) => update({ welfare: v })}
          />
          <FieldArea
            label="Environmental controls"
            value={form.environmental}
            onChange={(v) => update({ environmental: v })}
          />
        </div>
      </Section>

      <Section id="signoff" title="10. Prepared by" summary={form.preparedBy || "Not signed"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name"
            value={form.preparedBy}
            onChange={(v) => update({ preparedBy: v })}
          />
          <Field
            label="Role"
            value={form.preparedByRole}
            onChange={(v) => update({ preparedByRole: v })}
            placeholder="e.g. Site Supervisor, H&S Advisor"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          AI-generated draft. Named preparer is responsible for review and
          suitability before use on site.
        </p>
      </Section>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading}>
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download Full RAMs PDF"}
        </Button>
      </div>
    </div>
  );
}

/* ─────── Section primitives ─────── */

function Section({
  id,
  title,
  summary,
  defaultCollapsed = false,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!defaultCollapsed);
  return (
    <section
      id={id}
      className="border rounded-lg bg-card scroll-mt-32"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 rounded-t-lg transition"
      >
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {summary && (
            <p className="text-xs text-muted-foreground mt-0.5">{summary}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {open ? "Collapse" : "Edit"}
        </span>
      </button>
      {open && <div className="border-t p-4">{children}</div>}
    </section>
  );
}

function SectionScroller({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5 -mt-2">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function FieldArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
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
    >
      {prefix}:{score.score}
    </div>
  );
}

/* ─────── COSHH inline picker ─────── */

function CoshhPicker({
  substances,
  onChange,
}: {
  substances: CoshhEntry[];
  onChange: (s: CoshhEntry[]) => void;
}) {
  const [showLib, setShowLib] = useState(false);

  return (
    <div className="space-y-3">
      {substances.length > 0 && (
        <div className="space-y-2">
          {substances.map((s) => (
            <div
              key={s.id}
              className="border rounded-md p-3 bg-card flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-0.5">{s.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {s.controls}
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] uppercase shrink-0"
                style={{
                  borderColor:
                    s.riskLevel === "high"
                      ? "#dc2626"
                      : s.riskLevel === "medium"
                        ? "#d97706"
                        : "#16a34a",
                  color:
                    s.riskLevel === "high"
                      ? "#dc2626"
                      : s.riskLevel === "medium"
                        ? "#d97706"
                        : "#16a34a",
                }}
              >
                {s.riskLevel}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange(substances.filter((x) => x.id !== s.id))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button variant="outline" size="sm" onClick={() => setShowLib(true)}>
        + Add substance from library
      </Button>

      {showLib && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLib(false)}
        >
          <div
            className="bg-background rounded-lg border shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Add a substance</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLib(false)}
              >
                <X className="size-4" />
              </Button>
            </header>
            <div className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1.5">
                {COSHH_SUBSTANCES.map((lib) => (
                  <li key={lib.id}>
                    <button
                      onClick={() => {
                        onChange([
                          ...substances,
                          {
                            id: crypto.randomUUID(),
                            name: lib.name,
                            riskLevel: lib.riskLevel,
                            controls: lib.controls,
                            ppe: lib.ppe,
                            emergencyProcedure: lib.emergencyProcedure,
                          },
                        ]);
                        setShowLib(false);
                      }}
                      className="w-full text-left p-3 border rounded-md hover:border-foreground transition flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0">{lib.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {lib.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {lib.summary}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase shrink-0"
                      >
                        {lib.riskLevel}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
