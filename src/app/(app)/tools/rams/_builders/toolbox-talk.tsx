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
import { cn } from "@/lib/utils";

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

export function ToolboxTalkBuilder() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState("5 mins");
  const [generated, setGenerated] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setGenerating(true);
    // Real integration calls /api/rams/toolbox-talk → Anthropic Haiku
    await new Promise((r) => setTimeout(r, 800));
    setGenerated(
      `[Toolbox Talk — ${topic}]\n\nIntro:\nWe're talking today about ${topic.toLowerCase()}. This is something every one of us encounters on site, and it's a hazard that has injured workers across the industry.\n\nWhy it matters:\n- HSE statistics show this is a leading cause of injury in our trade.\n- Recent incidents in the supply chain reinforce the importance of getting this right.\n\nKey controls:\n- [Control 1 — specific to ${topic.toLowerCase()}]\n- [Control 2 — equipment / procedure]\n- [Control 3 — supervision / sign-off]\n\nWhat I expect from you today:\n- Use the controls every time, not just when you feel like it.\n- Stop the job if you spot something unsafe — that's your right and duty.\n- Speak up if you don't understand or aren't trained on something.\n\nQuestions?\n[Capture questions and answers below]\n\n— AI-generated draft. Review before delivery.`
    );
    setGenerating(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toolbox Talk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tt-topic">Topic</Label>
            <Input
              id="tt-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Safe use of disc cutters"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tt-audience">Audience</Label>
              <Input
                id="tt-audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. M&E first fix crew"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tt-duration">Duration</Label>
              <select
                id="tt-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
            disabled={!topic.trim()}
            loading={generating}
          >
            AI write the talk
          </AIButton>
        </CardContent>
      </Card>

      {!generated && (
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
                      onClick={() => setTopic(t)}
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

      {generated && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="size-4" />
                Briefing
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setGenerated("")}>
              Try again
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generated}
              onChange={(e) => setGenerated(e.target.value)}
              rows={20}
              className="font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline">Save draft</Button>
        <Button disabled={!generated}>
          <Download className="size-3.5 mr-1.5" />
          Generate Toolbox Talk PDF
        </Button>
      </div>
    </div>
  );
}
