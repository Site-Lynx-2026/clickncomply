// ═══════════════════════════════════════════════════════════════════════════
// RAMs Builder registry — every standalone document the user can launch.
// Drives the sidebar, the landing dashboard, and the library browser.
//
// Sections render as grouped nav blocks in the sidebar (mirroring the SL
// visual grammar — small dim uppercase heading + dividers).
//
// Status:
//   - "live"     — fully wired builder, working PDF output
//   - "wip"      — UI built, generation behind a flag / partial
//   - "planned"  — route stub, "coming soon" screen w/ vote-to-build button
// ═══════════════════════════════════════════════════════════════════════════

import {
  FileStack,        // One-Click Full RAMs
  ScrollText,       // Method Statement
  ShieldAlert,      // Risk Assessment
  FlaskConical,     // COSHH
  Activity,         // HAVs
  Volume2,          // Noise
  PackageOpen,      // Manual Handling
  ArrowUpFromLine,  // Working at Height
  UserMinus,        // Lone Working
  CircleDot,        // Confined Space
  Flame,            // Hot Works
  Zap,              // DSEAR
  HeartPulse,       // Pregnant Worker
  Baby,             // Young Worker
  Vibrate,          // Whole-Body Vibration
  ClipboardCheck,   // Permit to Work
  FlameKindling,    // Hot Works Permit
  Shovel,           // Permit to Dig
  ArrowDownToDot,   // Confined Space Entry permit
  MountainSnow,     // Working at Height permit
  Megaphone,        // Toolbox Talk
  HardHat,          // Site Induction
  CalendarClock,    // Daily Activity Briefing
  ClipboardList,    // Pre-task Briefing
  Wrench,           // PUWER Pre-Use Check
  Anchor,           // LOLER Inspection
  PlayCircle,       // Plant Pre-Start
  Boxes,            // Tool & Equipment Register
  Shirt,            // PPE Schedule
  Cross,            // First Aid Needs Assessment
  Home,             // Welfare Provision Plan
  Siren,            // Emergency Action Plan
  BookOpen,         // RA Library
  FlaskRound,       // COSHH Library
  Drill,            // HAVs Tool Database
  AudioLines,       // Noise Activity Database
  Hammer,           // Trade Templates
  type LucideIcon,
} from "lucide-react";

export type BuilderStatus = "live" | "wip" | "planned";

export type BuilderSlug =
  // Build
  | "full"
  // Single Documents
  | "method-statement"
  | "risk-assessment"
  | "coshh"
  | "havs"
  | "noise"
  | "manual-handling"
  // Specialist Assessments
  | "working-at-height"
  | "lone-working"
  | "confined-space"
  | "hot-works"
  | "dsear"
  | "pregnant-worker"
  | "young-worker"
  | "whole-body-vibration"
  // Permits to Work
  | "permit-to-work"
  | "hot-works-permit"
  | "permit-to-dig"
  | "confined-space-entry"
  | "working-at-height-permit"
  // Briefings & Talks
  | "toolbox-talk"
  | "site-induction"
  | "daily-activity-briefing"
  | "pre-task-briefing"
  // Plant & Equipment
  | "puwer-check"
  | "loler-inspection"
  | "plant-prestart"
  | "equipment-register"
  // PPE & Welfare
  | "ppe-schedule"
  | "first-aid-assessment"
  | "welfare-plan"
  | "emergency-action-plan"
  // Library
  | "ra-library"
  | "coshh-library"
  | "havs-library"
  | "noise-library"
  | "trade-templates";

export interface Builder {
  slug: BuilderSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: BuilderStatus;
  /** Section the builder appears under in the sidebar. */
  section: BuilderSection;
  /** Tagline used on the landing tile. */
  tile?: string;
}

export type BuilderSection =
  | "build"
  | "documents"
  | "specialist"
  | "permits"
  | "briefings"
  | "plant"
  | "ppe"
  | "library";

export const SECTIONS: Record<BuilderSection, { label: string; order: number }> = {
  build:      { label: "Build",                  order: 0 },
  documents:  { label: "Single Documents",       order: 1 },
  specialist: { label: "Specialist Assessments", order: 2 },
  permits:    { label: "Permits to Work",        order: 3 },
  briefings:  { label: "Briefings & Talks",      order: 4 },
  plant:      { label: "Plant & Equipment",      order: 5 },
  ppe:        { label: "PPE & Welfare",          order: 6 },
  library:    { label: "Library",                order: 7 },
};

export const BUILDERS: Record<BuilderSlug, Builder> = {
  // ── BUILD ──
  full: {
    slug: "full",
    name: "One-Click Full RAMs",
    shortName: "Full RAMs",
    tagline: "Every assessment, one document — 12 steps, AI-assisted.",
    description:
      "The complete Risk Assessment & Method Statement document. Combines method, hazards, COSHH, HAVs, noise, PPE, plant and emergency procedures in one signable PDF. AI fills the long-form text from your tool selections.",
    icon: FileStack,
    status: "wip",
    section: "build",
    tile: "Full RAMS in 5 minutes",
  },

  // ── SINGLE DOCUMENTS ──
  "method-statement": {
    slug: "method-statement",
    name: "Method Statement",
    shortName: "Method Statement",
    tagline: "Sequence-of-work statement, ready to send up the chain.",
    description:
      "A standalone, branded method statement covering the sequence of work, responsibilities, plant, materials, and supervision. Pre-written steps by trade, AI tightens the wording.",
    icon: ScrollText,
    status: "wip",
    section: "documents",
  },
  "risk-assessment": {
    slug: "risk-assessment",
    name: "Risk Assessment",
    shortName: "Risk Assessment",
    tagline: "Hazards, controls, residual risk — pick from 300+ pre-built items.",
    description:
      "Build a risk assessment from a library of 300+ pre-written hazards across 18 categories. 5x5 matrix with auto-coloured residual risk. Add custom hazards, AI-suggest controls.",
    icon: ShieldAlert,
    status: "wip",
    section: "documents",
  },
  coshh: {
    slug: "coshh",
    name: "COSHH Assessment",
    shortName: "COSHH",
    tagline: "Substance-by-substance hazard control plan.",
    description:
      "COSHH assessments for every substance you handle on site. Pre-loaded library of 80+ common substances (cement, silica, isocyanates, epoxies, solvents). SDS reference, exposure routes, control hierarchy, emergency procedures.",
    icon: FlaskConical,
    status: "wip",
    section: "documents",
  },
  havs: {
    slug: "havs",
    name: "HAVs Assessment",
    shortName: "HAVs",
    tagline: "Hand-arm vibration log — auto-calculated EAV / ELV.",
    description:
      "Log every vibrating tool with daily trigger time. Vibration magnitudes pre-loaded for 60+ tools (breakers, grinders, SDS drills, sanders). Calculator flags Exposure Action Value (100 points) and Exposure Limit Value (400 points). Health surveillance prompts.",
    icon: Activity,
    status: "wip",
    section: "documents",
  },
  noise: {
    slug: "noise",
    name: "Noise Assessment",
    shortName: "Noise",
    tagline: "LEQ calculator — Lower / Upper EAV thresholds flagged.",
    description:
      "Daily noise dose calculator. Pre-loaded dB levels for 50+ activities. Flags Lower EAV (80 dB), Upper EAV (85 dB), Exposure Limit (87 dB). Hearing protection plan and zoning recommendations.",
    icon: Volume2,
    status: "wip",
    section: "documents",
  },
  "manual-handling": {
    slug: "manual-handling",
    name: "Manual Handling Assessment",
    shortName: "Manual Handling",
    tagline: "TILE format — task, individual, load, environment.",
    description:
      "Manual handling assessment using the HSE TILE structure. Load weights, lift heights, frequency, posture, environment. Auto-flags assessments above HSE guideline weights.",
    icon: PackageOpen,
    status: "wip",
    section: "documents",
  },

  // ── SPECIALIST ASSESSMENTS ──
  "working-at-height": {
    slug: "working-at-height",
    name: "Working at Height Assessment",
    shortName: "Working at Height",
    tagline: "Hierarchy of control — avoid, prevent, mitigate.",
    description:
      "Working at Height Regulations 2005 compliant assessment. Avoid > prevent > mitigate hierarchy. Edge protection, MEWP, scaffolding, ladders, harness, rescue plan.",
    icon: ArrowUpFromLine,
    status: "wip",
    section: "specialist",
  },
  "lone-working": {
    slug: "lone-working",
    name: "Lone Working Assessment",
    shortName: "Lone Working",
    tagline: "Check-in protocol, escalation, panic procedure.",
    description:
      "Lone worker risk assessment. Check-in cadence, supervisor escalation, lone worker device, panic procedure. Specific to site visits, surveys, out-of-hours work.",
    icon: UserMinus,
    status: "wip",
    section: "specialist",
  },
  "confined-space": {
    slug: "confined-space",
    name: "Confined Space Assessment",
    shortName: "Confined Space",
    tagline: "Atmospheric testing, top-man, rescue plan.",
    description:
      "Confined Spaces Regulations 1997 assessment. Atmospheric monitoring, ventilation, top-man duties, escape plan, rescue equipment. Tied to entry permit.",
    icon: CircleDot,
    status: "wip",
    section: "specialist",
  },
  "hot-works": {
    slug: "hot-works",
    name: "Hot Works Assessment",
    shortName: "Hot Works",
    tagline: "Welding, cutting, grinding — fire watch protocol.",
    description:
      "Hot works risk assessment for welding, cutting, grinding, brazing. Fire watch duration, exclusion zone, extinguisher placement, smoke detection isolation.",
    icon: Flame,
    status: "wip",
    section: "specialist",
  },
  dsear: {
    slug: "dsear",
    name: "DSEAR Assessment",
    shortName: "DSEAR",
    tagline: "Explosive atmospheres — zoning, ATEX equipment.",
    description:
      "Dangerous Substances and Explosive Atmospheres Regulations 2002 assessment. Hazardous zones (0/1/2, 20/21/22), ignition source control, ATEX-rated equipment.",
    icon: Zap,
    status: "wip",
    section: "specialist",
  },
  "pregnant-worker": {
    slug: "pregnant-worker",
    name: "Pregnant Worker Assessment",
    shortName: "Pregnant Worker",
    tagline: "Specific risks — chemicals, lifting, posture, fatigue.",
    description:
      "Risk assessment for pregnant workers and new/breastfeeding mothers. Manual handling limits, COSHH exclusions, posture, working time, rest provision.",
    icon: HeartPulse,
    status: "wip",
    section: "specialist",
  },
  "young-worker": {
    slug: "young-worker",
    name: "Young Worker Assessment",
    shortName: "Young Worker",
    tagline: "Under-18 controls — supervision, plant exclusions.",
    description:
      "Risk assessment for workers under 18. Supervision requirements, prohibited equipment, working hours, training and induction-specific controls.",
    icon: Baby,
    status: "wip",
    section: "specialist",
  },
  "whole-body-vibration": {
    slug: "whole-body-vibration",
    name: "Whole-Body Vibration",
    shortName: "WBV",
    tagline: "Plant operator vibration log — A(8) calculation.",
    description:
      "Whole-body vibration assessment for plant operators (dumpers, excavators, rollers). A(8) daily exposure calculation. EAV 0.5 m/s², ELV 1.15 m/s².",
    icon: Vibrate,
    status: "wip",
    section: "specialist",
  },

  // ── PERMITS TO WORK ──
  "permit-to-work": {
    slug: "permit-to-work",
    name: "Permit to Work",
    shortName: "Permit to Work",
    tagline: "Generic permit — issuer, holder, validity, sign-off.",
    description:
      "Generic permit-to-work template. Issuer, holder, validity window, work scope, isolations, controls, sign-off, hand-back.",
    icon: ClipboardCheck,
    status: "wip",
    section: "permits",
  },
  "hot-works-permit": {
    slug: "hot-works-permit",
    name: "Hot Works Permit",
    shortName: "Hot Works Permit",
    tagline: "FPA-style permit — fire watch, after-burn check.",
    description:
      "Hot works permit aligned with FPA / RC7 guidance. Fire watch duration (60 min after-burn check), extinguisher placement, smoke alarm isolation.",
    icon: FlameKindling,
    status: "wip",
    section: "permits",
  },
  "permit-to-dig": {
    slug: "permit-to-dig",
    name: "Permit to Dig",
    shortName: "Permit to Dig",
    tagline: "CAT scan record, service drawings, hand-dig zone.",
    description:
      "Permit to dig with mandatory CAT and Genny scan record, statutory utility drawings, hand-dig exclusion zone marker.",
    icon: Shovel,
    status: "wip",
    section: "permits",
  },
  "confined-space-entry": {
    slug: "confined-space-entry",
    name: "Confined Space Entry Permit",
    shortName: "CSE Permit",
    tagline: "Atmospheric test log, entrant register, top-man.",
    description:
      "Confined space entry permit. Atmospheric test log (O₂, LEL, H₂S, CO), entrant register, top-man details, rescue plan, validity window.",
    icon: ArrowDownToDot,
    status: "wip",
    section: "permits",
  },
  "working-at-height-permit": {
    slug: "working-at-height-permit",
    name: "Working at Height Permit",
    shortName: "WAH Permit",
    tagline: "Edge protection check, harness anchor, weather hold.",
    description:
      "Working at height permit. Edge protection inspection, anchor point check, harness inspection, wind speed hold (28 mph default), rescue plan reference.",
    icon: MountainSnow,
    status: "wip",
    section: "permits",
  },

  // ── BRIEFINGS & TALKS ──
  "toolbox-talk": {
    slug: "toolbox-talk",
    name: "Toolbox Talk",
    shortName: "Toolbox Talk",
    tagline: "Pick a topic, AI writes the briefing — sign-off attached.",
    description:
      "Generate a 5-minute toolbox talk on any topic. 100+ pre-built topics covering hazards, regulations, recent incidents. AI writes a punchy briefing, sign-off sheet attached.",
    icon: Megaphone,
    status: "wip",
    section: "briefings",
  },
  "site-induction": {
    slug: "site-induction",
    name: "Site Induction Pack",
    shortName: "Site Induction",
    tagline: "Branded, signed-off site induction with attendance log.",
    description:
      "Full site induction pack — site rules, hazards, emergency procedures, welfare, contacts. Attendance register and competency declaration on the back.",
    icon: HardHat,
    status: "wip",
    section: "briefings",
  },
  "daily-activity-briefing": {
    slug: "daily-activity-briefing",
    name: "Daily Activity Briefing",
    shortName: "DAB",
    tagline: "DAB sheet — today's tasks, hazards, sign-off.",
    description:
      "Daily Activity Briefing. Today's tasks, key hazards, weather, plant on site, attendance and sign-off. Auto-fills from any active RAMs.",
    icon: CalendarClock,
    status: "wip",
    section: "briefings",
  },
  "pre-task-briefing": {
    slug: "pre-task-briefing",
    name: "Pre-Task Briefing",
    shortName: "Pre-Task",
    tagline: "Quick task brief — hazards, controls, sign-off.",
    description:
      "Single-page pre-task briefing. Pulls from the parent RAMs, focuses on the task at hand, captures crew sign-off.",
    icon: ClipboardList,
    status: "wip",
    section: "briefings",
  },

  // ── PLANT & EQUIPMENT ──
  "puwer-check": {
    slug: "puwer-check",
    name: "PUWER Pre-Use Check",
    shortName: "PUWER Check",
    tagline: "Pre-use inspection sheet — sign and store.",
    description:
      "PUWER 1998 compliant pre-use inspection. Tool / plant condition checklist, defect log, operator sign-off. Pre-built sheets for common kit.",
    icon: Wrench,
    status: "wip",
    section: "plant",
  },
  "loler-inspection": {
    slug: "loler-inspection",
    name: "LOLER Inspection Sheet",
    shortName: "LOLER",
    tagline: "Lifting equipment thorough examination record.",
    description:
      "LOLER 1998 thorough examination record. Equipment ID, SWL, last exam, defects, competent person sign-off. Ties to lifting equipment register.",
    icon: Anchor,
    status: "wip",
    section: "plant",
  },
  "plant-prestart": {
    slug: "plant-prestart",
    name: "Plant Pre-Start Check",
    shortName: "Pre-Start",
    tagline: "Daily plant check — fluids, tyres, controls, alarms.",
    description:
      "Daily pre-start check for plant. Fluid levels, tyres / tracks, controls, lights, alarms, ROPS / FOPS. Operator sign-off, defect escalation.",
    icon: PlayCircle,
    status: "wip",
    section: "plant",
  },
  "equipment-register": {
    slug: "equipment-register",
    name: "Tool & Equipment Register",
    shortName: "Equipment Register",
    tagline: "Single source of truth for every piece of kit on site.",
    description:
      "Master register for tools, plant, lifting equipment, PPE. Last inspection, next due, owner, location. Ties to PUWER and LOLER records.",
    icon: Boxes,
    status: "wip",
    section: "plant",
  },

  // ── PPE & WELFARE ──
  "ppe-schedule": {
    slug: "ppe-schedule",
    name: "PPE Schedule",
    shortName: "PPE Schedule",
    tagline: "Task-by-task PPE matrix — what, when, why.",
    description:
      "PPE schedule keyed to tasks and hazards. Standard set + task-specific (RPE, gloves grade, eye protection rating). Issue log and replacement cadence.",
    icon: Shirt,
    status: "wip",
    section: "ppe",
  },
  "first-aid-assessment": {
    slug: "first-aid-assessment",
    name: "First Aid Needs Assessment",
    shortName: "First Aid",
    tagline: "HSE-compliant first aid provision sheet.",
    description:
      "First aid needs assessment per HSE guidance. Headcount, hazard category, distance from A&E. Recommends FAW / EFAW provision and kit composition.",
    icon: Cross,
    status: "wip",
    section: "ppe",
  },
  "welfare-plan": {
    slug: "welfare-plan",
    name: "Welfare Provision Plan",
    shortName: "Welfare",
    tagline: "Schedule 2 CDM compliance — toilets, washing, rest.",
    description:
      "Welfare provision plan per CDM 2015 Schedule 2. Toilets, washing, drying, rest, drinking water, heating. Headcount-driven sizing.",
    icon: Home,
    status: "wip",
    section: "ppe",
  },
  "emergency-action-plan": {
    slug: "emergency-action-plan",
    name: "Emergency Action Plan",
    shortName: "Emergency Plan",
    tagline: "Fire, medical, spill — single-page response card.",
    description:
      "Emergency action plan covering fire, medical, environmental spill, structural failure, security incident. Assembly point, contacts, escalation, on-call.",
    icon: Siren,
    status: "wip",
    section: "ppe",
  },

  // ── LIBRARY ──
  "ra-library": {
    slug: "ra-library",
    name: "Risk Assessment Library",
    shortName: "RA Library",
    tagline: "300+ pre-built risk assessments across 18 categories.",
    description:
      "Browse 300+ pre-written risk assessments across 18 categories. Free tier: read and copy. Paid tier: one-click into builder, branded PDF, no watermark.",
    icon: BookOpen,
    status: "wip",
    section: "library",
  },
  "coshh-library": {
    slug: "coshh-library",
    name: "COSHH Library",
    shortName: "COSHH Library",
    tagline: "80+ substances — SDS-aligned, ready to copy.",
    description:
      "Browse 80+ pre-built COSHH assessments — cement, silica, isocyanates, epoxies, solvents, fuels, sealants. Free tier read; paid tier copies into builder.",
    icon: FlaskRound,
    status: "wip",
    section: "library",
  },
  "havs-library": {
    slug: "havs-library",
    name: "HAVs Tool Database",
    shortName: "HAVs Tools",
    tagline: "60+ tools with vibration magnitudes pre-loaded.",
    description:
      "Vibration magnitude database for 60+ common tools — breakers, grinders, SDS drills, sanders, chainsaws. Manufacturer values where published, HSE typicals where not.",
    icon: Drill,
    status: "wip",
    section: "library",
  },
  "noise-library": {
    slug: "noise-library",
    name: "Noise Activity Database",
    shortName: "Noise Activities",
    tagline: "50+ activities with typical dB levels.",
    description:
      "Typical sound pressure levels for 50+ construction activities. Saw cutting, breaking, grinding, generator running. Drives the LEQ calculator.",
    icon: AudioLines,
    status: "wip",
    section: "library",
  },
  "trade-templates": {
    slug: "trade-templates",
    name: "Trade Templates",
    shortName: "Trade Templates",
    tagline: "80+ trades — pre-loaded RAMs starter packs.",
    description:
      "Trade-by-trade RAMs starter packs. Sparky, plumber, scaffolder, roofer, demolition, groundworker, joiner, painter, M&E. Pre-loads relevant RAs, COSHH, HAVs, noise.",
    icon: Hammer,
    status: "wip",
    section: "library",
  },
};

export const ALL_BUILDERS = Object.values(BUILDERS);

export function buildersBySection(): Record<BuilderSection, Builder[]> {
  const out = {} as Record<BuilderSection, Builder[]>;
  for (const key of Object.keys(SECTIONS) as BuilderSection[]) out[key] = [];
  for (const b of ALL_BUILDERS) out[b.section].push(b);
  return out;
}

export function getBuilder(slug: string): Builder | null {
  return (BUILDERS as Record<string, Builder | undefined>)[slug] ?? null;
}
