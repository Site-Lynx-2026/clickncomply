import { PlannedToolLanding } from "@/components/marketing/planned-tool-landing";
import { TOOLS } from "@/tools";

export const metadata = {
  title: `${TOOLS.qa.name} — ClickNComply`,
  description: TOOLS.qa.description,
};

export default function QaLanding() {
  return <PlannedToolLanding slug="qa" />;
}
