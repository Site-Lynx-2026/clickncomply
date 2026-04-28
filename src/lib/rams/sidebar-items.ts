import {
  FileStack,
  ScrollText,
  ShieldAlert,
  FlaskConical,
  Activity,
  Volume2,
  ClipboardCheck,
  Megaphone,
  Wrench,
  Shirt,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated RAMs sidebar — 10 entries, no sections, no library.
 *
 * Down from 37 across 8 sections to 10 flat. The 26 specialist /
 * variant slugs (working-at-height, hot-works-permit, etc.) are still
 * routable as deep links from the AI intake and as direct URLs, but
 * they are not surfaced as sidebar items. Daily-driver users land in
 * the right umbrella entry and pick the variant inside.
 *
 * The Library section (RA Library, COSHH Library, HAVs DB, Noise DB,
 * Trade Templates) is hidden — those are authoring/data surfaces that
 * leak inside the builders that need them, not user nav.
 */

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  href: string;
  /** "wip" shows a small lime dot. "live" is silent. Affects display only. */
  status?: "live" | "wip";
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  // Make
  {
    label: "Full RAMs",
    icon: FileStack,
    href: "/tools/rams/full",
    status: "wip",
  },

  // Documents
  {
    label: "Method Statement",
    icon: ScrollText,
    href: "/tools/rams/method-statement",
    status: "wip",
  },
  {
    label: "Risk Assessment",
    icon: ShieldAlert,
    href: "/tools/rams/risk-assessment",
    status: "wip",
  },
  {
    label: "COSHH",
    icon: FlaskConical,
    href: "/tools/rams/coshh",
    status: "wip",
  },
  {
    label: "HAVs",
    icon: Activity,
    href: "/tools/rams/havs",
    status: "wip",
  },
  {
    label: "Noise",
    icon: Volume2,
    href: "/tools/rams/noise",
    status: "wip",
  },

  // Workflow umbrellas (each opens a 4–5 tile picker)
  {
    label: "Permit",
    icon: ClipboardCheck,
    href: "/tools/rams/permits",
    status: "wip",
  },
  {
    label: "Briefing",
    icon: Megaphone,
    href: "/tools/rams/briefings",
    status: "wip",
  },
  {
    label: "Inspection",
    icon: Wrench,
    href: "/tools/rams/inspections",
    status: "wip",
  },
  {
    label: "Plan",
    icon: Shirt,
    href: "/tools/rams/plans",
    status: "wip",
  },
];
