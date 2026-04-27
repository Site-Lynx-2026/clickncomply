"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Download, FlaskConical } from "lucide-react";
import { AIButton } from "@/components/ui/ai-button";

type RiskLevel = "low" | "medium" | "high";

interface Substance {
  id: string;
  name: string;
  sdsRef: string;
  exposureRoute: string;
  welRef: string;
  riskLevel: RiskLevel;
  controls: string;
  ppe: string;
  emergencyProcedure: string;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
};

export function CoshhBuilder() {
  const [substances, setSubstances] = useState<Substance[]>([]);
  const [title, setTitle] = useState("");

  function addSubstance() {
    setSubstances((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        name: "",
        sdsRef: "",
        exposureRoute: "Inhalation, skin contact",
        welRef: "",
        riskLevel: "medium",
        controls: "",
        ppe: "Nitrile gloves, safety glasses, FFP3 mask",
        emergencyProcedure:
          "Eye contact: rinse with water for 15 min. Skin: wash with soap and water. Inhalation: move to fresh air. Seek medical advice if symptoms persist.",
      },
    ]);
  }

  function update(id: string, patch: Partial<Substance>) {
    setSubstances((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function remove(id: string) {
    setSubstances((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">COSHH Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="coshh-title">Title</Label>
            <Input
              id="coshh-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. M&E first fix — Plot 12"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Substances
              {substances.length > 0 && (
                <span className="ml-2 text-muted-foreground font-normal text-sm">
                  ({substances.length})
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Each substance assessed individually with control hierarchy and
              emergency procedure.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AIButton size="sm">AI fill controls</AIButton>
            <Button size="sm" onClick={addSubstance}>
              <Plus className="size-3.5 mr-1.5" />
              Add substance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {substances.length === 0 ? (
            <div className="border-2 border-dashed rounded-md p-10 text-center bg-muted/20">
              <FlaskConical className="size-6 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                No substances added yet.
              </p>
              <Button variant="outline" size="sm" onClick={addSubstance}>
                <Plus className="size-3.5 mr-1.5" />
                Add first substance
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {substances.map((s) => (
                <SubstanceRow
                  key={s.id}
                  substance={s}
                  onUpdate={(patch) => update(s.id, patch)}
                  onRemove={() => remove(s.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline">Save draft</Button>
        <Button disabled={substances.length === 0}>
          <Download className="size-3.5 mr-1.5" />
          Generate COSHH PDF
        </Button>
      </div>
    </div>
  );
}

function SubstanceRow({
  substance,
  onUpdate,
  onRemove,
}: {
  substance: Substance;
  onUpdate: (patch: Partial<Substance>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border rounded-md p-4 bg-card space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs">Substance name</Label>
          <Input
            value={substance.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. Cement, MDI Foam, White Spirit"
            className="font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Risk level</Label>
          <select
            value={substance.riskLevel}
            onChange={(e) =>
              onUpdate({ riskLevel: e.target.value as RiskLevel })
            }
            className="border rounded-md h-9 px-2 text-sm bg-background"
            style={{ borderColor: RISK_COLORS[substance.riskLevel] }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0 mt-6"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">SDS reference</Label>
          <Input
            value={substance.sdsRef}
            onChange={(e) => onUpdate({ sdsRef: e.target.value })}
            placeholder="e.g. SDS-SIK-001 (Sika 1)"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">WEL reference (if applicable)</Label>
          <Input
            value={substance.welRef}
            onChange={(e) => onUpdate({ welRef: e.target.value })}
            placeholder="e.g. EH40/2005"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Exposure routes</Label>
        <Input
          value={substance.exposureRoute}
          onChange={(e) => onUpdate({ exposureRoute: e.target.value })}
          placeholder="Inhalation, skin contact, ingestion, eye contact"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Control measures</Label>
        <Textarea
          value={substance.controls}
          onChange={(e) => onUpdate({ controls: e.target.value })}
          rows={2}
          placeholder="Engineering controls, ventilation, substitution, exposure limits..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">PPE required</Label>
        <Input
          value={substance.ppe}
          onChange={(e) => onUpdate({ ppe: e.target.value })}
          placeholder="Glove grade, RPE, eye protection..."
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Emergency procedure</Label>
        <Textarea
          value={substance.emergencyProcedure}
          onChange={(e) => onUpdate({ emergencyProcedure: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}
