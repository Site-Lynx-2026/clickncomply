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
import { Download, Megaphone, ChevronLeft } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";
import { toast } from "sonner";
import { useBuilderDocument } from "../_components/use-builder-document";
import { SaveStatus } from "../_components/save-status";
import { LibraryGallery } from "../_components/library-gallery";
import {
  TOOLBOX_TOPICS,
  TOOLBOX_CATEGORIES,
} from "@/lib/rams/toolbox-topics";

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

  /**
   * Click-to-build: picking a topic auto-runs the AI generator. Zero typing
   * to get a ready-to-deliver toolbox talk in front of the user.
   */
  async function pickTopic(topicTitle: string) {
    update({ topic: topicTitle, generated: "" });
    await runGenerator(topicTitle, form.audience, form.duration);
  }

  async function runGenerator(
    topic: string,
    audience: string,
    duration: string
  ) {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/ai/toolbox-talk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience: audience || undefined,
          duration: duration || undefined,
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
      toast.success("Briefing ready.");
    } catch {
      toast.error("AI generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  function startBlank() {
    update({ topic: "Custom topic", generated: "" });
  }

  function backToGallery() {
    if (
      form.generated &&
      !confirm("Discard the current briefing and pick a different topic?")
    )
      return;
    update({ topic: "", generated: "" });
  }

  // ── GALLERY VIEW ──
  if (!form.topic) {
    return (
      <div className="space-y-6">
        <SaveStatus saving={saving} lastSaved={lastSaved} />
        <LibraryGallery
          heading="Pick a topic"
          subheading={`${TOOLBOX_TOPICS.length} pre-curated topics. Click any one — AI writes the talk in seconds.`}
          searchPlaceholder={`Search ${TOOLBOX_TOPICS.length} topics…`}
          items={TOOLBOX_TOPICS.map((t) => ({
            id: t.id,
            title: t.title,
            subtitle: t.subtitle,
            category: t.category,
            icon: t.icon,
          }))}
          categories={TOOLBOX_CATEGORIES.map((c) => ({
            id: c.id,
            label: c.label,
            icon: c.icon,
          }))}
          onPick={(item) => pickTopic(item.title)}
          customLabel="Write your own topic"
          onAddCustom={startBlank}
          searchableFields={(item) => [item.title, item.subtitle ?? ""]}
        />
      </div>
    );
  }

  // ── EDITOR VIEW ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={backToGallery}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Pick a different topic
        </button>
        <SaveStatus saving={saving} lastSaved={lastSaved} />
      </div>

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
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tt-audience">Audience (optional)</Label>
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
          {!form.generated && !generating && (
            <AIButton
              onClick={() =>
                runGenerator(form.topic, form.audience, form.duration)
              }
              disabled={!form.topic.trim()}
            >
              AI write the talk
            </AIButton>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="size-4" />
            Briefing
          </CardTitle>
          {form.generated && (
            <AIButton
              size="sm"
              onClick={() =>
                runGenerator(form.topic, form.audience, form.duration)
              }
              loading={generating}
            >
              Regenerate
            </AIButton>
          )}
        </CardHeader>
        <CardContent>
          {generating && !form.generated ? (
            <div className="border-2 border-dashed rounded-md p-12 text-center bg-muted/20">
              <p className="text-sm text-muted-foreground animate-pulse">
                AI is writing the briefing…
              </p>
            </div>
          ) : (
            <Textarea
              value={form.generated}
              onChange={(e) => update({ generated: e.target.value })}
              rows={20}
              className="font-mono text-xs leading-relaxed"
              placeholder="The AI-generated briefing will appear here..."
            />
          )}
        </CardContent>
      </Card>

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
