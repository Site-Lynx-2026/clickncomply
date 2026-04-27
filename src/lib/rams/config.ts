// ═══════════════════════════════════════════════════════════════════════════
// RAMS — CONFIG & TYPES
// Single document, 12 tabbed steps
// Tools drive COSHH/HAVS/Noise assessments automatically
// ═══════════════════════════════════════════════════════════════════════════

// ── RISK MATRIX ──
export const LIKELIHOOD_LABELS: Record<number, string> = {
  1: 'Very Unlikely', 2: 'Unlikely', 3: 'Possible', 4: 'Likely', 5: 'Very Likely',
}
export const SEVERITY_LABELS: Record<number, string> = {
  1: 'Insignificant', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Catastrophic',
}

export function riskScore(l: number, s: number) {
  const score = l * s
  if (score <= 4) return { score, level: 'Low' as const, color: '#16a34a' }
  if (score <= 9) return { score, level: 'Medium' as const, color: '#d97706' }
  if (score <= 15) return { score, level: 'High' as const, color: '#E87722' }
  return { score, level: 'Critical' as const, color: '#dc2626' }
}

// ── HAVS CALC ──
export function calcHAVSPoints(mag: number, hours: number): number {
  if (mag <= 0 || hours <= 0) return 0
  return Math.round((mag / 2.5) * (mag / 2.5) * hours * 100 / 8)
}
export const HAVS_EAV = 100
export const HAVS_ELV = 400

// ── NOISE THRESHOLDS ──
export const NOISE_LOWER_EAV = 80
export const NOISE_UPPER_EAV = 85
export const NOISE_ELV = 87

// ── NOISE LEQ CALC ──
export function calcNoiseLEQ(sources: { db: number; hours: number }[]): number {
  const active = sources.filter(s => s.db > 0 && s.hours > 0)
  if (active.length === 0) return 0
  let dose = 0, totalHours = 0
  active.forEach(s => { dose += s.hours * Math.pow(10, s.db / 10); totalHours += s.hours })
  return totalHours > 0 ? Math.round(10 * Math.log10(dose / totalHours)) : 0
}

// ── FORM DATA SHAPE ──
// Everything lives in one rams_documents.form_data JSONB field

export interface RAMSHazard {
  id: string
  hazard: string
  consequences: string
  whoAtRisk: string
  initialL: number
  initialS: number
  controls: string
  residualL: number
  residualS: number
  fromLibrary?: boolean
  fromAI?: boolean
}

export interface RAMSMethodStep {
  id: string
  stepNumber: number
  description: string
  responsible: string
}

export interface RAMSCOSHHSubstance {
  id: string
  name: string
  sdsRef: string
  exposureRoute: string
  welRef: string
  riskLevel: 'low' | 'medium' | 'high'
  controls: string
}

export interface RAMSHAVSTool {
  id: string
  name: string
  magnitude: number   // m/s²
  hours: number       // daily trigger time
  points: number      // calculated
}

export interface RAMSNoiseTool {
  id: string
  name: string
  db: number
  hours: number
}

export interface RAMSSignoff {
  id: string
  name: string
  role: string
  signature: string
  timestamp: string
  lat: number | null
  lng: number | null
  status: 'signed' | 'sent' | 'pending'
  token?: string
}

export interface RAMSFormData {
  // Step 1: Project info
  clientId: string
  clientName: string
  clientEmail: string
  siteId: string
  siteName: string
  siteAddress: string
  taskId: string
  title: string
  description: string
  revision: string
  dateOfWorks: string
  locationOfWorks: string
  duration: string
  welfare: string
  environmental: string

  // Step 2: Method statement
  methodSteps: RAMSMethodStep[]

  // Step 3: PPE
  ppe: string[]          // PPE item IDs
  ppeCustom: string[]

  // Step 4: Power tools
  powerTools: string[]   // Power tool IDs
  powerToolVoltages: Record<string, string>  // toolId → voltage
  powerToolsCustom: string

  // Step 5: Hand tools
  generalHandTools: boolean
  specialistHandTools: string[]  // hand tool IDs
  handToolsCustom: string

  // Step 6: Plant & equipment
  plant: string[]        // Plant item IDs
  plantSplits: Record<string, string>  // categoryId → splitOptionId
  plantCustom: string

  // Step 7: Emergency
  emergency: {
    firstAid: string
    fireProc: string
    assemblyPoint: string
    nearestAE: string
    emergencyContacts: string
  }

  // Step 8: Risk assessment
  hazards: RAMSHazard[]

  // Step 9: COSHH
  coshhSubstances: RAMSCOSHHSubstance[]

  // Step 10: HAVS
  havsTools: RAMSHAVSTool[]
  havsControls: string

  // Step 11: Noise
  noiseTools: RAMSNoiseTool[]
  noiseZones: string
  noiseProtection: string
  noiseControls: string

  // Step 12: Review & sign
  preparedBy: string
  preparedByRole: string
  preparedByPhone: string
  printName: string
  crewSignoffs: RAMSSignoff[]
  competencies: string[]
}

export function createEmptyRAMS(): RAMSFormData {
  return {
    clientId: '', clientName: '', clientEmail: '', siteId: '', siteName: '', siteAddress: '', taskId: '',
    title: '', description: '', revision: '1', dateOfWorks: '', locationOfWorks: '', duration: '',
    welfare: 'Welfare facilities provided on site including: toilet, washing facilities with hot and cold water, drying room, rest area with seating, drinking water, and heating facilities for food.',
    environmental: 'All waste segregated on site. Licensed waste carrier for removal. No burning of materials. Work limited to agreed hours. Water suppression and damping down as required.',
    methodSteps: [],
    ppe: ['ppe-hardhat', 'ppe-boots', 'ppe-hivis', 'ppe-gloves'], ppeCustom: [],
    powerTools: [], powerToolVoltages: {}, powerToolsCustom: '',
    generalHandTools: true, specialistHandTools: [], handToolsCustom: '',
    plant: [], plantSplits: {}, plantCustom: '',
    emergency: {
      firstAid: 'Qualified first aider on site at all times. First aid kit located in the site office.',
      fireProc: 'Raise the alarm, evacuate via nearest safe route to the assembly point. Do not attempt to fight the fire unless trained. Call 999.',
      assemblyPoint: 'As designated on site induction plan.',
      nearestAE: '', emergencyContacts: '',
    },
    hazards: [],
    coshhSubstances: [],
    havsTools: [], havsControls: '',
    noiseTools: [], noiseZones: '', noiseProtection: '', noiseControls: '',
    preparedBy: '', preparedByRole: '', preparedByPhone: '', printName: '',
    crewSignoffs: [], competencies: [],
  }
}

// ── STEP DEFINITIONS ──
export const RAMS_STEPS = [
  { num: 1, label: 'Project Info' },
  { num: 2, label: 'Method Statement' },
  { num: 3, label: 'PPE' },
  { num: 4, label: 'Power Tools' },
  { num: 5, label: 'Hand Tools' },
  { num: 6, label: 'Plant & Equipment' },
  { num: 7, label: 'Emergency' },
  { num: 8, label: 'Risk Assessment' },
  { num: 9, label: 'COSHH' },
  { num: 10, label: 'HAVS' },
  { num: 11, label: 'Noise' },
  { num: 12, label: 'Review & Sign' },
] as const
