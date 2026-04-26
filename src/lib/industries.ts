/**
 * Industry registry — every industry ClickNComply targets.
 * Grouped by category. Used by the onboarding wizard to silently tag the user
 * and drive framework recommendations on the dashboard.
 *
 * 70+ options. We aim to be the SaaS that "has everyone's industry."
 */

export interface IndustryOption {
  slug: string;
  label: string;
  // Suggested frameworks for users in this industry (used for nudges later)
  suggestedFrameworks?: string[];
}

export interface IndustryGroup {
  label: string;
  industries: IndustryOption[];
}

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  {
    label: "Construction & Built Environment",
    industries: [
      { slug: "arch-metalwork", label: "Architectural metalwork", suggestedFrameworks: ["bs-en-1090", "iso-9001", "chas"] },
      { slug: "structural-steel", label: "Structural steelwork", suggestedFrameworks: ["bs-en-1090", "iso-9001", "chas"] },
      { slug: "steel-erection", label: "Steel erection", suggestedFrameworks: ["chas", "cdm-2015"] },
      { slug: "civils-groundworks", label: "Civils — groundworks", suggestedFrameworks: ["chas", "cdm-2015"] },
      { slug: "civils-drainage", label: "Civils — drainage", suggestedFrameworks: ["chas", "cdm-2015"] },
      { slug: "civils-highways", label: "Civils — highways", suggestedFrameworks: ["chas", "iso-9001"] },
      { slug: "civils-utilities", label: "Civils — utilities", suggestedFrameworks: ["chas", "iso-9001"] },
      { slug: "concrete", label: "Concrete works", suggestedFrameworks: ["chas", "iso-9001"] },
      { slug: "demolition", label: "Demolition", suggestedFrameworks: ["chas", "cdm-2015"] },
      { slug: "asbestos", label: "Asbestos removal", suggestedFrameworks: ["chas", "iso-45001"] },
      { slug: "roofing-commercial", label: "Roofing — commercial", suggestedFrameworks: ["chas", "iso-9001"] },
      { slug: "roofing-residential", label: "Roofing — residential", suggestedFrameworks: ["chas"] },
      { slug: "cladding", label: "Cladding & curtain walling", suggestedFrameworks: ["bs-en-1090", "iso-9001"] },
      { slug: "glazing", label: "Glazing", suggestedFrameworks: ["chas", "iso-9001"] },
      { slug: "plastering", label: "Plastering & drywall" },
      { slug: "painting", label: "Painting & decorating" },
      { slug: "brickwork", label: "Brickwork & masonry" },
      { slug: "carpentry", label: "Carpentry & joinery" },
      { slug: "tiling", label: "Tiling" },
      { slug: "flooring", label: "Flooring" },
      { slug: "insulation", label: "Insulation" },
      { slug: "scaffolding", label: "Scaffolding", suggestedFrameworks: ["chas", "iso-45001"] },
      { slug: "plant-operators", label: "Plant operators / lifting" },
      { slug: "plant-hire", label: "Plant & tool hire" },
    ],
  },
  {
    label: "M&E Services",
    industries: [
      { slug: "electrical-commercial", label: "Electrical — commercial", suggestedFrameworks: ["iso-9001", "iso-45001"] },
      { slug: "electrical-industrial", label: "Electrical — industrial" },
      { slug: "electrical-domestic", label: "Electrical — domestic" },
      { slug: "electrical-testing", label: "Electrical testing & inspection" },
      { slug: "plumbing", label: "Plumbing" },
      { slug: "heating-gas", label: "Heating & gas" },
      { slug: "ventilation", label: "Ventilation" },
      { slug: "aircon", label: "Air conditioning" },
      { slug: "refrigeration", label: "Refrigeration" },
      { slug: "fire-sprinkler", label: "Fire sprinkler" },
      { slug: "fire-alarm", label: "Fire alarm" },
      { slug: "security", label: "Security systems" },
      { slug: "bms", label: "BMS / controls" },
      { slug: "av-data", label: "AV / data cabling" },
    ],
  },
  {
    label: "Specialist Construction",
    industries: [
      { slug: "rail", label: "Rail works", suggestedFrameworks: ["iso-9001", "iso-45001"] },
      { slug: "aviation", label: "Aviation infrastructure" },
      { slug: "marine", label: "Marine / dock" },
      { slug: "telecoms", label: "Telecoms / 5G" },
      { slug: "substations", label: "Substation works" },
      { slug: "overhead-lines", label: "Overhead lines" },
      { slug: "wind-turbine", label: "Wind turbine installation" },
      { slug: "solar-pv", label: "Solar PV installation" },
      { slug: "ev-charging", label: "EV charging installation" },
      { slug: "heritage", label: "Heritage & restoration" },
    ],
  },
  {
    label: "Manufacturing & Engineering",
    industries: [
      { slug: "heavy-engineering", label: "Heavy engineering", suggestedFrameworks: ["iso-9001", "bs-en-1090"] },
      { slug: "light-fabrication", label: "Light fabrication", suggestedFrameworks: ["iso-9001", "bs-en-1090"] },
      { slug: "precision-engineering", label: "Precision engineering", suggestedFrameworks: ["iso-9001"] },
      { slug: "plastics-composites", label: "Plastics & composites" },
      { slug: "coatings", label: "Coatings" },
      { slug: "electronics", label: "Electronics" },
      { slug: "aerospace", label: "Aerospace components", suggestedFrameworks: ["iso-9001"] },
      { slug: "automotive", label: "Automotive components", suggestedFrameworks: ["iso-9001"] },
      { slug: "food-production", label: "Food production", suggestedFrameworks: ["haccp", "iso-9001"] },
    ],
  },
  {
    label: "Facilities & Property",
    industries: [
      { slug: "facilities-management", label: "Facilities management" },
      { slug: "cleaning", label: "Cleaning" },
      { slug: "landscaping", label: "Landscaping & grounds" },
      { slug: "pest-control", label: "Pest control" },
      { slug: "property-maintenance", label: "Property maintenance" },
      { slug: "estate-management", label: "Estate management" },
    ],
  },
  {
    label: "Hospitality, Food & Retail",
    industries: [
      { slug: "catering", label: "Catering", suggestedFrameworks: ["haccp"] },
      { slug: "hospitality", label: "Hospitality / hotels" },
      { slug: "retail", label: "Retail" },
      { slug: "food-packaging", label: "Food packaging", suggestedFrameworks: ["haccp"] },
    ],
  },
  {
    label: "Tech & Digital",
    industries: [
      { slug: "saas", label: "SaaS / software", suggestedFrameworks: ["iso-27001", "cyber-essentials", "gdpr"] },
      { slug: "msp-it", label: "MSP / IT services", suggestedFrameworks: ["iso-27001", "cyber-essentials"] },
      { slug: "hosting-cloud", label: "Hosting / cloud" },
      { slug: "digital-agency", label: "Digital agency", suggestedFrameworks: ["gdpr"] },
      { slug: "cybersecurity", label: "Cybersecurity", suggestedFrameworks: ["iso-27001", "cyber-essentials"] },
    ],
  },
  {
    label: "Professional Services",
    industries: [
      { slug: "architecture", label: "Architecture" },
      { slug: "engineering-consultancy", label: "Engineering consultancy", suggestedFrameworks: ["iso-9001"] },
      { slug: "qs-cost", label: "QS / cost consultancy" },
      { slug: "legal", label: "Legal", suggestedFrameworks: ["gdpr"] },
      { slug: "accounting", label: "Accounting", suggestedFrameworks: ["gdpr"] },
      { slug: "recruitment", label: "Recruitment", suggestedFrameworks: ["gdpr"] },
      { slug: "hs-consultancy", label: "Health & safety consultancy" },
    ],
  },
  {
    label: "Healthcare",
    industries: [
      { slug: "dental", label: "Dental practice", suggestedFrameworks: ["gdpr"] },
      { slug: "veterinary", label: "Veterinary practice" },
      { slug: "medical", label: "Medical practice", suggestedFrameworks: ["gdpr"] },
      { slug: "care-home", label: "Care home / care services", suggestedFrameworks: ["iso-45001", "gdpr"] },
      { slug: "medical-devices", label: "Medical devices", suggestedFrameworks: ["iso-9001"] },
    ],
  },
  {
    label: "Logistics",
    industries: [
      { slug: "haulage", label: "Haulage / transport" },
      { slug: "warehousing", label: "Warehousing", suggestedFrameworks: ["iso-9001", "iso-45001"] },
      { slug: "couriers", label: "Couriers" },
      { slug: "distribution", label: "Distribution" },
    ],
  },
  {
    label: "Other",
    industries: [
      { slug: "education", label: "Education / training" },
      { slug: "charity", label: "Charity / non-profit" },
      { slug: "public-sector", label: "Public sector" },
      { slug: "other", label: "Other (describe in setup)" },
    ],
  },
];

// Flat lookup helpers
export const ALL_INDUSTRIES: IndustryOption[] = INDUSTRY_GROUPS.flatMap(
  (g) => g.industries
);

export function findIndustry(slug: string): IndustryOption | undefined {
  return ALL_INDUSTRIES.find((i) => i.slug === slug);
}
