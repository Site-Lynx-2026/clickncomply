// ═══════════════════════════════════════════════════════════════════════════
// RAMS — TOOL, PLANT & EQUIPMENT LIBRARIES
// Power tools with HAVS/Noise/COSHH tags, voltage options
// Plant & equipment with split questions and competency tags
// Hand tools — general + specialist
// ═══════════════════════════════════════════════════════════════════════════

export type ToolTag = 'havs' | 'noise' | 'coshh' | 'hot-works' | 'wah' | 'loler' | 'cpcs' | 'pasma' | 'ipaf' | 'lift' | 'manual-handling'

export const TAG_STYLES: Record<ToolTag, { label: string; bg: string; color: string; border: string }> = {
  'havs':           { label: 'HAVS',           bg: 'rgba(249,115,22,0.1)', color: '#f97316', border: 'rgba(249,115,22,0.2)' },
  'noise':          { label: 'Noise',          bg: 'rgba(234,179,8,0.1)',  color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  'coshh':          { label: 'COSHH',          bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  'hot-works':      { label: 'Hot Works',      bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  'wah':            { label: 'Working at Height', bg: 'rgba(55,138,221,0.1)', color: '#85b7eb', border: 'rgba(55,138,221,0.2)' },
  'loler':          { label: 'LOLER',          bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  'cpcs':           { label: 'CPCS',           bg: 'rgba(234,179,8,0.1)',  color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  'pasma':          { label: 'PASMA',          bg: 'rgba(55,138,221,0.1)', color: '#85b7eb', border: 'rgba(55,138,221,0.2)' },
  'ipaf':           { label: 'IPAF',           bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  'lift':           { label: 'Lift Plan',      bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  'manual-handling': { label: 'Manual Handling', bg: 'rgba(234,179,8,0.1)', color: '#eab308', border: 'rgba(234,179,8,0.2)' },
}

// ── POWER TOOL ──
export interface PowerTool {
  id: string
  name: string
  tags: ToolTag[]
  hasVoltage: boolean     // show voltage selector
  voltageOptions?: string[] // custom options — defaults to ['18/24V Battery', '110V', '240V']
  note?: string           // e.g. "Pneumatic — air compressor required"
  havsMag?: number        // m/s² vibration magnitude
  noiseDb?: number        // typical dB(A)
}

export const DEFAULT_VOLTAGES = ['18/24V Battery', '110V', '240V']

export interface PowerToolCategory {
  id: string
  name: string
  icon: string
  hint: string
  tools: PowerTool[]
}

export const POWER_TOOL_CATEGORIES: PowerToolCategory[] = [
  {
    id: 'drilling', name: 'Drilling & Fixing', icon: '🔩', hint: 'Drills, drivers, impact wrenches, nail guns',
    tools: [
      { id: 'pt-sds-drill', name: 'SDS / Rotary Hammer Drill', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 8.0, noiseDb: 98 },
      { id: 'pt-impact-wrench', name: 'Impact Wrench', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 5.5, noiseDb: 95 },
      { id: 'pt-combi-drill', name: 'Combi Drill / Driver', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 4.0, noiseDb: 90 },
      { id: 'pt-nail-gun', name: 'Nail Gun / Brad Nailer', tags: ['noise'], hasVoltage: true, voltageOptions: ['18/24V Battery', '110V', 'Pneumatic'], noiseDb: 99 },
      { id: 'pt-screwgun', name: 'Screwgun / Auto-feed Driver', tags: ['noise'], hasVoltage: true, noiseDb: 85 },
      { id: 'pt-mag-drill', name: 'Magnetic Drill (Mag Base)', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 3.0, noiseDb: 88 },
      { id: 'pt-core-drill', name: 'Diamond Core Drill', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, havsMag: 5.0, noiseDb: 92 },
    ],
  },
  {
    id: 'cutting', name: 'Cutting & Grinding', icon: '💿', hint: 'Disc cutters, saws, grinders, chasers',
    tools: [
      { id: 'pt-disc-cutter', name: 'Disc Cutter / Angle Grinder', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, havsMag: 7.0, noiseDb: 103 },
      { id: 'pt-circular-saw', name: 'Circular Saw / Table Saw', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, havsMag: 6.0, noiseDb: 100 },
      { id: 'pt-jigsaw', name: 'Jigsaw / Reciprocating Saw', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 8.0, noiseDb: 92 },
      { id: 'pt-mitre-saw', name: 'Mitre Saw / Chop Saw', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 3.0, noiseDb: 98 },
      { id: 'pt-wall-chaser', name: 'Wall Chaser', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, havsMag: 7.0, noiseDb: 100 },
      { id: 'pt-road-saw', name: 'Road Saw / Floor Saw', tags: ['havs', 'noise', 'coshh'], hasVoltage: false, havsMag: 9.0, noiseDb: 105, note: 'Petrol — fuel handling and fume controls' },
    ],
  },
  {
    id: 'demolition', name: 'Demolition & Breaking', icon: '🔨', hint: 'Breakers, chippers, needle guns',
    tools: [
      { id: 'pt-electric-breaker', name: 'Electric Breaker / Kango', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, voltageOptions: ['110V', '240V'], havsMag: 12.0, noiseDb: 107 },
      { id: 'pt-pneumatic-breaker', name: 'Pneumatic Breaker', tags: ['havs', 'noise', 'coshh'], hasVoltage: false, havsMag: 18.0, noiseDb: 110, note: 'Pneumatic — air compressor required' },
      { id: 'pt-needle-gun', name: 'Needle Gun / Scaler', tags: ['havs', 'noise'], hasVoltage: false, havsMag: 14.0, noiseDb: 100, note: 'Pneumatic — air compressor required' },
      { id: 'pt-floor-scabbler', name: 'Floor Scabbler', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, voltageOptions: ['110V', '240V'], havsMag: 14.0, noiseDb: 105 },
    ],
  },
  {
    id: 'finishing', name: 'Finishing & Decorating', icon: '🎨', hint: 'Sanders, sprayers, heat guns, polishers',
    tools: [
      { id: 'pt-orbital-sander', name: 'Random Orbital / Belt Sander', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, havsMag: 3.5, noiseDb: 91 },
      { id: 'pt-paint-sprayer', name: 'Paint Sprayer / HVLP', tags: ['coshh'], hasVoltage: true },
      { id: 'pt-heat-gun', name: 'Heat Gun', tags: ['coshh'], hasVoltage: true, voltageOptions: ['110V', '240V'] },
      { id: 'pt-floor-grinder', name: 'Floor Grinder / Concrete Polisher', tags: ['havs', 'noise', 'coshh'], hasVoltage: true, voltageOptions: ['110V', '240V'], havsMag: 6.0, noiseDb: 95 },
      { id: 'pt-plaster-mixer', name: 'Plaster Mixer / Drill Mixer', tags: ['havs', 'noise'], hasVoltage: true, havsMag: 4.0, noiseDb: 88 },
    ],
  },
  {
    id: 'welding', name: 'Welding & Hot Works', icon: '🦊', hint: 'Welders, torches, cutting sets',
    tools: [
      { id: 'pt-mig-welder', name: 'MIG / MMA Welder', tags: ['coshh', 'noise', 'hot-works'], hasVoltage: true, voltageOptions: ['110V', '240V'], noiseDb: 82 },
      { id: 'pt-tig-welder', name: 'TIG Welder', tags: ['coshh', 'hot-works'], hasVoltage: true, voltageOptions: ['110V', '240V'] },
      { id: 'pt-oxy-set', name: 'Oxy-Acetylene Cutting / Welding Set', tags: ['coshh', 'hot-works'], hasVoltage: true, voltageOptions: ['Gas'], note: 'Gas — cylinder storage and handling controls' },
      { id: 'pt-blowtorch', name: 'Blowtorch / Propane Torch', tags: ['hot-works'], hasVoltage: true, voltageOptions: ['Gas'], note: 'Gas — fire extinguisher within 2m, fire watcher' },
      { id: 'pt-plasma', name: 'Plasma Cutter', tags: ['coshh', 'noise', 'hot-works'], hasVoltage: true, voltageOptions: ['110V', '240V'], noiseDb: 95 },
    ],
  },
]

// ── HAND TOOLS ──
export interface HandTool {
  id: string
  name: string
  note: string
  tags?: ToolTag[]
}

export const SPECIALIST_HAND_TOOLS: HandTool[] = [
  { id: 'ht-podger', name: 'Podger Spanner / Bar', note: 'Dropped object risk — tool lanyard required at height' },
  { id: 'ht-torque', name: 'Calibrated Torque Wrench', note: 'Structural connections — calibration certificate required, record torque values' },
  { id: 'ht-pipe-cutter', name: 'Pipe Cutter / Pipe Bender', note: 'Repetitive strain — manual handling assessment, ergonomic breaks' },
  { id: 'ht-slings', name: 'Lifting Slings / Shackles / Chains', note: 'LOLER — colour coded, current inspection, SWL marked', tags: ['loler'] },
  { id: 'ht-ratchet-straps', name: 'Ratchet Straps / Load Binders', note: 'Pre-use inspection — check for fraying, damage or faded SWL' },
  { id: 'ht-gas-torch', name: 'Gas Torch (hand-held)', note: 'Hot Works permit — fire extinguisher within 2m, fire watcher', tags: ['hot-works'] },
  { id: 'ht-tin-snips', name: 'Tin Snips / Aviation Shears', note: 'Cut edge risk — heavy gloves, dispose of offcuts safely' },
  { id: 'ht-stanley', name: 'Stanley Knife / Utility Knife', note: 'Retractable blade only. Dispose of blades in sharps container.' },
  { id: 'ht-crowbar', name: 'Crowbar / Wrecking Bar', note: 'Manual handling and pinch points. Adequate space to swing.' },
]

// ── PLANT & EQUIPMENT ──
export interface PlantItem {
  id: string
  name: string
  tags: ToolTag[]
  note: string
  noiseDb?: number
}

export interface PlantSplitQuestion {
  label: string
  options: { id: string; title: string; subtitle: string; info: string }[]
}

export interface PlantCategory {
  id: string
  name: string
  icon: string
  hint: string
  sectionLabel?: string  // e.g. "Getting up high", "Moving & lifting"
  splitQuestion?: PlantSplitQuestion
  infoBar?: string
  warnBar?: string
  items: PlantItem[]
}

export const PLANT_CATEGORIES: PlantCategory[] = [
  // ═══ GETTING UP HIGH ═══
  {
    id: 'scaffold', name: 'Scaffold', icon: '🏗️', hint: 'Tube & fit, system scaffold, suspended cradle',
    sectionLabel: 'Getting up high',
    splitQuestion: {
      label: 'What is your involvement with the scaffold?',
      options: [
        { id: 'using', title: 'We are working from scaffold erected by others', subtitle: 'You are a trade using the scaffold — inspect the tag before use, report defects, do not alter it.', info: 'Using scaffold erected by others — scaffold tag must be current and signed off before work starts. Do not alter, remove boards or clip on additional equipment without scaffolder approval.' },
        { id: 'erecting', title: 'We are erecting or altering the scaffold', subtitle: 'Scaffolding contractor only — CISRS card, design, handover certificate and scaffold tag system required.', info: 'Erecting scaffold — CISRS card required. Scaffold to be designed, erected and handed over with a current scaffold tag before any trade uses it.' },
      ],
    },
    items: [
      { id: 'pl-tube-scaffold', name: 'Tube & Fitting Scaffold', tags: ['wah'], note: 'Pre-use: check scaffold tag is current and displayed.' },
      { id: 'pl-system-scaffold', name: 'System Scaffold (Kwikstage/Layher/Haki)', tags: ['wah'], note: 'Pre-use: check scaffold tag is current and displayed.' },
      { id: 'pl-suspended-scaffold', name: 'Suspended Scaffold / Cradle', tags: ['wah', 'loler'], note: 'Thorough examination record required on site. Trained operator only.' },
      { id: 'pl-birdcage', name: 'Birdcage / Truss-out Scaffold', tags: ['wah'], note: 'Pre-use: check scaffold tag is current and displayed.' },
      { id: 'pl-cantilever-scaffold', name: 'Cantilever / Spur Scaffold', tags: ['wah'], note: 'Structural engineer sign-off required. Scaffold tag mandatory.' },
    ],
  },
  {
    id: 'tower', name: 'Mobile Scaffold Towers', icon: '🔼', hint: 'Aluminium towers, staircase towers, narrow span',
    splitQuestion: {
      label: 'Who is erecting the tower?',
      options: [
        { id: 'self', title: 'We are erecting it ourselves', subtitle: 'PASMA card required. 3:1 base ratio, outriggers deployed, working platform inspection.', info: 'PASMA card required for erection. Never exceed maximum working height. Outriggers must be deployed on all four corners.' },
        { id: 'others', title: 'Erected by someone else — we are just using it', subtitle: 'Pre-use inspection required before every use. Do not alter or extend.', info: 'Pre-use inspection required before every use. Do not alter or extend the tower. Report any defects before climbing.' },
      ],
    },
    items: [
      { id: 'pl-tower-agr', name: 'Aluminium Folding Tower (AGR method)', tags: ['wah', 'pasma'], note: '3:1 base ratio. All four outriggers deployed. Max platform height observed.' },
      { id: 'pl-tower-3t', name: 'Through-the-Rung Tower (3T method)', tags: ['wah', 'pasma'], note: '3T erection method only. PASMA card required.' },
      { id: 'pl-tower-staircase', name: 'Staircase Access Tower', tags: ['wah', 'pasma'], note: 'Heavier than standard — floor loading check required.' },
      { id: 'pl-tower-narrow', name: 'Narrow Span Tower (1.2m)', tags: ['wah', 'pasma'], note: 'Higher tip-over risk. Outriggers mandatory. Reduced max height.' },
      { id: 'pl-tower-cantilever', name: 'Cantilever / Bridging Tower', tags: ['wah', 'pasma'], note: 'Specialist configuration. Structural loading assessment required.' },
    ],
  },
  {
    id: 'mewp', name: 'Powered Access — MEWP', icon: '🔧', hint: 'Scissor lifts, boom lifts, cherry pickers, hoists',
    infoBar: 'IPAF card required. Pre-use inspection and LOLER thorough examination record must be available on site.',
    items: [
      { id: 'pl-scissor', name: 'Scissor Lift (PEMP)', tags: ['wah', 'ipaf', 'loler'], note: 'Ground conditions check. Outriggers deployed. Overhead clearance assessed.' },
      { id: 'pl-cherry-picker', name: 'Cherry Picker / Knuckle Boom Lift', tags: ['wah', 'ipaf', 'loler'], note: 'Stabilisers deployed. Exclusion zone below basket. Harness anchor point.' },
      { id: 'pl-vertical-mast', name: 'Vertical Mast / Push-around MEWP', tags: ['wah', 'ipaf', 'loler'], note: 'Level surface only. Max load check. Harness anchor point.' },
      { id: 'pl-rough-terrain', name: 'Rough Terrain MEWP', tags: ['wah', 'ipaf', 'loler'], note: 'Ground bearing assessment. Stabilisers. Exclusion zone.' },
      { id: 'pl-hoist', name: 'Personnel / Materials Hoist', tags: ['wah', 'loler'], note: 'Trained operator only. Thorough examination record required.' },
    ],
  },
  {
    id: 'ladders', name: 'Ladders & Non-powered Access', icon: '🪜', hint: 'Extension ladders, step ladders, podiums, roof ladders',
    warnBar: 'Ladders must only be used for short duration light work. Never as a working platform. Inspect before every use.',
    items: [
      { id: 'pl-extension-ladder', name: 'Extension Ladder', tags: ['wah'], note: '75° angle (1 in 4 rule). Tied or footed. Short duration only.' },
      { id: 'pl-step-ladder', name: 'Step Ladder / Double-sided Steps', tags: ['wah'], note: 'Light work only. 3 points of contact. Do not stand on top two rungs.' },
      { id: 'pl-podium', name: 'Podium Steps', tags: ['wah'], note: 'Pre-use inspection. Do not exceed max load. Level surface.' },
      { id: 'pl-hop-up', name: 'Hop-up / Trestle & Staging', tags: ['wah'], note: 'Inspect before use. Edge protection if platform over 2m.' },
      { id: 'pl-roof-ladder', name: 'Roof Ladder / Cat Ladder', tags: ['wah'], note: 'Fragile roof assessment required. Ridge hook secure before use.' },
    ],
  },
  // ═══ MOVING & LIFTING ═══
  {
    id: 'lifting', name: 'Lifting Plant & Equipment', icon: '🏗️', hint: 'Cranes, telehandlers, hoists, vacuum lifters',
    sectionLabel: 'Moving & lifting things',
    splitQuestion: {
      label: 'Crane or lifting operation — who is in control?',
      options: [
        { id: 'ours', title: 'We are operating the lifting plant', subtitle: 'Lift plan, CPCS/LOLER, slinger/signaller and exclusion zone required.', info: 'Operating lifting plant — lift plan mandatory for all crane lifts. CPCS card required. Slinger/signaller briefed.' },
        { id: 'others', title: 'Another contractor is operating — we are receiving the lift', subtitle: 'Stand clear of load path, tag lines, do not approach until load is landed.', info: 'Receiving a lift — stand well clear of the load path. Tag lines to guide the load. Only approach when banksman signals safe.' },
      ],
    },
    items: [
      { id: 'pl-vacuum-lifter', name: 'Vacuum Lifter / Glass Lifter', tags: ['loler', 'lift'], note: 'Pre-use inspection. Suction pad check. Never exceed SWL.' },
      { id: 'pl-mobile-crane', name: 'Mobile Crane', tags: ['cpcs', 'loler', 'lift'], note: 'Lift plan mandatory. Slinger/signaller required. Ground bearing check.' },
      { id: 'pl-telehandler', name: 'Telehandler / Reach Truck', tags: ['cpcs', 'loler'], note: 'Pedestrian segregation. Stabilisers deployed. Attachment inspection.' },
      { id: 'pl-forklift', name: 'Forklift Truck', tags: ['cpcs', 'loler'], note: 'Pedestrian segregation mandatory. Daily pre-use check. No passengers.' },
      { id: 'pl-chain-block', name: 'Chain Block / Manual Hoist', tags: ['loler', 'lift'], note: 'SWL clearly marked. Current inspection record.' },
      { id: 'pl-electric-hoist', name: 'Electric Chain Hoist', tags: ['loler', 'lift'], note: 'Thorough examination certificate required. Limit switch check.' },
      { id: 'pl-gin-wheel', name: 'Gin Wheel / Block & Tackle', tags: ['loler', 'lift'], note: 'Anchor point load rated. Rope condition inspected.' },
      { id: 'pl-pallet-truck', name: 'Pallet Truck / Pump Truck', tags: ['manual-handling'], note: 'Floor loading check. SWL marked. Level surface only.' },
      { id: 'pl-slings', name: 'Lifting Slings / Shackles / Chains', tags: ['loler', 'lift'], note: 'Colour coded. Current inspection record. Discard if damaged.' },
    ],
  },
  // ═══ VEHICLES ═══
  {
    id: 'vehicles', name: 'Site & Delivery Vehicles', icon: '🚛', hint: 'Dumpers, excavators, delivery lorries, HIAB',
    sectionLabel: 'Site vehicles',
    warnBar: 'Pedestrian and vehicle segregation must be in place. 5 mph speed limit. Banksman for all reversing.',
    items: [
      { id: 'pl-dumper', name: 'Site Dumper (Forward/Swivel tip)', tags: ['cpcs'], note: 'Daily pre-use check. Segregated route. Overturning risk on slopes.', noiseDb: 96 },
      { id: 'pl-mini-excavator', name: 'Mini Excavator (up to 10t)', tags: ['cpcs'], note: 'Underground services check. Exclusion zone. Overhead line survey.', noiseDb: 90 },
      { id: 'pl-excavator', name: 'Full Size Excavator (over 10t)', tags: ['cpcs'], note: 'Underground services. Overhead lines. Exclusion zone minimum 6m.', noiseDb: 95 },
      { id: 'pl-delivery-lorry', name: 'Delivery Lorry (Curtainsider/Flatbed)', tags: ['lift'], note: 'Segregated route. Banksman for reversing. 5 mph enforced.' },
      { id: 'pl-hiab', name: 'HIAB / Crane Lorry', tags: ['cpcs', 'loler', 'lift'], note: 'Outriggers deployed. Lift plan. Exclusion zone around full radius.' },
      { id: 'pl-concrete-pump', name: 'Concrete Pump (static/boom)', tags: ['lift', 'coshh'], note: 'Ground bearing. Outriggers. Exclusion zone under boom arc.' },
    ],
  },
  // ═══ POWER SUPPLY ═══
  {
    id: 'power', name: 'Generators, Transformers & Compressors', icon: '⚡', hint: 'Site power supply, air tools, dust suppression',
    sectionLabel: 'Generating power on site',
    items: [
      { id: 'pl-generator', name: 'Diesel / Petrol Generator', tags: ['coshh', 'noise'], note: 'Exhaust fumes — ventilated area only. Fire risk. Refuelling procedure.', noiseDb: 95 },
      { id: 'pl-transformer', name: '110V Site Transformer (CTE)', tags: [], note: 'PAT tested. RCD protected. Inspected before use. Yellow leads only.' },
      { id: 'pl-battery-station', name: 'Battery Charging Station', tags: [], note: 'Ventilated area. No overcharging. Fire extinguisher within 2m.' },
      { id: 'pl-compressor', name: 'Air Compressor', tags: ['noise'], note: 'Pressure system — relief valve check. Hose whip restraints fitted.', noiseDb: 88 },
      { id: 'pl-pressure-washer', name: 'Water Bowser / Pressure Washer', tags: [], note: 'Dust suppression. Slip hazard from run-off.' },
      { id: 'pl-lpg', name: 'LPG / Gas Bottle Storage', tags: ['coshh', 'hot-works'], note: 'Upright, secured, ventilated. Away from heat. Fire extinguisher nearby.' },
    ],
  },
]

// ── PPE ITEMS ──
export interface PPEItem { id: string; label: string; enStandard?: string }

export const PPE_ITEMS: PPEItem[] = [
  { id: 'ppe-hardhat', label: 'Hard hat', enStandard: 'EN 397' },
  { id: 'ppe-boots', label: 'Safety footwear', enStandard: 'EN ISO 20345' },
  { id: 'ppe-hivis', label: 'High-vis vest', enStandard: 'EN ISO 20471' },
  { id: 'ppe-gloves', label: 'Safety gloves', enStandard: 'EN 388' },
  { id: 'ppe-harness', label: 'Safety harness & lanyard', enStandard: 'EN 361' },
  { id: 'ppe-face-shield', label: 'Face shield / visor', enStandard: 'EN 166' },
  { id: 'ppe-ear', label: 'Ear defenders', enStandard: 'EN 352' },
  { id: 'ppe-welding', label: 'Welding mask & gauntlets' },
  { id: 'ppe-rpe', label: 'RPE / dust mask (FFP3)' },
  { id: 'ppe-glasses', label: 'Safety glasses', enStandard: 'EN 166' },
  { id: 'ppe-goggles', label: 'Safety goggles', enStandard: 'EN 166' },
  { id: 'ppe-knee', label: 'Knee pads' },
  { id: 'ppe-chem-gloves', label: 'Chemical resistant gloves' },
  { id: 'ppe-coverall', label: 'Disposable coverall' },
  { id: 'ppe-bump-cap', label: 'Bump cap' },
]
