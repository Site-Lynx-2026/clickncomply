/**
 * Tool registry for ClickNComply Group.
 *
 * Each "tool" is a standalone create-and-download service:
 *   - Has its own focused landing page (e.g. /rams)
 *   - Has its own price (£2-9/mo)
 *   - Generates a specific document type (RAMs, QA, lift plan, HR doc, audit pack)
 *
 * Tools share one auth, one DB, one Stripe account, one design system —
 * but each looks/feels standalone to the user. The "ClickNComply Group"
 * brand is intentionally not pushed.
 *
 * Build sequence:
 *   V1: RAMs Builder (lowest ticket, fastest validation)
 *   V2: QA Builder
 *   V3: Lift Plan Maker
 *   V4: HR Lite
 *   V5: Compliance Suite (uses framework registry from src/frameworks/)
 *   V6+: New tools per pain point we discover
 */

import {
  ShieldAlert,
  ClipboardCheck,
  MoveVertical,
  Users,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type ToolSlug = "rams" | "lift-plans" | "qa" | "hr" | "suite";
export type ToolStatus = "live" | "wip" | "planned" | "waitlist";

export type PricingType = "per-user" | "per-employee-plus-admin" | "flat";

export interface ToolPricing {
  type: PricingType;
  monthly: number;
  annual: number;
  // Optional secondary rate (e.g. HR Lite has admin + per-employee)
  adminMonthly?: number;
  adminAnnual?: number;
  note?: string;
}

export interface Tool {
  slug: ToolSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: ToolStatus;
  pricing: ToolPricing;
  // Frameworks this tool covers — empty for standalone tools, populated for Suite
  frameworks: string[];
  // Public landing route
  landingPath: string;
  // In-app working route (after auth + activation)
  appPath: string;
}

export const TOOLS: Record<ToolSlug, Tool> = {
  rams: {
    slug: "rams",
    name: "RAMs Builder",
    shortName: "RAMs",
    tagline: "RAMs in 5 minutes. Pre-made library + AI fill-in.",
    description:
      "Build risk assessments and method statements for any trade. Pre-made templates by sector, AI-assisted detail capture, branded PDF output ready to send up the chain.",
    icon: ShieldAlert,
    status: "wip",
    pricing: { type: "per-user", monthly: 2, annual: 20 },
    frameworks: [],
    landingPath: "/rams",
    appPath: "/tools/rams",
  },
  "lift-plans": {
    slug: "lift-plans",
    name: "Lift Plan Maker",
    shortName: "Lift Plans",
    tagline: "BS 7121 compliant lift plans in 10 minutes.",
    description:
      "Compliant lift plans for cranes, hoists, telehandlers, and lifting operations. LOLER-aligned templates, exclusion-zone diagrams, auto-formatted PDFs.",
    icon: MoveVertical,
    status: "planned",
    pricing: { type: "per-user", monthly: 2, annual: 20 },
    frameworks: [],
    landingPath: "/lift-plans",
    appPath: "/tools/lift-plans",
  },
  qa: {
    slug: "qa",
    name: "QA Builder",
    shortName: "QA",
    tagline: "QA reports + handover packs. Pre-made trade library.",
    description:
      "Build inspection sheets, handover packs, and QA reports for every trade. Photo upload, sign-off, branded PDF output that auditors and main contractors actually accept.",
    icon: ClipboardCheck,
    status: "planned",
    pricing: { type: "per-user", monthly: 4, annual: 40 },
    frameworks: [],
    landingPath: "/qa",
    appPath: "/tools/qa",
  },
  hr: {
    slug: "hr",
    name: "HR Lite",
    shortName: "HR",
    tagline: "Employee docs without the BrightHR price tag.",
    description:
      "Employee handbooks, contracts, policies, and starter packs. Pay only for what you have — £2.50 per admin and £0.50 per employee. No geofencing, no clock-ins. Just the docs you need.",
    icon: Users,
    status: "planned",
    pricing: {
      type: "per-employee-plus-admin",
      adminMonthly: 2.5,
      adminAnnual: 25,
      monthly: 0.5,
      annual: 5,
      note: "£2.50/admin + £0.50/employee per month",
    },
    frameworks: [],
    landingPath: "/hr",
    appPath: "/tools/hr",
  },
  suite: {
    slug: "suite",
    name: "Compliance Suite",
    shortName: "Suite",
    tagline: "Every framework, one £9 subscription.",
    description:
      "Manage ISO 9001, BS EN 1090, CHAS, ConstructionLine, ISO 14001, ISO 45001, ISO 27001, Cyber Essentials, GDPR, HACCP, and CDM 2015 in one place. Replaces a £2,000+ consultant.",
    icon: ShieldCheck,
    status: "wip",
    pricing: { type: "flat", monthly: 9, annual: 86 },
    frameworks: [
      "iso-9001",
      "bs-en-1090",
      "chas",
      "constructionline",
      "iso-14001",
      "iso-45001",
      "iso-27001",
      "cyber-essentials",
      "gdpr",
      "haccp",
      "cdm-2015",
    ],
    landingPath: "/suite",
    appPath: "/tools/suite",
  },
};

export const ALL_TOOLS = Object.values(TOOLS);

export const ACTIVATABLE_TOOLS = ALL_TOOLS.filter(
  (t) => t.status === "live" || t.status === "wip"
);

export const PLANNED_TOOLS = ALL_TOOLS.filter((t) => t.status === "planned");

/**
 * Format pricing as a display string.
 * e.g. "£2 / user / month" or "£2.50 admin + £0.50 employee / month"
 */
export function formatPricing(tool: Tool): string {
  const p = tool.pricing;
  switch (p.type) {
    case "flat":
      return `£${p.monthly} / month`;
    case "per-user":
      return `£${p.monthly} / user / month`;
    case "per-employee-plus-admin":
      return `£${p.adminMonthly} admin + £${p.monthly} employee / month`;
  }
}
