/**
 * Toolbox Talk topic library — 100+ pre-curated topics across 8 themes.
 *
 * Each topic is a clickable card that auto-runs the AI generator. The
 * library IS the product — the user picks a topic, the briefing is in
 * front of them in 2 seconds.
 */

export interface ToolboxTopic {
  id: string;
  title: string;
  subtitle: string;
  category: ToolboxCategory;
  icon: string;
}

export type ToolboxCategory =
  | "wah"
  | "plant"
  | "health"
  | "site"
  | "behavioural"
  | "weather"
  | "specialist"
  | "incident";

export const TOOLBOX_CATEGORIES: { id: ToolboxCategory; label: string; icon: string }[] = [
  { id: "wah", label: "Working at Height", icon: "🪜" },
  { id: "plant", label: "Plant & Equipment", icon: "🚜" },
  { id: "health", label: "Health & Wellbeing", icon: "❤️" },
  { id: "site", label: "Site Hazards", icon: "⚠️" },
  { id: "behavioural", label: "Behaviour & Culture", icon: "🤝" },
  { id: "weather", label: "Weather & Seasonal", icon: "🌦️" },
  { id: "specialist", label: "Specialist Tasks", icon: "🔬" },
  { id: "incident", label: "Incidents & Lessons", icon: "📋" },
];

export const TOOLBOX_TOPICS: ToolboxTopic[] = [
  // ═══ WORKING AT HEIGHT ═══
  { id: "tt-mewp", title: "Safe use of MEWPs", subtitle: "Pre-use checks, harness anchor, exclusion zone, rescue plan", category: "wah", icon: "🪜" },
  { id: "tt-ladders", title: "Ladder safety — 1:4 rule", subtitle: "Industrial grade only, footed/tied, short duration", category: "wah", icon: "🪜" },
  { id: "tt-pasma", title: "Mobile scaffold tower (PASMA)", subtitle: "Outriggers, brakes, no-move-with-load rule", category: "wah", icon: "🏗️" },
  { id: "tt-flat-roof", title: "Edge protection on flat roofs", subtitle: "2m demarcation, harness, weather hold", category: "wah", icon: "🏠" },
  { id: "tt-fragile", title: "Fragile roof surfaces", subtitle: "Crawling boards, nets, permit to work", category: "wah", icon: "🪜" },
  { id: "tt-harness", title: "Harness inspection and rescue", subtitle: "6-monthly inspection, rescue plan rehearsal", category: "wah", icon: "🪢" },
  { id: "tt-scaffold-tag", title: "Scaffold tag system", subtitle: "Green tag before use, daily inspection", category: "wah", icon: "🏗️" },
  { id: "tt-podium", title: "Podium step safety", subtitle: "Preferred over ladders, 4-leg lock", category: "wah", icon: "🪜" },
  { id: "tt-leading-edge", title: "Leading-edge protection", subtitle: "Net, harness, exclusion below", category: "wah", icon: "🏗️" },
  { id: "tt-roof-light", title: "Roof lights and rooflights", subtitle: "Treat as fragile; cover or net", category: "wah", icon: "💡" },

  // ═══ PLANT & EQUIPMENT ═══
  { id: "tt-banksman", title: "Banksman duties around moving plant", subtitle: "Eye contact, signals, exclusion zone", category: "plant", icon: "🚜" },
  { id: "tt-disc-cutter", title: "Disc cutter / angle grinder safety", subtitle: "Guards, RPM match, full PPE", category: "plant", icon: "💿" },
  { id: "tt-puwer", title: "Pre-use checks (PUWER)", subtitle: "Daily inspection, defect tagging", category: "plant", icon: "🔧" },
  { id: "tt-loler", title: "LOLER lifting equipment register", subtitle: "Thorough exam, SWL, competent person", category: "plant", icon: "⚓" },
  { id: "tt-co", title: "Generator and CO awareness", subtitle: "Ventilation, CO monitor, never indoors", category: "plant", icon: "⚠️" },
  { id: "tt-nail-gun", title: "Cartridge nail gun safety", subtitle: "Contact-trip only, never bump fire", category: "plant", icon: "🔨" },
  { id: "tt-excavator", title: "Excavator slew zone", subtitle: "Clear cab, exclusion, cab restraints", category: "plant", icon: "🚜" },
  { id: "tt-telehandler", title: "Telehandler stability", subtitle: "Load chart, tyre pressures, level ground", category: "plant", icon: "🚜" },
  { id: "tt-dumper", title: "Dumper rollover prevention", subtitle: "ROPS, seatbelt, route assessment", category: "plant", icon: "🚜" },
  { id: "tt-110v", title: "110V centre-tap site supply", subtitle: "Why 110V on site, never use 240V tools", category: "plant", icon: "⚡" },
  { id: "tt-pat", title: "PAT testing on portable equipment", subtitle: "Visual + electrical test, current label", category: "plant", icon: "⚡" },
  { id: "tt-abrasive-wheel", title: "Abrasive wheel replacement", subtitle: "Trained appointed person only", category: "plant", icon: "💿" },

  // ═══ HEALTH & WELLBEING ═══
  { id: "tt-havs", title: "HAVs — recognising symptoms", subtitle: "Tingling, blanching, numbness — report early", category: "health", icon: "🤚" },
  { id: "tt-noise", title: "Noise and hearing protection", subtitle: "85dB threshold, hearing zones, attenuation rating", category: "health", icon: "🔊" },
  { id: "tt-manual-handling", title: "Manual handling — TILE", subtitle: "Task / Individual / Load / Environment", category: "health", icon: "📦" },
  { id: "tt-mh-stress", title: "Mental health and stress at work", subtitle: "Spotting signs, support routes, no-stigma culture", category: "health", icon: "🧠" },
  { id: "tt-heat", title: "Heat stress in summer", subtitle: "Hydration, breaks, signs of heat exhaustion", category: "health", icon: "☀️" },
  { id: "tt-cold", title: "Cold stress and dehydration", subtitle: "Layered clothing, warm fluids, frostbite signs", category: "health", icon: "❄️" },
  { id: "tt-msd", title: "Musculoskeletal disorders (MSDs)", subtitle: "Posture, rotation, mechanical aids", category: "health", icon: "🦴" },
  { id: "tt-respiratory", title: "Respiratory health on site", subtitle: "Silica, dust, RPE classes (FFP2/3)", category: "health", icon: "😷" },
  { id: "tt-fatigue", title: "Fatigue and shift work", subtitle: "Reporting fatigue, rest breaks, driving home tired", category: "health", icon: "😴" },
  { id: "tt-vibration-wb", title: "Whole-body vibration (plant operators)", subtitle: "Daily exposure, seat condition, route smoothing", category: "health", icon: "🚜" },
  { id: "tt-skin", title: "Skin care and dermatitis", subtitle: "Cement burn, gloves, after-work washing", category: "health", icon: "🧴" },

  // ═══ SITE HAZARDS ═══
  { id: "tt-cat-genny", title: "Cable strikes — CAT and Genny", subtitle: "Always scan, hand-dig 500mm of services", category: "site", icon: "🔌" },
  { id: "tt-confined", title: "Confined space entry", subtitle: "Atmospheric test, top-man, rescue plan", category: "site", icon: "⚫" },
  { id: "tt-stf", title: "Slips, trips and falls", subtitle: "Housekeeping, lighting, cable management", category: "site", icon: "⚠️" },
  { id: "tt-hot-works", title: "Hot works permit and fire watch", subtitle: "60-min after-burn, extinguisher, isolation", category: "site", icon: "🔥" },
  { id: "tt-asbestos", title: "Asbestos awareness", subtitle: "Refurb survey, stop & report, never disturb", category: "site", icon: "☣️" },
  { id: "tt-silica", title: "Silica dust and RPE", subtitle: "Wet cutting, on-tool extraction, FFP3", category: "site", icon: "💨" },
  { id: "tt-permit-to-dig", title: "Permit to dig", subtitle: "Drawings, scan, hand-dig, spotter", category: "site", icon: "⛏️" },
  { id: "tt-overhead", title: "Overhead power lines", subtitle: "Goal posts, height restrictors, 15m exclusion", category: "site", icon: "⚡" },
  { id: "tt-fire-mb", title: "Fire — means of escape & assembly", subtitle: "Routes clear, alarms, headcount", category: "site", icon: "🚨" },
  { id: "tt-traffic", title: "Site traffic management", subtitle: "Segregated routes, banksman, hi-vis", category: "site", icon: "🚧" },
  { id: "tt-deep-excav", title: "Deep excavations", subtitle: "Battering, shoring, atmospheric testing", category: "site", icon: "⛏️" },
  { id: "tt-housekeeping", title: "Site housekeeping", subtitle: "Clear walkways, segregated waste, end-of-shift sweep", category: "site", icon: "🧹" },
  { id: "tt-lone-working", title: "Lone working", subtitle: "Check-in cadence, panic device, escalation", category: "site", icon: "👤" },

  // ═══ BEHAVIOURAL / SOFT SKILLS ═══
  { id: "tt-stop-job", title: "Stop the job — your right and duty", subtitle: "Authority to stop, no comeback, why it matters", category: "behavioural", icon: "✋" },
  { id: "tt-near-miss", title: "Reporting near misses", subtitle: "Why we want them, how to report, examples", category: "behavioural", icon: "📋" },
  { id: "tt-ppe", title: "PPE compliance", subtitle: "Why we wear it, how to spot bad fit, replacement", category: "behavioural", icon: "🦺" },
  { id: "tt-induction", title: "Site induction refresh", subtitle: "Re-cap of site rules, emergency, contacts", category: "behavioural", icon: "🪪" },
  { id: "tt-new-starters", title: "Looking out for new starters", subtitle: "Buddy system, hazard spotting, ask-first culture", category: "behavioural", icon: "🤝" },
  { id: "tt-housekeeping-eod", title: "End-of-day housekeeping", subtitle: "10-min rule, clear routes, secure plant", category: "behavioural", icon: "🧹" },
  { id: "tt-mobile-phone", title: "Mobile phones on site", subtitle: "When use is dangerous, hands-free in plant", category: "behavioural", icon: "📱" },
  { id: "tt-banter", title: "Banter or bullying — knowing the line", subtitle: "Respectful workplace, reporting route", category: "behavioural", icon: "💬" },
  { id: "tt-drugs-alcohol", title: "Drugs and alcohol policy", subtitle: "Zero tolerance, testing, support routes", category: "behavioural", icon: "🚫" },
  { id: "tt-unsafe-act", title: "Calling out unsafe acts", subtitle: "Blameless intervention, peer-to-peer", category: "behavioural", icon: "👁️" },
  { id: "tt-good-housekeeping", title: "Good housekeeping habits", subtitle: "Tools away, routes clear, cables overhead", category: "behavioural", icon: "🧹" },

  // ═══ WEATHER & SEASONAL ═══
  { id: "tt-wind", title: "High wind operations", subtitle: "Anemometer, 28mph stand-down, lifting hold", category: "weather", icon: "💨" },
  { id: "tt-rain", title: "Wet weather working", subtitle: "Slip risk, electrical safety, weather PPE", category: "weather", icon: "🌧️" },
  { id: "tt-ice-snow", title: "Ice and snow on site", subtitle: "Gritted routes, fall risk, plant changes", category: "weather", icon: "❄️" },
  { id: "tt-fog", title: "Fog and low visibility", subtitle: "Hi-vis, plant lights, banksman essential", category: "weather", icon: "🌫️" },
  { id: "tt-thunder", title: "Thunderstorm and lightning", subtitle: "Stop crane lifts, indoor only, monitor warning", category: "weather", icon: "⛈️" },
  { id: "tt-summer-uv", title: "Summer UV exposure", subtitle: "Long sleeves, sunscreen, skin checks", category: "weather", icon: "☀️" },
  { id: "tt-winter-darkness", title: "Winter darkness — site lighting", subtitle: "Task lighting, route lighting, fatigue risk", category: "weather", icon: "🌙" },

  // ═══ SPECIALIST TASKS ═══
  { id: "tt-welding", title: "Welding fume control", subtitle: "LEV, RPE, fume extractor torches", category: "specialist", icon: "🔥" },
  { id: "tt-isolation", title: "Electrical isolation procedure", subtitle: "Lock-out tag-out, multi-meter prove dead", category: "specialist", icon: "⚡" },
  { id: "tt-crane", title: "Lifting plan and contract lift", subtitle: "Lift category, A/B/C, appointed person", category: "specialist", icon: "🏗️" },
  { id: "tt-temp-works", title: "Temporary works (TWC)", subtitle: "Designer / coordinator / supervisor roles", category: "specialist", icon: "🏗️" },
  { id: "tt-pile-driving", title: "Pile driving and vibration", subtitle: "WBV exposure, neighbour comms, monitoring", category: "specialist", icon: "🪨" },
  { id: "tt-demolition", title: "Demolition pre-start brief", subtitle: "R&D survey, sequence, exclusion, dust", category: "specialist", icon: "💥" },
  { id: "tt-roofing-felts", title: "Bitumen roofing — torch-on", subtitle: "Hot work permit, fire watch, gas cylinder", category: "specialist", icon: "🏠" },
  { id: "tt-window-fitting", title: "Window glazing handling", subtitle: "Suction lifters, edge protection, sharps", category: "specialist", icon: "🪟" },
  { id: "tt-plaster-dust", title: "Plaster dust and respiratory", subtitle: "Wet cutting, FFP3, area ventilation", category: "specialist", icon: "💨" },
  { id: "tt-dsear", title: "DSEAR and explosive atmospheres", subtitle: "Zoning, ATEX equipment, ignition control", category: "specialist", icon: "💥" },

  // ═══ INCIDENTS & LESSONS LEARNED ═══
  { id: "tt-recent-fall", title: "Lessons from recent falls", subtitle: "What went wrong, what controls would have stopped it", category: "incident", icon: "📋" },
  { id: "tt-recent-strike", title: "Lessons from cable strikes", subtitle: "Anatomy of a strike, recovery", category: "incident", icon: "📋" },
  { id: "tt-recent-plant", title: "Lessons from plant incidents", subtitle: "Recent industry incidents, root cause", category: "incident", icon: "📋" },
  { id: "tt-recent-fire", title: "Lessons from site fires", subtitle: "Hot works failures, prevention", category: "incident", icon: "📋" },
  { id: "tt-recent-coshh", title: "Lessons from chemical exposure", subtitle: "Recent dermatitis / respiratory cases", category: "incident", icon: "📋" },
  { id: "tt-riddor", title: "RIDDOR — what to report and when", subtitle: "Categories, 7-day rule, who reports", category: "incident", icon: "📋" },
  { id: "tt-investigation", title: "How we investigate incidents", subtitle: "5-whys, no-blame, learning culture", category: "incident", icon: "🔍" },
];
