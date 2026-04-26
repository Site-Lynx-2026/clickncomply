/**
 * Framework registry — single source of truth for all compliance frameworks
 * supported by ClickNComply. Each framework registers itself here.
 *
 * Build sequence:
 *   V1: ISO 9001
 *   V2: BS EN 1090, CHAS
 *   V3: ISO 14001, ISO 45001
 *   V4: ConstructionLine, GDPR, ISO 27001, Cyber Essentials
 *   V5+: HACCP, CDM 2015, others driven by demand
 *
 * NOTE: Trademark / legal — see research/LEGAL.md for required wording.
 *   - Never display ISO/CHAS/Cyber Essentials logos
 *   - Use "templates aligned with ISO 9001:2015", not "ISO 9001 compliant"
 *   - All outputs labelled "AI-generated draft"
 */

export type FrameworkSlug =
  | "iso-9001"
  | "bs-en-1090"
  | "chas"
  | "constructionline"
  | "iso-14001"
  | "iso-45001"
  | "iso-27001"
  | "cyber-essentials"
  | "gdpr"
  | "haccp"
  | "cdm-2015";

export interface FrameworkDefinition {
  slug: FrameworkSlug;
  name: string;
  shortName: string;
  fullVersion: string;
  publishedBy: string;
  description: string;
  whoNeedsIt: string;
  liveStatus: "live" | "wip" | "planned";
  // V1 has only ISO 9001 live. Others fill in week by week.
}

export const FRAMEWORKS: Record<FrameworkSlug, FrameworkDefinition> = {
  "iso-9001": {
    slug: "iso-9001",
    name: "Quality Management System (ISO 9001:2015)",
    shortName: "ISO 9001",
    fullVersion: "ISO 9001:2015",
    publishedBy: "International Organization for Standardization",
    description:
      "Generic quality management system standard. The most-certified management standard worldwide.",
    whoNeedsIt: "Anyone selling B2B at scale, especially to larger contractors and supply chains.",
    liveStatus: "wip",
  },
  "bs-en-1090": {
    slug: "bs-en-1090",
    name: "Steel and Aluminium Structure Execution (BS EN 1090-2:2018+A1:2024)",
    shortName: "BS EN 1090",
    fullVersion: "BS EN 1090-2:2018+A1:2024",
    publishedBy: "BSI / CEN",
    description:
      "Mandatory CE/UKCA marking standard for fabricated steel structures. Defines Execution Classes and Factory Production Control.",
    whoNeedsIt: "Steel fabricators selling structural steelwork in UK/EU.",
    liveStatus: "planned",
  },
  chas: {
    slug: "chas",
    name: "CHAS Health & Safety Pre-qualification",
    shortName: "CHAS",
    fullVersion: "CHAS (Veriforce) — current",
    publishedBy: "Veriforce CHAS",
    description: "UK SSIP-affiliated H&S accreditation for contractors and suppliers.",
    whoNeedsIt: "UK construction subcontractors selling to main contractors and public sector.",
    liveStatus: "planned",
  },
  constructionline: {
    slug: "constructionline",
    name: "Constructionline Pre-qualification",
    shortName: "Constructionline",
    fullVersion: "Constructionline (Bronze/Silver/Gold)",
    publishedBy: "Warringtonfire / Constructionline",
    description: "UK supply-chain pre-qualification used widely by main contractors and public sector.",
    whoNeedsIt: "UK construction subcontractors and suppliers.",
    liveStatus: "planned",
  },
  "iso-14001": {
    slug: "iso-14001",
    name: "Environmental Management System (ISO 14001:2015)",
    shortName: "ISO 14001",
    fullVersion: "ISO 14001:2015",
    publishedBy: "International Organization for Standardization",
    description: "Environmental management system standard. Reuses ~70% of ISO 9001 templates.",
    whoNeedsIt: "Businesses with environmental impact / regulated waste / public sector tenders.",
    liveStatus: "planned",
  },
  "iso-45001": {
    slug: "iso-45001",
    name: "Occupational Health & Safety Management System (ISO 45001:2018)",
    shortName: "ISO 45001",
    fullVersion: "ISO 45001:2018",
    publishedBy: "International Organization for Standardization",
    description: "OH&S management system standard. Replaces older OHSAS 18001.",
    whoNeedsIt: "Any business with employee health & safety obligations beyond statutory minimum.",
    liveStatus: "planned",
  },
  "iso-27001": {
    slug: "iso-27001",
    name: "Information Security Management System (ISO 27001:2022)",
    shortName: "ISO 27001",
    fullVersion: "ISO 27001:2022",
    publishedBy: "International Organization for Standardization",
    description: "Information security management standard.",
    whoNeedsIt: "Tech businesses, SaaS, MSPs, anyone holding sensitive customer data at scale.",
    liveStatus: "planned",
  },
  "cyber-essentials": {
    slug: "cyber-essentials",
    name: "Cyber Essentials (UK NCSC)",
    shortName: "Cyber Essentials",
    fullVersion: "Cyber Essentials v3.3 (Danzell)",
    publishedBy: "UK NCSC / IASME",
    description: "UK government-backed cyber security certification.",
    whoNeedsIt: "UK businesses selling to government or in supply chains that require it.",
    liveStatus: "planned",
  },
  gdpr: {
    slug: "gdpr",
    name: "UK GDPR / EU GDPR",
    shortName: "GDPR",
    fullVersion: "UK GDPR + Data Protection Act 2018 + EU GDPR (Reg 2016/679)",
    publishedBy: "ICO (UK), EDPB (EU)",
    description: "Data protection regulation. No certification — operational compliance with continuous accountability records.",
    whoNeedsIt: "Every business holding personal data of UK or EU individuals.",
    liveStatus: "planned",
  },
  haccp: {
    slug: "haccp",
    name: "HACCP Food Safety",
    shortName: "HACCP",
    fullVersion: "HACCP — Codex Alimentarius CXC 1-1969 Rev 5-2020",
    publishedBy: "Codex Alimentarius",
    description: "Hazard Analysis Critical Control Points — food safety system.",
    whoNeedsIt: "Food businesses (manufacturing, catering, retail).",
    liveStatus: "planned",
  },
  "cdm-2015": {
    slug: "cdm-2015",
    name: "Construction (Design and Management) Regulations 2015",
    shortName: "CDM 2015",
    fullVersion: "CDM Regulations 2015 (UK)",
    publishedBy: "HSE (UK)",
    description:
      "UK construction regulation. Mandates F10 Notification, Construction Phase Plan, Pre-Construction Info, Health & Safety File.",
    whoNeedsIt: "UK construction projects with multiple contractors or duration > 30 days.",
    liveStatus: "planned",
  },
};

export const LIVE_FRAMEWORKS = Object.values(FRAMEWORKS).filter(
  (f) => f.liveStatus === "live"
);

export const WIP_FRAMEWORKS = Object.values(FRAMEWORKS).filter(
  (f) => f.liveStatus === "wip"
);
