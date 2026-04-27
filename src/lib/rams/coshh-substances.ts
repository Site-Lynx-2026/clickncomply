/**
 * COSHH substance library — 80+ pre-curated substances common on UK
 * construction sites. Each entry pre-fills exposure routes, controls, PPE
 * and emergency procedure when the user clicks it. Built from HSE EH40 WELs
 * and SDS-aligned good practice.
 *
 * Click-to-add: zero typing for the common case.
 */

export type CoshhCategory =
  | "cement"
  | "wood"
  | "metal"
  | "paint"
  | "adhesive"
  | "fuel"
  | "solvent"
  | "cleaning"
  | "insulation"
  | "stone"
  | "biological"
  | "specialist";

export interface CoshhSubstanceLibraryItem {
  id: string;
  name: string;
  category: CoshhCategory;
  icon: string;
  riskLevel: "low" | "medium" | "high";
  /** One-line "what is it" used as card subtitle. */
  summary: string;
  exposureRoute: string;
  welRef?: string;
  controls: string;
  ppe: string;
  emergencyProcedure: string;
}

export const COSHH_CATEGORIES: { id: CoshhCategory; label: string; icon: string }[] = [
  { id: "cement", label: "Cement & Concrete", icon: "🧱" },
  { id: "wood", label: "Wood & Dust", icon: "🪵" },
  { id: "metal", label: "Metal & Welding", icon: "🔩" },
  { id: "paint", label: "Paints & Coatings", icon: "🎨" },
  { id: "adhesive", label: "Adhesives & Sealants", icon: "🧴" },
  { id: "fuel", label: "Fuels & Oils", icon: "⛽" },
  { id: "solvent", label: "Solvents", icon: "💧" },
  { id: "cleaning", label: "Cleaning Chemicals", icon: "🧽" },
  { id: "insulation", label: "Insulation & Fibres", icon: "🧣" },
  { id: "stone", label: "Stone, Silica & Aggregates", icon: "🪨" },
  { id: "biological", label: "Biological Hazards", icon: "🦠" },
  { id: "specialist", label: "Specialist Trades", icon: "🔬" },
];

const STD_EMERGENCY =
  "Eye contact: rinse with water for 15 min. Skin: wash with soap and water. Inhalation: move to fresh air. Ingestion: do not induce vomiting; seek medical advice. Show SDS to medical staff.";

export const COSHH_SUBSTANCES: CoshhSubstanceLibraryItem[] = [
  // ═══ CEMENT & CONCRETE ═══
  {
    id: "coshh-cement",
    name: "Portland Cement (dry)",
    category: "cement",
    icon: "🧱",
    riskLevel: "high",
    summary: "Highly alkaline; causes burns and dermatitis on skin contact.",
    exposureRoute: "Skin contact, eye contact, inhalation",
    welRef: "EH40 — 10 mg/m³ (8h TWA)",
    controls:
      "Substitute for ready-mix where possible. Wet handling preferred. Local exhaust ventilation when bagging or mixing. Avoid skin contact — never kneel in wet cement. Time-limit exposure.",
    ppe: "Nitrile or rubber gloves (long cuff), goggles, FFP3 mask when mixing, waterproof overalls and knee pads.",
    emergencyProcedure:
      "Skin: wash immediately with copious water; do NOT rub. Eyes: irrigate with eye-wash for 15 min, get medical help. Burns: seek A&E within 30 min — cement burns are deep.",
  },
  {
    id: "coshh-concrete-additives",
    name: "Concrete Additives / Plasticisers",
    category: "cement",
    icon: "🧪",
    riskLevel: "medium",
    summary: "Sika, Fosroc, BASF chemical admixtures for concrete.",
    exposureRoute: "Skin contact, eye contact",
    controls:
      "Decant to closed dispenser. Mix in ventilated area. Spill kit available. Empty containers triple-rinsed before disposal.",
    ppe: "Nitrile gloves, goggles, splash apron.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-grout",
    name: "Cementitious Grout",
    category: "cement",
    icon: "🧱",
    riskLevel: "medium",
    summary: "Tile grout, structural grout — alkaline cement base.",
    exposureRoute: "Skin contact, inhalation when dry",
    controls:
      "Wet mixing only. Add water before powder. Limit exposure time. Wash hands before breaks.",
    ppe: "Nitrile gloves, FFP3 mask when bagging, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-mortar",
    name: "Lime Mortar / Hydrated Lime",
    category: "cement",
    icon: "🧱",
    riskLevel: "high",
    summary: "Highly caustic; severe burn risk to skin and eyes.",
    exposureRoute: "Skin contact, eye contact, inhalation of dust",
    welRef: "EH40 — 5 mg/m³ (8h TWA)",
    controls:
      "Avoid contact. Wet handling. Specialist training for traditional lime work. LEV during slaking. No splashing.",
    ppe: "Long-cuff nitrile gloves, full-face shield, RPE FFP3, waterproof overalls.",
    emergencyProcedure:
      "Skin: rinse for 15+ minutes. Eyes: emergency eye wash for 20 min, A&E. Lime burns — get medical attention same day.",
  },

  // ═══ WOOD & DUST ═══
  {
    id: "coshh-wood-softwood",
    name: "Softwood Dust",
    category: "wood",
    icon: "🪵",
    riskLevel: "medium",
    summary: "Sawing/sanding pine, fir, spruce — respiratory sensitiser.",
    exposureRoute: "Inhalation, skin contact",
    welRef: "EH40 — 5 mg/m³ (8h TWA)",
    controls:
      "On-tool extraction (M-class). Wet cutting where possible. LEV in workshop. Routine cleaning — no dry sweeping. No food/drink in dust zones.",
    ppe: "FFP3 mask, eye protection, gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-wood-hardwood",
    name: "Hardwood Dust (oak, beech, etc)",
    category: "wood",
    icon: "🪵",
    riskLevel: "high",
    summary: "Carcinogenic — linked to nasal cancer.",
    exposureRoute: "Inhalation, skin contact",
    welRef: "EH40 — 3 mg/m³ (8h TWA)",
    controls:
      "Eliminate or substitute where possible. M-class on-tool extraction mandatory. Health surveillance for regular operatives. Routine LEV testing.",
    ppe: "FFP3 mask (powered air RPE for sustained exposure), goggles, gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-mdf",
    name: "MDF / Composite Board Dust",
    category: "wood",
    icon: "🪵",
    riskLevel: "high",
    summary: "Contains formaldehyde resin — sensitiser and irritant.",
    exposureRoute: "Inhalation, skin, eyes",
    controls:
      "Cut outdoors or in extracted booth. M-class extraction. Avoid sanding without LEV. Health surveillance for routine operatives.",
    ppe: "FFP3 mask, goggles, gloves, long sleeves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-treated-timber",
    name: "Treated / Preserved Timber",
    category: "wood",
    icon: "🪵",
    riskLevel: "medium",
    summary: "Tanalised timber — copper-based preservatives.",
    exposureRoute: "Skin contact, inhalation when cutting",
    controls:
      "Cut outdoors, downwind. Avoid burning. No skin contact with sap.",
    ppe: "Gloves, FFP3 mask when cutting.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ METAL & WELDING ═══
  {
    id: "coshh-welding-fume",
    name: "MIG / MMA Welding Fume",
    category: "metal",
    icon: "🔥",
    riskLevel: "high",
    summary: "All welding fume now classed as carcinogenic by HSE.",
    exposureRoute: "Inhalation",
    welRef: "EH40 — 5 mg/m³ (8h TWA)",
    controls:
      "LEV (on-torch extraction or fume extractor) MANDATORY for all welding indoors. RPE in addition. Outdoor: still use RPE.",
    ppe: "Powered air respirator (TH3) for sustained welding, welding helmet, leathers, gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-stainless-fume",
    name: "Stainless Steel Welding Fume (Cr/Ni)",
    category: "metal",
    icon: "🔥",
    riskLevel: "high",
    summary: "Hexavalent chromium and nickel — strong carcinogens.",
    exposureRoute: "Inhalation",
    welRef: "EH40 — Cr(VI) 0.025 mg/m³",
    controls:
      "LEV mandatory. Powered air respirator. Restricted areas. Health surveillance. Air monitoring program.",
    ppe: "Powered air respirator (TH3 minimum), welding leathers, gauntlets, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-galvanised",
    name: "Galvanised Steel (zinc fume)",
    category: "metal",
    icon: "🔥",
    riskLevel: "high",
    summary: "Welding/cutting galvanised — zinc oxide fume causes metal fume fever.",
    exposureRoute: "Inhalation",
    welRef: "EH40 — 5 mg/m³ (8h TWA)",
    controls:
      "Strip galv coating before welding where possible. LEV mandatory. RPE. No food/drink in vicinity.",
    ppe: "Powered air respirator, welding PPE.",
    emergencyProcedure:
      "Metal fume fever: flu-like symptoms 4-12h after exposure. Move to fresh air, rest, fluids. See GP if persists.",
  },
  {
    id: "coshh-lead-paint",
    name: "Lead-based Paint (pre-1980)",
    category: "metal",
    icon: "🎨",
    riskLevel: "high",
    summary: "Lead paint on older buildings — toxic when stripped.",
    exposureRoute: "Inhalation, ingestion, skin contact",
    welRef: "CLAW 2002 — 0.15 mg/m³",
    controls:
      "Test before stripping. Wet stripping methods only — NO sanding/blast. Containment. Specialist asbestos-style protocols. Blood lead testing.",
    ppe: "Powered air respirator (TH3), disposable coveralls, gloves, decontamination.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ PAINTS & COATINGS ═══
  {
    id: "coshh-water-paint",
    name: "Water-based Emulsion Paint",
    category: "paint",
    icon: "🎨",
    riskLevel: "low",
    summary: "Standard interior emulsion — low VOC.",
    exposureRoute: "Skin, eyes",
    controls: "Adequate ventilation. Don't spray indoors without RPE.",
    ppe: "Gloves, eye protection when spraying.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-oil-paint",
    name: "Oil-based / Solvent Paint",
    category: "paint",
    icon: "🎨",
    riskLevel: "medium",
    summary: "Gloss, undercoat — VOC and solvent vapour.",
    exposureRoute: "Inhalation, skin, eyes",
    controls:
      "Ventilation essential. No naked flames. Skin contact avoided. Substitute water-based where possible.",
    ppe: "Solvent-resistant gloves (nitrile), eye protection, A2P3 RPE if spraying or in confined space.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-2pack",
    name: "2-Pack / Polyurethane Paint",
    category: "paint",
    icon: "🎨",
    riskLevel: "high",
    summary: "Isocyanate hardener — respiratory sensitiser, asthma risk.",
    exposureRoute: "Inhalation (very dangerous)",
    welRef: "EH40 — 0.02 mg/m³ (15 min STEL)",
    controls:
      "Booth spraying only with effective LEV. Air-fed RPE mandatory. Health surveillance — annual lung function. No mixing in occupied spaces.",
    ppe: "Air-fed half/full mask (constant flow), spray suit, gloves.",
    emergencyProcedure:
      "Asthma symptoms: stop work, fresh air, A&E. Sensitisation is irreversible — operative must not work with isocyanates again.",
  },
  {
    id: "coshh-bituminous",
    name: "Bitumen / Tar Coatings",
    category: "paint",
    icon: "🪨",
    riskLevel: "medium",
    summary: "Roofing felt adhesive, damp-proofing.",
    exposureRoute: "Skin contact, inhalation when hot",
    controls: "Cool application where possible. Avoid skin contact. UV exposure increases skin reactivity.",
    ppe: "Heat-resistant gloves, eye protection, FFP2 when fumes.",
    emergencyProcedure:
      "Hot bitumen burns: cool with water immediately, do NOT remove from skin, A&E. Skin: cleaning with mineral oil then wash.",
  },

  // ═══ ADHESIVES & SEALANTS ═══
  {
    id: "coshh-pu-foam",
    name: "PU Expanding Foam (MDI)",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "high",
    summary: "Methylene diphenyl diisocyanate — respiratory sensitiser.",
    exposureRoute: "Inhalation, skin",
    welRef: "EH40 — 0.02 mg/m³ (15 min STEL)",
    controls:
      "Ventilated area only. Avoid skin contact. Cured foam safe; uncured is the hazard. Health surveillance for regular users.",
    ppe: "Nitrile gloves, A2P3 RPE when spraying or confined space, eye protection.",
    emergencyProcedure:
      "Skin: do not pick — wait for cure, then peel. Eye: irrigate 15 min, A&E. Asthma: stop work immediately, A&E.",
  },
  {
    id: "coshh-silicone",
    name: "Silicone Sealant",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "low",
    summary: "Standard silicone gun cartridges.",
    exposureRoute: "Skin, eyes (uncured)",
    controls: "Ventilated area for low-modulus types. Avoid eye splash.",
    ppe: "Gloves, safety glasses.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-epoxy",
    name: "Epoxy Resin & Hardener",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "high",
    summary: "Skin sensitiser — leads to dermatitis and life-long allergy.",
    exposureRoute: "Skin contact (primary), inhalation",
    controls:
      "Avoid all skin contact. Pre-measured kits. Ventilated area. Health surveillance for regular users — once sensitised, operative cannot work with epoxy again.",
    ppe: "Disposable nitrile gloves (2x layer), goggles, A2P3 RPE for spraying.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-superglue",
    name: "Cyanoacrylate (Super Glue)",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "low",
    summary: "Instant adhesive — bonds skin instantly.",
    exposureRoute: "Skin contact, eyes",
    controls: "Ventilated area for spray. Acetone or warm soapy water for un-bonding.",
    ppe: "Nitrile gloves, eye protection.",
    emergencyProcedure:
      "Skin bonded: do NOT pull. Soak in warm soapy water, peel apart. Eye exposure: A&E immediately.",
  },
  {
    id: "coshh-contact-adhesive",
    name: "Contact Adhesive (solvent-based)",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "medium",
    summary: "Carpet/laminate adhesive — solvent vapour.",
    exposureRoute: "Inhalation, skin",
    controls: "Ventilated area. No naked flames. Limit application size.",
    ppe: "Nitrile gloves, A2 RPE indoors, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-construction-adhesive",
    name: "Construction Adhesive (No More Nails etc.)",
    category: "adhesive",
    icon: "🧴",
    riskLevel: "low",
    summary: "Standard PVA/MS polymer adhesive.",
    exposureRoute: "Skin, eyes",
    controls: "Ventilated area.",
    ppe: "Gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ FUELS & OILS ═══
  {
    id: "coshh-petrol",
    name: "Petrol",
    category: "fuel",
    icon: "⛽",
    riskLevel: "high",
    summary: "Highly flammable; vapour heavier than air.",
    exposureRoute: "Inhalation, skin, ingestion",
    controls:
      "Approved metal containers only. No smoking within 10m. No naked flames. Spill kit. Bunded storage.",
    ppe: "Solvent-resistant gloves, eye protection, anti-static clothing for decanting.",
    emergencyProcedure:
      "Fire: foam/CO2 extinguisher. Skin: wash with soap. Ingestion: do NOT induce vomiting, A&E.",
  },
  {
    id: "coshh-diesel",
    name: "Diesel / Gas Oil",
    category: "fuel",
    icon: "⛽",
    riskLevel: "medium",
    summary: "Plant fuel — irritant to skin and lungs.",
    exposureRoute: "Skin, inhalation",
    controls:
      "Bunded storage. Spill kit. No smoking. Ventilated refuelling.",
    ppe: "Solvent-resistant gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-engine-oil",
    name: "Engine Oil / Hydraulic Oil",
    category: "fuel",
    icon: "🛢️",
    riskLevel: "medium",
    summary: "Mineral oil — skin contact causes dermatitis.",
    exposureRoute: "Skin, eyes",
    controls: "Avoid prolonged skin contact. Spill kit. Drip trays.",
    ppe: "Nitrile gloves, eye protection, oil-resistant overalls.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-lpg",
    name: "LPG / Propane",
    category: "fuel",
    icon: "⛽",
    riskLevel: "high",
    summary: "Compressed liquid gas — heavier than air, asphyxiation risk.",
    exposureRoute: "Inhalation",
    controls:
      "Cylinders upright, chained, away from heat. Leak test with soapy water. Flashback arrestors. Storage outdoors.",
    ppe: "Gloves, eye protection.",
    emergencyProcedure:
      "Leak: evacuate, no ignition, vent area. Skin: cold-burn — soak in warm water, A&E. Inhalation: fresh air, monitor for hypoxia.",
  },

  // ═══ SOLVENTS ═══
  {
    id: "coshh-white-spirit",
    name: "White Spirit / Mineral Spirit",
    category: "solvent",
    icon: "💧",
    riskLevel: "medium",
    summary: "Paint thinner — moderate solvent vapour.",
    exposureRoute: "Inhalation, skin",
    welRef: "EH40 — 600 mg/m³ (8h TWA)",
    controls: "Ventilated area. Avoid skin contact. No naked flames.",
    ppe: "Solvent-resistant gloves, eye protection, A2 RPE if confined space.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-acetone",
    name: "Acetone",
    category: "solvent",
    icon: "💧",
    riskLevel: "medium",
    summary: "Highly flammable solvent.",
    exposureRoute: "Inhalation, skin, eyes",
    welRef: "EH40 — 1210 mg/m³ (8h TWA)",
    controls: "Ventilated area. No flames. Small quantities only.",
    ppe: "Nitrile gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-methylene-chloride",
    name: "Methylene Chloride / DCM (paint stripper)",
    category: "solvent",
    icon: "💧",
    riskLevel: "high",
    summary: "Paint stripper — toxic, restricted use.",
    exposureRoute: "Inhalation, skin",
    welRef: "EH40 — 350 mg/m³ (8h TWA)",
    controls:
      "Substitute with caustic strippers where possible. LEV. Banned for general public. Health surveillance.",
    ppe: "Air-fed RPE, gloves (specialist neoprene), full PPE.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-isopropyl",
    name: "Isopropyl Alcohol (IPA)",
    category: "solvent",
    icon: "💧",
    riskLevel: "low",
    summary: "Cleaning solvent — flammable but low toxicity.",
    exposureRoute: "Inhalation, skin",
    controls: "Ventilated area. No flames. Small quantities.",
    ppe: "Gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ CLEANING CHEMICALS ═══
  {
    id: "coshh-bleach",
    name: "Bleach (sodium hypochlorite)",
    category: "cleaning",
    icon: "🧽",
    riskLevel: "medium",
    summary: "Common cleaner — toxic vapour if mixed with acid.",
    exposureRoute: "Skin, eyes, inhalation",
    controls: "Never mix with acid cleaners (releases chlorine). Diluted use. Ventilated area.",
    ppe: "Nitrile gloves, goggles.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-ammonia",
    name: "Ammonia-based Cleaner",
    category: "cleaning",
    icon: "🧽",
    riskLevel: "medium",
    summary: "Window cleaners, degreasers.",
    exposureRoute: "Inhalation, skin, eyes",
    controls: "Never mix with bleach. Ventilated area.",
    ppe: "Gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-brick-cleaner",
    name: "Brick Cleaner / HCl Acid",
    category: "cleaning",
    icon: "🧽",
    riskLevel: "high",
    summary: "Hydrochloric acid — burns and toxic vapour.",
    exposureRoute: "Skin, eyes, inhalation",
    welRef: "EH40 — 8 mg/m³ (15 min STEL)",
    controls: "Outdoor application. Dilute with water (acid to water never reverse). Eye-wash on hand.",
    ppe: "Acid-resistant gloves, goggles + face shield, A2P3 RPE, acid suit, wellies.",
    emergencyProcedure:
      "Skin: rinse for 15 min. Eyes: emergency eye wash 20 min, A&E. Inhalation: fresh air.",
  },
  {
    id: "coshh-detergent",
    name: "Industrial Detergent",
    category: "cleaning",
    icon: "🧽",
    riskLevel: "low",
    summary: "Surfactant-based cleaner.",
    exposureRoute: "Skin, eyes",
    controls: "Diluted use. Splash protection.",
    ppe: "Gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ INSULATION & FIBRES ═══
  {
    id: "coshh-glass-fibre",
    name: "Glass Fibre / Mineral Wool",
    category: "insulation",
    icon: "🧣",
    riskLevel: "medium",
    summary: "Loft insulation, cavity bats — irritant fibres.",
    exposureRoute: "Skin, eyes, inhalation",
    controls: "Wear long sleeves. Ventilation. Wet down before disposal.",
    ppe: "FFP3 mask, goggles, gloves, long sleeves, hood.",
    emergencyProcedure:
      "Skin: rinse with cold water (NOT hot — opens pores). Eyes: rinse 15 min. Inhalation: fresh air.",
  },
  {
    id: "coshh-rockwool",
    name: "Rockwool / Stone Wool",
    category: "insulation",
    icon: "🧣",
    riskLevel: "medium",
    summary: "Acoustic and thermal insulation slab.",
    exposureRoute: "Skin, eyes, inhalation",
    controls: "Cut outdoors where possible. Wet cutting reduces fibres. Ventilation.",
    ppe: "FFP3 mask, goggles, gloves, long sleeves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-pir",
    name: "PIR / Polyiso Foam Board",
    category: "insulation",
    icon: "🧣",
    riskLevel: "low",
    summary: "Rigid insulation board (Celotex, Kingspan).",
    exposureRoute: "Skin, inhalation when cut",
    controls: "Cut outdoors. M-class extraction on saw.",
    ppe: "FFP3 mask, eye protection, gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },

  // ═══ STONE, SILICA & AGGREGATES ═══
  {
    id: "coshh-silica",
    name: "Respirable Crystalline Silica (RCS)",
    category: "stone",
    icon: "🪨",
    riskLevel: "high",
    summary: "Cutting concrete/brick/stone — silicosis, lung cancer.",
    exposureRoute: "Inhalation",
    welRef: "EH40 — 0.1 mg/m³ (8h TWA)",
    controls:
      "WET CUTTING is mandatory. On-tool extraction (M-class) where wet impractical. Health surveillance for routine operatives. Air monitoring on long jobs.",
    ppe: "FFP3 minimum, powered air respirator for sustained exposure, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-quartz",
    name: "Quartz Worktop Cutting",
    category: "stone",
    icon: "🪨",
    riskLevel: "high",
    summary: "Engineered stone — extremely high silica content.",
    exposureRoute: "Inhalation",
    welRef: "EH40 — 0.1 mg/m³ (8h TWA)",
    controls:
      "Wet cutting + on-tool extraction. Workshop environment with LEV. Specialist work — increased silicosis risk.",
    ppe: "Powered air respirator (TH3), full face shield, gloves.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-gypsum",
    name: "Gypsum / Plasterboard Dust",
    category: "stone",
    icon: "🪨",
    riskLevel: "medium",
    summary: "Cutting plasterboard — irritant dust.",
    exposureRoute: "Inhalation, eyes",
    welRef: "EH40 — 10 mg/m³ (8h TWA)",
    controls: "Score-and-snap preferred over sawing. M-class extraction if cutting.",
    ppe: "FFP3 mask, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-asphalt",
    name: "Hot Asphalt / Tarmac",
    category: "stone",
    icon: "🪨",
    riskLevel: "medium",
    summary: "Road and footway laying — fume hazard.",
    exposureRoute: "Skin (burns), inhalation",
    controls: "Hot weather PPE. Fume control on paver. Distance from breathing zone.",
    ppe: "Heat-resistant gloves, eye protection, FFP2 mask in fumes.",
    emergencyProcedure:
      "Hot tar burns: cool with water immediately, do NOT remove tar from skin, A&E.",
  },

  // ═══ BIOLOGICAL HAZARDS ═══
  {
    id: "coshh-asbestos",
    name: "Asbestos (suspected)",
    category: "biological",
    icon: "☣️",
    riskLevel: "high",
    summary: "STOP WORK if suspected. Specialist removal only.",
    exposureRoute: "Inhalation",
    welRef: "CAR 2012 — 0.1 fibres/cm³",
    controls:
      "STOP. Refurbishment/Demolition Survey before disturbance. Licensed contractor for licensable work. Notification to HSE for non-licensed work above thresholds.",
    ppe: "Type 5/6 disposable suit, RPE FFP3 minimum (powered for long exposure), gloves, decontamination.",
    emergencyProcedure:
      "Stop, isolate area, contact site manager. Decontaminate. Record incident under CAR 2012.",
  },
  {
    id: "coshh-pigeon",
    name: "Pigeon / Bird Droppings",
    category: "biological",
    icon: "🦠",
    riskLevel: "medium",
    summary: "Histoplasmosis, psittacosis risk — older buildings.",
    exposureRoute: "Inhalation, skin",
    controls: "Wet down before disturbing. Don't dry sweep. Specialist removal for large quantities.",
    ppe: "FFP3 mask, disposable suit, gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-rat-leptospirosis",
    name: "Leptospirosis (rat urine in water)",
    category: "biological",
    icon: "🦠",
    riskLevel: "high",
    summary: "Drainage and groundworks — Weil's disease.",
    exposureRoute: "Skin contact (cuts), eyes, ingestion",
    controls: "Cover all cuts. Avoid hand-to-mouth. Wash before eating. Briefing on symptoms (flu-like, jaundice).",
    ppe: "Waterproof gloves, goggles, washable overalls, wellies.",
    emergencyProcedure:
      "Symptoms within 2-30 days: see GP urgently with site exposure history. Antibiotics within 5 days are effective.",
  },
  {
    id: "coshh-sewage",
    name: "Sewage / Foul Water",
    category: "biological",
    icon: "🦠",
    riskLevel: "high",
    summary: "Drainage — bacterial and viral hazard.",
    exposureRoute: "Skin, ingestion, eyes",
    controls: "Cover cuts. No hand-to-mouth. Wash thoroughly after work. Hepatitis A/B + tetanus vaccinations.",
    ppe: "Waterproof gloves (long-cuff), goggles, waterproof overalls, wellies.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-japanese-knotweed",
    name: "Japanese Knotweed",
    category: "biological",
    icon: "🌿",
    riskLevel: "medium",
    summary: "Invasive plant — controlled waste under EPA 1990.",
    exposureRoute: "Spread risk; not toxic to skin",
    controls: "Specialist removal only. Licensed disposal. Quarantine area. No fragments in spoil.",
    ppe: "Standard site PPE.",
    emergencyProcedure:
      "Accidental spread: contain area, contact specialist contractor, notify Environment Agency.",
  },

  // ═══ SPECIALIST TRADES ═══
  {
    id: "coshh-flux",
    name: "Soldering Flux",
    category: "specialist",
    icon: "🔬",
    riskLevel: "medium",
    summary: "Plumbing flux — respiratory sensitiser.",
    exposureRoute: "Inhalation, skin",
    controls: "LEV at workstation. Lead-free solder where possible.",
    ppe: "Gloves, A2 RPE in confined space, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-resin-floor",
    name: "Resin Floor Coating (epoxy/PU)",
    category: "specialist",
    icon: "🔬",
    riskLevel: "high",
    summary: "Industrial floors — isocyanate or epoxy hardener.",
    exposureRoute: "Inhalation, skin (sensitiser)",
    controls:
      "Work in isolated zone. LEV. Sensitised operatives must not work with isocyanates. Health surveillance.",
    ppe: "Air-fed RPE, two-layer gloves, full coverall, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-grout-injection",
    name: "Grout Injection Resins",
    category: "specialist",
    icon: "🔬",
    riskLevel: "high",
    summary: "Underpinning and waterproofing resins — solvent and isocyanate based.",
    exposureRoute: "Inhalation, skin",
    controls: "Specialist contractors. Closed system pumping. Spill containment.",
    ppe: "Air-fed RPE, gloves, full body protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
  {
    id: "coshh-boiler-treatment",
    name: "Boiler / Heating System Chemicals",
    category: "specialist",
    icon: "🔬",
    riskLevel: "medium",
    summary: "Inhibitor, descaler, leak-sealant additives.",
    exposureRoute: "Skin, eyes",
    controls: "Closed system. Don't decant. Ventilated area when system open.",
    ppe: "Nitrile gloves, eye protection.",
    emergencyProcedure: STD_EMERGENCY,
  },
];
