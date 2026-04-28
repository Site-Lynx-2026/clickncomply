import { Wrench, Anchor, PlayCircle, Boxes } from "lucide-react";
import { UmbrellaPicker } from "../_components/umbrella-picker";

export const metadata = {
  title: "Inspections — ClickNComply",
  description: "PUWER pre-use checks, LOLER inspections, plant pre-start, equipment register.",
};

export default function InspectionsPickerPage() {
  return (
    <UmbrellaPicker
      eyebrow="Inspections"
      title="Inspect a piece of kit"
      subtitle="Pick the type. Pass / fail / N-A per item, with defect notes and an overall stamp."
      items={[
        {
          slug: "puwer-check",
          name: "PUWER Pre-Use Check",
          description: "Daily check on a tool before use — guards, condition, function.",
          icon: Wrench,
        },
        {
          slug: "loler-inspection",
          name: "LOLER Inspection",
          description: "Statutory inspection of lifting equipment — accessories, slings, hoists.",
          icon: Anchor,
        },
        {
          slug: "plant-prestart",
          name: "Plant Pre-Start",
          description: "Daily walkaround before plant goes to work — fluids, tyres, controls.",
          icon: PlayCircle,
        },
        {
          slug: "equipment-register",
          name: "Equipment Register Entry",
          description: "Log a piece of kit — serial, owner, last/next inspection.",
          icon: Boxes,
        },
      ]}
    />
  );
}
