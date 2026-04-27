// ═══════════════════════════════════════════════════════════════════════════
// RAMS — PRE-BUILT LIBRARY
// 180+ Risk Assessments, 20+ COSHH, 15+ HAVS, 15+ Noise
// 40+ Trade Templates with pre-written Method Statement steps
// ═══════════════════════════════════════════════════════════════════════════

// Types defined here — this library is self-contained
export interface RALibraryItem {
  id: string; category: string; hazard: string; whoAtRisk: string
  consequences: string
  initialL: number; initialS: number; controls: string; residualL: number; residualS: number
}
export interface COSHHLibraryItem {
  id: string; category: string; substance: string; hazards: string; routeOfExposure: string
  controls: string; ppeRequired: string; emergencyProcedures: string
}
export interface HAVSLibraryItem { id: string; tool: string; vibrationMag: number; typicalUse: string }
export interface NoiseLibraryItem { id: string; activity: string; typicalDb: number; hearingProtection: string; controls: string }
export interface RAMSTrade {
  id: string; trade: string; category: string; icon?: string; description: string
  raItems: string[]; coshhItems: string[]; havsItems: string[]; noiseItems: string[]
  ppe: string[]; msSteps: string[]; defaultDocs: string[]
}
export interface TradeCategory { id: string; label: string; icon?: string }

// ── RA CATEGORIES ──
export const RA_CATEGORIES: TradeCategory[] = [
  { id: 'wah', label: 'Working at Height' },
  { id: 'mh', label: 'Manual Handling' },
  { id: 'plant', label: 'Plant & Machinery' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'fire', label: 'Fire & Hot Works' },
  { id: 'confined', label: 'Confined Spaces' },
  { id: 'excavation', label: 'Excavation & Groundworks' },
  { id: 'structural', label: 'Structural' },
  { id: 'lifting', label: 'Lifting Operations' },
  { id: 'scaffold', label: 'Scaffolding' },
  { id: 'demolition', label: 'Demolition' },
  { id: 'welding', label: 'Welding & Cutting' },
  { id: 'noise', label: 'Noise & Vibration' },
  { id: 'dust', label: 'Dust & Respiratory' },
  { id: 'coshh', label: 'Chemical / COSHH' },
  { id: 'traffic', label: 'Traffic & Vehicles' },
  { id: 'environment', label: 'Environmental' },
  { id: 'general', label: 'General Site' },
  { id: 'asbestos', label: 'Asbestos' },
  { id: 'health', label: 'Health & Wellbeing' },
  { id: 'occupied', label: 'Occupied Premises' },
  { id: 'weather', label: 'Weather & Seasonal' },
]

// ── RISK ASSESSMENT LIBRARY ──
export const RA_LIBRARY: RALibraryItem[] = [
  // ═══ WORKING AT HEIGHT ═══
  { id: 'RA-WAH-001', category: 'wah', hazard: 'Falls from scaffolding', whoAtRisk: 'Operatives', consequences: 'Fatal or life-changing injury from fall; crush injuries from scaffold component failure; multiple casualties if platform collapses.', initialL: 4, initialS: 5, controls: 'Scaffolding erected and inspected by CISRS competent person. Scaffold tag system — green tag before use. Edge protection on all platforms (guard rails, mid rails, toe boards). Access via internal ladder system. Daily visual inspection by scaffold user.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-002', category: 'wah', hazard: 'Falls from ladders', whoAtRisk: 'Operatives', consequences: 'Fatal or serious injury; fractures, head and spinal injuries; prolonged absence from work.', initialL: 4, initialS: 4, controls: 'Ladders only for short duration access (<30 mins). 1:4 ratio, tied or footed. 3-rung overlap minimum. Industrial grade EN 131 ladders only. Pre-use inspection. Podium steps preferred where practicable.', residualL: 2, residualS: 4 },
  { id: 'RA-WAH-003', category: 'wah', hazard: 'Falls from MEWP / cherry picker', whoAtRisk: 'Operatives', consequences: 'Fatal or serious injury from fall or platform collapse; ejection from basket; crush between platform and structure.', initialL: 3, initialS: 5, controls: 'IPAF trained and licenced operators only. Daily pre-use checks. Harness worn and attached to designated anchor. Ground conditions assessed. Exclusion zone at base. Wind speed monitored — stand down above 28mph.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-004', category: 'wah', hazard: 'Falling objects from height', whoAtRisk: 'All site personnel', consequences: 'Serious head injury or fatality to personnel below; property damage; injury to public if beyond site boundary.', initialL: 4, initialS: 5, controls: 'Toe boards and brick guards on all scaffolding. Tool lanyards used at height. Exclusion zone below work area clearly signed. Fan protection on public-facing scaffolding. Hard hats mandatory in all drop zones.', residualL: 2, residualS: 4 },
  { id: 'RA-WAH-005', category: 'wah', hazard: 'Fragile roof/surface collapse', whoAtRisk: 'Operatives', consequences: 'Fatal fall through fragile surface; serious injuries from fall height; potential injury to personnel below.', initialL: 3, initialS: 5, controls: 'Fragile surfaces identified and signed. Crawling boards / stagings provided. No walking on unprotected fragile surfaces. Nets below where possible. Briefing given to all operatives. Permit to work on fragile surfaces.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-006', category: 'wah', hazard: 'Falls through openings / voids', whoAtRisk: 'All site personnel', consequences: 'Fatal or serious injury from unguarded void; fractures, head and spinal injuries; secondary injuries if landing on materials below.', initialL: 4, initialS: 5, controls: 'All openings covered with clearly marked, secured covers capable of supporting loads. Barriers around open edges. Warning signage displayed. Daily checks on covers. Night-time security of void covers.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-007', category: 'wah', hazard: 'Falls from flat roofs', whoAtRisk: 'Operatives', consequences: 'Fatal or serious injury from fall off roof edge; fractures and head injuries; RIDDOR reportable.', initialL: 3, initialS: 5, controls: 'Edge protection installed at all roof perimeters. Demarcation zones 2m from edge. Permit to work on roof. Harness and lanyard where edge protection impracticable. Weather monitoring — stand down in high winds/ice.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-008', category: 'wah', hazard: 'Falls from mobile scaffold tower', whoAtRisk: 'Operatives', consequences: 'Serious injury or fatality from fall or tower overturning; fractures, head and spinal injuries.', initialL: 3, initialS: 4, controls: 'PASMA trained erectors only. Erected to manufacturer instruction and TG20. Outriggers deployed on all towers. Brakes applied when stationary. Tower not to be moved with personnel on platform. Maximum height per manufacturer spec.', residualL: 1, residualS: 4 },
  { id: 'RA-WAH-009', category: 'wah', hazard: 'Falls from steelwork during erection', whoAtRisk: 'Steel erectors', consequences: 'Fatal or serious injury during erection phase; falls from beam height; secondary injury from falling tools or components.', initialL: 4, initialS: 5, controls: 'Detailed erection sequence and method statement. Safety nets below working level. Harness and lanyard with inertia reel to designated anchor points. MEWP for bolt-up where possible. No walking along beams without fall arrest.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-010', category: 'wah', hazard: 'Collapse of temporary access platform', whoAtRisk: 'Operatives', consequences: 'Multiple injuries or fatalities from platform collapse under load; potential for multiple casualties.', initialL: 2, initialS: 5, controls: 'Platform designed to support intended loads plus safety factor. Inspected before first use and at regular intervals. Components checked for damage. Load limits clearly displayed. Competent person to erect and inspect.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-011', category: 'wah', hazard: 'Falls during roof work — pitched roofs', whoAtRisk: 'Operatives', consequences: 'Fatal or serious injury from fall down pitch; head and spinal injuries; fatality from fall to lower level below eaves.', initialL: 4, initialS: 5, controls: 'Roof ladders and crawling boards provided. Eaves edge protection in place. Harness and lanyard for leading edge work. Netting below where feasible. No work in wet/icy conditions on pitched surfaces.', residualL: 1, residualS: 5 },

  // ═══ MANUAL HANDLING ═══
  { id: 'RA-MH-001', category: 'mh', hazard: 'Musculoskeletal injury from lifting heavy materials', whoAtRisk: 'Operatives', consequences: 'Back injury, muscle tears, long-term musculoskeletal disorder; chronic pain; lost time injury; potential permanent disability.', initialL: 4, initialS: 3, controls: 'Manual handling assessment completed. Mechanical aids used where loads exceed 25kg (trolleys, hoists, vacuum lifters). Team lifts briefed and used. Loads split into manageable sizes. Operatives trained in safe lifting techniques.', residualL: 2, residualS: 3 },
  { id: 'RA-MH-002', category: 'mh', hazard: 'Moving pipes, rolls or irregular shaped materials', whoAtRisk: 'Operatives', consequences: 'Back and shoulder injury; crush injuries to fingers and hands from rolling materials; injury from dropped load.', initialL: 4, initialS: 3, controls: 'Correct lifting aids provided (pipe trolleys, roller stands). Team lifts where needed. Route cleared and checked. PPE including rigger gloves. Materials stored at waist height where possible.', residualL: 2, residualS: 3 },
  { id: 'RA-MH-003', category: 'mh', hazard: 'Repetitive strain from sustained postures', whoAtRisk: 'Operatives', consequences: 'Chronic upper limb disorder; back pain; carpal tunnel syndrome; long-term disability and loss of earning capacity.', initialL: 3, initialS: 2, controls: 'Task rotation to vary posture. Regular breaks enforced (minimum 10 mins per hour for repetitive tasks). Ergonomic tools where available. Anti-fatigue matting for standing tasks.', residualL: 2, residualS: 2 },
  { id: 'RA-MH-004', category: 'mh', hazard: 'Moving boxed/packaged materials', whoAtRisk: 'Operatives', consequences: 'Back injury and muscle strain; foot or toe crush if materials dropped; slips on unstable packaging.', initialL: 3, initialS: 3, controls: 'Trolleys and pallet trucks provided. Delivery vehicles to have tail lifts. Storage areas at working height. Good housekeeping — clear routes. Team lifts for awkward/heavy boxes.', residualL: 2, residualS: 2 },
  { id: 'RA-MH-005', category: 'mh', hazard: 'Carrying materials on stairs/slopes', whoAtRisk: 'Operatives', consequences: 'Fall on stairs leading to serious injury; back injury; foot injuries from dropped load; multiple injuries if load falls on others below.', initialL: 4, initialS: 4, controls: 'Mechanical lifting preferred (hoist, crane). Stairs/slopes assessed for suitability. Handrails available. Materials moved in smaller loads. Good lighting. Non-slip surfaces.', residualL: 2, residualS: 3 },
  { id: 'RA-MH-006', category: 'mh', hazard: 'Moving plasterboard / sheet materials', whoAtRisk: 'Operatives', consequences: 'Back and shoulder injury; eye and face laceration from sheet edges; crush injury if sheet falls; wind-catching causing loss of control.', initialL: 4, initialS: 3, controls: 'Board lifter/trolley provided. Two-person carry minimum for full sheets. Edge protectors used. Wind conditions checked for external transport. Materials stored flat, not leaning.', residualL: 2, residualS: 2 },
  { id: 'RA-MH-007', category: 'mh', hazard: 'Cable pulling / heavy cable drums', whoAtRisk: 'Operatives, Electricians', consequences: 'Back and shoulder injury; hand and finger crush from drum and guides; repetitive strain from sustained pulling effort.', initialL: 3, initialS: 3, controls: 'Cable drum jacks and rollers provided. Cable pulling winch for long runs. Cable guides at bends. Adequate manpower for manual pull. Drum brakes applied during payout.', residualL: 2, residualS: 2 },
  { id: 'RA-MH-008', category: 'mh', hazard: 'Manual handling of steel sections/beams', whoAtRisk: 'Steel erectors', consequences: 'Crush and impact injuries from heavy steel; back injury; fatality if section falls; lacerations from sharp edges.', initialL: 4, initialS: 4, controls: 'Crane/telehandler for all heavy lifts. Magnetic handlers for sheet steel. Team lifts only for light sections. Sharp edges protected. Rigger gloves mandatory. Tag lines for guiding loads.', residualL: 2, residualS: 3 },

  // ═══ PLANT & MACHINERY ═══
  { id: 'RA-PM-001', category: 'plant', hazard: 'Struck by moving plant', whoAtRisk: 'All site personnel', consequences: 'Fatal or serious crush injury; multiple fatalities if plant loses control; injuries to others in the path of movement.', initialL: 3, initialS: 5, controls: 'Banksman for all reversing operations. Exclusion zones maintained and signed. Hi-vis PPE mandatory. Plant fitted with reversing alarms, cameras, and proximity sensors. Segregated pedestrian/vehicle routes.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-002', category: 'plant', hazard: 'Entanglement/crush in machinery', whoAtRisk: 'Operatives', consequences: 'Amputation, degloving, crush injuries; fatality in severe cases; irreversible injury requiring prolonged treatment.', initialL: 2, initialS: 5, controls: 'All guards in place before operation. LOTO isolation procedures followed. Only trained and authorised operators. Emergency stop accessible. Daily pre-use checks. Loose clothing/jewellery removed.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-003', category: 'plant', hazard: 'Excavator overturning', whoAtRisk: 'Plant operators', consequences: 'Fatal crush injury to operator; serious injury from cab impact; machine damage and potential secondary hazard.', initialL: 2, initialS: 5, controls: 'Ground conditions assessed. Machine appropriate for terrain. Seatbelt worn at all times. Outriggers deployed where fitted. No operation on slopes exceeding manufacturer limits. Daily pre-use checks.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-004', category: 'plant', hazard: 'Telehandler/forklift collision', whoAtRisk: 'All site personnel', consequences: 'Serious crush injury or fatality from vehicle collision; dropped load injuries; property damage.', initialL: 3, initialS: 5, controls: 'CPCS/NPORS trained operator. Speed limit 5mph. Segregated routes. Load secured and balanced. Visibility — use banksman when load obstructs view. No passengers. Seatbelt worn.', residualL: 1, residualS: 4 },
  { id: 'RA-PM-005', category: 'plant', hazard: 'Disc cutter/grinder injury', whoAtRisk: 'Operatives', consequences: 'Deep lacerations and amputations; projectile injury from disc burst; eye damage; burns from sparks; fire.', initialL: 3, initialS: 4, controls: 'Disc guards fitted and not removed. Correct disc for material and RPM. Dead-man switch functional. Full PPE: face shield, gloves, hearing protection. Hot work permit where required. Fire extinguisher within 2m.', residualL: 1, residualS: 4 },
  { id: 'RA-PM-006', category: 'plant', hazard: 'Circular/chop saw injury', whoAtRisk: 'Operatives', consequences: 'Serious lacerations or amputations of fingers and hands; eye damage from debris; dust inhalation injury.', initialL: 3, initialS: 4, controls: 'Guards correctly adjusted. Push sticks used. No loose clothing. Emergency stop accessible. Blade condition checked before use. Area clear of trip hazards. Dust extraction fitted.', residualL: 1, residualS: 4 },
  { id: 'RA-PM-007', category: 'plant', hazard: 'Dumper overturning on uneven ground', whoAtRisk: 'Plant operators', consequences: 'Fatal crush injury to operator from rollover; serious injury if ejected from cab; secondary hazard from load spillage.', initialL: 3, initialS: 5, controls: 'Routes assessed and maintained. ROPS fitted. Seatbelt worn. Speed appropriate for conditions. No overloading. Tip on level ground only. Training and competence verified.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-008', category: 'plant', hazard: 'Compressor/pressure vessel failure', whoAtRisk: 'Operatives', consequences: 'Explosion or burst hose causing serious injury; whiplash injury from loose airline; hearing damage from noise; property damage.', initialL: 2, initialS: 4, controls: 'LOLER/PSSR inspections current. Pressure relief valves functional. Hoses in good condition — daily check. No kinks or damage to airlines. Correct couplings used. Drained after use.', residualL: 1, residualS: 3 },
  { id: 'RA-PM-009', category: 'plant', hazard: 'Generator fumes / CO poisoning', whoAtRisk: 'All site personnel', consequences: 'Carbon monoxide poisoning leading to rapid incapacitation and fatality; serious neurological injury; potential for multiple casualties.', initialL: 3, initialS: 5, controls: 'Generator positioned externally with exhaust away from openings. CO monitor in adjacent work areas. Adequate ventilation. Never run generator in enclosed/semi-enclosed space. Emergency procedure briefed.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-010', category: 'plant', hazard: 'Nail gun / cartridge tool injury', whoAtRisk: 'Operatives', consequences: 'Penetrating injury from fastener; eye injury; potential fatality if fired near head; injury to bystanders.', initialL: 3, initialS: 4, controls: 'Only trained operatives. Contact-trip trigger only (no bump fire). Never point at anyone. Safety glasses mandatory. Cartridge tool certification current. Area behind work face checked for services and people.', residualL: 1, residualS: 4 },

  // ═══ ELECTRICAL ═══
  { id: 'RA-EL-001', category: 'electrical', hazard: 'Electrocution from live services', whoAtRisk: 'Operatives', consequences: 'Electric shock, cardiac arrest, burns and fatality; secondary falls if shock occurs at height; arc flash causing fire.', initialL: 3, initialS: 5, controls: 'CAT scanner and Genny used before any penetration of walls/floors. Service drawings obtained and reviewed. Permit to dig/penetrate in place. Isolation confirmed by qualified electrician where working on electrical systems. Lock-off tags applied.', residualL: 1, residualS: 5 },
  { id: 'RA-EL-002', category: 'electrical', hazard: 'Contact with overhead power lines', whoAtRisk: 'Plant operators, Operatives', consequences: 'Electrocution and fatality; arc flash causing fire and explosion; multiple casualties; power interruption affecting wider area.', initialL: 2, initialS: 5, controls: 'Goal posts and bunting installed at line height. Height restrictors on plant. Safe working distance maintained (minimum 15m for HV). DNO consulted. Briefing to all plant operators. No plant within exclusion zone.', residualL: 1, residualS: 5 },
  { id: 'RA-EL-003', category: 'electrical', hazard: 'Defective portable electrical equipment', whoAtRisk: 'Operatives', consequences: 'Electric shock and burns; cardiac arrest; fire from electrical fault; secondary injuries from shock-induced fall.', initialL: 3, initialS: 4, controls: 'PAT testing current on all equipment. 110V supply via CTE transformer. RCD protection on all circuits. Visual inspection before each use. Damaged equipment immediately removed from service and tagged.', residualL: 1, residualS: 3 },
  { id: 'RA-EL-004', category: 'electrical', hazard: 'Electric shock from temporary site wiring', whoAtRisk: 'All site personnel', consequences: 'Electric shock, burns and cardiac arrest; fire from damaged wiring; prolonged site shutdown following serious incident.', initialL: 3, initialS: 4, controls: 'Temporary electrical installation to BS 7671. Regular inspection by qualified electrician. Distribution boards locked. Cable routes protected — overhead or covered. No daisy-chaining of extension leads.', residualL: 1, residualS: 3 },
  { id: 'RA-EL-005', category: 'electrical', hazard: 'Arc flash from electrical panels', whoAtRisk: 'Electricians', consequences: 'Severe burns, blindness and fatality from arc flash; explosion causing injury to bystanders; fire damage to installation.', initialL: 2, initialS: 5, controls: 'Dead working wherever possible. Risk assessment for live work. Arc-rated PPE worn. Insulated tools. Competent electrician only. Permit to work. Buddy system for live work. Arc flash boundary maintained.', residualL: 1, residualS: 5 },
  { id: 'RA-EL-006', category: 'electrical', hazard: 'Underground cable strike during excavation', whoAtRisk: 'Operatives', consequences: 'Electrocution and fatality from cable strike; gas explosion if gas main struck; flooding from water main; RIDDOR reportable.', initialL: 3, initialS: 5, controls: 'CAT and Genny scan before dig. Statutory utility records checked. Hand dig within 500mm of detected services. Insulated tools used. Permit to dig issued. Spotter present during machine dig near services.', residualL: 1, residualS: 5 },
  { id: 'RA-EL-007', category: 'electrical', hazard: 'Battery explosion / acid burn', whoAtRisk: 'Operatives', consequences: 'Severe eye injury from acid splash; chemical burns; fire from hydrogen gas ignition; long-term vision damage.', initialL: 2, initialS: 4, controls: 'Battery charging in well-ventilated areas. No smoking or naked flames near charging. Eye wash station available. Acid-resistant gloves and goggles when handling. Correct charging procedures followed.', residualL: 1, residualS: 3 },

  // ═══ FIRE & HOT WORKS ═══
  { id: 'RA-FW-001', category: 'fire', hazard: 'Fire from welding/cutting/grinding', whoAtRisk: 'All site personnel', consequences: 'Site fire spreading to structure; serious burns; fatality from smoke inhalation; costly property damage; HSE prosecution.', initialL: 3, initialS: 5, controls: 'Hot work permit issued and signed off. Fire watcher during and 60 minutes after. Fire extinguisher within 2m. Combustibles cleared 10m radius or protected with fire blankets. Smoke detection locally isolated with permit.', residualL: 1, residualS: 4 },
  { id: 'RA-FW-002', category: 'fire', hazard: 'Fire from flammable material storage', whoAtRisk: 'All site personnel', consequences: 'Explosion and rapid fire spread; serious burns; fatality; significant property destruction; evacuation of all site personnel.', initialL: 3, initialS: 5, controls: 'COSHH storage cabinet for flammable liquids. No smoking within 10m. Quantities limited to daily use. Spill kit available. Emergency procedure displayed. Fire extinguisher adjacent.', residualL: 1, residualS: 4 },
  { id: 'RA-FW-003', category: 'fire', hazard: 'Burns from molten metal / slag', whoAtRisk: 'Welders, Adjacent operatives', consequences: 'Serious burns to skin and eyes; fire ignition in surrounding area; ignition of clothing causing further injury.', initialL: 3, initialS: 4, controls: 'Welding screens deployed. Fire-retardant overalls. Welding gauntlets and spats. Exclusion zone around welding area. No combustible material below. Spatter sheets in place.', residualL: 1, residualS: 3 },
  { id: 'RA-FW-004', category: 'fire', hazard: 'Gas cylinder explosion / leak', whoAtRisk: 'Operatives', consequences: 'Explosion causing fatality and serious injury to multiple persons; fire from ignited gas; shrapnel injuries from cylinder failure.', initialL: 2, initialS: 5, controls: 'Cylinders stored upright, chained, away from heat. Flashback arrestors fitted. Regulators in good condition. Leak test with soapy water. No grease on oxygen equipment. Cylinder trolley for transport.', residualL: 1, residualS: 5 },
  { id: 'RA-FW-005', category: 'fire', hazard: 'Fire in temporary accommodation / welfare units', whoAtRisk: 'All site personnel', consequences: 'Burns and smoke inhalation; potential fatality; loss of welfare and site records; serious disruption to works.', initialL: 2, initialS: 4, controls: 'Smoke detectors installed and tested. Fire extinguisher in each unit. Emergency exit clear. Electrical equipment PAT tested. No overloading sockets. Fire procedure displayed. Regular fire drills.', residualL: 1, residualS: 3 },
  { id: 'RA-FW-006', category: 'fire', hazard: 'Fire from bitumen / asphalt heating', whoAtRisk: 'Roofers, Operatives', consequences: 'Serious burns from hot bitumen contact; roof fire spreading to structure; fire from spilled heated bitumen.', initialL: 3, initialS: 4, controls: 'Hot work permit. Gas torches attended at all times. Fire extinguisher within 2m. No naked flame within 2m of felt rolls. Cool-down period observed. Fire watch maintained after completion.', residualL: 1, residualS: 3 },

  // ═══ CONFINED SPACES ═══
  { id: 'RA-CS-001', category: 'confined', hazard: 'Oxygen depletion / toxic atmosphere', whoAtRisk: 'Operatives', consequences: 'Rapid incapacitation and fatality without warning; potential for multiple casualties including would-be rescuers without proper equipment.', initialL: 3, initialS: 5, controls: 'Confined space risk assessment completed. Continuous gas monitoring before and during entry. Trained rescue team on standby. Permit to enter issued. Forced ventilation provided. Communication system in place. Tripod and winch for rescue.', residualL: 1, residualS: 5 },
  { id: 'RA-CS-002', category: 'confined', hazard: 'Drowning / engulfment in confined space', whoAtRisk: 'Operatives', consequences: 'Fatality by drowning or burial; entrapment requiring prolonged rescue; potential for multiple casualties.', initialL: 2, initialS: 5, controls: 'Space isolated from liquid/material inflow. Blanking plates fitted. Drain-down confirmed. Entry permit system. Rescue plan in place. No lone working. Emergency alarm system.', residualL: 1, residualS: 5 },
  { id: 'RA-CS-003', category: 'confined', hazard: 'Fire/explosion in confined space', whoAtRisk: 'Operatives', consequences: 'Multiple fatalities from explosion in confined space; serious burns; structural damage; impossible rescue from collapsed confined space.', initialL: 2, initialS: 5, controls: 'Gas monitoring for LEL before entry. No ignition sources unless permit allows. Intrinsically safe equipment only. Forced ventilation. Hot work permit additional to confined space permit.', residualL: 1, residualS: 5 },
  { id: 'RA-CS-004', category: 'confined', hazard: 'Claustrophobia / heat stress in confined space', whoAtRisk: 'Operatives', consequences: 'Panic, collapse and incapacitation; heat stroke requiring emergency evacuation; delayed response increasing risk of fatality.', initialL: 3, initialS: 3, controls: 'Personnel medically fit and willing. Time limits on entry. Regular breaks. Adequate ventilation. Communication system. Buddy system. Emergency plan briefed. Cool drinking water available.', residualL: 2, residualS: 2 },

  // ═══ EXCAVATION & GROUNDWORKS ═══
  { id: 'RA-EX-001', category: 'excavation', hazard: 'Collapse of excavation/trench', whoAtRisk: 'Operatives', consequences: 'Burial and fatality; serious crush injuries; prolonged and hazardous rescue operation; potential for multiple casualties.', initialL: 3, initialS: 5, controls: 'Trench support (shoring/sheet piling) or batter back to safe angle per soil type. Edge protection barriers 1m from edge. Daily inspection by competent person. No materials stored within 1m of edge. Permit to dig. Means of escape at regular intervals.', residualL: 1, residualS: 5 },
  { id: 'RA-EX-002', category: 'excavation', hazard: 'Striking underground services (gas/electric/water)', whoAtRisk: 'Operatives', consequences: 'Electrocution and fatality from electrical cable; gas explosion and fire; flooding; serious injury to multiple persons from secondary effects.', initialL: 3, initialS: 5, controls: 'Statutory records checked. CAT and Genny scan completed and marked. Hand dig within 500mm of detected services. Insulated hand tools. Permit to dig. Emergency procedure for gas/electric strikes briefed. Service positions marked with paint/pegs.', residualL: 1, residualS: 5 },
  { id: 'RA-EX-003', category: 'excavation', hazard: 'Person falling into excavation', whoAtRisk: 'All site personnel', consequences: 'Serious injuries including fractures and head injuries from fall; secondary risk of burial if sides unstable; RIDDOR reportable.', initialL: 3, initialS: 4, controls: 'Barriers/guardrails around all excavations. Stop blocks for vehicles. Lighting at night. Warning signage. Pedestrian routes diverted. Banks graded for safe access. Access ladders provided within 6m of any operative.', residualL: 1, residualS: 4 },
  { id: 'RA-EX-004', category: 'excavation', hazard: 'Flooding of excavation', whoAtRisk: 'Operatives', consequences: 'Drowning or entrapment; hypothermia; trench collapse from water-weakened sides; rapid flooding leaving no time to escape.', initialL: 3, initialS: 4, controls: 'Weather forecast monitored. Pumping equipment available. Sump formed for water collection. No entry to flooded excavation. Ground water levels assessed. Emergency evacuation plan.', residualL: 2, residualS: 3 },
  { id: 'RA-EX-005', category: 'excavation', hazard: 'Contaminated ground / made ground', whoAtRisk: 'Operatives', consequences: 'Acute toxic exposure; skin and respiratory disease; long-term health effects from carcinogenic contaminants; environmental prosecution.', initialL: 3, initialS: 4, controls: 'Desktop study and ground investigation reviewed. PPE for contaminated ground — coveralls, gloves, RPE. No eating/drinking in work area. Decontamination facilities. Monitoring for gases. Waste disposal to licensed facility.', residualL: 2, residualS: 3 },
  { id: 'RA-EX-006', category: 'excavation', hazard: 'Machine/vehicle falling into excavation', whoAtRisk: 'Plant operators', consequences: 'Fatality of operator from overturned machine in trench; serious crush injuries; secondary collapse of trench sides.', initialL: 2, initialS: 5, controls: 'Stop blocks/bunds at edges. Banksman for plant near excavations. Safe working distance from edge (typically 1m per metre of depth). Ground stability assessed. No tracking parallel to open trench.', residualL: 1, residualS: 5 },
  { id: 'RA-EX-007', category: 'excavation', hazard: 'Piling operations — noise, vibration, collapse', whoAtRisk: 'Operatives, Public', consequences: 'Hearing damage from prolonged noise; vibration damage to adjacent structures; rig collapse causing fatality.', initialL: 3, initialS: 4, controls: 'Piling mat in place. Exclusion zone during operations. Noise and vibration monitoring. Hearing protection mandatory. Rig inspected daily. Ground conditions assessed. Spotter during rig movement.', residualL: 1, residualS: 4 },

  // ═══ STRUCTURAL ═══
  { id: 'RA-ST-001', category: 'structural', hazard: 'Structural collapse during erection', whoAtRisk: 'Operatives, Other trades', consequences: 'Multiple fatalities from uncontrolled structural collapse; serious injuries across a wide area; prolonged site shutdown and HSE investigation.', initialL: 2, initialS: 5, controls: 'Temporary works design by competent engineer (TWC/TWS). Erection sequence followed as per design. Bracing installed as steelwork progresses. Exclusion zone during lifts. No removal of bracing without engineer approval.', residualL: 1, residualS: 5 },
  { id: 'RA-ST-002', category: 'structural', hazard: 'Crush/trap during steel erection', whoAtRisk: 'Steel erectors', consequences: 'Crush injuries and amputation; fatality from trapped between structural members; secondary fall injury if person loses balance.', initialL: 3, initialS: 5, controls: 'Lift plan for all crane lifts. Slinger/signaller CPCS competent. Tag lines on all loads. Operatives stand clear during landing. Bolted connections secured before releasing crane. Pinch point awareness briefing.', residualL: 1, residualS: 5 },
  { id: 'RA-ST-003', category: 'structural', hazard: 'Formwork/falsework collapse', whoAtRisk: 'Operatives', consequences: 'Multiple fatalities from concrete load collapse; serious injuries from impact with formwork; prolonged burial rescue operation.', initialL: 2, initialS: 5, controls: 'Falsework designed to BS 5975. Erected by competent person. Independent check before loading. Props on sole plates. No early striking without engineer approval. Loading sequence controlled.', residualL: 1, residualS: 5 },
  { id: 'RA-ST-004', category: 'structural', hazard: 'Precast concrete element falling during placement', whoAtRisk: 'Operatives', consequences: 'Fatality or serious injury from falling precast element; secondary structural damage; possible injury to multiple personnel in exclusion zone.', initialL: 2, initialS: 5, controls: 'Lift plan prepared. Slinger/signaller competent. Lifting inserts checked. Exclusion zone during lift. Temporary propping immediately after placement. No release until stable.', residualL: 1, residualS: 5 },
  { id: 'RA-ST-005', category: 'structural', hazard: 'Wall/masonry collapse during construction', whoAtRisk: 'Operatives', consequences: 'Burial, serious injury or fatality from wall collapse; multiple casualties if collapse during occupied work period.', initialL: 2, initialS: 5, controls: 'Walls built plumb and level. Wind speed limitations observed. Temporary bracing for freestanding walls. Wall ties installed at correct spacing. No overloading of scaffold with materials.', residualL: 1, residualS: 5 },
  { id: 'RA-ST-006', category: 'structural', hazard: 'Concrete pour — formwork burst', whoAtRisk: 'Operatives', consequences: 'Injury from escaping concrete; formwork component strike; property damage; delay to works from failed pour.', initialL: 2, initialS: 4, controls: 'Formwork designed for pour pressure. Ties and props checked before pour. Pour rate controlled. Monitoring during pour. Stand clear of forms during striking. Emergency stop procedure for pump.', residualL: 1, residualS: 4 },

  // ═══ LIFTING OPERATIONS ═══
  { id: 'RA-LO-001', category: 'lifting', hazard: 'Crane collapse / overturning', whoAtRisk: 'All site personnel', consequences: 'Multiple fatalities from crane collapse; widespread property destruction; potential injury to public beyond site boundary.', initialL: 1, initialS: 5, controls: 'Crane erected and inspected per LOLER. Ground bearing capacity assessed. Outrigger mats deployed. Wind speed monitoring — stand down per manufacturer limits. Certified operator (CPCS). Exclusion zone during operations.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-002', category: 'lifting', hazard: 'Dropped/swinging load from crane', whoAtRisk: 'All site personnel', consequences: 'Fatality or serious injury from dropped load; injuries from swinging load striking personnel; secondary structural damage.', initialL: 2, initialS: 5, controls: 'Lift plan prepared and briefed. Slinger/signaller appointed and competent. Lifting accessories inspected and certified. Tag lines on all loads. Exclusion zone maintained. No working under suspended loads.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-003', category: 'lifting', hazard: 'Failure of lifting accessories (slings, shackles)', whoAtRisk: 'Operatives', consequences: 'Dropped load causing fatality or serious injury; secondary injury from swinging load; property damage.', initialL: 2, initialS: 5, controls: 'All lifting accessories LOLER inspected (6-monthly). SWL clearly marked. Pre-use visual inspection. Damaged equipment immediately removed. Correct sling angle observed. No shock loading.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-004', category: 'lifting', hazard: 'Person struck by crane jib/counterweight', whoAtRisk: 'All site personnel', consequences: 'Serious injury or fatality from jib strike; crush injuries in tail swing area; multiple casualties if jib sweeps occupied area.', initialL: 2, initialS: 5, controls: 'Exclusion zone around crane radius. Barriers at tail swing area. Warning signage. Banksman positioned safely. Communication via radio. Crane operator visibility checks.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-005', category: 'lifting', hazard: 'Contact between crane and overhead power lines', whoAtRisk: 'Crane operator, All', consequences: 'Electrocution and fatality of operator or ground personnel; power interruption to wider area; fire from arc flash.', initialL: 2, initialS: 5, controls: 'Overhead line survey before crane setup. Goal posts and bunting installed. Safe clearance distance maintained. DNO contacted if required. Crane radius limited to prevent oversail. Briefing to operator.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-006', category: 'lifting', hazard: 'HIAB/lorry loader failure during offload', whoAtRisk: 'Operatives, Drivers', consequences: 'Serious injury or fatality from dropped or swinging load; vehicle overturning causing crush injuries.', initialL: 2, initialS: 5, controls: 'LOLER inspection current. Operator trained. Outriggers fully deployed on firm ground. SWL observed per load chart. No side loading. Area clear of personnel during lift. Delivery briefed to driver.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-007', category: 'lifting', hazard: 'Vacuum lifter failure during glazing/cladding install', whoAtRisk: 'Operatives', consequences: 'Dropped glazing panel causing fatality or serious injury; secondary shattering injury from broken glass; fall from height if operative is attached.', initialL: 2, initialS: 5, controls: 'Vacuum lifter LOLER inspected. Tested before each lift. Battery charge checked. Backup retention device where available. Exclusion zone below. Two-person handling. Wind speed monitored.', residualL: 1, residualS: 5 },

  // ═══ SCAFFOLDING ═══
  { id: 'RA-SC-001', category: 'scaffold', hazard: 'Scaffold collapse', whoAtRisk: 'All site personnel', consequences: 'Multiple fatalities and serious injuries from scaffold collapse; injury to public if scaffold faces highway; significant property damage.', initialL: 2, initialS: 5, controls: 'Designed and erected by CISRS competent scaffolders. Compliant with TG20/SG4. Base plates on sole plates. Ties at correct spacing. Weekly inspection and after adverse weather. Scaffold tag system.', residualL: 1, residualS: 5 },
  { id: 'RA-SC-002', category: 'scaffold', hazard: 'Overloading scaffold platform', whoAtRisk: 'Operatives', consequences: 'Platform failure causing falls from height; partial or full scaffold collapse under excessive load; injuries to personnel below.', initialL: 3, initialS: 5, controls: 'Load class clearly marked on scaffold tag. Material storage limits briefed. No stacking above guardrail height. Materials distributed evenly. No mechanical plant on scaffold without specific design.', residualL: 1, residualS: 4 },
  { id: 'RA-SC-003', category: 'scaffold', hazard: 'Contact with scaffold during vehicle movement', whoAtRisk: 'Drivers, Scaffold users', consequences: 'Scaffold destabilisation or collapse from vehicle impact; injury to scaffold users; falling materials onto passers-by.', initialL: 3, initialS: 4, controls: 'Vehicle protection barriers installed. Height warning signs. Banksman for large vehicles. Scaffold base lit/signed at night. No vehicle parking within 2m of scaffold base.', residualL: 1, residualS: 4 },
  { id: 'RA-SC-004', category: 'scaffold', hazard: 'Unauthorised alteration to scaffolding', whoAtRisk: 'All site personnel', consequences: 'Hidden structural weakness leading to collapse; falls from height due to removed edge protection; injury to next user unaware of change.', initialL: 3, initialS: 5, controls: 'Scaffold tag system — red tag if altered. Only CISRS scaffolders to modify. Toolbox talk on scaffold rules. Disciplinary action for unauthorised changes. Weekly inspection catches alterations.', residualL: 1, residualS: 5 },

  // ═══ DEMOLITION ═══
  { id: 'RA-DM-001', category: 'demolition', hazard: 'Unplanned structural collapse during demolition', whoAtRisk: 'All site personnel', consequences: 'Multiple fatalities from uncontrolled collapse; widespread serious injuries; property damage to adjacent structures; prolonged HSE investigation.', initialL: 3, initialS: 5, controls: 'Demolition plan prepared by competent engineer. Pre-demolition survey completed (structure, services, asbestos). Sequence followed strictly. Exclusion zone maintained. Temporary propping where needed. Continuous monitoring.', residualL: 1, residualS: 5 },
  { id: 'RA-DM-002', category: 'demolition', hazard: 'Asbestos exposure during soft strip', whoAtRisk: 'Operatives', consequences: 'Mesothelioma, asbestosis and lung cancer — latent period of 15–50 years; fatal disease with no cure; potential for criminal prosecution.', initialL: 3, initialS: 5, controls: 'Refurbishment/demolition asbestos survey completed (R&D survey). Licensed contractor for ACM removal. Air monitoring during and after. Enclosure where required. RPE and disposable coveralls. Decontamination unit on site.', residualL: 1, residualS: 5 },
  { id: 'RA-DM-003', category: 'demolition', hazard: 'Falling debris during demolition', whoAtRisk: 'All site personnel, Public', consequences: 'Fatality or serious injury from falling masonry, steel or concrete; injury to public beyond hoarding; property damage.', initialL: 4, initialS: 5, controls: 'Exclusion zone with hoarding. Debris netting/fans on perimeter scaffold. No public access within zone. Hard hat mandatory. Demolition sequence top-down. Materials lowered, not thrown.', residualL: 1, residualS: 5 },
  { id: 'RA-DM-004', category: 'demolition', hazard: 'Dust exposure during demolition', whoAtRisk: 'Operatives, Public', consequences: 'Silicosis and chronic lung disease from silica dust; respiratory disease from other demolition dusts; long-term disability; enforcement action.', initialL: 4, initialS: 3, controls: 'Water suppression during all breaking/cutting. Dust screens on perimeter. RPE (minimum FFP3). Air monitoring. Damping down stockpiles. Wheel wash for vehicles leaving site.', residualL: 2, residualS: 2 },
  { id: 'RA-DM-005', category: 'demolition', hazard: 'Hitting live services during demolition', whoAtRisk: 'Operatives', consequences: 'Electrocution and fatality from live cable; gas explosion from severed gas main; flooding from water main; RIDDOR reportable.', initialL: 3, initialS: 5, controls: 'All services isolated and capped before demolition begins. Isolation certificates obtained. Services traced and marked. Hand demolition near suspect services. Gas/electric emergency procedure briefed.', residualL: 1, residualS: 5 },

  // ═══ WELDING & CUTTING ═══
  { id: 'RA-WC-001', category: 'welding', hazard: 'UV radiation / arc eye from welding', whoAtRisk: 'Welders, Adjacent workers', consequences: 'Painful arc eye (photokeratitis) requiring medical treatment; long-term UV damage to vision; cataracts from chronic exposure.', initialL: 4, initialS: 3, controls: 'Auto-darkening welding helmet (shade 10-13). Welding screens deployed. Warning signs displayed. Adjacent workers informed. No viewing arc without protection. Curtain/screen minimum 2m around work.', residualL: 1, residualS: 2 },
  { id: 'RA-WC-002', category: 'welding', hazard: 'Welding fume inhalation', whoAtRisk: 'Welders', consequences: 'Lung cancer from chronic fume exposure; siderosis; metal fume fever; respiratory sensitisation; occupational asthma; RIDDOR reportable occupational disease.', initialL: 4, initialS: 4, controls: 'LEV (local exhaust ventilation) at point of welding. RPE (P3 filter minimum) where LEV insufficient. Weld in well-ventilated area or use extraction fan. Avoid welding galvanised/stainless without extraction. Health surveillance programme.', residualL: 2, residualS: 3 },
  { id: 'RA-WC-003', category: 'welding', hazard: 'Electric shock from welding equipment', whoAtRisk: 'Welders', consequences: 'Electric shock causing cardiac arrest; severe burns at contact points; secondary fall if shock occurs at height.', initialL: 2, initialS: 4, controls: 'Equipment in good condition — daily check. Dry gloves and clothing. Insulated electrode holders. Earth return correctly connected. No welding in wet conditions without additional precautions. RCD protected supply.', residualL: 1, residualS: 3 },
  { id: 'RA-WC-004', category: 'welding', hazard: 'Gas cutting — flashback / explosion', whoAtRisk: 'Operatives', consequences: 'Flashback explosion causing serious burns and injury; hose fire; cylinder failure causing shrapnel and explosion; fatality in severe cases.', initialL: 2, initialS: 5, controls: 'Flashback arrestors on both torch and regulator. Hoses in good condition. Correct lighting procedure. Purge lines before lighting. No grease on oxygen fittings. Cylinders stored upright and secured.', residualL: 1, residualS: 5 },
  { id: 'RA-WC-005', category: 'welding', hazard: 'Grinding sparks causing fire/burns', whoAtRisk: 'Operatives', consequences: 'Ignition of surrounding materials causing site fire; burn injuries from sparks on exposed skin; eye injury from spark contact.', initialL: 3, initialS: 3, controls: 'Spark direction controlled. Fire blankets on combustibles. Grinding guard in place. Fire extinguisher within 2m. No grinding near flammable stores. Eye protection and face shield worn.', residualL: 1, residualS: 2 },

  // ═══ NOISE & VIBRATION ═══
  { id: 'RA-NV-001', category: 'noise', hazard: 'Hearing damage from noise above 85 dB(A)', whoAtRisk: 'Operatives, Adjacent trades', consequences: 'Permanent, irreversible hearing loss; tinnitus; occupational deafness claim; RIDDOR reportable occupational disease.', initialL: 4, initialS: 4, controls: 'Noise assessment completed. Hearing protection zones designated and signed. Ear defenders (minimum SNR 25) mandatory in zones. Low-noise methods selected. Time limits on high-noise exposure. Health surveillance.', residualL: 2, residualS: 3 },
  { id: 'RA-NV-002', category: 'noise', hazard: 'HAVS from vibrating tools', whoAtRisk: 'Operatives', consequences: 'Permanent nerve and vascular damage to hands (vibration white finger); loss of dexterity; inability to work in cold; irreversible condition; compensation claims.', initialL: 4, initialS: 3, controls: 'HAVS assessment completed. Low-vibration tools selected where possible. Exposure time limits enforced and monitored. Tool maintenance programme. Anti-vibration gloves. Operatives trained on HAVS symptoms. Health surveillance for regular users.', residualL: 2, residualS: 3 },
  { id: 'RA-NV-003', category: 'noise', hazard: 'Whole body vibration from plant/vehicles', whoAtRisk: 'Plant operators', consequences: 'Chronic spinal disorders and back pain; musculoskeletal damage; long-term disability; compensation claims; lost working time.', initialL: 3, initialS: 3, controls: 'Suspension seats on all plant. Route maintenance to reduce roughness. Speed limits enforced. Time limits on operation. Operator health surveillance. Correct tyre pressures maintained.', residualL: 2, residualS: 2 },

  // ═══ DUST & RESPIRATORY ═══
  { id: 'RA-DR-001', category: 'dust', hazard: 'Silica dust from cutting concrete/stone', whoAtRisk: 'Operatives', consequences: 'Silicosis (fatal, incurable lung disease); lung cancer; COPD; RIDDOR reportable occupational disease; HSE enforcement.', initialL: 4, initialS: 5, controls: 'Water suppression on all cutting. On-tool dust extraction with H-class vacuum. RPE minimum FFP3. Enclosed cutting area where possible. Face-fit tested RPE. Health surveillance. COSHH assessment.', residualL: 2, residualS: 4 },
  { id: 'RA-DR-002', category: 'dust', hazard: 'Wood dust inhalation', whoAtRisk: 'Carpenters, Joiners', consequences: 'Occupational asthma; nasal cancer from hardwood dust (RIDDOR reportable); chronic respiratory disease; sensitisation preventing further exposure.', initialL: 3, initialS: 4, controls: 'On-tool extraction fitted to all power tools. Workshop extraction system. RPE (FFP2 minimum) for hand sanding or where extraction insufficient. Regular cleaning — no dry sweeping. Health surveillance for hardwood dust.', residualL: 2, residualS: 3 },
  { id: 'RA-DR-003', category: 'dust', hazard: 'Plaster/gypsum dust inhalation', whoAtRisk: 'Plasterers, Dry liners', consequences: 'Respiratory irritation and discomfort; dermatitis from skin contact with dust; potential for chronic respiratory symptoms with prolonged exposure.', initialL: 3, initialS: 3, controls: 'Mix in ventilated area. RPE (FFP2) during mixing and sanding. Damp down before sweeping. Vacuum with H-class filter for sanding dust. Water-based products preferred.', residualL: 2, residualS: 2 },
  { id: 'RA-DR-004', category: 'dust', hazard: 'Metal fume/dust from grinding/cutting', whoAtRisk: 'Metal workers', consequences: 'Metal fume fever; siderosis (iron lung deposits); lung disease from chromium/nickel compounds; occupational cancer risk from stainless/galvanised work.', initialL: 3, initialS: 4, controls: 'LEV at point of generation. RPE (P3 filter) for grinding galvanised or stainless steel. Welding fume extraction. Well-ventilated work area. Health surveillance. Rotate operatives to limit exposure.', residualL: 2, residualS: 3 },
  { id: 'RA-DR-005', category: 'dust', hazard: 'Asbestos fibre exposure', whoAtRisk: 'All site personnel', consequences: 'Mesothelioma, asbestosis and lung cancer — all potentially fatal with no cure; latent period of up to 50 years; criminal prosecution possible.', initialL: 2, initialS: 5, controls: 'Asbestos survey reviewed. If suspect material found — STOP WORK and evacuate. Licensed contractor for removal. No disturbance of known ACMs. Asbestos awareness training for all operatives. Asbestos register checked before any work.', residualL: 1, residualS: 5 },

  // ═══ CHEMICAL / COSHH ═══
  { id: 'RA-CH-001', category: 'coshh', hazard: 'Skin contact with cement/concrete', whoAtRisk: 'Operatives', consequences: 'Severe chromate dermatitis; chemical burns requiring hospitalisation; chronic skin sensitisation preventing further exposure; significant lost time.', initialL: 4, initialS: 3, controls: 'Barrier cream applied before work. Appropriate gloves (nitrile or PVC). Long sleeves. Wash immediately if skin contact. First aid for cement burns — irrigate with clean water. Skin inspection programme.', residualL: 2, residualS: 2 },
  { id: 'RA-CH-002', category: 'coshh', hazard: 'Chemical burns from acids/cleaning agents', whoAtRisk: 'Operatives', consequences: 'Serious chemical burns requiring hospitalisation; permanent eye damage or blindness; long-term scarring; RIDDOR reportable.', initialL: 3, initialS: 4, controls: 'COSHH assessment completed. SDS available on site. Correct PPE per SDS (chemical-resistant gloves, goggles, apron). Eye wash station. Spillage procedure. Minimum quantities stored. Dilution per manufacturer.', residualL: 1, residualS: 3 },
  { id: 'RA-CH-003', category: 'coshh', hazard: 'Inhalation of solvent fumes (paints, adhesives)', whoAtRisk: 'Painters, Operatives', consequences: 'CNS depression, headache, nausea and loss of consciousness; long-term liver and kidney damage; fire risk from vapour ignition.', initialL: 3, initialS: 4, controls: 'Water-based products preferred. Adequate ventilation. RPE with organic vapour cartridge where ventilation insufficient. COSHH assessment. No smoking in area. Exposure time limits.', residualL: 2, residualS: 3 },
  { id: 'RA-CH-004', category: 'coshh', hazard: 'Exposure to epoxy resin / isocyanates', whoAtRisk: 'Operatives', consequences: 'Permanent respiratory sensitisation (occupational asthma); allergic dermatitis; once sensitised, no further exposure possible; career-ending condition.', initialL: 3, initialS: 4, controls: 'Respiratory sensitiser — RPE mandatory (minimum APF20). Chemical-resistant gloves. COSHH assessment. Health surveillance. No eating/drinking in work area. Contained mixing. Skin decontamination procedure.', residualL: 1, residualS: 3 },
  { id: 'RA-CH-005', category: 'coshh', hazard: 'Lead paint exposure during stripping/demolition', whoAtRisk: 'Operatives', consequences: 'Lead poisoning causing neurological damage, kidney damage and reproductive harm; elevated blood lead levels; RIDDOR reportable occupational disease.', initialL: 3, initialS: 5, controls: 'Lead paint survey before work. Chemical stripping preferred over heat/abrasive. RPE (P3 filter). Disposable overalls. Blood lead monitoring. Decontamination procedure. Waste as special waste.', residualL: 1, residualS: 4 },

  // ═══ TRAFFIC & VEHICLES ═══
  { id: 'RA-TV-001', category: 'traffic', hazard: 'Pedestrian/vehicle conflict on site', whoAtRisk: 'All site personnel', consequences: 'Serious injury or fatality from vehicle collision; crush injuries; RIDDOR reportable; potential HSE prosecution.', initialL: 3, initialS: 5, controls: 'Segregated pedestrian/vehicle routes with barriers. One-way system where practical. Speed limit 5mph. Hi-vis mandatory. Banksman for all deliveries. Pedestrian crossings at conflict points.', residualL: 1, residualS: 4 },
  { id: 'RA-TV-002', category: 'traffic', hazard: 'Delivery vehicle overturning during offload', whoAtRisk: 'Drivers, Operatives', consequences: 'Crush injury or fatality from vehicle or load; injuries to nearby personnel; significant property damage.', initialL: 2, initialS: 5, controls: 'Level hard standing for offloading. Ground conditions assessed. Outrigger mats for HIAB vehicles. Weight limits checked. Banksman present. Vehicle brakes applied and chocked.', residualL: 1, residualS: 5 },
  { id: 'RA-TV-003', category: 'traffic', hazard: 'Reversing vehicle striking person', whoAtRisk: 'All site personnel', consequences: 'Fatal or serious crush injury from reversing vehicle; insufficient warning time in noisy environment; RIDDOR reportable.', initialL: 3, initialS: 5, controls: 'Banksman for all reversing. Reversing alarms and cameras fitted. Exclusion zone behind reversing vehicles. Hi-vis mandatory. One-way system to minimise reversing. Briefing at induction.', residualL: 1, residualS: 5 },
  { id: 'RA-TV-004', category: 'traffic', hazard: 'Public highway traffic at site entrance', whoAtRisk: 'Operatives, Public', consequences: 'Road traffic accident involving public vehicles; serious injury or fatality; legal liability; site suspension from local authority.', initialL: 3, initialS: 5, controls: 'Traffic management plan approved. Banksman at site access. Wheel wash to prevent mud on road. Warning signs on approach. Road sweeping if required. Speed restrictions on approach.', residualL: 1, residualS: 4 },
  { id: 'RA-TV-005', category: 'traffic', hazard: 'Vehicle fire from fuel leak', whoAtRisk: 'Drivers, Operatives', consequences: 'Serious burns to operator; fire spreading to adjacent plant or materials; explosion risk if fuel tank involved; property damage.', initialL: 2, initialS: 4, controls: 'Daily vehicle checks including fuel lines. No smoking near plant. Fuel stored in bunded area. Spill kit available. Fire extinguisher on all plant/vehicles. Emergency procedure briefed.', residualL: 1, residualS: 3 },

  // ═══ ENVIRONMENTAL ═══
  { id: 'RA-EN-001', category: 'environment', hazard: 'Pollution/spill to watercourse', whoAtRisk: 'Environment', consequences: 'Ecological damage to watercourse; EA enforcement notice or prosecution; significant remediation costs; reputational damage.', initialL: 3, initialS: 4, controls: 'Spill kit on site. Drip trays under plant/fuel storage. Bunded fuel stores. No wash-out near drains. Silt fencing at boundary. Environmental incident procedure. EA contact details available.', residualL: 1, residualS: 3 },
  { id: 'RA-EN-002', category: 'environment', hazard: 'Fuel/oil spillage contaminating ground', whoAtRisk: 'Environment', consequences: 'Ground contamination requiring costly remediation; EA enforcement; potential criminal prosecution; project delays.', initialL: 3, initialS: 3, controls: 'Double-bunded fuel storage. Drip trays under plant. Spill kit at fuel store and on plant. Refuelling on hardstanding only. No overfilling. Designated refuelling point.', residualL: 2, residualS: 2 },
  { id: 'RA-EN-003', category: 'environment', hazard: 'Noise nuisance to neighbours/public', whoAtRisk: 'Public', consequences: 'Local authority enforcement notice; work stoppage order; complaint escalation; reputational damage; fines.', initialL: 3, initialS: 2, controls: 'Working hours restricted per local authority (typically 08:00-18:00 Mon-Fri, 08:00-13:00 Sat). Noisy works planned away from sensitive receptors. Acoustic barriers where required. Neighbour liaison.', residualL: 2, residualS: 2 },
  { id: 'RA-EN-004', category: 'environment', hazard: 'Waste disposal — incorrect segregation', whoAtRisk: 'Environment', consequences: 'Environmental prosecution and fines; duty of care breach; illegal fly-tipping liability; EA enforcement; project reputational damage.', initialL: 3, initialS: 3, controls: 'Waste segregation areas clearly signed. Skip labelling. Licensed waste carrier. Waste transfer notes retained. Site Waste Management Plan. Toolbox talk on waste segregation. No burning on site.', residualL: 2, residualS: 2 },

  // ═══ GENERAL SITE ═══
  { id: 'RA-GS-001', category: 'general', hazard: 'Slips, trips and falls on level', whoAtRisk: 'All site personnel', consequences: 'Fractures, head injuries and sprains; lost time injury; secondary injury from falling into other hazards or materials.', initialL: 4, initialS: 3, controls: 'Good housekeeping maintained throughout shift. Cable routes protected or overhead. Adequate lighting. Walkways kept clear and signed. Anti-slip surfaces on ramps. Immediate clean-up of spills.', residualL: 2, residualS: 2 },
  { id: 'RA-GS-002', category: 'general', hazard: 'Adverse weather conditions', whoAtRisk: 'Operatives', consequences: 'Falls from height in high winds or ice; exposure and hypothermia; lightning strike; vehicle accidents on icy site roads.', initialL: 3, initialS: 4, controls: 'Weather forecast checked daily. Work at height suspended in high winds (>17mph for most tasks). Additional PPE for cold/wet conditions. Lightning procedure — shelter and stand down. Ice treatment on walkways.', residualL: 2, residualS: 3 },
  { id: 'RA-GS-003', category: 'general', hazard: 'Unauthorised access / trespassers', whoAtRisk: 'Public, Trespassers', consequences: 'Injury to trespasser (especially children) leading to civil liability; vandalism causing damage and danger; theft of plant or materials.', initialL: 3, initialS: 4, controls: 'Hoarding/fencing secure (2.4m minimum). Site locked when unattended. Signage displayed. CCTV where required. Security guard for high-risk sites. Banksman at vehicle access during working hours.', residualL: 2, residualS: 3 },
  { id: 'RA-GS-004', category: 'general', hazard: 'Poor lighting in work area', whoAtRisk: 'All site personnel', consequences: 'Falls, trips and injuries due to poor visibility; failure to identify hazards; near-miss incidents increasing.', initialL: 3, initialS: 3, controls: 'Task lighting provided for all work areas. Minimum 200 lux for general construction, 500 lux for detailed work. Emergency lighting on escape routes. Portable lighting maintained and PAT tested.', residualL: 1, residualS: 2 },
  { id: 'RA-GS-005', category: 'general', hazard: 'Lone working', whoAtRisk: 'Operative', consequences: 'Undetected injury or illness; delayed emergency response increasing severity; fatality in cases where prompt assistance would have saved life.', initialL: 3, initialS: 4, controls: 'Lone working risk assessment. Check-in system (buddy calls every 30 mins). No high-risk activities alone. Mobile phone charged and in service. First aid kit available. Emergency contact details carried.', residualL: 2, residualS: 3 },
  { id: 'RA-GS-006', category: 'general', hazard: 'Welfare facilities inadequate', whoAtRisk: 'All site personnel', consequences: 'Illness from lack of sanitation; dehydration; morale and productivity impact; HSE enforcement notice; potential prohibition.', initialL: 2, initialS: 2, controls: 'Toilet and washing facilities maintained. Hot and cold water. Drying room. Rest area with seating and heating. Clean drinking water. Facilities for heating food. Cleaned daily.', residualL: 1, residualS: 1 },
  { id: 'RA-GS-007', category: 'general', hazard: 'Sharps / needle stick injury', whoAtRisk: 'Operatives', consequences: 'Blood-borne virus exposure (HIV, Hepatitis B and C); serious long-term illness; significant psychological distress; RIDDOR reportable.', initialL: 2, initialS: 4, controls: 'Pre-start survey of area. Gloves worn during clearance. Sharps bin available. No hand-picking of sharps — use grabbers. Hepatitis B vaccination offered. Incident procedure for needle stick.', residualL: 1, residualS: 3 },
  { id: 'RA-GS-008', category: 'general', hazard: 'Heat stress / sunburn', whoAtRisk: 'Operatives', consequences: 'Heat exhaustion and heat stroke requiring immediate medical treatment; fatality in extreme cases; cognitive impairment increasing accident risk.', initialL: 3, initialS: 3, controls: 'Regular water breaks (every 20 mins in hot conditions). Shade provided where possible. Sunscreen available. Lightweight clothing. Schedule heavy work for cooler periods. First aiders briefed on heat illness symptoms.', residualL: 2, residualS: 2 },
  { id: 'RA-GS-009', category: 'general', hazard: 'Weil\'s disease (leptospirosis)', whoAtRisk: 'Operatives', consequences: 'Leptospirosis infection — flu-like illness progressing to organ failure; potential fatality; prolonged recovery; RIDDOR reportable.', initialL: 2, initialS: 4, controls: 'Avoid contact with stagnant water. Cuts and abrasions covered with waterproof dressings. Wash hands before eating. Awareness briefing. Report flu-like symptoms to site manager and GP. Mention occupational exposure.', residualL: 1, residualS: 3 },
  { id: 'RA-GS-010', category: 'general', hazard: 'Inadequate site security out-of-hours', whoAtRisk: 'Public, Trespassers', consequences: 'Vandalism, theft, child injury from playing on plant or unsecured excavations. Civil and criminal liability for site team.', initialL: 3, initialS: 4, controls: 'Hoarding 2.4m minimum, locked gates after-hours, plant immobilised and locked, materials stored away from boundary. CCTV or security guard on high-risk sites. Out-of-hours emergency contact displayed.', residualL: 1, residualS: 3 },
  { id: 'RA-GS-011', category: 'general', hazard: 'Untrained / uninducted personnel on site', whoAtRisk: 'All site personnel', consequences: 'Accident from operatives unfamiliar with site rules, hazards, emergency procedures. CDM 2015 enforcement risk.', initialL: 3, initialS: 3, controls: 'No site access without induction. Visitor register at gate. CSCS check on entry. Daily briefings before work commences. Buddy assignment for new starters.', residualL: 1, residualS: 2 },
  { id: 'RA-GS-012', category: 'general', hazard: 'Mobile phone use during work', whoAtRisk: 'Operatives', consequences: 'Distraction leading to falls, plant strikes, missed warnings. Hand-arm interference with PPE.', initialL: 3, initialS: 3, controls: 'No mobile phones during plant operation. Designated phone use areas. Hands-free in vehicles. Brief on photography permissions on site.', residualL: 2, residualS: 2 },

  // ═══ ASBESTOS ═══
  { id: 'RA-AS-001', category: 'asbestos', hazard: 'Disturbing suspected ACMs (asbestos-containing materials)', whoAtRisk: 'Operatives, occupants', consequences: 'Long-latency lung disease (mesothelioma, asbestosis, lung cancer). Exposure liability extends decades. Legal action under CAR 2012.', initialL: 3, initialS: 5, controls: 'STOP work if asbestos suspected. R&D survey reviewed before any disturbance. Licensed contractor for licensable work. UKAS-accredited analyst for non-licensed. Site briefing on ACM register.', residualL: 1, residualS: 5 },
  { id: 'RA-AS-002', category: 'asbestos', hazard: 'Inadequate enclosure during licensed removal', whoAtRisk: 'Operatives, neighbouring premises', consequences: 'Fibre release contaminating wider site. Costly decontamination. HSE prohibition notice. Licence revocation.', initialL: 2, initialS: 5, controls: 'Negative pressure enclosure with HEPA filtration. Smoke test before start. Daily inspection by analyst. 3-stage decontamination. Reassurance air clearance before reoccupation.', residualL: 1, residualS: 5 },
  { id: 'RA-AS-003', category: 'asbestos', hazard: 'Asbestos waste disposal failure', whoAtRisk: 'Operatives, public, environment', consequences: 'Environmental contamination. Environmental Agency prosecution. Costly site remediation.', initialL: 2, initialS: 4, controls: 'Double-bagged in red asbestos sacks. Locked skip with EA permit. Licensed waste carrier only. Consignment notes retained 3 years.', residualL: 1, residualS: 3 },
  { id: 'RA-AS-004', category: 'asbestos', hazard: 'Cross-contamination from PPE', whoAtRisk: 'Operatives, families', consequences: 'Domestic exposure to asbestos fibres. Para-occupational mesothelioma cases.', initialL: 2, initialS: 5, controls: 'Disposable Type 5/6 coveralls — never worn off-site. Boots cleaned in decon. Powered air respirator stored on-site. Daily decontamination shower.', residualL: 1, residualS: 4 },
  { id: 'RA-AS-005', category: 'asbestos', hazard: 'Untrained operative undertaking NNLW work', whoAtRisk: 'Operatives', consequences: 'Inadvertent exposure. CAR 2012 enforcement — minimum HSE Cat A training required for all NNLW.', initialL: 3, initialS: 4, controls: 'UKATA Category A awareness for all operatives in proximity. Cat B training for those carrying out NNLW. Health surveillance and personal exposure monitoring.', residualL: 1, residualS: 3 },
  { id: 'RA-AS-006', category: 'asbestos', hazard: 'Asbestos cement product breakage', whoAtRisk: 'Operatives', consequences: 'Fibre release from broken cement sheet/pipe. Lower fibre release than friable but still hazardous.', initialL: 3, initialS: 4, controls: 'Hand-held methods only — no power tools. Pre-wet to suppress fibre. Bag fragments. Type 5/6 coverall and FFP3.', residualL: 1, residualS: 3 },

  // ═══ HEALTH & WELLBEING ═══
  { id: 'RA-HW-001', category: 'health', hazard: 'Mental health crisis on site', whoAtRisk: 'Operatives', consequences: 'Self-harm, suicide. Construction industry has highest male suicide rate. Loss of life and lasting impact on team.', initialL: 3, initialS: 5, controls: 'Mates in Mind / Lighthouse Club briefing. Mental Health First Aiders trained. Confidential 24/7 helpline displayed. No-stigma culture. Manager training on spotting signs.', residualL: 2, residualS: 4 },
  { id: 'RA-HW-002', category: 'health', hazard: 'Chronic stress / burnout', whoAtRisk: 'Operatives, supervisors', consequences: 'Long-term sickness absence. Reduced concentration leading to accidents. Family/relationship breakdown.', initialL: 3, initialS: 3, controls: 'Reasonable working hours. Mandatory rest breaks. Workload management by supervisor. Annual wellbeing surveys. EAP available.', residualL: 2, residualS: 2 },
  { id: 'RA-HW-003', category: 'health', hazard: 'Drug or alcohol misuse', whoAtRisk: 'All site personnel', consequences: 'Impaired operative causing accident — fatality risk. Disciplinary and criminal consequences.', initialL: 2, initialS: 5, controls: 'Drug/alcohol policy displayed. Random testing programme. Pre-employment screening. Confidential support through EAP. Manager intervention training.', residualL: 1, residualS: 4 },
  { id: 'RA-HW-004', category: 'health', hazard: 'Fatigue from extended shifts', whoAtRisk: 'Operatives, road users', consequences: 'Cognitive impairment leading to accidents. Driving home after long shift = collision risk.', initialL: 3, initialS: 4, controls: 'Working hours limit (max 12h shift, 60h/week). Mandatory breaks. Fatigue management policy. Naps if shift overruns. Hotel for distant operatives.', residualL: 2, residualS: 3 },
  { id: 'RA-HW-005', category: 'health', hazard: 'Pregnancy at work', whoAtRisk: 'Pregnant operative, foetus', consequences: 'Miscarriage from chemical exposure or trauma. Manual handling injury. Heat stress.', initialL: 2, initialS: 4, controls: 'New & expectant mother risk assessment. Chemical exposure restrictions. Reduced manual handling. Rest breaks. Avoid working at height after week 28. Reassign duties as needed.', residualL: 1, residualS: 3 },
  { id: 'RA-HW-006', category: 'health', hazard: 'Young worker (under 18)', whoAtRisk: 'Young operative', consequences: 'Inexperience leading to higher accident rate. Legal restrictions on hours and tasks.', initialL: 3, initialS: 3, controls: 'Specific risk assessment for under-18s. Direct supervision. Restricted from high-risk plant. Limited hours per Working Time Regulations. Apprenticeship framework where applicable.', residualL: 2, residualS: 2 },
  { id: 'RA-HW-007', category: 'health', hazard: 'Skin sensitisation / dermatitis', whoAtRisk: 'Operatives', consequences: 'Chronic skin condition leading to permanent inability to work with the substance. Career-ending.', initialL: 3, initialS: 3, controls: 'Avoid skin contact — proper PPE selection. Health surveillance at COSHH-required frequency. Skin checks. Barrier creams. Removal from exposure on first sign.', residualL: 1, residualS: 2 },
  { id: 'RA-HW-008', category: 'health', hazard: 'Hand-arm vibration syndrome (HAVS)', whoAtRisk: 'Operatives using vibrating tools', consequences: 'Permanent nerve damage, vascular damage (white finger). Career impact — operative may need redeployment.', initialL: 4, initialS: 3, controls: 'Daily exposure calculator (EAV 100 pts, ELV 400 pts). Tool selection — low-vibration where available. Tool rotation. Health surveillance Tier 1-3. Symptom reporting.', residualL: 2, residualS: 2 },
  { id: 'RA-HW-009', category: 'health', hazard: 'Eye fatigue / vision strain', whoAtRisk: 'Operatives, supervisors', consequences: 'Headaches, blurred vision, reduced concentration leading to accidents.', initialL: 2, initialS: 2, controls: 'Adequate lighting (200-500 lux). Anti-glare task lighting. DSE assessment for office workers. Regular breaks. Annual eye tests if required.', residualL: 1, residualS: 1 },
  { id: 'RA-HW-010', category: 'health', hazard: 'Respiratory sensitisation', whoAtRisk: 'Operatives', consequences: 'Occupational asthma — irreversible. Operative must avoid further exposure for life.', initialL: 3, initialS: 4, controls: 'Substitution where possible (water-based paint, lead-free solder, etc.). Effective LEV. RPE class matched to substance. Health surveillance with spirometry. Remove on first symptoms.', residualL: 1, residualS: 3 },

  // ═══ OCCUPIED PREMISES ═══
  { id: 'RA-OC-001', category: 'occupied', hazard: 'Public access to working area', whoAtRisk: 'Public', consequences: 'Injury to staff, customers, or pupils. Civil claim. Reputational damage.', initialL: 3, initialS: 4, controls: 'Hoarding/Heras separation. Out-of-hours working. Access controlled by FM. Daily walk-through with FM. Signage and floor markings.', residualL: 1, residualS: 3 },
  { id: 'RA-OC-002', category: 'occupied', hazard: 'Disruption to building occupants', whoAtRisk: 'Occupants, operatives', consequences: 'Complaints, business disruption, schedule overruns. Acoustic and dust complaints leading to enforcement.', initialL: 3, initialS: 2, controls: 'Communicated schedule with FM and tenants. Noisy works restricted hours. Dust suppression. Daily updates board. Liaison with FM.', residualL: 2, residualS: 2 },
  { id: 'RA-OC-003', category: 'occupied', hazard: 'Live MEP services interfering with works', whoAtRisk: 'Operatives, occupants', consequences: 'Electric shock, gas leak, water damage to occupied areas. Disruption to building services.', initialL: 3, initialS: 4, controls: 'As-built drawings reviewed. Permit to work for live works. Isolations confirmed before disturbance. FM-controlled key cabinet. Out-of-hours for major MEP works.', residualL: 1, residualS: 3 },
  { id: 'RA-OC-004', category: 'occupied', hazard: 'Smoke detection / sprinkler interference', whoAtRisk: 'Building occupants', consequences: 'False alarm causing evacuation and business disruption. Worse — smoke detector covered and not reinstated, meaning real fire goes undetected.', initialL: 3, initialS: 4, controls: 'FM-controlled detector isolation. Daily sign-on/sign-off log. Smoke-shroud protection over individual heads. Reinstatement check end-of-shift.', residualL: 1, residualS: 3 },
  { id: 'RA-OC-005', category: 'occupied', hazard: 'Infection control breach in healthcare', whoAtRisk: 'Patients, staff', consequences: 'Hospital-acquired infection. Aspergillus from disturbance of dust during hospital works. Patient deaths in extreme cases.', initialL: 3, initialS: 5, controls: 'HBN/HTM compliance. ICRA assessment. Negative pressure enclosure. HEPA filtration. Daily wet clean. Air monitoring.', residualL: 1, residualS: 4 },
  { id: 'RA-OC-006', category: 'occupied', hazard: 'Safeguarding incident in school', whoAtRisk: 'Pupils, operatives', consequences: 'Allegation against operative. Criminal investigation. Reputational damage to school and contractor.', initialL: 2, initialS: 4, controls: 'DBS checks for all site team. Safeguarding induction. No contact with pupils. Visible ID. Designated routes through occupied parts.', residualL: 1, residualS: 3 },

  // ═══ WEATHER & SEASONAL ═══
  { id: 'RA-WE-001', category: 'weather', hazard: 'High wind operations at height', whoAtRisk: 'Operatives, public', consequences: 'Operative blown off platform. Loose materials/sheets becoming projectiles. Crane collapse from wind load.', initialL: 3, initialS: 5, controls: 'Anemometer on site. Stand-down at 17 mph for normal work, 11 mph for crane lifts, 28 mph for plant generally. Lashing of loose materials. Daily Met Office check.', residualL: 1, residualS: 5 },
  { id: 'RA-WE-002', category: 'weather', hazard: 'Lightning strike on site', whoAtRisk: 'All site personnel', consequences: 'Fatality from direct or near-strike. Damage to electronic equipment. Site evacuation.', initialL: 1, initialS: 5, controls: 'Lightning monitoring app. Stand-down on first thunder heard. Operatives leave high points (cranes, scaffolds, roofs). Site office or substantial building shelter.', residualL: 1, residualS: 4 },
  { id: 'RA-WE-003', category: 'weather', hazard: 'Ice and snow on access routes', whoAtRisk: 'All site personnel', consequences: 'Slips and falls leading to fractures. Vehicle skids on icy roads. RIDDOR reportable.', initialL: 4, initialS: 3, controls: 'Daily gritting / salting of routes. Remove snow before start of shift. Footwear with grip. Reduced site speed limit. Walkway lighting.', residualL: 2, residualS: 2 },
  { id: 'RA-WE-004', category: 'weather', hazard: 'Heatwave / extreme heat', whoAtRisk: 'Operatives', consequences: 'Heat exhaustion, heat stroke, dehydration. Cognitive impairment leading to accidents. Sunburn / skin cancer over career.', initialL: 3, initialS: 3, controls: 'Acclimatisation period for new starters. Cool drinking water available. Shaded breaks every 30 mins above 28°C. Cooling cloths/vests. Sunscreen. Shift earlier in day.', residualL: 2, residualS: 2 },
  { id: 'RA-WE-005', category: 'weather', hazard: 'Cold weather / hypothermia risk', whoAtRisk: 'Operatives', consequences: 'Hypothermia, frostbite, reduced dexterity leading to accidents. Worst for outdoor static work.', initialL: 3, initialS: 3, controls: 'Layered insulated clothing. Warm welfare facilities. Hot drinks. Stop-work threshold for extreme cold. Move task indoors where possible. Buddy check.', residualL: 1, residualS: 2 },
  { id: 'RA-WE-006', category: 'weather', hazard: 'Heavy rain / flooding', whoAtRisk: 'Operatives, environment', consequences: 'Slips, electrical hazards from wet equipment. Excavations collapsing. Pollution of watercourses from site runoff.', initialL: 3, initialS: 3, controls: 'Drainage of working areas. Pump out excavations. Cover materials. Stop work in extreme conditions. Silt management to protect waterways.', residualL: 2, residualS: 2 },

  // ═══ EXPANSIONS WITHIN EXISTING CATEGORIES ═══
  { id: 'RA-WAH-012', category: 'wah', hazard: 'Falls from boom-type MEWP basket', whoAtRisk: 'MEWP operator', consequences: 'Catapult effect — operator launched out of basket. Fatal injury. Most common when basket strikes obstacle.', initialL: 2, initialS: 5, controls: 'IPAF 1b/3b operator. Harness with short restraint lanyard tied to designated anchor. Pre-use inspection. Banksman where required. Wind speed monitor.', residualL: 1, residualS: 5 },
  { id: 'RA-WAH-013', category: 'wah', hazard: 'Falls during scaffold dismantle', whoAtRisk: 'Scaffolders', consequences: 'Falls from height during strike phase when guard rails removed. Most scaffolder fatalities occur at this point.', initialL: 4, initialS: 5, controls: 'CISRS L2 minimum for dismantle. SG4 fall arrest. Top-down dismantle sequence. Drop zones below clear. No removal of last guard rail until clipped on.', residualL: 1, residualS: 4 },
  { id: 'RA-WAH-014', category: 'wah', hazard: 'Fall through fragile cement-fibre sheets', whoAtRisk: 'Operatives', consequences: 'Fatal fall through cement-fibre sheet roofing — common older industrial buildings. Sheet not load-bearing.', initialL: 3, initialS: 5, controls: 'No walking on cement-fibre sheet. Crawling boards or staging. Edge-protected access. Permit to work on fragile roofs. Briefing on identification.', residualL: 1, residualS: 5 },

  { id: 'RA-PM-011', category: 'plant', hazard: 'Telehandler tip-over on slope', whoAtRisk: 'Operator, ground crew', consequences: 'Operator crushed. Load deposited unpredictably. Mechanical damage.', initialL: 2, initialS: 5, controls: 'CPCS/NPORS operator. Load chart adherence. Stabilisers deployed. Routes assessed for cross-fall. Tyre pressures correct.', residualL: 1, residualS: 4 },
  { id: 'RA-PM-012', category: 'plant', hazard: 'Excavator quick-hitch failure', whoAtRisk: 'Ground crew', consequences: 'Bucket falls during operation. Multiple fatalities possible. Industry-wide problem.', initialL: 2, initialS: 5, controls: 'Auto-lock quick-hitch only — no semi-automatic. Daily pre-use check. Operator visual confirmation of pin engagement. No personnel within slew arc.', residualL: 1, residualS: 5 },
  { id: 'RA-PM-013', category: 'plant', hazard: 'Skid-steer loader rollover', whoAtRisk: 'Operator', consequences: 'Operator crushed by rollover. Common in confined or sloped sites.', initialL: 2, initialS: 5, controls: 'Trained operator. Seatbelt always worn. ROPS in place. Routes pre-surveyed. Avoid steep cross-falls.', residualL: 1, residualS: 4 },
  { id: 'RA-PM-014', category: 'plant', hazard: 'Wheel loader struck-by pedestrian', whoAtRisk: 'Pedestrians on site', consequences: 'Fatality from operator blind-spot. RIDDOR reportable. Common cause of fatal accidents on site.', initialL: 3, initialS: 5, controls: 'Pedestrian-vehicle segregation. Banksman in mixed zones. 360° camera/proximity alarm. Hi-vis enforced. Eye contact rule before pedestrian crosses.', residualL: 1, residualS: 5 },

  { id: 'RA-EL-008', category: 'electrical', hazard: 'Inadvertent disturbance of live cables behind ceiling/wall', whoAtRisk: 'Operatives', consequences: 'Electric shock, fire from short-circuit, building damage.', initialL: 3, initialS: 4, controls: 'CAT scan and Genny before any drilling/cutting. Live cable detector. Permit to penetrate. Photographs of services pre-cover.', residualL: 1, residualS: 3 },
  { id: 'RA-EL-009', category: 'electrical', hazard: 'PV system DC live during install', whoAtRisk: 'Operatives, electricians', consequences: 'PV strings remain live in daylight even when AC isolated. Electric shock from DC.', initialL: 3, initialS: 4, controls: 'Cover panels during install. Use lockable DC isolators. Voltage-rated insulated tools. Two-person rule for DC live work.', residualL: 1, residualS: 3 },
  { id: 'RA-EL-010', category: 'electrical', hazard: 'Inadequate earth bonding', whoAtRisk: 'Operatives, future occupants', consequences: 'Electric shock from extraneous conductive parts. Failed inspection.', initialL: 2, initialS: 4, controls: 'Bonding to BS 7671. Earth electrode test. Continuity test on every circuit. Periodic inspection certificate.', residualL: 1, residualS: 3 },

  { id: 'RA-FW-007', category: 'fire', hazard: 'Hot works inadvertently igniting concealed combustibles', whoAtRisk: 'All site personnel', consequences: 'Site fire spreading inside cavity walls. Hours after operatives have left. Major property damage and operative fatality if night work.', initialL: 2, initialS: 5, controls: 'Hot work permit. Fire watcher 60 minutes after work ends. Thermal imaging camera check of cavities. Suppression in cavity if depth allows.', residualL: 1, residualS: 4 },
  { id: 'RA-FW-008', category: 'fire', hazard: 'Lithium battery thermal runaway', whoAtRisk: 'Operatives, fire wardens', consequences: 'Battery fire — extreme heat, toxic smoke. Difficult to extinguish (water-only). Spreads rapidly.', initialL: 2, initialS: 4, controls: 'Battery storage area separated 5m from combustibles. Charging on metal table only. No damaged batteries on site. Lithium battery extinguisher (F500/AVD).', residualL: 1, residualS: 3 },

  { id: 'RA-CS-006', category: 'confined', hazard: 'Sudden flooding of confined space', whoAtRisk: 'Entrant', consequences: 'Drowning. Unable to escape. Examples: drainage works during heavy rain, basement during burst pipe.', initialL: 2, initialS: 5, controls: 'Weather forecast checked pre-entry. Pump capacity standby. Top-man can pump out / call rescue. Escape harness on entrant.', residualL: 1, residualS: 4 },
  { id: 'RA-CS-007', category: 'confined', hazard: 'Toxic atmosphere from disturbance', whoAtRisk: 'Entrant', consequences: 'Loss of consciousness from H2S, methane, CO. Rapid incapacitation possible.', initialL: 3, initialS: 5, controls: 'Continuous gas monitor (4-gas). Forced ventilation. Pre-entry test. Escape SCBA standby. Ventilation hose in entry.', residualL: 1, residualS: 4 },

  { id: 'RA-EX-009', category: 'excavation', hazard: 'Buried services strike during dig', whoAtRisk: 'Operatives, public', consequences: 'Electrocution from cable strike. Gas leak/explosion. Water main flooding. Costly utility damage claim.', initialL: 3, initialS: 5, controls: 'CAT and Genny before any dig. Statutory utility records. Hand-dig within 500mm of services. Spotter for machine dig near services. Permit to dig.', residualL: 1, residualS: 4 },
  { id: 'RA-EX-010', category: 'excavation', hazard: 'Ground contamination encountered', whoAtRisk: 'Operatives, environment', consequences: 'Chemical exposure, skin contact with contaminated soil. Off-site contamination if mishandled.', initialL: 3, initialS: 3, controls: 'Phase 1/2 site investigation reviewed. Stop work if unexpected contamination encountered. Specialist disposal. Decon for operatives.', residualL: 1, residualS: 2 },
  { id: 'RA-EX-011', category: 'excavation', hazard: 'Excavation undermining adjacent structures', whoAtRisk: 'Operatives, building occupants', consequences: 'Building collapse onto excavation. Multiple fatalities possible.', initialL: 2, initialS: 5, controls: 'Structural engineer\'s temporary works design. Sequential excavation. Underpinning where required. Crack monitoring. Stop on first sign of movement.', residualL: 1, residualS: 5 },

  { id: 'RA-LO-009', category: 'lifting', hazard: 'Lifting accessory failure during lift', whoAtRisk: 'Lift team, slingers', consequences: 'Load drops onto operatives. Multiple fatalities possible. Major mechanical damage.', initialL: 2, initialS: 5, controls: 'LOLER thorough exam in date. Accessories inspected pre-use. SWL never exceeded. Designated lift area cleared. CPCS slinger/signaller.', residualL: 1, residualS: 5 },
  { id: 'RA-LO-010', category: 'lifting', hazard: 'Tandem lift co-ordination failure', whoAtRisk: 'Lift teams, ground crew', consequences: 'Load swings or drops. Crane overload. Multiple cranes involved means coordination critical.', initialL: 2, initialS: 5, controls: 'Appointed Person plan. Pre-lift briefing. Single lift director. Radio comms. Practice dry-run for complex tandems.', residualL: 1, residualS: 4 },

  { id: 'RA-DM-007', category: 'demolition', hazard: 'Premature collapse during structural strip-out', whoAtRisk: 'Demolition operatives', consequences: 'Operative crushed by falling structure. Most common cause of demolition fatalities.', initialL: 2, initialS: 5, controls: 'Demolition plan signed by demolition engineer. Sequence respected — top-down. Temporary works for any retained elements. CCDO trained operatives.', residualL: 1, residualS: 5 },
  { id: 'RA-DM-008', category: 'demolition', hazard: 'Hidden voids / basements during demo', whoAtRisk: 'Operatives', consequences: 'Plant or operative falls into unmarked void. Crush injury or fall.', initialL: 2, initialS: 4, controls: 'Pre-demo R&D survey identifies voids. Probing of suspect areas. Cover or barrier all voids. Drone survey for inaccessible areas.', residualL: 1, residualS: 3 },

  { id: 'RA-DU-007', category: 'dust', hazard: 'Wood dust during sanding (HW)', whoAtRisk: 'Joiners, finishers', consequences: 'Long-term respiratory disease — softwood asthma; hardwood nasal cancer (carcinogenic).', initialL: 4, initialS: 4, controls: 'M-class on-tool extraction. Wet sanding where possible. Health surveillance — annual lung function. FFP3 minimum.', residualL: 2, residualS: 3 },
  { id: 'RA-DU-008', category: 'dust', hazard: 'Cement dust during mixing', whoAtRisk: 'Operatives', consequences: 'Respiratory irritation, dermatitis, eye damage.', initialL: 3, initialS: 3, controls: 'Pre-mixed mortar/concrete preferred. LEV at mixer. Wet methods. FFP3 mask. Goggles.', residualL: 2, residualS: 2 },

  { id: 'RA-CH-007', category: 'coshh', hazard: 'Solvent inhalation in confined area', whoAtRisk: 'Operatives', consequences: 'CNS depression, dizziness, unconsciousness. Long-term liver/kidney damage.', initialL: 3, initialS: 4, controls: 'Substitute water-based products where possible. Mechanical ventilation. A2 RPE. Time-limited exposure. No naked flame.', residualL: 1, residualS: 3 },
  { id: 'RA-CH-008', category: 'coshh', hazard: 'Acid burns from cleaners', whoAtRisk: 'Operatives', consequences: 'Severe chemical burns to skin and eyes. Lung damage from vapour inhalation.', initialL: 2, initialS: 4, controls: 'Acid-resistant gloves and goggles. Eye-wash on hand. Ventilation. Acid-to-water mixing only. Spill kit.', residualL: 1, residualS: 3 },

  { id: 'RA-TV-007', category: 'traffic', hazard: 'Reversing plant strikes pedestrian', whoAtRisk: 'Site personnel', consequences: 'Fatal crush injury from reversing plant — leading cause of construction fatalities.', initialL: 3, initialS: 5, controls: 'Banksman for all reversing. 360° cameras. Reversing alarms. Hi-vis. Segregated pedestrian routes. Eye-contact protocol.', residualL: 1, residualS: 5 },
  { id: 'RA-TV-008', category: 'traffic', hazard: 'Public road interface — temporary traffic management', whoAtRisk: 'Public, site team', consequences: 'Vehicle/pedestrian struck. RTC at site exit. Public claim.', initialL: 3, initialS: 4, controls: 'Chapter 8 compliant TM. Approved diversion routes. Banksman during peak times. Wheel-wash to prevent road contamination.', residualL: 1, residualS: 3 },

  { id: 'RA-EN-006', category: 'environment', hazard: 'Pollution incident — hydraulic oil spill', whoAtRisk: 'Environment', consequences: 'Watercourse pollution. EA prosecution. Significant remediation cost.', initialL: 2, initialS: 4, controls: 'Drip trays under static plant. Spill kit at plant compound. Hose inspection daily. Pollution incident plan.', residualL: 1, residualS: 3 },
  { id: 'RA-EN-007', category: 'environment', hazard: 'Noise complaint from neighbours', whoAtRisk: 'Public, project programme', consequences: 'Council enforcement notice. Stop work. Schedule overrun. Reputation impact.', initialL: 3, initialS: 2, controls: 'Section 61 consent. Noise barriers. Restricted hours. Quietest plant available. Liaison officer for community.', residualL: 2, residualS: 2 },

  { id: 'RA-WC-005', category: 'welding', hazard: 'Welder eye flash (arc-eye)', whoAtRisk: 'Welder, bystanders', consequences: 'Painful corneal flash burn 6-12h after exposure. Temporary blindness.', initialL: 4, initialS: 2, controls: 'Welding shield mandatory. Welding screens around welder to protect bystanders. Auto-darkening lens. No looking directly at arc.', residualL: 2, residualS: 1 },
  { id: 'RA-WC-006', category: 'welding', hazard: 'Welding fume in confined space', whoAtRisk: 'Welder', consequences: 'Acute exposure to high fume concentration. CO poisoning. Asphyxiation.', initialL: 3, initialS: 5, controls: 'Confined space permit. LEV mandatory. Powered air respirator. Continuous gas monitor. Top-man. Restricted duration.', residualL: 1, residualS: 4 },

  { id: 'RA-NV-005', category: 'noise', hazard: 'Whole-body vibration from plant operation', whoAtRisk: 'Plant operators', consequences: 'Lower back disorders, sciatica from prolonged vibration exposure. Chronic disability.', initialL: 3, initialS: 3, controls: 'Daily exposure A(8) calculation. EAV 0.5 m/s², ELV 1.15 m/s². Seat condition maintained. Routes smoothed. Speed limits. Operator rotation.', residualL: 2, residualS: 2 },
  { id: 'RA-NV-006', category: 'noise', hazard: 'Hearing damage from intermittent peak noise', whoAtRisk: 'Operatives in noisy zones', consequences: 'Permanent noise-induced hearing loss. Tinnitus. RIDDOR reportable.', initialL: 4, initialS: 3, controls: 'Hearing protection in noise zones (>85dB(A)). Zoning signed. Audiometry pre-employment and annually. Quietest plant available.', residualL: 2, residualS: 2 },

  { id: 'RA-SC-006', category: 'scaffold', hazard: 'Scaffold tie failure', whoAtRisk: 'Operatives, public', consequences: 'Scaffold collapse. Multiple fatalities. Major incident.', initialL: 1, initialS: 5, controls: 'Designed scaffold by competent designer. Tie pattern per design. Drilled tie tests. Weekly inspection. Wind speed stand-down.', residualL: 1, residualS: 5 },

  { id: 'RA-ST-008', category: 'structural', hazard: 'Premature loading of fresh concrete', whoAtRisk: 'Operatives, occupants', consequences: 'Structural failure. Operative crush injury. Construction defect.', initialL: 2, initialS: 5, controls: 'Cube test results before strike. Engineer\'s clearance to load. No early strike of formwork. Curing protected.', residualL: 1, residualS: 4 },
]

// ── COSHH LIBRARY ──
export const COSHH_LIBRARY: COSHHLibraryItem[] = [
  { id: 'COSHH-001', category: 'Construction', substance: 'Portland Cement', hazards: 'Skin irritation, chemical burns, dermatitis, eye damage', routeOfExposure: 'Skin contact, Inhalation, Eye contact', controls: 'Avoid skin contact. Use pre-mixed where possible. Wet methods to reduce dust. LEV when mixing. Wash immediately on contact.', ppeRequired: 'Nitrile gloves, Safety goggles, FFP2 dust mask, Long sleeves', emergencyProcedures: 'Skin: irrigate with clean water for 20 mins. Eyes: irrigate for 20 mins, seek medical attention. Inhalation: move to fresh air.' },
  { id: 'COSHH-002', category: 'Construction', substance: 'Silica Dust (from cutting concrete/stone)', hazards: 'Silicosis, lung cancer, COPD', routeOfExposure: 'Inhalation', controls: 'Water suppression on all cutting. On-tool dust extraction with H-class vacuum. No dry sweeping. Air monitoring where required. Health surveillance.', ppeRequired: 'FFP3 dust mask (face-fit tested), Safety goggles', emergencyProcedures: 'Move to fresh air. Seek medical attention if breathing difficulty. Report to occupational health.' },
  { id: 'COSHH-003', category: 'Welding', substance: 'Welding Fumes (mild steel)', hazards: 'Metal fume fever, respiratory irritation, long-term lung damage', routeOfExposure: 'Inhalation', controls: 'LEV at point of welding. General ventilation. Weld outdoors or in well-ventilated area. Avoid position directly over fume plume.', ppeRequired: 'P3 filter respirator, Welding helmet, Gauntlets', emergencyProcedures: 'Move to fresh air. If symptoms of metal fume fever (flu-like), seek medical attention. Report incident.' },
  { id: 'COSHH-004', category: 'Welding', substance: 'Welding Fumes (stainless steel/galvanised)', hazards: 'Hexavalent chromium exposure, zinc fume fever, respiratory sensitisation', routeOfExposure: 'Inhalation', controls: 'LEV mandatory — no exception. RPE with P3 filter minimum. Health surveillance. COSHH assessment specific to material. Minimise welding time on stainless/galvanised.', ppeRequired: 'Powered air respirator or P3 half-mask, Welding helmet, Gauntlets, Coveralls', emergencyProcedures: 'Move to fresh air immediately. Seek medical attention. Report to occupational health for health surveillance.' },
  { id: 'COSHH-005', category: 'Painting', substance: 'Solvent-Based Paints & Coatings', hazards: 'CNS depression, headache, nausea, dermatitis, fire risk', routeOfExposure: 'Inhalation, Skin contact', controls: 'Water-based alternatives preferred. Adequate ventilation. Avoid confined spaces without extraction. Minimal skin contact. No smoking/naked flames.', ppeRequired: 'Organic vapour respirator (A2 filter), Nitrile gloves, Safety goggles, Coveralls', emergencyProcedures: 'Skin: wash with soap and water. Inhalation: move to fresh air. If dizziness persists, seek medical attention. Fire: CO2 or foam extinguisher.' },
  { id: 'COSHH-006', category: 'Construction', substance: 'Epoxy Resin / Adhesives', hazards: 'Skin sensitisation (allergic dermatitis), respiratory sensitisation', routeOfExposure: 'Skin contact, Inhalation', controls: 'Use in well-ventilated area. Avoid skin contact. Once sensitised, no further exposure. Pre-employment screening. Contained mixing.', ppeRequired: 'Nitrile gloves (changed frequently), Safety goggles, RPE (A2P3 filter), Coveralls', emergencyProcedures: 'Skin: remove contaminated clothing, wash thoroughly. Eyes: irrigate 20 mins. Allergic reaction: seek medical attention immediately.' },
  { id: 'COSHH-007', category: 'Construction', substance: 'PU Foam / Sealants (Isocyanates)', hazards: 'Respiratory sensitisation, asthma, skin irritation', routeOfExposure: 'Inhalation, Skin contact', controls: 'Well-ventilated area. RPE if spraying. Avoid aerosol generation. Once sensitised — permanent removal from exposure. Health surveillance.', ppeRequired: 'RPE (A2P3 filter for spray application), Nitrile gloves, Safety goggles', emergencyProcedures: 'Inhalation: move to fresh air. If wheeze/breathing difficulty, seek urgent medical attention. Skin: wash with soap and water.' },
  { id: 'COSHH-008', category: 'Construction', substance: 'Diesel Fuel / Red Diesel', hazards: 'Skin irritation, dermatitis, environmental contamination', routeOfExposure: 'Skin contact, Inhalation (vapour)', controls: 'Minimise skin contact. Use fuel nozzle/pump. Drip tray during refuelling. Bunded storage. Spill kit available. No smoking during refuelling.', ppeRequired: 'Nitrile gloves, Safety goggles during refuelling', emergencyProcedures: 'Skin: wash with soap and water. Spillage: contain with absorbent, notify Environment Agency if significant. Eyes: irrigate 15 mins.' },
  { id: 'COSHH-009', category: 'Construction', substance: 'Hydraulic Oil / Cutting Oil', hazards: 'Skin irritation, dermatitis, oil acne', routeOfExposure: 'Skin contact', controls: 'Barrier cream before work. Avoid prolonged contact. Clean overalls daily. Correct gloves when handling. Report skin changes immediately.', ppeRequired: 'Oil-resistant gloves, Coveralls', emergencyProcedures: 'Skin: wash with soap and water. Do not use solvents to clean skin. Eyes: irrigate 15 mins, seek medical attention.' },
  { id: 'COSHH-010', category: 'Construction', substance: 'Brick Acid / Hydrochloric Acid', hazards: 'Severe chemical burns, eye damage, respiratory irritation', routeOfExposure: 'Skin contact, Eye contact, Inhalation', controls: 'Dilute as per manufacturer instruction. Apply by brush, not spray. PPE worn throughout. Eye wash station within 10m. Neutralising agent available.', ppeRequired: 'Chemical-resistant gloves, Face shield, Rubber apron, Wellington boots', emergencyProcedures: 'Skin: irrigate with water 20 mins. Eyes: irrigate with clean water 20 mins, seek urgent medical attention. Inhalation: fresh air, if difficulty breathing call 999.' },
  { id: 'COSHH-011', category: 'Roofing', substance: 'Bitumen / Asphalt (hot applied)', hazards: 'Burns, fume inhalation, fire risk', routeOfExposure: 'Skin contact, Inhalation', controls: 'PPE for hot works. Temperature controlled per manufacturer. Adequate ventilation. No contact with water (steam explosion risk). Fire extinguisher adjacent.', ppeRequired: 'Heat-resistant gloves, Face shield, Long sleeves, Safety boots, RPE (P2 filter)', emergencyProcedures: 'Burns: cool under running water 20 mins. Do not remove adhering bitumen. Seek medical attention. Fume inhalation: fresh air.' },
  { id: 'COSHH-012', category: 'Painting', substance: 'Lead-Based Paint (existing)', hazards: 'Lead poisoning — neurological damage, kidney damage, reproductive harm', routeOfExposure: 'Inhalation, Ingestion, Skin absorption', controls: 'Chemical stripping preferred. No heat stripping. Contained work area. Air monitoring. Blood lead level monitoring. Decontamination before eating. Waste as special waste.', ppeRequired: 'RPE (P3 filter), Disposable coveralls, Nitrile gloves, Overshoes', emergencyProcedures: 'If suspected exposure: blood lead test. Skin: wash thoroughly. Report to occupational health. Symptoms may be delayed.' },
  { id: 'COSHH-013', category: 'Construction', substance: 'Concrete Release Agent / Mould Oil', hazards: 'Skin irritation, dermatitis', routeOfExposure: 'Skin contact', controls: 'Barrier cream applied before use. Avoid spray application near face. Wash exposed skin after use. Use biodegradable products where possible.', ppeRequired: 'Nitrile gloves, Safety goggles, Coveralls', emergencyProcedures: 'Skin: wash with soap and water. Eyes: irrigate for 15 mins.' },
  { id: 'COSHH-014', category: 'Flooring', substance: 'Floor Levelling Compound Dust', hazards: 'Respiratory irritation, skin drying', routeOfExposure: 'Inhalation, Skin contact', controls: 'Mix in well-ventilated area. Water suppression. Clean up with damp methods. RPE during mixing. Gloves for handling.', ppeRequired: 'FFP2 dust mask, Nitrile gloves, Safety goggles', emergencyProcedures: 'Inhalation: fresh air. Skin: wash with water. Eyes: irrigate for 15 mins.' },
  { id: 'COSHH-015', category: 'Insulation', substance: 'Mineral Wool / Glass Fibre (insulation)', hazards: 'Skin irritation, eye irritation, respiratory irritation', routeOfExposure: 'Skin contact, Inhalation, Eye contact', controls: 'Loose-fitting long sleeves and trousers. Barrier cream. Cut with sharp knife (not tear). Adequate ventilation. Wash work clothes separately. No rubbing eyes.', ppeRequired: 'FFP2 dust mask, Safety goggles, Loose gloves, Coveralls', emergencyProcedures: 'Skin: wash gently with cold water (hot water opens pores). Eyes: irrigate gently. Respiratory irritation: fresh air.' },
]

// ── HAVS LIBRARY ──
export const HAVS_LIBRARY: HAVSLibraryItem[] = [
  { id: 'HAVS-001', tool: 'Angle Grinder / Disc Cutter', vibrationMag: 6.0, typicalUse: '60 mins' },
  { id: 'HAVS-002', tool: 'Breaker / Kango (medium)', vibrationMag: 12.0, typicalUse: '30 mins' },
  { id: 'HAVS-003', tool: 'Breaker / Kango (heavy)', vibrationMag: 18.0, typicalUse: '15 mins' },
  { id: 'HAVS-004', tool: 'SDS Rotary Hammer Drill', vibrationMag: 9.0, typicalUse: '45 mins' },
  { id: 'HAVS-005', tool: 'Core Drill', vibrationMag: 5.0, typicalUse: '30 mins' },
  { id: 'HAVS-006', tool: 'Impact Wrench (cordless)', vibrationMag: 5.0, typicalUse: '45 mins' },
  { id: 'HAVS-007', tool: 'Impact Wrench (air)', vibrationMag: 7.0, typicalUse: '30 mins' },
  { id: 'HAVS-008', tool: 'Nail Gun (1st fix)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-009', tool: 'Reciprocating Saw', vibrationMag: 7.0, typicalUse: '30 mins' },
  { id: 'HAVS-010', tool: 'Circular Saw (handheld)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-011', tool: 'Plate Compactor / Wacker', vibrationMag: 10.0, typicalUse: '30 mins' },
  { id: 'HAVS-012', tool: 'Trench Rammer', vibrationMag: 15.0, typicalUse: '20 mins' },
  { id: 'HAVS-013', tool: 'Floor Polisher / Sander', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-014', tool: 'Chainsaw', vibrationMag: 6.0, typicalUse: '30 mins' },
  { id: 'HAVS-015', tool: 'Rivet Gun', vibrationMag: 7.0, typicalUse: '45 mins' },
  { id: 'HAVS-016', tool: 'Strimmer / Brush Cutter', vibrationMag: 5.0, typicalUse: '60 mins' },
  { id: 'HAVS-017', tool: 'Magnetic Drill (Mag Drill)', vibrationMag: 3.0, typicalUse: '30 mins' },
  { id: 'HAVS-018', tool: 'Jigsaw', vibrationMag: 8.0, typicalUse: '30 mins' },
  { id: 'HAVS-019', tool: 'Chop Saw / Mitre Saw', vibrationMag: 3.0, typicalUse: '30 mins' },
  { id: 'HAVS-020', tool: 'Scabbler / Needle Gun', vibrationMag: 14.0, typicalUse: '15 mins' },
  // ═══ Drilling extras ═══
  { id: 'HAVS-021', tool: 'Combi Drill / Driver (cordless)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-022', tool: 'Percussion Drill (240V)', vibrationMag: 7.0, typicalUse: '45 mins' },
  { id: 'HAVS-023', tool: 'Hammer Drill (cordless 18V)', vibrationMag: 6.0, typicalUse: '60 mins' },
  { id: 'HAVS-024', tool: 'Diamond Core Drill (handheld)', vibrationMag: 6.0, typicalUse: '30 mins' },
  // ═══ Saws extras ═══
  { id: 'HAVS-025', tool: 'Table Saw', vibrationMag: 3.0, typicalUse: '60 mins' },
  { id: 'HAVS-026', tool: 'Band Saw', vibrationMag: 3.0, typicalUse: '60 mins' },
  { id: 'HAVS-027', tool: 'Tile Saw (wet)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-028', tool: 'Floor Saw / Road Saw', vibrationMag: 9.0, typicalUse: '20 mins' },
  // ═══ Grinding / cutting extras ═══
  { id: 'HAVS-029', tool: 'Die Grinder (small)', vibrationMag: 5.0, typicalUse: '45 mins' },
  { id: 'HAVS-030', tool: 'Wall Chaser', vibrationMag: 7.0, typicalUse: '30 mins' },
  { id: 'HAVS-031', tool: 'Cut-off Saw (petrol)', vibrationMag: 8.0, typicalUse: '20 mins' },
  // ═══ Compaction & demolition ═══
  { id: 'HAVS-032', tool: 'Vibrating Roller (pedestrian)', vibrationMag: 11.0, typicalUse: '20 mins' },
  { id: 'HAVS-033', tool: 'Demolition Hammer (small)', vibrationMag: 10.0, typicalUse: '30 mins' },
  { id: 'HAVS-034', tool: 'Electric Pick', vibrationMag: 13.0, typicalUse: '20 mins' },
  { id: 'HAVS-035', tool: 'Floor Scabbler', vibrationMag: 14.0, typicalUse: '15 mins' },
  // ═══ Finishing / sanding ═══
  { id: 'HAVS-036', tool: 'Orbital Sander', vibrationMag: 5.0, typicalUse: '60 mins' },
  { id: 'HAVS-037', tool: 'Palm Sander', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-038', tool: 'Belt Sander', vibrationMag: 7.0, typicalUse: '30 mins' },
  { id: 'HAVS-039', tool: 'Random Orbit Sander', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-040', tool: 'Floor Polisher (rotary)', vibrationMag: 3.0, typicalUse: '60 mins' },
  // ═══ Pneumatic ═══
  { id: 'HAVS-041', tool: 'Pneumatic Breaker (heavy)', vibrationMag: 18.0, typicalUse: '15 mins' },
  { id: 'HAVS-042', tool: 'Pneumatic Chipping Hammer', vibrationMag: 15.0, typicalUse: '15 mins' },
  { id: 'HAVS-043', tool: 'Pneumatic Sander', vibrationMag: 6.0, typicalUse: '45 mins' },
  { id: 'HAVS-044', tool: 'Air Riveter', vibrationMag: 6.0, typicalUse: '45 mins' },
  { id: 'HAVS-045', tool: 'Pneumatic Drill', vibrationMag: 8.0, typicalUse: '30 mins' },
  // ═══ Concrete ═══
  { id: 'HAVS-046', tool: 'Concrete Vibrator (poker)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-047', tool: 'Concrete Power Float', vibrationMag: 6.0, typicalUse: '45 mins' },
  { id: 'HAVS-048', tool: 'Tamping Beam (powered)', vibrationMag: 7.0, typicalUse: '30 mins' },
  // ═══ Outdoor / landscaping ═══
  { id: 'HAVS-049', tool: 'Hedge Trimmer (petrol)', vibrationMag: 6.0, typicalUse: '30 mins' },
  { id: 'HAVS-050', tool: 'Leaf Blower (petrol)', vibrationMag: 5.0, typicalUse: '60 mins' },
  { id: 'HAVS-051', tool: 'Lawnmower (pedestrian petrol)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-052', tool: 'Stump Grinder', vibrationMag: 8.0, typicalUse: '30 mins' },
  { id: 'HAVS-053', tool: 'Post Driver (powered)', vibrationMag: 16.0, typicalUse: '15 mins' },
  // ═══ Roofing / cladding ═══
  { id: 'HAVS-054', tool: 'Felt Stripper (powered)', vibrationMag: 9.0, typicalUse: '30 mins' },
  { id: 'HAVS-055', tool: 'Cladding Crimper', vibrationMag: 5.0, typicalUse: '45 mins' },
  // ═══ Specialist ═══
  { id: 'HAVS-056', tool: 'Bush Hammer', vibrationMag: 12.0, typicalUse: '20 mins' },
  { id: 'HAVS-057', tool: 'Tile Removal Tool (powered)', vibrationMag: 10.0, typicalUse: '20 mins' },
  { id: 'HAVS-058', tool: 'Stone Polisher (handheld)', vibrationMag: 5.0, typicalUse: '45 mins' },
  { id: 'HAVS-059', tool: 'Engraver / Etcher', vibrationMag: 7.0, typicalUse: '30 mins' },
  { id: 'HAVS-060', tool: 'Pole Saw (chainsaw on pole)', vibrationMag: 5.0, typicalUse: '45 mins' },
  { id: 'HAVS-061', tool: 'Earth Auger / Post Hole Borer', vibrationMag: 9.0, typicalUse: '20 mins' },
  { id: 'HAVS-062', tool: 'Vibrating Plate (small)', vibrationMag: 8.0, typicalUse: '30 mins' },
  // ═══ More cordless tools ═══
  { id: 'HAVS-063', tool: 'Cordless Combi Drill (12V)', vibrationMag: 3.0, typicalUse: '60 mins' },
  { id: 'HAVS-064', tool: 'Cordless Impact Driver (compact)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-065', tool: 'Cordless Mini Grinder (76mm)', vibrationMag: 5.0, typicalUse: '45 mins' },
  { id: 'HAVS-066', tool: 'Cordless Multi-tool / Oscillating', vibrationMag: 6.0, typicalUse: '30 mins' },
  // ═══ Tile / stone work ═══
  { id: 'HAVS-067', tool: 'Tile Removal Hammer', vibrationMag: 11.0, typicalUse: '20 mins' },
  { id: 'HAVS-068', tool: 'Stone Pneumatic Carving Tool', vibrationMag: 8.0, typicalUse: '30 mins' },
  // ═══ Roofing ═══
  { id: 'HAVS-069', tool: 'Slate Cutter (handheld)', vibrationMag: 4.0, typicalUse: '60 mins' },
  { id: 'HAVS-070', tool: 'Felt Stripper (manual rotating)', vibrationMag: 7.0, typicalUse: '30 mins' },
  // ═══ MEP specialist ═══
  { id: 'HAVS-071', tool: 'Pipe Threader (handheld)', vibrationMag: 3.0, typicalUse: '60 mins' },
  { id: 'HAVS-072', tool: 'Cable Pulling Drum (motorised)', vibrationMag: 2.0, typicalUse: '60 mins' },
  { id: 'HAVS-073', tool: 'Pipe Press Tool (electric)', vibrationMag: 4.0, typicalUse: '60 mins' },
  // ═══ Demolition / cutting ═══
  { id: 'HAVS-074', tool: 'Wall / Block Saw (track-mounted)', vibrationMag: 5.0, typicalUse: '60 mins' },
  { id: 'HAVS-075', tool: 'Concrete Cutter (handheld petrol)', vibrationMag: 9.0, typicalUse: '20 mins' },
  // ═══ Specialist heritage ═══
  { id: 'HAVS-076', tool: 'Mortar Rake (electric)', vibrationMag: 6.0, typicalUse: '45 mins' },
  { id: 'HAVS-077', tool: 'Stone Etching Tool', vibrationMag: 6.0, typicalUse: '30 mins' },
  // ═══ Plant operator interface ═══
  { id: 'HAVS-078', tool: 'Whole-body Vibration: Dumper Operator', vibrationMag: 0.6, typicalUse: 'Whole shift' },
  { id: 'HAVS-079', tool: 'Whole-body Vibration: Excavator Operator', vibrationMag: 0.5, typicalUse: 'Whole shift' },
  { id: 'HAVS-080', tool: 'Whole-body Vibration: Roller Operator', vibrationMag: 0.7, typicalUse: 'Whole shift' },
]

// ── NOISE LIBRARY ──
export const NOISE_LIBRARY: NoiseLibraryItem[] = [
  { id: 'NOISE-001', activity: 'Disc Cutting / Angle Grinding', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection zone signage. Rotate operatives. Low-noise blades where available.' },
  { id: 'NOISE-002', activity: 'Concrete Breaking / Kango', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection zone 15m radius. Time limits enforced. Low-vibration breakers. Noise barriers where feasible.' },
  { id: 'NOISE-003', activity: 'SDS Drilling into Concrete', typicalDb: 92, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection mandatory within 5m. Core drilling preferred for larger holes (lower noise).' },
  { id: 'NOISE-004', activity: 'Chop Saw / Mitre Saw', typicalDb: 98, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Dedicated cutting area with noise barrier. Hearing protection zone signed. Blade condition maintained.' },
  { id: 'NOISE-005', activity: 'MIG/Stick Welding', typicalDb: 82, hearingProtection: 'Ear plugs recommended', controls: 'Below upper EAV. Monitor cumulative exposure if combined with other noisy tasks.' },
  { id: 'NOISE-006', activity: 'Nail Gun Operation', typicalDb: 92, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection within 3m. Low-noise fastening alternatives where possible.' },
  { id: 'NOISE-007', activity: 'Impact Wrench (pneumatic)', typicalDb: 93, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Cordless impact preferred (lower noise). Hearing protection mandatory. Time limits monitored.' },
  { id: 'NOISE-008', activity: 'Plate Compactor / Wacker', typicalDb: 96, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection zone. Rotate operators. Remote compaction methods where feasible.' },
  { id: 'NOISE-009', activity: 'Concrete Pour with Vibrator', typicalDb: 85, hearingProtection: 'Ear plugs at minimum', controls: 'At upper EAV — hearing protection required. Rotate poker operators. Self-compacting concrete where possible.' },
  { id: 'NOISE-010', activity: 'Piling Operations', typicalDb: 105, hearingProtection: 'Ear defenders (SNR 35+)', controls: 'Exclusion zone 25m. Hearing protection mandatory within 50m. Vibration monitoring. CFA piling lower noise alternative.' },
  { id: 'NOISE-011', activity: 'Chainsaw Operation', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection mandatory. 15m exclusion zone. Electric chainsaw lower noise alternative.' },
  { id: 'NOISE-012', activity: 'Road Saw / Floor Saw', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection zone 15m. Time limits. Water suppression also reduces noise slightly. Notify neighbours.' },
  { id: 'NOISE-013', activity: 'General Construction Activities', typicalDb: 78, hearingProtection: 'None required (below lower EAV)', controls: 'Below action level. Monitor if combined with intermittent noisy tasks.' },
  { id: 'NOISE-014', activity: 'Scaffold Erection / Striking', typicalDb: 88, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection zone. Rubber fittings to reduce impact noise. Communication by radio not shouting.' },
  { id: 'NOISE-015', activity: 'Steel Erection / Bolting', typicalDb: 90, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Impact driver lower noise than ratchet in many cases. Hearing protection mandatory during bolting-up. Rubber pads on landing areas.' },
  // ═══ Drilling / cutting ═══
  { id: 'NOISE-016', activity: 'Hand Drill (cordless)', typicalDb: 85, hearingProtection: 'Ear plugs', controls: 'At upper EAV. Hearing protection if used continuously >15 mins.' },
  { id: 'NOISE-017', activity: 'Diamond Core Drilling (wet)', typicalDb: 90, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Wet method. Hearing protection within 5m. Continuous extraction reduces fume but not noise.' },
  { id: 'NOISE-018', activity: 'Wall Chasing', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: '15m hearing protection zone. Wet methods lower dust not noise. Communicate by radio.' },
  { id: 'NOISE-019', activity: 'Tile Cutter / Stone Saw', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Wet cutting reduces dust. Hearing protection in 5m zone. Diamond blade for cleaner cut.' },
  { id: 'NOISE-020', activity: 'Reciprocating Saw', typicalDb: 92, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection within 3m. Cordless preferred over corded. Sharp blade reduces force needed.' },
  { id: 'NOISE-021', activity: 'Jigsaw', typicalDb: 90, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection in proximity. Sharp blade. Stable workpiece.' },
  { id: 'NOISE-022', activity: 'Circular Saw (handheld)', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection 5m zone. Sharp blade reduces noise. Blade guard maintained.' },
  { id: 'NOISE-023', activity: 'Wall Chaser', typicalDb: 98, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection mandatory. M-class extraction for dust. Sharp blade reduces both dust and noise.' },

  // ═══ Plant / heavy ═══
  { id: 'NOISE-024', activity: 'Excavator (Wheeled/Tracked)', typicalDb: 88, hearingProtection: 'Ear defenders (SNR 25+) for operator', controls: 'Cab insulation maintained. Door closed during operation. Operator audiometry program.' },
  { id: 'NOISE-025', activity: 'Telehandler', typicalDb: 85, hearingProtection: 'Ear plugs in cab', controls: 'At upper EAV. Cab insulation. Maintain engine and exhaust.' },
  { id: 'NOISE-026', activity: 'Dumper Operation', typicalDb: 90, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Cab insulation. Operator within cab. Outside the cab — hearing protection within 5m.' },
  { id: 'NOISE-027', activity: 'Generator Running', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Acoustic enclosure where available. Locate away from work areas. Hearing protection within 5m.' },
  { id: 'NOISE-028', activity: 'Compressor Operation', typicalDb: 92, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Acoustic enclosure. Hearing protection within 5m. Maintain unit (worn parts get noisier).' },
  { id: 'NOISE-029', activity: 'Tower Crane Slewing', typicalDb: 80, hearingProtection: 'Not normally required', controls: 'Below action level for ground crew. Operator inside cab insulated.' },
  { id: 'NOISE-030', activity: 'Mobile Crane Operation', typicalDb: 85, hearingProtection: 'Ear plugs for slingers/banksmen', controls: 'At upper EAV for ground crew. Distance from engine where possible.' },
  { id: 'NOISE-031', activity: 'Concrete Pump', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection 5m zone. Pump screen / barrier. Limit duration of operation.' },

  // ═══ Demolition / breaking ═══
  { id: 'NOISE-032', activity: 'Pneumatic Breaker (paving)', typicalDb: 105, hearingProtection: 'Ear defenders (SNR 35+)', controls: 'Hearing protection 25m zone. Time limits. Hydraulic breaker on excavator lower noise.' },
  { id: 'NOISE-033', activity: 'Hydraulic Breaker (excavator-mounted)', typicalDb: 110, hearingProtection: 'Ear defenders (SNR 35+)', controls: '50m hearing protection zone. Section 61 consent for noise. Notify neighbours.' },
  { id: 'NOISE-034', activity: 'Demolition (mechanical)', typicalDb: 98, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection 15m zone. Dust suppression also reduces airborne noise transmission.' },
  { id: 'NOISE-035', activity: 'Crusher / Mobile Screen', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Acoustic barriers. Hearing protection 15m zone. Maintain dust suppression to prevent dry running.' },
  { id: 'NOISE-036', activity: 'Concrete Saw (wet)', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Wet cutting. Hearing protection 15m. Diamond blade reduces effort and noise.' },

  // ═══ Specialist trades ═══
  { id: 'NOISE-037', activity: 'Floor Polisher / Burnisher', typicalDb: 80, hearingProtection: 'Not normally required', controls: 'Below action level. Monitor cumulative exposure if multiple tasks.' },
  { id: 'NOISE-038', activity: 'Power Float (concrete)', typicalDb: 85, hearingProtection: 'Ear plugs', controls: 'At upper EAV. Time limits per operative. Engine maintained.' },
  { id: 'NOISE-039', activity: 'Vibrating Plate / Wacker', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection mandatory. Time limits. Rotate operators.' },
  { id: 'NOISE-040', activity: 'Tarmac Paver Operation', typicalDb: 90, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection in 5m zone. Reverse alarm calibrated. Operator cab insulation.' },
  { id: 'NOISE-041', activity: 'Roller Operation', typicalDb: 88, hearingProtection: 'Ear plugs for operator', controls: 'Cab insulation. Limit duration of vibratory mode.' },
  { id: 'NOISE-042', activity: 'Bitumen Boiler', typicalDb: 75, hearingProtection: 'Not required', controls: 'Below action level. Fume hazard primary concern not noise.' },

  // ═══ Outdoor / landscaping ═══
  { id: 'NOISE-043', activity: 'Leaf Blower (petrol)', typicalDb: 105, hearingProtection: 'Ear defenders (SNR 35+)', controls: 'Hearing protection mandatory. Battery-powered alternative available. Time-of-day restrictions in residential.' },
  { id: 'NOISE-044', activity: 'Lawnmower (petrol)', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection mandatory. Battery alternative. Sharpened blade reduces effort.' },
  { id: 'NOISE-045', activity: 'Hedge Trimmer (petrol)', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection mandatory. Time limit per session.' },
  { id: 'NOISE-046', activity: 'Stump Grinder', typicalDb: 105, hearingProtection: 'Ear defenders (SNR 35+)', controls: 'Hearing protection 15m zone. Time limits. Notify neighbours.' },
  { id: 'NOISE-047', activity: 'Wood Chipper', typicalDb: 110, hearingProtection: 'Ear defenders (SNR 35+)', controls: '25m hearing protection zone. Section 61 in residential. Limit operating hours.' },

  // ═══ Construction by region ═══
  { id: 'NOISE-048', activity: 'Pile Driving (impact)', typicalDb: 115, hearingProtection: 'Ear defenders (SNR 35+) + plugs', controls: '50m hearing protection zone. Section 61 mandatory. Impact piling avoided where possible — use CFA or driven sheet alternatives.' },
  { id: 'NOISE-049', activity: 'Sheet Pile Driving', typicalDb: 110, hearingProtection: 'Ear defenders (SNR 35+)', controls: '50m hearing protection zone. Vibratory hammer lower noise than impact. Notify neighbours.' },
  { id: 'NOISE-050', activity: 'Abrasive Blasting (Vacu-blast)', typicalDb: 100, hearingProtection: 'Ear defenders (SNR 30+)', controls: 'Hearing protection in zone. Vacu-blast lower than open. Containment shelter.' },
  { id: 'NOISE-051', activity: 'Hot Work — Lance Cutting', typicalDb: 95, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection. Combined with hot work and fume hazards — full PPE.' },
  { id: 'NOISE-052', activity: 'Site Vehicle Reversing Alarm', typicalDb: 90, hearingProtection: 'Not for short bursts', controls: 'Smart reversing alarm (matches ambient). Calibration annual. Test daily.' },
  { id: 'NOISE-053', activity: 'Multi-tool / Oscillating Saw', typicalDb: 88, hearingProtection: 'Ear plugs', controls: 'At upper EAV with extended use. Hearing protection if used >15 mins continuous.' },
  { id: 'NOISE-054', activity: 'Belt Sander', typicalDb: 92, hearingProtection: 'Ear defenders (SNR 25+)', controls: 'Hearing protection within 3m. M-class extraction for dust.' },
]

// ── TRADE CATEGORIES ──
export const TRADE_CATEGORIES: TradeCategory[] = [
  { id: 'structural', label: 'Structural' },
  { id: 'mep', label: 'MEP (Mechanical, Electrical, Plumbing)' },
  { id: 'envelope', label: 'Building Envelope' },
  { id: 'fitout', label: 'Fitout & Finishes' },
  { id: 'external', label: 'External Works' },
  { id: 'demolition', label: 'Demolition & Enabling' },
  { id: 'specialist', label: 'Specialist' },
  { id: 'civil', label: 'Civil & Highways' },
  { id: 'heritage', label: 'Heritage & Listed Buildings' },
  { id: 'occupied', label: 'Occupied / Live Premises' },
  { id: 'renewables', label: 'Renewables & Low Carbon' },
  { id: 'access', label: 'Working at Height & Access' },
  { id: 'infrastructure', label: 'Rail, Marine & Aviation' },
]

// ── TRADE TEMPLATES ──
export const RAMS_TRADES: RAMSTrade[] = [
  // ═══ STRUCTURAL ═══
  {
    id: 'structural-steelwork', trade: 'Structural Steelwork', category: 'structural',
    description: 'Steel erection, fabrication, bolted/welded connections',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-WAH-009', 'RA-ST-001', 'RA-ST-002', 'RA-LO-001', 'RA-LO-002', 'RA-LO-003', 'RA-WC-001', 'RA-WC-002', 'RA-FW-001', 'RA-PM-005', 'RA-NV-001', 'RA-MH-008', 'RA-TV-001', 'RA-GS-001', 'RA-GS-002'],
    coshhItems: ['COSHH-003', 'COSHH-004'], havsItems: ['HAVS-001', 'HAVS-015', 'HAVS-006'], noiseItems: ['NOISE-001', 'NOISE-005', 'NOISE-015'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-welding', 'ppe-ear', 'ppe-face'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Receive and check steel delivery against fabrication drawings. Verify mill certificates and CE marking.', 'Establish exclusion zone around erection area. Erect barriers and signage.', 'Erect steel to sequence per erection method statement. Install temporary bracing as work progresses.', 'Bolt connections to design torque. Record bolt tightening on inspection sheet.', 'Carry out welding per WPS. Welding inspection to BS EN 1090. Record NDT results.', 'Install safety nets/edge protection as steelwork progresses. Maintain fall arrest systems.', 'Complete snag list and walk-through with site manager. Record on handover sheet.', 'Remove temporary works and bracing per TWC instruction. Confirm structural stability.'],
  },
  {
    id: 'concrete-formwork', trade: 'Concrete & Formwork', category: 'structural',
    description: 'In-situ concrete, formwork, reinforcement fixing',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-ST-003', 'RA-ST-006', 'RA-MH-001', 'RA-CH-001', 'RA-PM-001', 'RA-LO-002', 'RA-NV-001', 'RA-DR-001', 'RA-GS-001', 'RA-TV-001'],
    coshhItems: ['COSHH-001', 'COSHH-013'], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-009', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review structural drawings and pour schedule. Confirm rebar schedule and formwork design.', 'Erect formwork to design. Check alignment, level, and structural adequacy. Record on checklist.', 'Fix reinforcement per drawing. Spacers at correct centres. Cover meter check before pour.', 'Pre-pour inspection — formwork, rebar, inserts, services all checked and signed off.', 'Concrete pour — monitor pour rate, vibrate to remove air voids, take test cubes as required.', 'Curing regime as per specification. Protect from frost/wind/rain as needed.', 'Strike formwork per engineer instruction. Minimum striking times observed. Inspect concrete surface.', 'Snag and remedial works. Apply repair mortar to honeycombing or defects.'],
  },
  {
    id: 'masonry', trade: 'Masonry & Brickwork', category: 'structural',
    description: 'Brickwork, blockwork, stonework',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-ST-005', 'RA-MH-001', 'RA-MH-006', 'RA-CH-001', 'RA-PM-005', 'RA-NV-001', 'RA-DR-001', 'RA-GS-001', 'RA-GS-002'],
    coshhItems: ['COSHH-001', 'COSHH-002', 'COSHH-010'], havsItems: ['HAVS-001', 'HAVS-004'], noiseItems: ['NOISE-001', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Set out wall positions from drawings. Check levels and alignment.', 'Scaffold erected to provide safe working platform. Inspected before use.', 'Build masonry to drawings — check gauge, level, plumb at each course.', 'Install wall ties at specified centres. Record on inspection sheet.', 'Form openings with lintels per structural design. Prop until cured if required.', 'Point/rake out joints. Clean down brickwork face.', 'Install DPC, cavity trays, and weep holes per details.', 'Final inspection — plumb, level, alignment, pointing quality.'],
  },
  {
    id: 'timber-frame', trade: 'Timber Frame', category: 'structural',
    description: 'Timber frame erection, SIPs, CLT',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-ST-001', 'RA-LO-002', 'RA-MH-001', 'RA-MH-006', 'RA-FW-002', 'RA-PM-010', 'RA-NV-001', 'RA-DR-002', 'RA-GS-001', 'RA-GS-002'],
    coshhItems: [], havsItems: ['HAVS-008', 'HAVS-010'], noiseItems: ['NOISE-006', 'NOISE-013'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Check slab/foundation level and alignment. Set out sole plates per layout drawings.', 'Fix sole plates with approved fixings. DPC membrane below sole plate.', 'Erect wall panels in sequence. Temporary bracing immediately after standing.', 'Fix panels together with nailing pattern per design.', 'Install floor cassettes/joists. Temporary edge protection at all leading edges.', 'Erect upper floor panels. Maintain temporary bracing until permanent bracing installed.', 'Install roof trusses per truss layout. Temporary bracing per BCSA guidance.', 'Wrap with breather membrane. Weathertight before internal trades commence.'],
  },

  // ═══ MEP ═══
  {
    id: 'electrical-1st-fix', trade: 'Electrical — 1st Fix', category: 'mep',
    description: 'Cable routes, containment, back boxes',
    raItems: ['RA-EL-001', 'RA-EL-003', 'RA-EL-004', 'RA-WAH-002', 'RA-WAH-008', 'RA-PM-005', 'RA-MH-007', 'RA-DR-001', 'RA-NV-001', 'RA-GS-001'],
    coshhItems: [], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-003', 'NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear', 'ppe-dust'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review electrical layout drawings and cable schedule. Mark out routes on walls/soffits.', 'Install containment (tray, trunking, conduit) per layout. Fire-rated where crossing compartments.', 'Chase walls for back boxes where required. Dust suppression during chasing.', 'Install back boxes, ceiling roses, consumer unit enclosures per layout.', 'Pull cables through containment. Label all cables at each end.', 'Make off connections at back boxes. Leave tails for 2nd fix.', 'Test containment earthing. Megger test all circuits. Record results.', 'Handover to 2nd fix team with test results and marked-up drawings.'],
  },
  {
    id: 'electrical-2nd-fix', trade: 'Electrical — 2nd Fix', category: 'mep',
    description: 'Final connections, accessories, testing, commissioning',
    raItems: ['RA-EL-001', 'RA-EL-003', 'RA-EL-005', 'RA-WAH-002', 'RA-GS-001'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Verify 1st fix complete and tested. Check all circuits isolated before work.', 'Fit accessories — sockets, switches, luminaires per specification.', 'Connect final circuits at consumer unit / distribution board.', 'Complete initial verification per BS 7671. Record all test results on certificates.', 'Commission lighting and power circuits. Function test all circuits.', 'Issue Electrical Installation Certificate (EIC) or Minor Works Certificate.', 'Handover to client/main contractor with test certificates and O&M information.'],
  },
  {
    id: 'plumbing', trade: 'Plumbing & Pipework', category: 'mep',
    description: 'Hot/cold water, waste, soil stacks',
    raItems: ['RA-EL-001', 'RA-WAH-002', 'RA-WAH-008', 'RA-MH-002', 'RA-FW-001', 'RA-PM-005', 'RA-CH-001', 'RA-GS-001'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-003', 'NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review mechanical drawings and pipe schedule. Mark out pipe routes and penetrations.', 'Core drill or form penetrations. Use CAT scanner before drilling.', 'Install brackets and supports per design. Fire-rated where penetrating compartments.', 'Install pipework to layout. Test joints progressively.', 'Pressure test system per specification. Record results.', 'Insulate pipework per specification. Label pipework per BS 1710.', 'Commission system — flush, chlorinate (if potable), final test.', 'Handover with test certificates and as-built drawings.'],
  },
  {
    id: 'mechanical-hvac', trade: 'Mechanical / HVAC', category: 'mep',
    description: 'Heating, ventilation, air conditioning',
    raItems: ['RA-EL-001', 'RA-EL-003', 'RA-WAH-001', 'RA-WAH-003', 'RA-LO-002', 'RA-MH-001', 'RA-FW-001', 'RA-NV-001', 'RA-GS-001'],
    coshhItems: ['COSHH-009'], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-003', 'NOISE-013'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review M&E drawings. Coordinate with other trades on builders work.', 'Install major plant items (AHUs, chillers, boilers) per lift plan if crane required.', 'Install ductwork to layout. Support per DW/144. Seal all joints.', 'Install pipework for heating/cooling circuits. Pressure test progressively.', 'Install controls and BMS points per controls spec.', 'Commission each system per BSRIA/CIBSE guidance. Record commissioning data.', 'Balance air/water systems. Adjust to design flowrates.', 'Handover with commissioning records, O&M manuals, and as-built drawings.'],
  },
  {
    id: 'fire-alarm', trade: 'Fire Alarm Installation', category: 'mep',
    description: 'Fire detection, alarm systems, emergency lighting',
    raItems: ['RA-EL-001', 'RA-EL-003', 'RA-WAH-002', 'RA-WAH-008', 'RA-GS-001'],
    coshhItems: [], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review fire strategy and alarm layout. Confirm category per BS 5839.', 'Install containment and cable routes. Fire-rated cables where specified.', 'Install detectors, call points, sounders per layout drawing.', 'Install fire alarm panel and connect all circuits.', 'Commission system per BS 5839. Test all devices. Record results.', 'Issue commissioning certificate. Hand over log book and zone chart.'],
  },

  // ═══ BUILDING ENVELOPE ═══
  {
    id: 'roofing-flat', trade: 'Flat Roofing', category: 'envelope',
    description: 'Single ply, built-up felt, liquid applied',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-WAH-007', 'RA-FW-001', 'RA-FW-006', 'RA-MH-001', 'RA-PM-005', 'RA-NV-001', 'RA-GS-002', 'RA-GS-001'],
    coshhItems: ['COSHH-011', 'COSHH-006'], havsItems: ['HAVS-001'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-knee'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Erect edge protection at all roof perimeters before roofing works commence.', 'Prepare substrate — clean, prime where required, check falls.', 'Install insulation to design U-value. Mechanical fix or adhere per spec.', 'Install membrane — single ply mechanically fixed or adhered per manufacturer.', 'Detail upstands, penetrations, outlets per manufacturer details.', 'Test for watertightness. Flood test if specified.', 'Remove edge protection only after all roof works complete.'],
  },
  {
    id: 'roofing-pitched', trade: 'Pitched Roofing', category: 'envelope',
    description: 'Tiles, slates, lead work',
    raItems: ['RA-WAH-001', 'RA-WAH-004', 'RA-WAH-005', 'RA-WAH-011', 'RA-MH-001', 'RA-SC-001', 'RA-NV-001', 'RA-GS-002', 'RA-GS-001'],
    coshhItems: ['COSHH-012'], havsItems: ['HAVS-001', 'HAVS-010'], noiseItems: ['NOISE-001', 'NOISE-006'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Erect scaffolding with eaves edge protection. Roof ladder access.', 'Install underlay/breathable membrane. Batten to gauge.', 'Load out materials to scaffold. Do not overload.', 'Tile/slate from eaves to ridge. Hip and valley details per spec.', 'Install ridge tiles. Dry fix or mortar per specification.', 'Lead work to valleys, abutments, flashings per Lead Sheet Association guidance.', 'Inspect completed roof from scaffold. Photograph for record.'],
  },
  {
    id: 'cladding', trade: 'Cladding', category: 'envelope',
    description: 'Metal cladding, rainscreen, composite panels',
    raItems: ['RA-WAH-001', 'RA-WAH-003', 'RA-WAH-004', 'RA-LO-002', 'RA-MH-001', 'RA-PM-005', 'RA-NV-001', 'RA-GS-002', 'RA-GS-001'],
    coshhItems: ['COSHH-006'], havsItems: ['HAVS-001', 'HAVS-004', 'HAVS-015'], noiseItems: ['NOISE-001', 'NOISE-015'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-ear', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Survey structure and check alignment/tolerances for cladding installation.', 'Install brackets and support rails per cladding design.', 'Install insulation and vapour barrier.', 'Install cladding panels — bottom up per layout. Use MEWP or scaffold.', 'Fix flashings, trims, and sealant joints per details.', 'Clean down completed cladding. Remove protective film.', 'Inspection and snagging. Record on completion checklist.'],
  },
  {
    id: 'curtain-wall', trade: 'Curtain Walling', category: 'envelope',
    description: 'Aluminium curtain wall, structural glazing',
    raItems: ['RA-WAH-001', 'RA-WAH-003', 'RA-WAH-004', 'RA-LO-002', 'RA-LO-007', 'RA-MH-001', 'RA-PM-005', 'RA-GS-002', 'RA-GS-001'],
    coshhItems: ['COSHH-006'], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Survey slab edges for alignment. Set out mullion positions.', 'Install brackets per structural design. Torque bolts and record.', 'Install mullions — plumb, align, fix. Temporary bracing where needed.', 'Install transoms. Check squareness and level.', 'Glaze units into frames using vacuum lifter. Wind speed limitations observed.', 'Install pressure plates, caps, and gaskets.', 'Seal all perimeter joints. Water test completed areas.', 'Clean and inspect. Handover with warranty documentation.'],
  },
  {
    id: 'glazing', trade: 'Glazing & Windows', category: 'envelope',
    description: 'Window installation, door sets, glass replacement',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-MH-001', 'RA-MH-006', 'RA-PM-005', 'RA-GS-001'],
    coshhItems: ['COSHH-006'], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Check openings for size and square. Report discrepancies.', 'Lift windows to opening. Mechanical aids for heavy units.', 'Fix frames — packers, fixings per window supplier specification.', 'Glaze sealed units. Gaskets and beading per spec.', 'Seal perimeter with appropriate sealant. Backer rod where needed.', 'Adjust ironmongery and hardware. Function test all opening lights.', 'Clean and inspect. Protect from following trades.'],
  },
  {
    id: 'insulation', trade: 'Insulation', category: 'envelope',
    description: 'Thermal insulation, acoustic insulation',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-MH-001', 'RA-DR-003', 'RA-GS-001'],
    coshhItems: ['COSHH-015'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear', 'ppe-coveralls'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Review insulation specification and U-value requirements.', 'Prepare surfaces — clean, dry, free from debris.', 'Cut and fit insulation to design thickness. Stagger joints. No gaps.', 'Fix mechanically or adhere per manufacturer instruction.', 'Install vapour control layer where specified. Seal all joints and laps.', 'Inspect for gaps and thermal bridges. Remediate before covering.'],
  },
  {
    id: 'waterproofing', trade: 'Waterproofing', category: 'envelope',
    description: 'Below ground waterproofing, tanking, damp proofing',
    raItems: ['RA-WAH-002', 'RA-CS-001', 'RA-EX-001', 'RA-MH-001', 'RA-CH-004', 'RA-GS-001'],
    coshhItems: ['COSHH-006', 'COSHH-007'], havsItems: ['HAVS-001'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-respirator', 'ppe-eyewear', 'ppe-coveralls'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Prepare substrate — clean, dry, repair defects.', 'Apply primer per manufacturer specification.', 'Apply waterproofing membrane/coating per system details.', 'Detail penetrations, day joints, and terminations per manufacturer.', 'Protection board installed over membrane before backfill.', 'Water test where possible. Record results.'],
  },

  // ═══ FITOUT & FINISHES ═══
  {
    id: 'drylining', trade: 'Drylining & Partitions', category: 'fitout',
    description: 'Metal stud partitions, plasterboard, dot and dab',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-MH-001', 'RA-MH-006', 'RA-PM-005', 'RA-DR-003', 'RA-NV-001', 'RA-GS-001'],
    coshhItems: ['COSHH-014'], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-001', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out partition positions from drawings. Laser level for lines.', 'Fix head and floor track. Check for services before fixing.', 'Install studs at specified centres. Door openings formed.', 'Install services (1st fix electrical/plumbing) before boarding.', 'Board one side. Insulation installed. Board second side.', 'Joint and tape. Sand smooth. Protect from damage.'],
  },
  {
    id: 'plastering', trade: 'Plastering (Wet)', category: 'fitout',
    description: 'Wet plaster, rendering, screeding',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-MH-001', 'RA-CH-001', 'RA-DR-003', 'RA-GS-001'],
    coshhItems: ['COSHH-001', 'COSHH-014'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Prepare surfaces — hack, PVA, dubbing out as required.', 'Apply scratch coat / base coat. Rule and float level.', 'Apply finish coat. Trowel smooth.', 'Protect finished plaster from damage and frost.', 'Clean tools and area on completion.'],
  },
  {
    id: 'painting', trade: 'Painting & Decorating', category: 'fitout',
    description: 'Internal/external painting, wallcoverings',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-CH-003', 'RA-CH-005', 'RA-MH-003', 'RA-GS-001'],
    coshhItems: ['COSHH-005', 'COSHH-012'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-respirator'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Surface preparation — fill, sand, prime per specification.', 'Protect floors, fixtures, and adjacent finishes.', 'Apply paint system per specification (primer, undercoat, finish coats).', 'Allow drying time between coats per manufacturer.', 'Inspect and touch up. Remove protection.', 'Clean down and dispose of waste correctly. Solvent rags in sealed metal bin.'],
  },
  {
    id: 'flooring', trade: 'Flooring', category: 'fitout',
    description: 'Vinyl, carpet, laminate, raised access floor',
    raItems: ['RA-MH-001', 'RA-CH-003', 'RA-CH-004', 'RA-GS-001', 'RA-MH-003'],
    coshhItems: ['COSHH-006', 'COSHH-014'], havsItems: [], noiseItems: [],
    ppe: ['ppe-boots', 'ppe-gloves', 'ppe-knee', 'ppe-dust'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Check subfloor for level, moisture content, cleanliness.', 'Apply levelling compound if required. Allow to cure.', 'Acclimatise flooring material per manufacturer instruction.', 'Install flooring per specification — adhesive, click-fit, or loose-lay.', 'Trim and fit to edges. Install threshold strips and trims.', 'Protect installed flooring from following trades.'],
  },
  {
    id: 'tiling', trade: 'Tiling & Stone', category: 'fitout',
    description: 'Wall and floor tiling, natural stone',
    raItems: ['RA-MH-001', 'RA-CH-001', 'RA-PM-005', 'RA-DR-001', 'RA-GS-001', 'RA-MH-003'],
    coshhItems: ['COSHH-001', 'COSHH-002'], havsItems: ['HAVS-001'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-boots', 'ppe-gloves', 'ppe-knee', 'ppe-dust', 'ppe-eyewear', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out tile layout. Establish datum levels and centre lines.', 'Prepare substrate — tanking/waterproofing in wet areas per BS 5385.', 'Apply adhesive and fix tiles to layout. Spacers at correct width.', 'Cut tiles with wet cutter (water suppression for dust). Edge trim where specified.', 'Grout joints. Clean off excess. Seal grout if specified.', 'Apply silicone sealant to movement joints and perimeters.', 'Protect tiled areas from following trades.'],
  },
  {
    id: 'joinery', trade: 'Joinery & Carpentry', category: 'fitout',
    description: '2nd fix carpentry, door hanging, kitchen fitting',
    raItems: ['RA-WAH-002', 'RA-PM-005', 'RA-PM-006', 'RA-PM-010', 'RA-DR-002', 'RA-MH-001', 'RA-GS-001'],
    coshhItems: [], havsItems: ['HAVS-010', 'HAVS-008'], noiseItems: ['NOISE-004', 'NOISE-006'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Receive and check joinery items against schedule. Store flat and protected.', 'Set out positions from drawings. Door openings squared and checked.', 'Fix frames/linings. Plumb and level. Pack and fix securely.', 'Hang doors. Adjust hinges, latch, and lock. Gap tolerances per spec.', 'Fit architraves, skirting, and trims. Mitre corners.', 'Install kitchen units/worktops per layout. Level and secure.', 'Final adjust all ironmongery. Function test fire doors. Protect from damage.'],
  },
  {
    id: 'ceilings', trade: 'Ceiling Installation', category: 'fitout',
    description: 'Suspended ceilings, MF ceilings, bulkheads',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-MH-001', 'RA-MH-006', 'RA-DR-003', 'RA-GS-001'],
    coshhItems: [], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out ceiling grid from drawings. Laser level for datum.', 'Install perimeter angle/channel. Fix at specified centres.', 'Install suspension hangers. Check for services before drilling.', 'Install main runners and cross tees. Level and square.', 'Install ceiling tiles/boards. Handle with clean gloves.', 'Cut tiles around services/light fittings. Clean edges.', 'Inspect and replace damaged tiles. Clean grid.'],
  },

  // ═══ EXTERNAL WORKS ═══
  {
    id: 'groundworks', trade: 'Groundworks', category: 'external',
    description: 'Foundations, substructure, ground preparation',
    raItems: ['RA-EX-001', 'RA-EX-002', 'RA-EX-003', 'RA-EX-005', 'RA-EX-006', 'RA-PM-001', 'RA-PM-003', 'RA-PM-007', 'RA-LO-002', 'RA-MH-001', 'RA-TV-001', 'RA-EN-001', 'RA-GS-001'],
    coshhItems: ['COSHH-001', 'COSHH-008'], havsItems: ['HAVS-011', 'HAVS-012'], noiseItems: ['NOISE-002', 'NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'noise'],
    msSteps: ['Review geotechnical report and foundation design. Obtain service records.', 'Set out excavation positions. Mark services. Obtain permit to dig.', 'Excavate to formation level. Shore/batter as required.', 'Inspect formation. Competent person to verify.', 'Blind and place reinforcement per structural design.', 'Pour concrete foundations. Vibrate and cure per spec.', 'Backfill and compact in layers to specified density.', 'Final levels and handover to superstructure.'],
  },
  {
    id: 'drainage', trade: 'Drainage', category: 'external',
    description: 'Below ground drainage, manholes, connections',
    raItems: ['RA-EX-001', 'RA-EX-002', 'RA-EX-003', 'RA-EX-004', 'RA-PM-001', 'RA-CS-001', 'RA-MH-001', 'RA-TV-001', 'RA-EN-001', 'RA-GS-001'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-011'], noiseItems: ['NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out drainage layout from drawings. Establish invert levels.', 'Excavate trench to formation. Shore if deeper than 1.2m.', 'Lay bedding material. Level and compact.', 'Install pipes to fall. Joint and bed per manufacturer.', 'Build manholes/inspection chambers per details.', 'Backfill in layers. Compact to specified density.', 'CCTV survey and water/air test. Record results.', 'Connect to existing system per water authority approval.'],
  },
  {
    id: 'landscaping', trade: 'Landscaping', category: 'external',
    description: 'Hard and soft landscaping, planting',
    raItems: ['RA-PM-001', 'RA-PM-005', 'RA-MH-001', 'RA-NV-002', 'RA-EN-001', 'RA-GS-001', 'RA-GS-002', 'RA-GS-009'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-011', 'HAVS-016'], noiseItems: ['NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out landscape layout from drawings.', 'Prepare ground — clear, grade, cultivate as required.', 'Install hard landscaping — kerbs, paving, edgings per details.', 'Install drainage and irrigation if specified.', 'Prepare planting areas — topsoil, compost, amendments.', 'Plant per planting schedule. Stake trees. Mulch beds.', 'Install fencing and street furniture per layout.', 'Final clean-up and handover.'],
  },
  {
    id: 'paving', trade: 'Paving & Kerbing', category: 'external',
    description: 'Block paving, flags, tarmac, kerb laying',
    raItems: ['RA-PM-001', 'RA-PM-005', 'RA-MH-001', 'RA-NV-001', 'RA-DR-001', 'RA-TV-001', 'RA-GS-001'],
    coshhItems: ['COSHH-001', 'COSHH-011'], havsItems: ['HAVS-001', 'HAVS-011'], noiseItems: ['NOISE-001', 'NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear', 'ppe-dust', 'ppe-knee'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out levels and alignment from drawings.', 'Prepare sub-base — excavate, compact, level.', 'Lay kerbs/edgings to line and level. Haunch with concrete.', 'Lay base course/bedding material. Compact.', 'Install paving/flags to pattern. Cut with wet cutter.', 'Joint and compact. Kiln-dried sand for block paving.', 'Final clean and inspection.'],
  },
  {
    id: 'fencing', trade: 'Fencing & Boundaries', category: 'external',
    description: 'Security fencing, timber fencing, gates',
    raItems: ['RA-EX-002', 'RA-PM-005', 'RA-MH-001', 'RA-GS-001', 'RA-GS-002'],
    coshhItems: ['COSHH-001'], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out fence line from drawings. Check for underground services.', 'Excavate post holes or drive posts per detail.', 'Install posts — concrete, bolt, or drive as specified. Plumb and align.', 'Install rails and panels. Level.', 'Install gates and hardware. Function test.', 'Final inspection and handover.'],
  },

  // ═══ DEMOLITION & ENABLING ═══
  {
    id: 'soft-strip', trade: 'Soft Strip', category: 'demolition',
    description: 'Internal strip-out, removal of finishes and services',
    raItems: ['RA-DM-001', 'RA-DM-002', 'RA-DM-004', 'RA-DM-005', 'RA-EL-001', 'RA-MH-001', 'RA-WAH-002', 'RA-DR-005', 'RA-GS-001'],
    coshhItems: ['COSHH-002'], havsItems: ['HAVS-002', 'HAVS-004'], noiseItems: ['NOISE-002', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-ear', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Review asbestos survey (R&D). Asbestos removed by licensed contractor first.', 'Isolate all services — electric, gas, water. Obtain isolation certificates.', 'Remove fixtures, fittings, and services in sequence.', 'Remove ceiling tiles, partitions, flooring — work top down.', 'Segregate waste — timber, metal, plasterboard, general.', 'Dust suppression throughout. Dampen before disturbing.', 'Clear and clean. Final inspection before structural demo or refit.'],
  },
  {
    id: 'structural-demolition', trade: 'Structural Demolition', category: 'demolition',
    description: 'Structural demolition, machine demolition',
    raItems: ['RA-DM-001', 'RA-DM-002', 'RA-DM-003', 'RA-DM-004', 'RA-DM-005', 'RA-PM-001', 'RA-PM-003', 'RA-EX-001', 'RA-LO-002', 'RA-NV-001', 'RA-DR-001', 'RA-TV-001', 'RA-EN-001'],
    coshhItems: ['COSHH-002', 'COSHH-008'], havsItems: ['HAVS-002'], noiseItems: ['NOISE-002', 'NOISE-010'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-ear', 'ppe-respirator', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh', 'noise'],
    msSteps: ['Demolition plan prepared by competent engineer. Method statement approved.', 'Pre-demolition structural survey completed.', 'Asbestos removal complete. Clearance certificate obtained.', 'All services isolated and capped. Certificates obtained.', 'Establish exclusion zone. Hoarding, signage, banksman.', 'Demolish in sequence per plan — top down, working back from perimeter.', 'Dust suppression throughout — water cannons, misting.', 'Process materials on site — crush concrete, segregate steel.', 'Backfill and grade to formation. Final inspection.'],
  },
  {
    id: 'site-clearance', trade: 'Site Clearance', category: 'demolition',
    description: 'Vegetation clearance, tree removal, site preparation',
    raItems: ['RA-PM-001', 'RA-PM-005', 'RA-NV-002', 'RA-MH-001', 'RA-GS-001', 'RA-GS-007', 'RA-GS-009', 'RA-EN-001'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-014', 'HAVS-016'], noiseItems: ['NOISE-011'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Ecological survey reviewed. Nesting season restrictions observed.', 'Tree survey — protected trees identified and protected.', 'Mark out clearance boundary. Protect retained features.', 'Remove vegetation with appropriate plant/hand tools.', 'Tree felling by qualified arborist. Exclusion zone maintained.', 'Grub out roots where required. Backfill and compact.', 'Dispose of green waste to licensed facility or chip on site.', 'Final site survey and handover.'],
  },

  // ═══ SPECIALIST ═══
  {
    id: 'fire-stopping', trade: 'Fire Stopping', category: 'specialist',
    description: 'Penetration seals, linear gap seals, cavity barriers',
    raItems: ['RA-WAH-002', 'RA-WAH-008', 'RA-CH-004', 'RA-DR-003', 'RA-MH-001', 'RA-GS-001'],
    coshhItems: ['COSHH-006', 'COSHH-007'], havsItems: ['HAVS-004'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-dust', 'ppe-respirator', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Review fire strategy and penetration schedule. Identify all fire-rated walls/floors.', 'Survey and record all penetrations requiring fire stopping.', 'Prepare penetrations — clean, remove debris, check size.', 'Install fire stopping products per manufacturer test evidence.', 'Photograph each installation. Record on fire stopping register.', 'Third party inspection where specified. Obtain certificate.'],
  },
  {
    id: 'scaffolding-erection', trade: 'Scaffolding', category: 'specialist',
    description: 'Scaffold erection, adaptation, dismantling',
    raItems: ['RA-SC-001', 'RA-SC-002', 'RA-SC-004', 'RA-WAH-001', 'RA-WAH-004', 'RA-LO-002', 'RA-MH-001', 'RA-MH-008', 'RA-NV-001', 'RA-TV-001', 'RA-GS-001', 'RA-GS-002'],
    coshhItems: [], havsItems: [], noiseItems: ['NOISE-014'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Review scaffold design/TG20 compliance sheet. Check ground conditions.', 'Lay sole plates. Install base plates and standards.', 'Erect scaffold to design — ledgers, transoms, bracing.', 'Install ties at specified centres. Record on tie schedule.', 'Install platforms, guard rails, toe boards, ladder access.', 'Complete scaffold inspection and apply green tag.', 'Brief users on scaffold rules and load limits.', 'Dismantle in reverse order. Exclusion zone below.'],
  },
  {
    id: 'lift-installation', trade: 'Lift Installation', category: 'specialist',
    description: 'Passenger/goods lift installation',
    raItems: ['RA-WAH-001', 'RA-WAH-006', 'RA-CS-001', 'RA-EL-001', 'RA-EL-005', 'RA-LO-002', 'RA-MH-001', 'RA-PM-002', 'RA-GS-001'],
    coshhItems: ['COSHH-009'], havsItems: ['HAVS-004'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Survey lift shaft — dimensions, plumb, fixings.', 'Install guide rails. Plumb and align.', 'Install machine room equipment / traction machine.', 'Install car frame, platform, doors.', 'Install wiring and controls.', 'Commission and test per BS EN 81. Load test.', 'Issue Declaration of Conformity. Handover to client with O&M.'],
  },
  {
    id: 'temporary-works', trade: 'Temporary Works', category: 'specialist',
    description: 'Propping, shoring, temporary structures',
    raItems: ['RA-ST-001', 'RA-ST-003', 'RA-WAH-001', 'RA-LO-002', 'RA-MH-001', 'RA-GS-001'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Temporary works designed by competent engineer (TWC).', 'Design checked by independent checker (TWS).', 'Brief installation team on design and sequence.', 'Install per design. No deviations without engineer approval.', 'Inspect and sign off before loading.', 'Monitor during use. Report any movement/damage.', 'Remove only on engineer instruction. Sequence per design.'],
  },
  {
    id: 'piling', trade: 'Piling', category: 'specialist',
    description: 'Bored piling, driven piling, CFA',
    raItems: ['RA-EX-001', 'RA-EX-002', 'RA-EX-007', 'RA-PM-001', 'RA-PM-003', 'RA-LO-002', 'RA-NV-001', 'RA-NV-003', 'RA-EN-001', 'RA-TV-001', 'RA-GS-001'],
    coshhItems: ['COSHH-001', 'COSHH-008'], havsItems: [], noiseItems: ['NOISE-010'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'noise'],
    msSteps: ['Review piling layout and pile schedule. Check for services.', 'Set up piling mat. Level and compact.', 'Set out pile positions from survey.', 'Install piles per specification — bore, drive, or auger.', 'Concrete piles per design mix. Take test cubes.', 'Crop piles to cut-off level.', 'Pile integrity testing (PIT/CASE) per specification.', 'Handover with pile installation records and test results.'],
  },

  // ═══ CIVIL & HIGHWAYS ═══
  {
    id: 'road-works', trade: 'Road Works & Highways', category: 'civil',
    description: 'Road construction, resurfacing, traffic management',
    raItems: ['RA-TV-001', 'RA-TV-003', 'RA-TV-004', 'RA-PM-001', 'RA-PM-007', 'RA-EX-002', 'RA-NV-001', 'RA-DR-001', 'RA-GS-001', 'RA-GS-002', 'RA-EN-003'],
    coshhItems: ['COSHH-011', 'COSHH-008'], havsItems: ['HAVS-011', 'HAVS-001'], noiseItems: ['NOISE-001', 'NOISE-008', 'NOISE-012'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear', 'ppe-dust'],
    defaultDocs: ['method-statement', 'risk-assessment', 'noise'],
    msSteps: ['Implement traffic management per approved TM plan. Chapter 8 signage.', 'Set out works from drawings. Survey levels.', 'Plane/excavate existing surface. Dispose of arisings.', 'Prepare sub-base. Compact and level.', 'Lay base course/binder course. Compact and level.', 'Lay surface course. Check levels and crossfall.', 'Line markings, road studs, signage per highway design.', 'Open to traffic. Remove TM. Handover with as-built records.'],
  },
  {
    id: 'utilities', trade: 'Utility Connections', category: 'civil',
    description: 'Gas, electric, water, telecoms connections',
    raItems: ['RA-EX-001', 'RA-EX-002', 'RA-EL-001', 'RA-EL-006', 'RA-CS-001', 'RA-PM-001', 'RA-TV-004', 'RA-GS-001'],
    coshhItems: [], havsItems: ['HAVS-002', 'HAVS-004'], noiseItems: ['NOISE-002', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Obtain utility records and permits. Coordinate with statutory bodies.', 'Set out trench routes. CAT scan for existing services.', 'Excavate trench. Hand dig near existing services.', 'Install ducts/pipes per utility company specification.', 'Backfill and compact in layers. Warning tape above services.', 'Connection by utility company or accredited contractor.', 'Reinstate surface. Test and commission.', 'As-built survey and handover records.'],
  },
  {
    id: 'kerbing', trade: 'Kerbing & Edging', category: 'civil',
    description: 'Kerb laying, channel, edge restraint',
    raItems: ['RA-MH-001', 'RA-MH-002', 'RA-PM-001', 'RA-TV-001', 'RA-GS-001'],
    coshhItems: ['COSHH-001'], havsItems: ['HAVS-004', 'HAVS-001'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Set out kerb line from drawings. Check levels.', 'Excavate kerb foundation to required depth.', 'Pour concrete bedding. Strike off level.', 'Lift kerbs into position using mechanical aid.', 'Set kerbs to line and level. Joint and haunch.', 'Backfill behind kerb. Compact in layers.', 'Pointing where required.', 'Snag and handover.'],
  },
  {
    id: 'street-furniture', trade: 'Street Furniture & Signage', category: 'civil',
    description: 'Bollards, benches, lighting columns, signage',
    raItems: ['RA-MH-001', 'RA-EX-001', 'RA-PM-001', 'RA-TV-001', 'RA-EL-006'],
    coshhItems: ['COSHH-001'], havsItems: ['HAVS-002', 'HAVS-004'], noiseItems: ['NOISE-002'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Confirm locations from drawings. Mark out positions.', 'CAT scan and excavate foundations.', 'Pour concrete foundations to required depth.', 'Install items per manufacturer instructions.', 'Plumb and align. Backfill and compact.', 'Connect electrical where required by qualified electrician.', 'Test and commission lighting.', 'Snag and handover.'],
  },

  // ═══ HERITAGE & LISTED BUILDINGS ═══
  {
    id: 'lime-pointing', trade: 'Lime Pointing & Mortar Repair', category: 'heritage',
    description: 'Traditional lime mortar repointing, repairs to listed structures',
    raItems: ['RA-WAH-001', 'RA-WAH-002', 'RA-MH-001', 'RA-CH-001', 'RA-FW-005'],
    coshhItems: ['COSHH-001', 'COSHH-013'], havsItems: ['HAVS-001', 'HAVS-029'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Pre-start condition survey. Photograph existing fabric.', 'Heritage Officer/Conservation Officer briefing if required.', 'Set up scaffold or access platform. Edge protection.', 'Rake out defective mortar by hand or with low-impact tools — avoid damage to historic stonework.', 'Mix lime mortar to specified ratio (e.g. NHL 3.5). Hot lime training where used.', 'Pack mortar in courses. Tooling to match historic profile.', 'Protect from rapid drying — damp hessian/sheeting per heritage spec.', 'Curing period 28+ days. Final photographic record. Handover with material certificates.'],
  },
  {
    id: 'stone-restoration', trade: 'Stone Masonry & Restoration', category: 'heritage',
    description: 'Stone repair, indenting, dutchman repairs, replacement',
    raItems: ['RA-WAH-001', 'RA-MH-008', 'RA-LO-001', 'RA-CH-002', 'RA-DU-001'],
    coshhItems: ['COSHH-001', 'COSHH-013'], havsItems: ['HAVS-001', 'HAVS-024', 'HAVS-029'], noiseItems: ['NOISE-001', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Heritage assessment. Method approved by Conservation Officer.', 'Set up scaffold with full edge protection.', 'Cut out defective stone using diamond-tipped hand tools — avoid percussive impact.', 'Cut new stone (matched to original). Lift with mechanical aid.', 'Set stone in lime mortar. Match coursing.', 'Pin where required (stainless steel pins).', 'Tool finish to match adjacent stone.', 'Final inspection by Conservation Officer. Photographic handover.'],
  },
  {
    id: 'slate-roofing', trade: 'Slate Roofing (Heritage)', category: 'heritage',
    description: 'Welsh slate, traditional slating, lead detailing',
    raItems: ['RA-WAH-001', 'RA-WAH-007', 'RA-WAH-011', 'RA-MH-006', 'RA-FW-006'],
    coshhItems: ['COSHH-006', 'COSHH-001'], havsItems: ['HAVS-001'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Pre-start condition survey. Identify existing slates for re-use.', 'Erect scaffold with edge protection. Roof ladders and crawl boards.', 'Strip existing slates carefully. Stack for re-use.', 'Inspect and repair battens, felt, sarking as required.', 'Set out slate courses. Hole/peg as required.', 'Lay slates from eaves up. Match historic detailing.', 'Lead flashing/valleys per heritage detail.', 'Final inspection. Handover with slate provenance records.'],
  },
  {
    id: 'lead-work', trade: 'Lead Work & Flashings', category: 'heritage',
    description: 'Lead roofing, flashings, decorative lead work',
    raItems: ['RA-WAH-001', 'RA-WAH-007', 'RA-FW-001', 'RA-FW-003', 'RA-MH-006'],
    coshhItems: ['COSHH-014'], havsItems: ['HAVS-001'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-welding', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Hot work permit. Fire watch arrangements.', 'Set up access. Edge protection.', 'Cut lead to size from rolls. Use shears or knives — no powered cutting.', 'Form lead using bossing tools. Avoid dry hammering (lead poisoning).', 'Lead burn welding (fully PPE\'d operatives only).', 'Fix lead with copper or stainless clips per heritage detail.', 'Patination oil applied to slow oxidation.', 'Final inspection. Hand and face washing essential post-work.'],
  },
  {
    id: 'sash-window', trade: 'Sash Window Restoration', category: 'heritage',
    description: 'Box sash window repair, draught-proofing, glass restoration',
    raItems: ['RA-WAH-001', 'RA-WAH-002', 'RA-MH-006', 'RA-CH-001'],
    coshhItems: ['COSHH-002', 'COSHH-007'], havsItems: ['HAVS-013'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-eyewear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Pre-start survey. Lead paint test (pre-1980 buildings).', 'Set up internal/external scaffolding or platform.', 'Carefully remove sashes and stops. Label for tracking.', 'Strip old paint by wet methods only — no sanding without LEV.', 'Repair timber rot — splice or epoxy fill per heritage approval.', 'Re-cord, re-weight, re-glaze as needed.', 'Refinish with matched paint system. Avoid VOC paints in occupied areas.', 'Re-fit. Smoothness check. Handover.'],
  },

  // ═══ OCCUPIED / LIVE PREMISES ═══
  {
    id: 'office-fit-out', trade: 'Office Fit-Out (Occupied)', category: 'occupied',
    description: 'Cat A/B fit-out in occupied or partially-occupied premises',
    raItems: ['RA-WAH-002', 'RA-MH-001', 'RA-EL-003', 'RA-FW-001', 'RA-DU-002', 'RA-NV-001', 'RA-GS-002'],
    coshhItems: ['COSHH-007', 'COSHH-018'], havsItems: ['HAVS-006', 'HAVS-013'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe'],
    defaultDocs: ['method-statement', 'risk-assessment', 'noise'],
    msSteps: ['Liaise with FM/tenant. Out-of-hours working agreed.', 'Erect dust screens/hoarding. Floor protection.', 'Daily clean-down regime. Limit dust generation.', 'Carry out works per floor plan and finishes schedule.', 'Coordinate with live MEP services. Permit to work for live areas.', 'Snag end-of-shift. Re-instate clean state for next-day occupants.', 'Practical completion walkthrough with FM.', 'Handover with O&M manuals and asset register.'],
  },
  {
    id: 'retail-fit-out', trade: 'Retail Fit-Out', category: 'occupied',
    description: 'Shop fit-out, often in occupied shopping centres',
    raItems: ['RA-MH-001', 'RA-EL-003', 'RA-FW-001', 'RA-WAH-002', 'RA-TV-002'],
    coshhItems: ['COSHH-007', 'COSHH-018'], havsItems: ['HAVS-006'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Centre management briefing. Out-of-hours working window.', 'Hoarding and dust screens. Public separation.', 'Strip-out per agreed sequence.', 'Install shop floor finishes, joinery, services.', 'Connect signage and shopfront per landlord spec.', 'Final clean. Snag.', 'Tenant fit-out completion certificate.', 'Hand over to retailer.'],
  },
  {
    id: 'healthcare-works', trade: 'Healthcare / Hospital Works', category: 'occupied',
    description: 'Works in operational healthcare environments — infection control critical',
    raItems: ['RA-WAH-002', 'RA-DU-002', 'RA-EL-003', 'RA-NV-001', 'RA-GS-002', 'RA-FW-001'],
    coshhItems: ['COSHH-018', 'COSHH-007'], havsItems: ['HAVS-006'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-coverall'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['HBN/HTM compliance check. Infection control briefing.', 'IPC permit raised. Daily HEPA inspection.', 'Negative pressure enclosure where required.', 'Operatives via separate route. Clean PPE in clinical area.', 'Daily wet-clean of works area. No dry sweeping.', 'Smoke detection isolation by FM only — never directly.', 'Air monitoring (particulate count) where specified.', 'Handover with terminal clean certificate.'],
  },
  {
    id: 'school-works', trade: 'School Works (Occupied)', category: 'occupied',
    description: 'Construction in occupied school or academy environments',
    raItems: ['RA-WAH-002', 'RA-MH-001', 'RA-FW-001', 'RA-PM-001', 'RA-EL-003', 'RA-GS-002'],
    coshhItems: [], havsItems: [], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Safeguarding briefing. DBS checks for site team.', 'Heras fencing — no public/pupil access.', 'Out-of-hours / holiday working preferred for noisy works.', 'Daily site inductions for any visitor.', 'Cleardown end-of-shift — no tools/materials accessible.', 'Coordination with school management for fire drills.', 'Final commissioning to suit term-time start.', 'Handover with safeguarding sign-off.'],
  },

  // ═══ ACCESS & WORKING AT HEIGHT (specialist) ═══
  {
    id: 'scaffold-system', trade: 'System Scaffolding (Layher/Cuplok)', category: 'access',
    description: 'Modular system scaffold erection',
    raItems: ['RA-WAH-001', 'RA-WAH-008', 'RA-WAH-010', 'RA-MH-001', 'RA-MH-002', 'RA-LO-001', 'RA-PM-001'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['CISRS-trained operatives only. PASMA where mobile.', 'Pre-start scaffold design check. Loading specification.', 'Erect base lifts. Sole boards on soft ground.', 'Build lifts to design. Bracing and ties as drawing.', 'Edge protection at all platforms — guard rail, mid-rail, toe board.', 'Ladders or stair towers for access.', 'Scaffold tagged GREEN before handover. Daily inspection.', 'Strike in reverse sequence. Stack for re-use.'],
  },
  {
    id: 'scaffold-tube', trade: 'Tube & Fitting Scaffolding', category: 'access',
    description: 'Traditional tube and clip scaffolding',
    raItems: ['RA-WAH-001', 'RA-WAH-008', 'RA-WAH-010', 'RA-MH-001', 'RA-MH-002'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['CISRS-trained operatives. SG4 fall arrest where applicable.', 'Confirm scaffold design from drawings.', 'Erect base lift. Sole boards. Adjustable bases.', 'Build standards, ledgers, transoms.', 'Brace per design. Tie to structure as required.', 'Boards, guard rails, toe boards.', 'Tag GREEN. Hand over with inspection certificate.', 'Periodic inspection at 7-day intervals.'],
  },
  {
    id: 'mast-climber', trade: 'Mast Climbing Work Platforms (MCWP)', category: 'access',
    description: 'Twin mast climbers for façade access',
    raItems: ['RA-WAH-001', 'RA-WAH-003', 'RA-WAH-010', 'RA-LO-001', 'RA-NV-002'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment', 'lift-plan'],
    msSteps: ['IPAF MCWP trained operators only. Lift plan approved.', 'Erect masts to base structure. Securing pins.', 'Erect platform. Wind speed monitoring.', 'Tie to structure at design intervals.', 'Test platform travel up/down. Emergency descent test.', 'Edge protection on platform.', 'Operatives at height tied off where SG4 applies.', 'Strike on completion in reverse sequence.'],
  },
  {
    id: 'rope-access', trade: 'Rope Access (IRATA)', category: 'access',
    description: 'IRATA rope access for inspection, maintenance, façade work',
    raItems: ['RA-WAH-001', 'RA-WAH-002', 'RA-WAH-006'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['IRATA Level 1/2/3 ratio per IRATA TACS. L3 supervisor on site.', 'Rope rigging plan. Anchor inspection (15 kN minimum).', 'Two independent ropes per operative. Back-up device.', 'Pre-start checks of all PPE and equipment.', 'Operatives descend in twin-rope system. Tools tethered.', 'Bottom-up rescue plan rehearsed. Top-team awareness.', 'Daily logging of equipment and rope hours.', 'Safe egress. Equipment de-rigged and inspected.'],
  },
  {
    id: 'bmu', trade: 'BMU / Façade Access Equipment', category: 'access',
    description: 'Building maintenance unit operation, suspended cradle works',
    raItems: ['RA-WAH-001', 'RA-WAH-003', 'RA-LO-001', 'RA-NV-002'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['BMU competent operator only. LOLER thorough exam in date.', 'Pre-start checks per manufacturer manual. Wind speed check.', 'Cradle inspection. Twin-rope for fall arrest.', 'Operatives don harness, attach to designated anchor.', 'Travel cradle to working position. Communicate with BMU operator.', 'Carry out works. Tools tethered. No leaning over.', 'Return to docking station. Secure cradle.', 'Sign off shift on BMU log.'],
  },

  // ═══ RENEWABLES & LOW CARBON ═══
  {
    id: 'solar-pv', trade: 'Solar PV Installation', category: 'renewables',
    description: 'Roof and ground-mount photovoltaic systems',
    raItems: ['RA-WAH-001', 'RA-WAH-007', 'RA-WAH-011', 'RA-EL-001', 'RA-EL-005', 'RA-MH-006'],
    coshhItems: [], havsItems: ['HAVS-006'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-glasses'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['MCS-certified installer. Roof structural check.', 'Erect roof access. Edge protection or harness.', 'Install rails to roof per manufacturer spec.', 'Lift panels (manual handling — 2-person carry).', 'Mount panels. DC cabling — kept off roof until ready.', 'Inverter installation by qualified electrician.', 'Commissioning per MCS protocol. G98/G99 connection.', 'Handover with as-built and yield projection.'],
  },
  {
    id: 'ev-charge-point', trade: 'EV Charge Point Installation', category: 'renewables',
    description: 'EV charging point install — domestic and commercial',
    raItems: ['RA-EL-001', 'RA-EL-003', 'RA-EX-001', 'RA-MH-001', 'RA-TV-002'],
    coshhItems: [], havsItems: ['HAVS-006', 'HAVS-022'], noiseItems: ['NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['OZEV-approved installer. Pre-install survey complete.', 'Isolate supply. Lock-out tag-out.', 'Run cabling per BS 7671. RCD type B.', 'Install charge point. Earth as required.', 'OZEV/DNO notification (G98/G99 where required).', 'Commission. Test under load.', 'Customer demonstration. Hand over with certificates.', 'Register with vehicle/grant body as required.'],
  },
  {
    id: 'heat-pump', trade: 'Air-Source Heat Pump Install', category: 'renewables',
    description: 'ASHP / GSHP install with associated MEP',
    raItems: ['RA-MH-001', 'RA-EL-001', 'RA-EX-001', 'RA-PM-001', 'RA-WC-001'],
    coshhItems: ['COSHH-016'], havsItems: ['HAVS-006'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['MCS-certified installer. F-Gas registered for refrigerant work.', 'Pre-install survey. EPC and heat-loss calc reviewed.', 'Strip existing system if applicable. Drain down safely.', 'Pour external pad for unit. Install brackets.', 'Lift unit into position. Mechanical aid for heavy units.', 'Pipework, refrigerant lines, electrical to BS 7671.', 'Refrigerant charge by F-Gas qualified engineer.', 'Commission per MCS. Customer demo + handover.'],
  },
  {
    id: 'underfloor-heating', trade: 'Underfloor Heating Install', category: 'renewables',
    description: 'Wet UFH manifold, pipework, screed',
    raItems: ['RA-MH-001', 'RA-MH-003', 'RA-EL-003', 'RA-CH-001'],
    coshhItems: ['COSHH-001', 'COSHH-016'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-knee'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Insulation board fixed to deck.', 'Manifold position confirmed. Mark out.', 'Lay UFH pipe per design. Clip to insulation.', 'Pressure test pipework before screed.', 'Install electrical thermostats by qualified electrician.', 'Screed pour by specialist team.', 'Commissioning curve over multiple days post-screed cure.', 'Customer demo. Handover with controls programming.'],
  },

  // ═══ SPECIALIST EXPANSIONS ═══
  {
    id: 'asbestos-licensed', trade: 'Licensed Asbestos Removal', category: 'specialist',
    description: 'Licensed removal of asbestos-containing materials',
    raItems: ['RA-WAH-002', 'RA-MH-001', 'RA-DU-002', 'RA-CH-002'],
    coshhItems: ['COSHH-018'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-coverall', 'ppe-rpe'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['HSE-licensed contractor. ASB5 notification 14 days before start.', 'Pre-start meeting with analyst.', 'Erect enclosure. Negative pressure unit. 3-stage decon.', 'Operatives with current medical and FFP3/powered RPE.', 'Wet stripping. Bag waste in red/asbestos-marked sacks.', 'Smoke test enclosure. Visual inspection by analyst.', 'Reassurance air clearance. Certificate of Reoccupation.', 'Waste disposal via licensed carrier to permitted site.'],
  },
  {
    id: 'asbestos-survey', trade: 'Asbestos Surveys (R&D)', category: 'specialist',
    description: 'Asbestos refurbishment & demolition surveys',
    raItems: ['RA-WAH-002', 'RA-CS-001'],
    coshhItems: ['COSHH-018'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-coverall', 'ppe-rpe'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['BOHS P402 surveyor. PASMA/IPAF as required.', 'Pre-survey desk study. Site induction.', 'Walk-through inspection — all areas.', 'Take samples per HSG264. Bag and label.', 'Photograph each sample location.', 'Submit samples to UKAS lab. Await results.', 'Compile survey report with risk register.', 'Handover to client with management plan recommendations.'],
  },
  {
    id: 'fire-stopping-compartmentation', trade: 'Fire Stopping & Compartmentation', category: 'specialist',
    description: 'Penetration sealing, fire collars, intumescent paint',
    raItems: ['RA-MH-001', 'RA-WAH-002', 'RA-FW-001'],
    coshhItems: ['COSHH-019'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['IFC-certified or equivalent qualified operatives.', 'Survey existing compartmentation. Mark up plans.', 'Pre-install MEP penetrations confirmed.', 'Install batt/sleeve to manufacturer detail.', 'Apply mastic/foam per spec. Fire-rated only.', 'Photographic record of every penetration.', 'Compile fire stopping register with location plans.', 'Handover to FM with O&M and maintenance plan.'],
  },
  {
    id: 'intumescent', trade: 'Intumescent Paint to Steelwork', category: 'specialist',
    description: 'Fire protection coatings to structural steel',
    raItems: ['RA-WAH-001', 'RA-MH-001'],
    coshhItems: ['COSHH-019'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-coverall'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['ICATS-trained applicator. Manufacturer spec confirmed.', 'Surface prep — abrasive blast / power tool clean to Sa 2.5.', 'Primer applied per spec.', 'Build coats of intumescent to required DFT.', 'DFT measurement at agreed frequency. Reject and recoat if low.', 'Topcoat where exposed.', 'QA records — substrate, primer DFT, IUM DFT, topcoat.', 'Hand over with ICATS certificate per element.'],
  },
  {
    id: 'curtain-walling', trade: 'Curtain Walling Install', category: 'envelope',
    description: 'Aluminium / steel curtain wall systems',
    raItems: ['RA-WAH-001', 'RA-LO-001', 'RA-MH-008', 'RA-EL-005'],
    coshhItems: ['COSHH-007'], havsItems: ['HAVS-006'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment', 'lift-plan'],
    msSteps: ['Setting-out from primary structure datum.', 'Brackets to slab. Survey checked.', 'Mullions lifted into position. Tied off where SG4.', 'Transoms installed. Plumb and align.', 'Glazing units lifted with vacuum lifters or mechanical aid.', 'Glazing gaskets and pressure plates. Caps installed.', 'Pressure test sample bays.', 'Snag and final clean.'],
  },
  {
    id: 'structural-glazing', trade: 'Structural Glazing / Frameless', category: 'envelope',
    description: 'Frameless glass walls, balustrades, atrium glazing',
    raItems: ['RA-WAH-001', 'RA-LO-001', 'RA-MH-008'],
    coshhItems: ['COSHH-019', 'COSHH-007'], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness'],
    defaultDocs: ['method-statement', 'risk-assessment', 'lift-plan'],
    msSteps: ['Pre-install survey. Tolerances to glass manufacturer.', 'Install fixings to structure.', 'Lift glass with vacuum lifters. Spreader bar for large units.', 'Position glass. Bond with structural silicone per manufacturer.', '7-day cure before load.', 'Edge protection until cured.', 'Snag and clean.', 'Handover with structural sign-off.'],
  },
  {
    id: 'shop-fitting', trade: 'Shop Fitting / Joinery', category: 'fitout',
    description: 'Bespoke joinery, shopfront, retail fitout',
    raItems: ['RA-MH-001', 'RA-EL-003', 'RA-PM-006'],
    coshhItems: ['COSHH-007', 'COSHH-002'], havsItems: ['HAVS-018', 'HAVS-019'], noiseItems: ['NOISE-004'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-glasses'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Workshop fabrication where possible.', 'Site delivery and storage.', 'Setting-out from finished floor and ceiling.', 'Carcass install. Plumb and level.', 'Front pieces and detail joinery.', 'Wiring/plumbing into joinery as required.', 'Final clean and protection.', 'Snag and handover with care instructions.'],
  },

  // ═══ DEMOLITION ═══
  {
    id: 'soft-strip', trade: 'Soft Strip Demolition', category: 'demolition',
    description: 'Internal strip-out — fixtures, fittings, services',
    raItems: ['RA-MH-001', 'RA-WAH-002', 'RA-DU-002', 'RA-EL-003', 'RA-CH-002'],
    coshhItems: ['COSHH-018'], havsItems: ['HAVS-006', 'HAVS-009'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Pre-strip asbestos survey. R&D survey reviewed.', 'Isolations confirmed for all services.', 'Strip in agreed sequence — top-down typically.', 'Segregate waste streams. Skip strategy.', 'Manual handling — mechanical aids for heavy items.', 'Daily clean-down. Damping for dust.', 'Recovery materials for re-use where practical.', 'Handover for full structural demolition.'],
  },
  {
    id: 'structural-demolition', trade: 'Structural Demolition', category: 'demolition',
    description: 'Full structural demolition by mechanical means',
    raItems: ['RA-WAH-001', 'RA-WAH-006', 'RA-PM-001', 'RA-PM-004', 'RA-DU-001', 'RA-NV-001'],
    coshhItems: ['COSHH-018', 'COSHH-013'], havsItems: ['HAVS-002', 'HAVS-003'], noiseItems: ['NOISE-002', 'NOISE-013'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-ear'],
    defaultDocs: ['method-statement', 'risk-assessment', 'noise'],
    msSteps: ['CCDO-trained operatives. Demolition plan signed off.', 'Hoarding and exclusion zone.', 'Dust suppression — mist cannon or water spray.', 'Demolish in agreed sequence — high reach excavator.', 'Process arisings on-site for re-use. Steel separation.', 'Continuous noise/dust monitoring per consent.', 'Final ground level. Clear arisings.', 'Handover for next phase.'],
  },
  {
    id: 'concrete-cutting', trade: 'Concrete Cutting & Drilling', category: 'demolition',
    description: 'Diamond cutting, core drilling, controlled demolition',
    raItems: ['RA-PM-005', 'RA-DU-001', 'RA-WAH-006', 'RA-GS-001'],
    coshhItems: ['COSHH-013'], havsItems: ['HAVS-024', 'HAVS-028'], noiseItems: ['NOISE-001', 'NOISE-003'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-rpe', 'ppe-ear', 'ppe-glasses'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Drawing review. Services scanned (GPR if structural).', 'Set up wet cutting — no dry methods inside buildings.', 'Mark cut lines. Operative briefing.', 'Execute cuts — diamond saw or core drill.', 'Slurry containment. No mains discharge.', 'Remove cut sections — mechanical aid.', 'Make good edges. Clean up slurry.', 'Handover to next trade.'],
  },

  // ═══ INFRASTRUCTURE — RAIL / MARINE / AVIATION ═══
  {
    id: 'rail-track', trade: 'Rail Track Works (Network Rail)', category: 'infrastructure',
    description: 'Track maintenance, possessions, S&T works',
    raItems: ['RA-TV-001', 'RA-WAH-002', 'RA-EX-001', 'RA-EL-002', 'RA-PM-001'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-002', 'HAVS-011'], noiseItems: ['NOISE-002', 'NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear', 'ppe-glasses'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Sentinel-trained operatives. PTS competence current.', 'COSS / IWA appointed per Rule Book.', 'T2/T3 possession or line blockage as planned.', 'Site briefing pre-shift. Headcount on/off track.', 'Carry out works within possession window.', 'Post-work inspection. P-Way records.', 'Handback signed by COSS.', 'Possession returned per timetable.'],
  },
  {
    id: 'marine-works', trade: 'Marine / Dockyard Works', category: 'infrastructure',
    description: 'Wharf, jetty, harbour construction',
    raItems: ['RA-MA-001', 'RA-WAH-001', 'RA-LO-001', 'RA-EX-002', 'RA-EN-002'],
    coshhItems: ['COSHH-008', 'COSHH-011'], havsItems: ['HAVS-011'], noiseItems: ['NOISE-001', 'NOISE-010'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-harness', 'ppe-lifejacket'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Tide window confirmed. Met office briefing.', 'Lifejackets mandatory. Throw line and rescue plan.', 'Marine traffic management with port authority.', 'Plant on barge — secured for sea state.', 'Carry out works within tidal window.', 'Environmental controls — silt curtains where needed.', 'Daily marine pollution check.', 'Handover with as-built bathymetry.'],
  },
  {
    id: 'airside', trade: 'Airside / Airport Works', category: 'infrastructure',
    description: 'Runway, taxiway, apron construction',
    raItems: ['RA-TV-001', 'RA-PM-001', 'RA-EL-001'],
    coshhItems: ['COSHH-008'], havsItems: ['HAVS-011'], noiseItems: ['NOISE-002', 'NOISE-008'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Airside permit / pass for all operatives.', 'Airfield Driving Permit (ADP) for plant operators.', 'NOTAM / Method of Work agreed with airfield ops.', 'FOD control — every plant inspected before/after.', 'Work to agreed window. Plant clear of airfield by close-out.', 'Surface laying / works as per design.', 'Linemarking and friction test where applicable.', 'Hand over to airfield ops.'],
  },

  // ═══ EXTERNAL — SOFT LANDSCAPING / TREE WORKS ═══
  {
    id: 'soft-landscaping', trade: 'Soft Landscaping & Planting', category: 'external',
    description: 'Topsoil, turf, planting, irrigation',
    raItems: ['RA-MH-001', 'RA-MH-003', 'RA-PM-001', 'RA-EX-001', 'RA-EN-001'],
    coshhItems: ['COSHH-006'], havsItems: ['HAVS-016', 'HAVS-051'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['Site clearance. Subgrade prep.', 'Topsoil import. Distribute to design depth.', 'Turfing or seed sowing per spec.', 'Plant tree pits — root barriers as needed.', 'Irrigation install where specified.', 'Establish maintenance regime.', 'Snag — replace failed plants.', 'Hand over with planting schedule.'],
  },
  {
    id: 'tree-surgery', trade: 'Tree Surgery / Arboriculture', category: 'external',
    description: 'Tree felling, pruning, removal',
    raItems: ['RA-WAH-001', 'RA-PM-001', 'RA-WC-002', 'RA-EN-001'],
    coshhItems: ['COSHH-005'], havsItems: ['HAVS-014', 'HAVS-060'], noiseItems: ['NOISE-014'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves', 'ppe-ear', 'ppe-face-shield'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['City & Guilds NPTC qualified climbers/operators.', 'Tree assessment — TPO / conservation area check.', 'Exclusion zone established. Banksman.', 'Climber harness, second rope, friction hitch.', 'Sectional dismantling — tools tethered.', 'Chipper operation per safe distance rule.', 'Site clearance. Stump grinding if specified.', 'Sign off with works register.'],
  },

  // ═══ MEP EXPANSION ═══
  {
    id: 'sprinklers', trade: 'Sprinkler Installation', category: 'mep',
    description: 'Wet/dry sprinkler systems, BS EN 12845',
    raItems: ['RA-WAH-002', 'RA-MH-001', 'RA-LO-002', 'RA-PM-008'],
    coshhItems: [], havsItems: ['HAVS-006', 'HAVS-022'], noiseItems: ['NOISE-001'],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['LPCB-certified installer. Design certificate confirmed.', 'Pipework runs marked from drawings.', 'Hangers and clips installed first fix.', 'Pipework install — pressed or threaded per spec.', 'Sprinkler heads at design centres.', 'Hydraulic pressure test to 1.5x working pressure.', 'Commissioning per BS EN 12845.', 'LPCB certificate handover.'],
  },
  {
    id: 'data-cabling', trade: 'Data / Structured Cabling', category: 'mep',
    description: 'Cat 6/6A/7, fibre, OM3/4',
    raItems: ['RA-WAH-002', 'RA-EL-003', 'RA-MH-007'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['BICSI / equivalent trained. Cabling design reviewed.', 'Containment route confirmed. Trays installed first.', 'Cable pulling — drum jacks, lubrication.', 'Termination at panels — keystone or RJ45.', 'Patch panels. Labelling per BS EN 50173.', 'Test every cable — Fluke certifier or equivalent.', 'Compile test results.', 'Handover with as-built and test certificates.'],
  },
  {
    id: 'fire-alarm-comm', trade: 'Fire Alarm — Commercial', category: 'mep',
    description: 'L1-L5 fire alarm systems, BS 5839',
    raItems: ['RA-WAH-002', 'RA-EL-003', 'RA-FW-001'],
    coshhItems: [], havsItems: ['HAVS-022'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['BAFE / equivalent certified. Drawings approved.', 'Containment install. Cabling — fire-rated where required.', 'Devices fixed — detectors, sounders, MCPs, beacons.', 'Wiring back to panel. Loop testing.', 'Cause-and-effect commissioning.', 'Tenant briefing — silence/reset procedures.', 'BS 5839 commissioning certificate.', 'Handover to FM.'],
  },
  {
    id: 'gas-install', trade: 'Gas Installation', category: 'mep',
    description: 'Domestic / commercial gas pipework and appliances',
    raItems: ['RA-EL-003', 'RA-CH-001', 'RA-FW-001'],
    coshhItems: ['COSHH-009'], havsItems: ['HAVS-006'], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment', 'coshh'],
    msSteps: ['Gas Safe registered engineer. Notification to GSR.', 'Isolate existing supply. Lock-off.', 'Pipework install per BS 6891.', 'Tightness test pre-commissioning.', 'Commission appliances. Flue gas analysis.', 'Customer briefing on isolation valves.', 'Building regs notification (Cat A).', 'Gas Safety Certificate handover.'],
  },
  {
    id: 'access-control', trade: 'Access Control & CCTV', category: 'mep',
    description: 'Electronic access control, intruder alarms, CCTV',
    raItems: ['RA-WAH-002', 'RA-EL-003'],
    coshhItems: [], havsItems: [], noiseItems: [],
    ppe: ['ppe-hardhat', 'ppe-hivis', 'ppe-boots', 'ppe-gloves'],
    defaultDocs: ['method-statement', 'risk-assessment'],
    msSteps: ['NSI/SSAIB-approved installer. Drawings approved.', 'Cabling install — concealed or in containment.', 'Devices installed — readers, cameras, sounders.', 'Configuration — networks, ACL, time profiles.', 'Customer training on system.', 'Handover with O&M.', 'Service contract details.', 'GDPR compliance for CCTV recording.'],
  },
]
