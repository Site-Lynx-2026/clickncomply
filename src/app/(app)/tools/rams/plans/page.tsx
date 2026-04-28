import { Shirt, Cross, Home, Siren } from "lucide-react";
import { UmbrellaPicker } from "../_components/umbrella-picker";

export const metadata = {
  title: "Plans & Schedules — ClickNComply",
  description: "PPE schedules, first aid needs assessments, welfare plans, emergency action plans.",
};

export default function PlansPickerPage() {
  return (
    <UmbrellaPicker
      eyebrow="Plans"
      title="Write a plan or schedule"
      subtitle="Pick the type. Each one is a chaptered policy document with a sign-on by the preparer."
      items={[
        {
          slug: "ppe-schedule",
          name: "PPE Schedule",
          description: "Per-task PPE matrix — head, eye, hand, foot, RPE, hi-vis.",
          icon: Shirt,
        },
        {
          slug: "first-aid-assessment",
          name: "First Aid Needs Assessment",
          description: "How many first aiders, what kit, where it lives, how to call for help.",
          icon: Cross,
        },
        {
          slug: "welfare-plan",
          name: "Welfare Provision Plan",
          description: "Toilets, washing, drying, rest area, drinking water — CDM-compliant.",
          icon: Home,
        },
        {
          slug: "emergency-action-plan",
          name: "Emergency Action Plan",
          description: "Fire, evacuation, casualty, spill — who does what, in what order.",
          icon: Siren,
        },
      ]}
    />
  );
}
