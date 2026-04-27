"use client";

import { useState } from "react";
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
import { Download, Megaphone } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";

const TOPIC_GROUPS: { label: string; topics: string[] }[] = [
  {
    label: "Working at Height",
    topics: [
      "Safe use of MEWPs",
      "Ladder safety — 1:4 rule",
      "Mobile scaffold tower (PASMA)",
      "Edge protection on flat roofs",
      "Fragile roof surfaces",
      "Harness inspection and rescue",
    ],
  },
  {
    label: "Plant & Equipment",
    topics: [
      "Banksman duties around moving plant",
      "Disc cutter / angle grinder safety",
      "Pre-use checks (PUWER)",
      "LOLER lifting equipment register",
      "Generator and CO awareness",
      "Cartridge nail gun safety",
    ],
  },
  {
    label: "Health & Wellbeing",
    topics: [
      "HAVs — recognising symptoms",
      "Noise and hearing protection",
      "Manual handling — TILE",
      "Mental health and Stress at Work",
      "Heat stress in summer",
      "Cold stress and dehydration",
    ],
  },
  {
    label: "Site Hazards",
    topics: [
      "Cable strikes — CAT and Genny",
      "Confined space entry",
      "Slips, trips and falls",
      "Hot works permit and fire watch",
      "Asbestos awareness",
      "Silica dust and RPE",
    ],
  },
  {
    label: "Behavioural / Soft Skills",
    topics: [
      "Stop the job — your right and duty",
      "Reporting near misses",
      "PPE compliance",
      "Site induction refresh",
      "Looking out for new starters",
      "End-of-day housekeeping",
    ],
  },
];

interface ToolboxTalkForm {
  topic: string;
  audience: string;
  duration: string;
  generated: string;
}

function emptyForm(): ToolboxTalkForm {
  return { topic: "", audience: "", duration: "5 mins", generated: "" };
}

export function ToolboxTalkBuilder() {
  const {
    form,
    update,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  } = useBuilderDocument<ToolboxTalkForm>({
    builderSlug: "toolbox-talk",
    emptyForm,
    titleFromForm: (f) => (f.topic ? `Toolbox Talk — ${f.topic}` : null),
  });

  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!form.topic.trim()) {
      toast.error("Pick a topic first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch(`/api/ai/toolbox-talk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: form.topic,
          audience: form.audience || undefined,
          duration: form.duration || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "AI generation failed.");
        return;
      }
      const { text } = await res.json();
      if (!text) {
        toast.error("AI returned no usable content.");
        return;
      }
      update({ generated: text });
      toast.success("Briefing ready. Edit, then download.");
    } catch {
      toast.error("AI generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <SaveStatus saving={saving} lastSaved={lastSaved} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toolbox Talk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tt-topic">Topic</Label>
            <Input
              id="tt-topic"
              value={form.topic}
              onChange={(e) => update({ topic: e.target.value })}
              placeholder="e.g. Safe use of disc cutters"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tt-audience">Audience</Label>
              <Input
                id="tt-audience"
                value={form.audience}
                onChange={(e) => update({ audience: e.target.value })}
                placeholder="e.g. M&E first fix crew"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tt-duration">Duration</Label>
              <select
                id="tt-duration"
                value={form.duration}
                onChange={(e) => update({ duration: e.target.value })}
                className="w-full border rounded-md h-9 px-2 text-sm bg-background"
              >
                <option>3 mins</option>
                <option>5 mins</option>
                <option>10 mins</option>
              </select>
            </div>
          </div>
          <AIButton
            onClick={handleGenerate}
            disabled={!form.topic.trim()}
            loading={generating}
          >
            AI write the talk
          </AIButton>
        </CardContent>
      </Card>

      {!form.generated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Or pick a topic</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {TOPIC_GROUPS.reduce((n, g) => n + g.topics.length, 0)} pre-written
              topics. Click to load and generate.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {TOPIC_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground mb-2">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => update({ topic: t })}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition",
                        "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {form.generated && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="size-4" />
              Briefing
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => update({ generated: "" })}
            >
              Try again
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.generated}
              onChange={(e) => update({ generated: e.target.value })}
              rows={20}
              className="font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={manualSave} disabled={saving}>
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button onClick={downloadPdf} disabled={downloading || !form.generated}>
          <Download className="size-3.5 mr-1.5" />
          {downloading ? "Generating…" : "Download Toolbox Talk PDF"}
        </Button>
      </div>
    </div>
  );
}
