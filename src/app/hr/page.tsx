import { PlannedToolLanding } from "@/components/marketing/planned-tool-landing";
import { TOOLS } from "@/tools";

export const metadata = {
  title: `${TOOLS.hr.name} — ClickNComply`,
  description: TOOLS.hr.description,
};

export default function HrLanding() {
  return <PlannedToolLanding slug="hr" />;
}
