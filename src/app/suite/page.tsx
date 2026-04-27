import { PlannedToolLanding } from "@/components/marketing/planned-tool-landing";
import { TOOLS } from "@/tools";

export const metadata = {
  title: `${TOOLS.suite.name} — ClickNComply`,
  description: TOOLS.suite.description,
};

export default function SuiteLanding() {
  return <PlannedToolLanding slug="suite" />;
}
