import { notFound } from "next/navigation";
import { getBuilder } from "@/lib/rams/builders";
import { BuilderShell } from "../_components/builder-shell";
import { ComingSoon } from "../_components/coming-soon";
import { FullRamsBuilder } from "../_builders/full";
import { MethodStatementBuilder } from "../_builders/method-statement";
import { RiskAssessmentBuilder } from "../_builders/risk-assessment";
import { CoshhBuilder } from "../_builders/coshh";
import { HavsBuilder } from "../_builders/havs";
import { ToolboxTalkBuilder } from "../_builders/toolbox-talk";
import { RaLibrary } from "../_builders/ra-library";
import { PermitBuilder } from "../_builders/permit";
import { BriefingBuilder } from "../_builders/briefing";
import { InspectionBuilder } from "../_builders/inspection";
import { PlanBuilder } from "../_builders/plan";
import { LibraryBrowser } from "../_builders/library";
import {
  COSHH_LIBRARY,
  HAVS_LIBRARY,
  NOISE_LIBRARY,
  RAMS_TRADES,
} from "@/lib/rams/library";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ builder: string }>;
}) {
  const { builder } = await params;
  const b = getBuilder(builder);
  if (!b) return {};
  return {
    title: `${b.name} — RAMs Builder — ClickNComply`,
    description: b.tagline,
  };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ builder: string }>;
}) {
  const { builder: slug } = await params;
  const builder = getBuilder(slug);
  if (!builder) notFound();

  const body = renderBody(slug);

  return <BuilderShell builder={builder}>{body}</BuilderShell>;
}

function renderBody(slug: string) {
  switch (slug) {
    case "full":
      return <FullRamsBuilder />;
    case "method-statement":
      return <MethodStatementBuilder />;
    case "risk-assessment":
      return <RiskAssessmentBuilder />;
    case "coshh":
      return <CoshhBuilder />;
    case "havs":
      return <HavsBuilder />;
    case "toolbox-talk":
      return <ToolboxTalkBuilder />;
    case "ra-library":
      return <RaLibrary />;
    // ─── Specialist assessments — reuse RiskAssessment pattern ───
    case "working-at-height":
      return (
        <RiskAssessmentBuilder
          slug="working-at-height"
          categoryFilter="wah"
          defaultTitle="Working at Height Assessment"
        />
      );
    case "manual-handling":
      return (
        <RiskAssessmentBuilder
          slug="manual-handling"
          categoryFilter="mh"
          defaultTitle="Manual Handling Assessment"
        />
      );
    case "hot-works":
      return (
        <RiskAssessmentBuilder
          slug="hot-works"
          categoryFilter="fire"
          defaultTitle="Hot Works Assessment"
        />
      );
    case "confined-space":
      return (
        <RiskAssessmentBuilder
          slug="confined-space"
          categoryFilter="confined"
          defaultTitle="Confined Space Assessment"
        />
      );
    case "lone-working":
      return (
        <RiskAssessmentBuilder
          slug="lone-working"
          categoryFilter="general"
          defaultTitle="Lone Working Assessment"
        />
      );
    case "dsear":
      return (
        <RiskAssessmentBuilder
          slug="dsear"
          categoryFilter="fire"
          defaultTitle="DSEAR Assessment"
        />
      );
    case "pregnant-worker":
      return (
        <RiskAssessmentBuilder
          slug="pregnant-worker"
          categoryFilter="health"
          defaultTitle="Pregnant Worker Assessment"
        />
      );
    case "young-worker":
      return (
        <RiskAssessmentBuilder
          slug="young-worker"
          categoryFilter="health"
          defaultTitle="Young Worker Assessment"
        />
      );
    case "whole-body-vibration":
      return (
        <RiskAssessmentBuilder
          slug="whole-body-vibration"
          categoryFilter="noise"
          defaultTitle="Whole-Body Vibration Assessment"
        />
      );
    // ─── Permits to Work — generic permit shape ───
    case "permit-to-work":
      return (
        <PermitBuilder
          slug="permit-to-work"
          defaultTitle="Permit to Work"
          intro="Generic permit-to-work form. Use for any controlled activity that needs an issuer + holder + validity window."
        />
      );
    case "hot-works-permit":
      return (
        <PermitBuilder
          slug="hot-works-permit"
          defaultTitle="Hot Works Permit"
          intro="Permit for welding, cutting, grinding or any naked-flame work. Fire watch required during and 60 minutes after."
          defaultPrecautions="• Combustibles removed within 10m / shielded with fire blanket\n• Two CO2 / dry-powder extinguishers at the work area\n• Smoke detection isolated in zone (record + restore)\n• Fire watch maintained during work + 60 mins after\n• Hot work area inspected at end of shift before leaving"
        />
      );
    case "permit-to-dig":
      return (
        <PermitBuilder
          slug="permit-to-dig"
          defaultTitle="Permit to Dig"
          intro="Required for any excavation. Service drawings + CAT scan + permit before any spade hits the ground."
          defaultPrecautions="• Latest service drawings reviewed and on site\n• CAT and Genny scan completed within 24 hrs of work\n• Trial holes hand-dug at every detected service\n• Edges battered or supported as per CDM 2015\n• Daily inspection by competent person while open"
        />
      );
    case "confined-space-entry":
      return (
        <PermitBuilder
          slug="confined-space-entry"
          defaultTitle="Confined Space Entry Permit"
          intro="Confined Spaces Regs 1997. Atmospheric monitoring, top-man, escape plan and rescue equipment required."
          defaultPrecautions="• Atmospheric test (O2, LEL, H2S, CO) before entry + continuous\n• Top-man stationed outside entry point throughout\n• Escape and rescue plan briefed and equipment on site\n• Two-way comms with entrant established + tested\n• Forced ventilation running where required"
        />
      );
    case "working-at-height-permit":
      return (
        <PermitBuilder
          slug="working-at-height-permit"
          defaultTitle="Working at Height Permit"
          intro="Required for non-routine height work. Edge protection, harness, rescue plan and weather check before issue."
          defaultPrecautions="• Edge protection in place at all open edges\n• Harness inspected, anchor points identified and rated\n• Rescue plan briefed + equipment available\n• Wind speed checked — stand down >28 mph\n• Exclusion zone below work area signed and barriered"
        />
      );
    // ─── Briefings — generic briefing shape ───
    case "site-induction":
      return (
        <BriefingBuilder
          slug="site-induction"
          defaultTitle="Site Induction"
          intro="Standard site induction for new starters. Cover the site rules, hazards, welfare, emergency procedures and PPE."
          defaultPoints={[
            "Site layout, welfare facilities and rest areas",
            "Site rules — PPE mandatory, no smoking, speed limit",
            "Specific hazards on site — note any active works",
            "Fire alarm signal, assembly point, fire warden details",
            "First aid arrangements — first aiders + kit location",
            "Reporting accidents and near misses (RIDDOR)",
            "Sign in/out procedure",
          ]}
        />
      );
    case "daily-activity-briefing":
      return (
        <BriefingBuilder
          slug="daily-activity-briefing"
          defaultTitle="Daily Activity Briefing"
          intro="Daily start-of-shift briefing. Walk through today's activities, hazards, weather and any changes since yesterday."
          defaultPoints={[
            "Today's planned activities — area + sequence",
            "Active hazards — what's changed since yesterday",
            "Weather check + impact on works",
            "Permits issued or active today",
            "PPE reminders for today's tasks",
          ]}
        />
      );
    case "pre-task-briefing":
      return (
        <BriefingBuilder
          slug="pre-task-briefing"
          defaultTitle="Pre-task Briefing"
          intro="Briefing immediately before starting a high-risk task. Confirms RAMS understood, PPE in place, controls active."
          defaultPoints={[
            "Task description and sequence",
            "Hazards identified in the RAMS",
            "Controls in place — confirm each one",
            "PPE required — check each operative has it",
            "Stop conditions — when to halt and re-assess",
          ]}
        />
      );
    // ─── Plant inspections — generic inspection checklist ───
    case "puwer-check":
      return (
        <InspectionBuilder
          slug="puwer-check"
          defaultTitle="PUWER Pre-Use Check"
          intro="Pre-use inspection under the Provision and Use of Work Equipment Regulations 1998. Operator-level visual + functional check before each shift."
          defaultItems={[
            "Operator competent and authorised to use this equipment",
            "Pre-start visual check completed (no visible damage)",
            "Guards in place and undamaged",
            "Emergency stop functional",
            "Fluid levels (oil, hydraulic, coolant) within range",
            "Tyres / tracks in serviceable condition",
            "Lights, horn, reversing alarm functional",
            "PPE for this equipment available and worn",
            "No signs of leaks, unusual noise or vibration",
            "Logbook reviewed for outstanding defects",
          ]}
        />
      );
    case "loler-inspection":
      return (
        <InspectionBuilder
          slug="loler-inspection"
          defaultTitle="LOLER Inspection"
          intro="Thorough examination under the Lifting Operations and Lifting Equipment Regulations 1998. 6-monthly for accessories that lift people, 12-monthly for other lifting equipment."
          defaultItems={[
            "SWL clearly marked and legible",
            "Identifying mark / serial number visible",
            "No visible cracks, corrosion or distortion",
            "Hooks: throat opening within manufacturer tolerance",
            "Slings: no broken wires, kinks, or chemical damage",
            "Shackles: pin secure, no spreading",
            "Chains: no stretched or distorted links",
            "All wear within allowable limits",
            "Test certificate available and in date",
            "Equipment fit for continued service",
          ]}
        />
      );
    case "plant-prestart":
      return (
        <InspectionBuilder
          slug="plant-prestart"
          defaultTitle="Plant Pre-Start Check"
          intro="Daily pre-start inspection for site plant — excavators, dumpers, telehandlers, MEWPs. Operator completes before first use of shift."
          defaultItems={[
            "Walk-around visual inspection complete",
            "All fluid levels checked (engine, hydraulic, coolant)",
            "Tyres / tracks inflated and undamaged",
            "All controls operate freely",
            "Brakes function (service + parking)",
            "Steering operates correctly",
            "Lights, horn, reversing alarm functional",
            "Mirrors and cameras clean and adjusted",
            "Safety devices (seat belt, FOPS, ROPS) intact",
            "Operator's manual on machine",
          ]}
        />
      );
    case "equipment-register":
      return (
        <InspectionBuilder
          slug="equipment-register"
          defaultTitle="Equipment Register Entry"
          intro="Asset-level record for any item of plant or equipment. Use to track inspection history and current status."
          defaultItems={[
            "Asset tagged and ID visible",
            "Manufacturer's manual available",
            "Last service / inspection in date",
            "Test certificates current",
            "PAT test current (if electrical)",
            "Operator training records on file",
            "Item in serviceable condition",
          ]}
        />
      );
    // ─── PPE & Welfare plans — generic plan shape ───
    case "ppe-schedule":
      return (
        <PlanBuilder
          slug="ppe-schedule"
          defaultTitle="PPE Schedule"
          intro="Site-wide PPE schedule. List the mandatory and task-specific PPE for this project, with EN standards and inspection cadence."
          defaultSections={[
            {
              label: "Mandatory PPE (all areas)",
              body: "• Hard hat (EN 397)\n• Safety footwear (EN ISO 20345)\n• High-vis vest (EN ISO 20471)\n• Safety gloves (EN 388)\n• Safety glasses (EN 166)",
            },
            {
              label: "Task-specific PPE",
              body: "List each task and the additional PPE required (e.g. ear defenders for >85 dB activities, FFP3 mask for cutting concrete, leather welding gauntlets for hot works).",
            },
            {
              label: "Inspection & replacement",
              body: "Pre-use visual check by operative each shift. Full inspection by site supervisor weekly. Damaged PPE removed immediately and replaced. Records kept on equipment register.",
            },
          ]}
        />
      );
    case "first-aid-assessment":
      return (
        <PlanBuilder
          slug="first-aid-assessment"
          defaultTitle="First Aid Needs Assessment"
          intro="Health and Safety (First-Aid) Regulations 1981. Assesses first aid provision required for the site based on hazards, headcount and remoteness."
          defaultSections={[
            { label: "Hazards on site" },
            { label: "Number of people on site" },
            { label: "Distance to nearest hospital / A&E" },
            {
              label: "First aid provision",
              body: "First aiders (number + qualification level), first aid kits (location + contents), eye-wash stations, defibrillator if required.",
            },
            { label: "Procedure for serious injury" },
          ]}
        />
      );
    case "welfare-plan":
      return (
        <PlanBuilder
          slug="welfare-plan"
          defaultTitle="Welfare Provision Plan"
          intro="CDM 2015 Schedule 2 — welfare provision. Toilets, washing, drinking water, rest area, drying room, food prep."
          defaultSections={[
            {
              label: "Toilets & washing",
              body: "Number of toilets, type (flushing / chemical), location, washing facilities (hot + cold water, soap, towels).",
            },
            { label: "Drinking water" },
            { label: "Rest area / canteen" },
            { label: "Drying room / changing facilities" },
            { label: "Cleaning regime" },
          ]}
        />
      );
    case "emergency-action-plan":
      return (
        <PlanBuilder
          slug="emergency-action-plan"
          defaultTitle="Emergency Action Plan"
          intro="Site emergency plan covering fire, medical emergency, structural collapse, severe weather and security incidents."
          defaultSections={[
            {
              label: "Fire emergency",
              body: "Alarm signal, evacuation route, assembly point, roll call procedure, fire warden contact details.",
            },
            { label: "Medical emergency" },
            { label: "Structural collapse / entrapment" },
            { label: "Severe weather" },
            { label: "Security incident / intruder" },
            {
              label: "Emergency contacts",
              body: "999 (emergency services), site manager (24/7 contact), nearest hospital, principal contractor, local police.",
            },
          ]}
        />
      );
    // ─── Noise Assessment — plan shape with noise-specific sections ───
    // ─── Library browsers — read-only catalogues ───
    case "coshh-library":
      return (
        <LibraryBrowser
          heading="COSHH Library"
          intro={`${COSHH_LIBRARY.length} pre-built substance assessments. Use any of these as a starting point for your own COSHH assessment.`}
          searchPlaceholder={`Search ${COSHH_LIBRARY.length} substances…`}
          items={COSHH_LIBRARY.map((s) => ({
            id: s.id,
            title: s.substance,
            category: s.category,
            meta: s.routeOfExposure,
            body: s.controls,
          }))}
        />
      );
    case "havs-library":
      return (
        <LibraryBrowser
          heading="HAVs Tool Database"
          intro={`${HAVS_LIBRARY.length} tools with pre-loaded vibration magnitudes. Pick from here when building a HAVs assessment.`}
          searchPlaceholder={`Search ${HAVS_LIBRARY.length} tools…`}
          items={HAVS_LIBRARY.map((t) => ({
            id: t.id,
            title: t.tool,
            meta: `${t.vibrationMag} m/s²`,
            body: t.typicalUse,
          }))}
        />
      );
    case "noise-library":
      return (
        <LibraryBrowser
          heading="Noise Activity Database"
          intro={`${NOISE_LIBRARY.length} site activities with typical dB(A) levels. Reference for noise assessments.`}
          searchPlaceholder={`Search ${NOISE_LIBRARY.length} activities…`}
          items={NOISE_LIBRARY.map((n) => ({
            id: n.id,
            title: n.activity,
            meta: `${n.typicalDb} dB(A)`,
            body: n.controls,
          }))}
        />
      );
    case "trade-templates":
      return (
        <LibraryBrowser
          heading="Trade Templates"
          intro={`${RAMS_TRADES.length} trade-specific RAMs templates. Each is a starting point with hazards, COSHH, HAVs and method steps for that trade.`}
          searchPlaceholder={`Search ${RAMS_TRADES.length} trades…`}
          items={RAMS_TRADES.map((t) => ({
            id: t.id,
            title: t.trade,
            category: t.category,
            meta: `${t.raItems.length} hazards`,
            body: t.description,
          }))}
        />
      );
    case "noise":
      return (
        <PlanBuilder
          slug="noise"
          defaultTitle="Noise Assessment"
          intro="Control of Noise at Work Regulations 2005. Document noise sources, exposure levels, hearing protection zones and controls."
          defaultSections={[
            {
              label: "Noise sources",
              body: "List each noise source with typical dB(A) levels and duration of exposure.",
            },
            {
              label: "Daily exposure (LEPd)",
              body: "Calculated daily exposure. Lower EAV: 80 dB(A) · Upper EAV: 85 dB(A) · ELV: 87 dB(A).",
            },
            {
              label: "Hearing protection zones",
              body: "Areas designated as hearing protection zones. Signage and access controls.",
            },
            {
              label: "Hearing protection type",
              body: "Type and SNR rating of hearing protection issued.",
            },
            {
              label: "Controls",
              body: "Engineering controls, time limits, low-noise method selection, health surveillance.",
            },
          ]}
        />
      );
    default:
      return <ComingSoon slug={slug} />;
  }
}
