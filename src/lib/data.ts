// All figures in this file are illustrative pilot data for demo purposes.
// They are not WICI measurements.

export type MaterialId = "organics" | "pet" | "paper" | "ldpe" | "metal" | "residual";

export type Material = {
  id: MaterialId;
  label: string;
  short: string;
  color: string;
  recoverable: boolean;
};

// Fixed categorical order, validated for colour-vision deficiency.
// Residual is the neutral "other" slot.
export const MATERIALS: Material[] = [
  { id: "organics", label: "Organics (food & garden)", short: "Organics", color: "#4F8A2E", recoverable: true },
  { id: "pet", label: "PET bottles", short: "PET", color: "#2D7DB8", recoverable: true },
  { id: "paper", label: "Paper & cardboard", short: "Paper & card", color: "#C08A2B", recoverable: true },
  { id: "ldpe", label: "Sachet & film (LDPE)", short: "Sachet film", color: "#8B5CB8", recoverable: true },
  { id: "metal", label: "Aluminium & metal", short: "Aluminium", color: "#D0584A", recoverable: true },
  { id: "residual", label: "Residual (non-recoverable)", short: "Residual", color: "#9A9890", recoverable: false },
];

export const material = (id: MaterialId) => MATERIALS.find((m) => m.id === id)!;

export const CLUSTER = {
  name: "Victoria Island Cluster",
  city: "Lagos",
  month: 6,
  totalMonths: 12,
  generators: 14,
  offtakers: 4,
  logisticsPartners: 3,
  trucksOwned: 0,
};

export const HERO = {
  name: "Harbour View Hotel",
  type: "Hotel · 120 rooms, 2 restaurants",
  area: "Victoria Island",
  weeklyKg: 1050,
  contact: "Facilities Manager",
  onboarded: "Month 2",
};

// ---------- Step 1: See ----------

export type Detection = {
  id: number;
  kind: "bottle" | "bottleFlat" | "cardboard" | "organics" | "sachet" | "can" | "canSide" | "crushed" | "tissue";
  material: MaterialId;
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  needsReview?: boolean;
};

export const DETECTIONS: Detection[] = [
  { id: 1, kind: "bottle", material: "pet", label: "PET bottle", confidence: 97, box: { x: 40, y: 60, w: 70, h: 170 } },
  { id: 2, kind: "cardboard", material: "paper", label: "Cardboard box", confidence: 96, box: { x: 150, y: 40, w: 180, h: 130 } },
  { id: 3, kind: "sachet", material: "ldpe", label: "Water sachets ×6", confidence: 89, box: { x: 380, y: 50, w: 150, h: 110 } },
  { id: 4, kind: "can", material: "metal", label: "Aluminium can", confidence: 92, box: { x: 135, y: 200, w: 60, h: 100 } },
  { id: 5, kind: "organics", material: "organics", label: "Food waste", confidence: 94, box: { x: 345, y: 200, w: 185, h: 125 } },
  { id: 6, kind: "canSide", material: "metal", label: "Aluminium can", confidence: 90, box: { x: 220, y: 235, w: 95, h: 58 } },
  { id: 7, kind: "bottleFlat", material: "pet", label: "PET bottle", confidence: 95, box: { x: 40, y: 318, w: 175, h: 62 } },
  { id: 8, kind: "tissue", material: "residual", label: "Soiled tissue", confidence: 86, box: { x: 245, y: 318, w: 90, h: 76 } },
  { id: 9, kind: "crushed", material: "residual", label: "Mixed plastic?", confidence: 58, box: { x: 548, y: 170, w: 78, h: 112 }, needsReview: true },
];

export const REVIEW_OPTIONS: { label: string; material: MaterialId }[] = [
  { label: "PET (crushed bottle)", material: "pet" },
  { label: "PP / mixed plastic", material: "residual" },
  { label: "Residual", material: "residual" },
];

// 7-day baseline audit for the hero generator, kg per week
export const BASELINE: Record<MaterialId, number> = {
  organics: 483,
  pet: 126,
  paper: 179,
  ldpe: 84,
  metal: 42,
  residual: 136,
};

// ---------- Step 2: Separate ----------

export const STREAMS = [
  {
    id: "organics",
    name: "Organics",
    bin: "Green bin",
    color: "#4F8A2E",
    contents: "Kitchen prep, plate waste, garden",
    points: ["Main kitchen", "Staff canteen"],
    kgWeek: 483,
  },
  {
    id: "dry",
    name: "Dry recyclables",
    bin: "Blue bin",
    color: "#2D7DB8",
    contents: "PET, cans, sachets, cardboard",
    points: ["Bar & restaurant", "Housekeeping carts", "Loading bay"],
    kgWeek: 431,
  },
  {
    id: "residual",
    name: "Residual",
    bin: "Grey bin",
    color: "#7c7a73",
    contents: "Tissue, soiled packaging, other",
    points: ["All points"],
    kgWeek: 136,
  },
] as const;

export const ONBOARDING = [
  { id: "audit", label: "7-day baseline audit completed", detail: "1,050 kg/week measured", done: true },
  { id: "kitchen", label: "Kitchen staff briefed", detail: "18 of 18 staff", done: true },
  { id: "house", label: "Housekeeping briefed", detail: "24 of 26 staff", done: true },
  { id: "signs", label: "Bin signage installed", detail: "12 collection points", done: false },
  { id: "spot", label: "Weekly contamination spot-check", detail: "Field officer, Fridays", done: false },
];

// Contamination in the dry-recyclables stream, % by weight, per week since onboarding
export const HERO_CONTAMINATION = [22, 17, 13, 9.5, 7, 6];

export const HERO_COMMERCIALS = {
  assessmentFee: 150_000,
  monthlyFee: 85_000,
};

// ---------- Step 3: Move ----------

export const PARTNERS = [
  { id: "greenroute", name: "GreenRoute PSP", kind: "LAWMA-licensed PSP operator", color: "#C08A2B" },
  { id: "pickers", name: "Island Pickers Co-op", kind: "Collector cooperative", color: "#508260" },
  { id: "bayside", name: "Bayside Haulage", kind: "Contracted logistics", color: "#174034" },
] as const;

export type PartnerId = (typeof PARTNERS)[number]["id"];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const SCHEDULE: { stream: string; color: string; days: Partial<Record<(typeof DAYS)[number], PartnerId>> }[] = [
  { stream: "Organics", color: "#4F8A2E", days: { Mon: "greenroute", Wed: "greenroute", Fri: "greenroute" } },
  { stream: "Dry recyclables", color: "#2D7DB8", days: { Tue: "pickers", Sat: "pickers" } },
  { stream: "Residual", color: "#7c7a73", days: { Mon: "bayside", Thu: "bayside" } },
];

export type Stop = {
  id: string;
  name: string;
  stream: string;
  kg: number;
  partner: PartnerId;
  x: number;
  y: number;
};

// Today's (Tuesday) dry-recyclables run, map coords in a 600x340 viewBox
export const STOPS: Stop[] = [
  { id: "s1", name: "Harbour View Hotel", stream: "Dry recyclables", kg: 214, partner: "pickers", x: 120, y: 210 },
  { id: "s2", name: "Marina Tower Offices", stream: "Dry recyclables", kg: 96, partner: "pickers", x: 190, y: 150 },
  { id: "s3", name: "Ozumba Food Court", stream: "Dry recyclables", kg: 132, partner: "pickers", x: 285, y: 175 },
  { id: "s4", name: "Atlantic Suites", stream: "Dry recyclables", kg: 168, partner: "pickers", x: 360, y: 235 },
  { id: "s5", name: "Seaside Prep School", stream: "Dry recyclables", kg: 74, partner: "pickers", x: 430, y: 160 },
];

export const HUB = { name: "Oniru partner yard", x: 525, y: 120 };

// ---------- Step 4: Aggregate ----------

export type Lot = {
  id: string;
  time: string;
  generator: string;
  material: MaterialId;
  kg: number;
  contamination: number;
  grade: "A" | "B" | "C";
};

export const LOTS: Lot[] = [
  { id: "L-2417", time: "09:12", generator: "Marina Tower Offices", material: "paper", kg: 88, contamination: 5.1, grade: "A" },
  { id: "L-2418", time: "09:40", generator: "Ozumba Food Court", material: "pet", kg: 74, contamination: 8.6, grade: "B" },
  { id: "L-2419", time: "10:05", generator: "Ozumba Food Court", material: "metal", kg: 31, contamination: 3.2, grade: "A" },
  { id: "L-2420", time: "10:31", generator: "Atlantic Suites", material: "ldpe", kg: 46, contamination: 11.4, grade: "C" },
];

export const NEW_LOT: Lot = {
  id: "L-2421",
  time: "11:02",
  generator: "Harbour View Hotel",
  material: "pet",
  kg: 126,
  contamination: 4.1,
  grade: "A",
};

export const STOCK: { material: MaterialId; kg: number; threshold: number }[] = [
  { material: "pet", kg: 1410, threshold: 1500 },
  { material: "paper", kg: 1880, threshold: 2000 },
  { material: "ldpe", kg: 620, threshold: 1000 },
  { material: "metal", kg: 212, threshold: 400 },
];

// ---------- Step 5: Match ----------

export const BATCH = {
  id: "PET-0612",
  material: "pet" as MaterialId,
  kg: 1536,
  contamination: 4.1,
  grade: "A",
  form: "Loose, bagged · clear & light blue",
  lots: 14,
  generators: 9,
};

export type Offtaker = {
  id: string;
  name: string;
  kind: string;
  area: string;
  minKg: number;
  maxContamination: number;
  pricePerKg: number;
  distanceKm: number;
  collects: boolean;
  reliability: number; // % of past pickups on time
};

export const OFFTAKERS: Offtaker[] = [
  { id: "o1", name: "Ikeja PET Flakers", kind: "PET flake processor", area: "Ikeja", minKg: 1000, maxContamination: 5, pricePerKg: 320, distanceKm: 22, collects: true, reliability: 96 },
  { id: "o2", name: "Agbara Polymer Works", kind: "Bottle-to-fibre plant", area: "Agbara", minKg: 2000, maxContamination: 3, pricePerKg: 355, distanceKm: 48, collects: true, reliability: 91 },
  { id: "o3", name: "Apapa Recycling Hub", kind: "Baler & exporter", area: "Apapa", minKg: 500, maxContamination: 8, pricePerKg: 275, distanceKm: 15, collects: true, reliability: 88 },
  { id: "o4", name: "Ojota Aggregators", kind: "Informal aggregator", area: "Ojota", minKg: 0, maxContamination: 15, pricePerKg: 190, distanceKm: 18, collects: false, reliability: 74 },
];

export function evaluateOfftaker(o: Offtaker) {
  const issues: string[] = [];
  if (BATCH.kg < o.minKg) issues.push(`Needs ≥ ${o.minKg.toLocaleString()} kg`);
  if (BATCH.contamination > o.maxContamination) issues.push(`Needs ≤ ${o.maxContamination}% contamination`);
  const logistics = o.collects ? 0 : Math.round(o.distanceKm * 1900);
  const gross = BATCH.kg * o.pricePerKg;
  const net = gross - logistics;
  // Score: net value per kg (60%), reliability (30%), proximity (10%)
  const score = issues.length
    ? 0
    : Math.round((net / BATCH.kg / 360) * 60 + (o.reliability / 100) * 30 + (1 - o.distanceKm / 60) * 10);
  return { issues, gross, logistics, net, score, eligible: issues.length === 0 };
}

// ---------- Step 6: Measure ----------

export const MONTHS = ["M1", "M2", "M3", "M4", "M5", "M6"];
export const DIVERTED_T = [3.2, 6.8, 9.4, 12.1, 14.0, 15.9];
export const CONTAMINATION_PCT = [21, 16, 12, 9.5, 8.1, 7.2];
export const ACTIVE_GENERATORS = [4, 8, 11, 12, 14, 14];

export const DIVERTED_BY_MATERIAL: { material: MaterialId; t: number }[] = [
  { material: "organics", t: 33.1 },
  { material: "paper", t: 13.2 },
  { material: "pet", t: 8.6 },
  { material: "ldpe", t: 4.9 },
  { material: "metal", t: 1.6 },
];

export const UNIT_ECONOMICS = {
  revenuePerT: 142_000, // blended material + service revenue per tonne handled
  costPerT: 118_000, // logistics + handling + field ops per tonne
  logisticsPerT: 18_400,
  logisticsTargetPerT: 15_000,
};

export const OFFTAKER_PERFORMANCE = [
  { name: "Ikeja PET Flakers", material: "pet" as MaterialId, t: 7.1, acceptance: 97 },
  { name: "Apapa Recycling Hub", material: "paper" as MaterialId, t: 13.2, acceptance: 93 },
  { name: "Lekki Compost Collective", material: "organics" as MaterialId, t: 33.1, acceptance: 95 },
  { name: "Ojota Aggregators", material: "ldpe" as MaterialId, t: 6.5, acceptance: 86 },
];

export const VALIDATION = [
  {
    q: "Will generators participate and pay?",
    evidence: "12 of 14 generators pay a monthly service fee",
    status: "proven" as const,
  },
  {
    q: "Can materials meet buyer specifications?",
    evidence: "94% of batches accepted on first inspection",
    status: "proven" as const,
  },
  {
    q: "What are the true logistics and handling costs?",
    evidence: "₦18.4k per tonne measured vs ₦15k target",
    status: "progress" as const,
  },
  {
    q: "Can the model track diversion and value?",
    evidence: "100% of lots weighed, graded and traced to buyer",
    status: "proven" as const,
  },
];

export const GENERATORS_MAP: { name: string; type: string; x: number; y: number; tMonth: number }[] = [
  { name: "Harbour View Hotel", type: "Hotel", x: 120, y: 210, tMonth: 4.2 },
  { name: "Marina Tower Offices", type: "Office", x: 190, y: 150, tMonth: 1.1 },
  { name: "Ozumba Food Court", type: "Restaurant", x: 285, y: 175, tMonth: 2.6 },
  { name: "Atlantic Suites", type: "Hotel", x: 360, y: 235, tMonth: 2.9 },
  { name: "Seaside Prep School", type: "School", x: 430, y: 160, tMonth: 0.9 },
  { name: "Bar Beach Grill", type: "Restaurant", x: 95, y: 265, tMonth: 1.4 },
  { name: "Adeola Plaza", type: "Office", x: 240, y: 110, tMonth: 0.7 },
  { name: "Lagoon Court Estate", type: "Residential", x: 330, y: 100, tMonth: 1.8 },
  { name: "Corporate Tower 7", type: "Office", x: 215, y: 250, tMonth: 0.8 },
  { name: "Island Event Centre", type: "Events", x: 400, y: 280, tMonth: 1.6 },
  { name: "Bishop Court Offices", type: "Office", x: 160, y: 95, tMonth: 0.5 },
  { name: "Ajose Bakery", type: "Food", x: 470, y: 225, tMonth: 0.6 },
  { name: "Ozumba Mart", type: "Retail", x: 310, y: 290, tMonth: 0.9 },
  { name: "Victoria Co-working Hub", type: "Office", x: 380, y: 135, tMonth: 0.4 },
];

export const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
export const nairaShort = (n: number) =>
  n >= 1_000_000 ? `₦${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `₦${+(n / 1000).toFixed(1)}k` : `₦${n}`;
