import {
  Megaphone,
  HardHat,
  CalendarClock,
  ClipboardList,
} from "lucide-react";
import { UmbrellaPicker } from "../_components/umbrella-picker";

export const metadata = {
  title: "Briefings & Talks — ClickNComply",
  description: "Toolbox talks, site inductions, daily activity briefings, pre-task briefings.",
};

export default function BriefingsPickerPage() {
  return (
    <UmbrellaPicker
      eyebrow="Briefings"
      title="Brief the crew"
      subtitle="Pick the type. Each one prints with a sign-on sheet so everyone present is recorded."
      items={[
        {
          slug: "toolbox-talk",
          name: "Toolbox Talk",
          description: "Topic-focused team talk — pre-built topics or write your own.",
          icon: Megaphone,
        },
        {
          slug: "site-induction",
          name: "Site Induction",
          description: "First-day orientation: rules, hazards, welfare, emergency.",
          icon: HardHat,
        },
        {
          slug: "daily-activity-briefing",
          name: "Daily Activity Briefing",
          description: "Morning huddle — today's work, hazards, controls.",
          icon: CalendarClock,
        },
        {
          slug: "pre-task-briefing",
          name: "Pre-task Briefing",
          description: "Before a high-risk task — confirm method, controls, sign-on.",
          icon: ClipboardList,
        },
      ]}
    />
  );
}
