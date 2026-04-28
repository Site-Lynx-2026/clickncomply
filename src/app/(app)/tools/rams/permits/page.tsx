import {
  ClipboardCheck,
  FlameKindling,
  Shovel,
  ArrowDownToDot,
  MountainSnow,
} from "lucide-react";
import { UmbrellaPicker } from "../_components/umbrella-picker";

export const metadata = {
  title: "Permits — ClickNComply",
  description: "Issue a permit to work — hot works, dig, confined space, working at height.",
};

export default function PermitsPickerPage() {
  return (
    <UmbrellaPicker
      eyebrow="Permits"
      title="Issue a permit"
      subtitle="Pick the type. Each one is a signable, time-bound permit with the right precautions baked in."
      items={[
        {
          slug: "permit-to-work",
          name: "Permit to Work",
          description: "General PtW for any controlled work activity.",
          icon: ClipboardCheck,
        },
        {
          slug: "hot-works-permit",
          name: "Hot Works Permit",
          description: "Welding, grinding, cutting — fire watch and atmospheric checks.",
          icon: FlameKindling,
        },
        {
          slug: "permit-to-dig",
          name: "Permit to Dig",
          description: "Excavation with services scan, signed off before breaking ground.",
          icon: Shovel,
        },
        {
          slug: "confined-space-entry",
          name: "Confined Space Entry",
          description: "Atmospheric testing, top-man, rescue plan.",
          icon: ArrowDownToDot,
        },
        {
          slug: "working-at-height-permit",
          name: "Working at Height Permit",
          description: "Edge protection, MEWP/scaffold checks, rescue plan.",
          icon: MountainSnow,
        },
      ]}
    />
  );
}
