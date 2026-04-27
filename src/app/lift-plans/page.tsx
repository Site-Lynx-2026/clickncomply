import { PlannedToolLanding } from "@/components/marketing/planned-tool-landing";
import { TOOLS } from "@/tools";

export const metadata = {
  title: `${TOOLS["lift-plans"].name} — ClickNComply`,
  description: TOOLS["lift-plans"].description,
};

export default function LiftPlansLanding() {
  return <PlannedToolLanding slug="lift-plans" />;
}
