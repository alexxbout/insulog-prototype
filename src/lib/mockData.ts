export interface MealEntry {
  id: string;
  name: string;
  brand?: string;
  quantity: number;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  sugars: number;
  fiber?: number;
  sodium?: number;
  image: string;
  timestamp: string;
  insulinDose?: number;
  doseTiming?: 'now' | '10min' | '20min';
  injectionZone?: string;
  injectionSide?: string;
  note?: string;
  nutriscore?: 'A' | 'B' | 'C' | 'D' | 'E';
  quantityUncertain?: boolean;
  isCustom?: boolean;
  carbsUncertain?: boolean;
}

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // HH:mm
  label: string; // "Petit-déjeuner", "Déjeuner", etc.
  entries: MealEntry[];
  totalCarbs: number;
  totalInsulin: number;
  correctionDose?: number;
  reducedDoseForActivity?: boolean;
  injectionZone?: string;
  injectionSide?: string;
  doseTiming?: 'now' | '10min' | '20min';
}

export interface CustomFood {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  sugars: number;
  fiber?: number;
  sodium?: number;
  image: string;
  nutriscore?: 'A' | 'B' | 'C' | 'D' | 'E';
  carbsUncertain?: boolean;
}

export interface GlucoseReading {
  timestamp: string;
  value: number;
  trend: 'rising' | 'falling' | 'stable' | 'rising_fast' | 'falling_fast';
}

export interface SportSession {
  id: string;
  type: 'Cardio' | 'Strength' | 'Other';
  activity: string;
  duration: number;
  timestamp: string;
  glucoseDelta: number;
  glucoseCurve: { time: number; value: number }[];
}

// ── User Profile ─────────────────────────────────────────────
export interface UserProfile {
  firstName: string;
  weightKg: number;
  rapidInsulinType: string;
  longInsulinType: string;
  diaHours: number;      // Duration of Insulin Action (3–6h)
  carbRatio: number;     // g of carbs per 1 unit of rapid insulin
  todayContext: string[]; // ['stress', 'illness', 'alcohol', 'cycle', 'sleep']
}

export const mockUserProfile: UserProfile = {
  firstName: 'Alexandre',
  weightKg: 75,
  rapidInsulinType: 'Novorapid',
  longInsulinType: 'Lantus',
  diaHours: 4,
  carbRatio: 10,
  todayContext: [],
};

// Insulin ratio & sport impact data
export const usualCarbRatio = 10; // 1 unit of insulin per 10g of carbs (initial default)

export interface SportInsulinImpact {
  sportType: string;
  adjustedRatio: number;
  hoursWindow: number;
  mealsAnalyzed: number;
  avgGlucoseDelta: number;
  periodHours: number;
}

export const sportInsulinImpacts: SportInsulinImpact[] = [
  { sportType: 'Course', adjustedRatio: 15, hoursWindow: 6, mealsAnalyzed: 8, avgGlucoseDelta: -45, periodHours: 3 },
  { sportType: 'Vélo', adjustedRatio: 14, hoursWindow: 5, mealsAnalyzed: 5, avgGlucoseDelta: -38, periodHours: 3 },
  { sportType: 'Musculation', adjustedRatio: 11, hoursWindow: 4, mealsAnalyzed: 6, avgGlucoseDelta: -12, periodHours: 3 },
  { sportType: 'Natation', adjustedRatio: 16, hoursWindow: 6, mealsAnalyzed: 3, avgGlucoseDelta: -52, periodHours: 3 },
  { sportType: 'Yoga', adjustedRatio: 10, hoursWindow: 2, mealsAnalyzed: 4, avgGlucoseDelta: -5, periodHours: 3 },
  { sportType: 'Marche', adjustedRatio: 12, hoursWindow: 3, mealsAnalyzed: 7, avgGlucoseDelta: -18, periodHours: 3 },
  { sportType: 'Sport collectif', adjustedRatio: 14, hoursWindow: 5, mealsAnalyzed: 4, avgGlucoseDelta: -35, periodHours: 3 },
];

/** Returns a recent sport session (mock: always 2h ago) for demo purposes */
export function getRecentSport(): SportSession | null {
  const twoHoursAgo = new Date(mockNow().getTime() - 2 * 60 * 60 * 1000);
  return {
    id: 'sp-recent',
    type: 'Cardio',
    activity: 'Course',
    duration: 40,
    timestamp: twoHoursAgo.toISOString().replace('T', ' ').slice(0, 16),
    glucoseDelta: -38,
    glucoseCurve: [],
  };
}

// Helper to build meals from entries
const buildMeal = (id: string, date: string, timestamp: string, label: string, entries: MealEntry[]): Meal => ({
  id,
  date,
  timestamp,
  label,
  entries,
  totalCarbs: entries.reduce((s, e) => s + e.carbs, 0),
  totalInsulin: entries.reduce((s, e) => s + (e.insulinDose || 0), 0),
});

export const todayDate = '2026-03-14';

/** Mock "now" consistent with mock data timeline (2026-03-15 14:00) */
export const mockNow = () => new Date('2026-03-15T14:00:00');

export const allMeals: Meal[] = [
  // Today
  buildMeal('m1', '2026-03-14', '07:32', 'Petit-déjeuner', [
    { id: '1', name: 'Pain complet', brand: 'Artisan Bakery', quantity: 80, carbs: 36, protein: 7.2, fat: 1.6, calories: 188, sugars: 3.2, fiber: 4.8, sodium: 380, image: '🍞', timestamp: '07:32', insulinDose: 3, doseTiming: 'now', nutriscore: 'A', injectionZone: 'belly', injectionSide: 'left' },
    { id: '2', name: 'Yaourt grec', brand: 'Fage', quantity: 170, carbs: 6, protein: 17, fat: 0.7, calories: 100, sugars: 5.1, image: '🥛', timestamp: '07:35', nutriscore: 'A' },
  ]),
  buildMeal('m2', '2026-03-14', '12:45', 'Déjeuner', [
    { id: '3', name: 'Pâtes bolognaise', brand: 'Maison', quantity: 320, carbs: 58, protein: 22, fat: 12, calories: 432, sugars: 8.4, fiber: 3.2, image: '🍝', timestamp: '12:45', insulinDose: 5, doseTiming: '10min', injectionZone: 'belly', injectionSide: 'left' },
  ]),
  buildMeal('m3', '2026-03-14', '15:20', 'Collation', [
    { id: '4', name: 'Pomme', quantity: 150, carbs: 21, protein: 0.5, fat: 0.3, calories: 78, sugars: 15.4, fiber: 3.6, image: '🍎', timestamp: '15:20' },
    { id: '5', name: 'Chocolat noir', brand: 'Lindt 85%', quantity: 25, carbs: 7, protein: 2.5, fat: 11, calories: 137, sugars: 3.5, image: '🍫', timestamp: '16:00', nutriscore: 'D' },
  ]),
  // Yesterday
  buildMeal('m4', '2026-03-13', '08:00', 'Petit-déjeuner', [
    { id: '6', name: 'Céréales', brand: 'Jordans', quantity: 60, carbs: 40, protein: 5, fat: 3, calories: 210, sugars: 12, image: '🥣', timestamp: '08:00', insulinDose: 4, doseTiming: 'now', injectionZone: 'thigh', injectionSide: 'right' },
    { id: '7', name: 'Lait d\'avoine', brand: 'Oatly', quantity: 200, carbs: 13.4, protein: 2, fat: 6, calories: 118, sugars: 8, image: '🥛', timestamp: '08:00', nutriscore: 'A' },
  ]),
  buildMeal('m5', '2026-03-13', '12:30', 'Déjeuner', [
    { id: '8', name: 'Riz basmati', brand: 'Tilda', quantity: 180, carbs: 140, protein: 13.5, fat: 1.1, calories: 628, sugars: 0.7, image: '🍚', timestamp: '12:30', insulinDose: 8, doseTiming: '10min', nutriscore: 'A', injectionZone: 'belly', injectionSide: 'right' },
    { id: '9', name: 'Poulet grillé', quantity: 150, carbs: 0, protein: 46, fat: 5, calories: 230, sugars: 0, image: '🍗', timestamp: '12:30' },
  ]),
  buildMeal('m6', '2026-03-13', '19:30', 'Dîner', [
    { id: '10', name: 'Pizza margherita', brand: 'Picard', quantity: 300, carbs: 75, protein: 24, fat: 18, calories: 558, sugars: 9, image: '🍕', timestamp: '19:30', insulinDose: 7, doseTiming: '20min', quantityUncertain: true, injectionZone: 'belly', injectionSide: 'left' },
  ]),
  // 2 days ago
  buildMeal('m7', '2026-03-12', '07:45', 'Petit-déjeuner', [
    { id: '11', name: 'Tartines confiture', quantity: 100, carbs: 52, protein: 4, fat: 2, calories: 240, sugars: 28, image: '🍞', timestamp: '07:45', insulinDose: 4, injectionZone: 'arm', injectionSide: 'left' },
  ]),
  buildMeal('m8', '2026-03-12', '13:00', 'Déjeuner', [
    { id: '12', name: 'Salade composée', quantity: 350, carbs: 18, protein: 12, fat: 15, calories: 255, sugars: 6, image: '🥗', timestamp: '13:00', insulinDose: 2, quantityUncertain: true, injectionZone: 'thigh', injectionSide: 'left' },
  ]),
];

export const getMealsForDate = (date: string): Meal[] => allMeals.filter(m => m.date === date);

export const getAvailableDates = (): string[] => [...new Set(allMeals.map(m => m.date))].sort().reverse();

/** Historical stats per meal label for dose validation */
export interface MealLabelStats {
  label: string;
  count: number;
  avgCarbs: number;
  avgInsulin: number;
  avgRatio: number; // g of carbs per 1u insulin
}

export function getMealLabelStats(label: string): MealLabelStats | null {
  const meals = allMeals.filter(m => m.label === label && m.totalInsulin > 0);
  if (meals.length === 0) return null;
  const avgCarbs = Math.round(meals.reduce((s, m) => s + m.totalCarbs, 0) / meals.length);
  const avgInsulin = Math.round(meals.reduce((s, m) => s + m.totalInsulin, 0) / meals.length * 10) / 10;
  const avgRatio = avgInsulin > 0 ? Math.round(avgCarbs / avgInsulin) : 0;
  return { label, count: meals.length, avgCarbs, avgInsulin, avgRatio };
}

// Search results
export const searchResults: Omit<MealEntry, 'timestamp'>[] = [
  { id: 's1', name: 'Riz basmati', brand: 'Tilda', quantity: 100, carbs: 78, protein: 7.5, fat: 0.6, calories: 349, sugars: 0.4, image: '🍚', nutriscore: 'A' },
  { id: 's2', name: 'Banane', quantity: 100, carbs: 23, protein: 1.1, fat: 0.3, calories: 89, sugars: 17, image: '🍌' },
  { id: 's3', name: 'Lait d\'avoine', brand: 'Oatly', quantity: 100, carbs: 6.7, protein: 1, fat: 3, calories: 59, sugars: 4, image: '🥛', nutriscore: 'A' },
  { id: 's4', name: 'Pain au levain', brand: 'Boulangerie locale', quantity: 100, carbs: 51, protein: 8, fat: 1.2, calories: 249, sugars: 2.1, image: '🍞', nutriscore: 'B' },
  { id: 's5', name: 'Pois chiches (conserve)', brand: 'Bonduelle', quantity: 100, carbs: 16, protein: 8.9, fat: 2.6, calories: 119, sugars: 1.1, image: '🫕', nutriscore: 'A' },
];

// Saved custom foods (persisted in localStorage in real app)
export const defaultCustomFoods: CustomFood[] = [
  { id: 'cf1', name: 'Gâteau mamie', description: 'Gâteau au chocolat maison', quantity: 100, carbs: 45, protein: 5, fat: 20, calories: 380, sugars: 30, image: '🍰' },
  { id: 'cf2', name: 'Smoothie maison', description: 'Banane + lait + flocons', quantity: 300, carbs: 42, protein: 8, fat: 4, calories: 236, sugars: 28, image: '🥤' },
];

export const latestGlucose: GlucoseReading = {
  timestamp: '16:42',
  value: 124,
  trend: 'stable',
};

/** Last injection info for zone rotation tracking */
export interface LastInjection {
  zone: string;
  side: string;
  timestamp: string;
  type: 'rapid' | 'long';
}

export function getLastInjections(): LastInjection[] {
  // Mock: last rapid was belly/left (today breakfast), last long was thigh/right (yesterday evening)
  return [
    { zone: 'belly', side: 'left', timestamp: '2026-03-15 07:32', type: 'rapid' },
    { zone: 'thigh', side: 'right', timestamp: '2026-03-14 22:00', type: 'long' },
  ];
}

export const glucoseHistory: GlucoseReading[] = Array.from({ length: 288 }, (_, i) => {
  const hour = Math.floor(i / 12);
  const min = (i % 12) * 5;
  const base = 110 + 30 * Math.sin((hour - 6) * Math.PI / 12) + 15 * Math.sin((hour - 1) * Math.PI / 6);
  const noise = (Math.random() - 0.5) * 20;
  const value = Math.max(55, Math.min(280, Math.round(base + noise)));
  return { timestamp: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`, value, trend: 'stable' as const };
});

export const postMealGlucose = Array.from({ length: 37 }, (_, i) => {
  const min = i * 5;
  const avg = 110 + 50 * Math.sin(min * Math.PI / 180) * Math.exp(-min / 150);
  const upper = avg + 15 + Math.random() * 5;
  const lower = avg - 15 - Math.random() * 5;
  return { time: min, avg: Math.round(avg), upper: Math.round(upper), lower: Math.round(lower) };
});

export const carbRatioScatter = Array.from({ length: 30 }, (_, i) => {
  const carbs = 15 + Math.random() * 80;
  const hadSport = Math.random() > 0.7;
  const delta = carbs * 0.6 + (hadSport ? -20 : 0) + (Math.random() - 0.5) * 40;
  return { carbs: Math.round(carbs), delta: Math.round(delta), sport: hadSport };
});

export const sportSessions: SportSession[] = [
  { id: 'sp1', type: 'Cardio', activity: 'Course', duration: 35, timestamp: '2026-03-10 07:00', glucoseDelta: -42, glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 140 - (i > 5 ? Math.min(i * 4, 42) : 0) + (Math.random() - 0.5) * 8 })) },
  { id: 'sp2', type: 'Strength', activity: 'Musculation', duration: 50, timestamp: '2026-03-09 17:30', glucoseDelta: 12, glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 118 + (i > 5 ? Math.min(i * 1.5, 12) : 0) + (Math.random() - 0.5) * 6 })) },
  { id: 'sp3', type: 'Cardio', activity: 'Vélo', duration: 60, timestamp: '2026-03-08 09:00', glucoseDelta: -55, glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 155 - (i > 5 ? Math.min(i * 5, 55) : 0) + (Math.random() - 0.5) * 10 })) },
  { id: 'sp4', type: 'Other', activity: 'Yoga', duration: 45, timestamp: '2026-03-07 18:00', glucoseDelta: -8, glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 105 - (i > 5 ? Math.min(i * 0.8, 8) : 0) + (Math.random() - 0.5) * 5 })) },
];

export const nightlyData = Array.from({ length: 14 }, (_, nightIdx) => {
  const date = new Date(2026, 2, 11 - nightIdx);
  const hours = Array.from({ length: 97 }, (_, i) => {
    const hour = i * 5 / 60;
    const base = 100 + 20 * Math.sin(hour * Math.PI / 4) + (Math.random() - 0.5) * 30;
    return { hour: Math.round(hour * 100) / 100, value: Math.max(50, Math.min(220, Math.round(base))) };
  });
  return {
    date: date.toISOString().split('T')[0],
    label: date.toLocaleDateString('fr', { weekday: 'short', month: 'short', day: 'numeric' }),
    readings: hours,
    events: hours.filter(h => h.value < 70 || h.value > 180).map(h => ({ hour: h.hour, value: h.value, type: h.value < 70 ? 'hypo' as const : 'hyper' as const })),
  };
});

export const basalWindows = [
  { id: 'b1', period: 'Matin', start: '06:00', end: '09:30', drift: 'rising' as const, avgDrift: +18, curve: Array.from({ length: 42 }, (_, i) => ({ min: i * 5, value: 95 + i * 0.43 + (Math.random() - 0.5) * 6 })) },
  { id: 'b2', period: 'Après-midi', start: '14:00', end: '17:00', drift: 'stable' as const, avgDrift: +3, curve: Array.from({ length: 36 }, (_, i) => ({ min: i * 5, value: 112 + i * 0.08 + (Math.random() - 0.5) * 8 })) },
  { id: 'b3', period: 'Soirée', start: '20:00', end: '23:00', drift: 'falling' as const, avgDrift: -12, curve: Array.from({ length: 36 }, (_, i) => ({ min: i * 5, value: 130 - i * 0.33 + (Math.random() - 0.5) * 7 })) },
  { id: 'b4', period: 'Nuit', start: '01:00', end: '05:30', drift: 'rising' as const, avgDrift: +22, curve: Array.from({ length: 54 }, (_, i) => ({ min: i * 5, value: 88 + i * 0.41 + (Math.random() - 0.5) * 5 })) },
];

// ── Insulin log (rapid + long-acting) ──────────────────────────────

export interface InsulinLog {
  id: string;
  type: 'rapid' | 'long';
  dose: number;        // units
  timestamp: string;   // ISO-like "YYYY-MM-DD HH:mm"
  injectionZone?: string;
  injectionSide?: string;
  reason?: 'meal' | 'correction'; // rapid only
  note?: string;
}

export const insulinLogs: InsulinLog[] = [
  { id: 'il1', type: 'long', dose: 14, timestamp: '2026-03-14 22:30', injectionZone: 'thigh', injectionSide: 'right' },
  { id: 'il2', type: 'long', dose: 14, timestamp: '2026-03-13 22:15', injectionZone: 'thigh', injectionSide: 'left' },
  { id: 'il3', type: 'long', dose: 14, timestamp: '2026-03-12 22:45', injectionZone: 'buttock', injectionSide: 'right' },
  { id: 'il4', type: 'rapid', dose: 3, timestamp: '2026-03-15 07:32', injectionZone: 'belly', injectionSide: 'left' },
  { id: 'il5', type: 'rapid', dose: 5, timestamp: '2026-03-15 12:45', injectionZone: 'belly', injectionSide: 'right' },
];

/**
 * Insulin-on-Board (IOB) calculation using a non-linear exponential decay model.
 * Based on a 4-hour Duration of Insulin Action (DIA) with a biphasic curve:
 * - Peak activity at ~75 min
 * - Uses the formula: IOB(t) = 1 - (0.05 * t^2 / DIA^2) * (5 - t * 3 / DIA)  for t < DIA
 *   where t is time in minutes since injection.
 *
 * Returns the total IOB in units from all rapid insulin doses in the last DIA hours.
 */
export function calculateIOB(atDate: Date = mockNow()): { totalIOB: number; contributions: { dose: number; timestamp: string; remaining: number }[] } {
  const DIA_MINUTES = mockUserProfile.diaHours * 60; // from user profile (default 4h)
  const contributions: { dose: number; timestamp: string; remaining: number }[] = [];
  let totalIOB = 0;

  for (const log of insulinLogs) {
    if (log.type !== 'rapid') continue;
    const injectionTime = new Date(log.timestamp.replace(' ', 'T'));
    const minutesElapsed = (atDate.getTime() - injectionTime.getTime()) / 60000;
    if (minutesElapsed < 0 || minutesElapsed >= DIA_MINUTES) continue;

    // Walsh non-linear IOB curve approximation
    const t = minutesElapsed / DIA_MINUTES; // normalize to 0..1
    const iobFraction = 1 - t * t * (3 - 2 * t); // smooth S-curve decay (Hermite basis)
    const remaining = Math.round(log.dose * iobFraction * 100) / 100;

    if (remaining > 0.01) {
      totalIOB += remaining;
      contributions.push({ dose: log.dose, timestamp: log.timestamp, remaining });
    }
  }

  return { totalIOB: Math.round(totalIOB * 100) / 100, contributions };
}

/**
 * Returns all rapid insulin doses given in the last `hours` hours.
 * Used to warn when starting a sport session with active insulin.
 */
export function getRecentRapidDoses(hours: number = 3, atDate: Date = mockNow()): InsulinLog[] {
  const cutoff = new Date(atDate.getTime() - hours * 60 * 60 * 1000);
  return insulinLogs.filter(log => {
    if (log.type !== 'rapid') return false;
    const t = new Date(log.timestamp.replace(' ', 'T'));
    return t >= cutoff && t <= atDate;
  });
}
