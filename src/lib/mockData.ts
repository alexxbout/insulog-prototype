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
  note?: string;
  nutriscore?: 'A' | 'B' | 'C' | 'D' | 'E';
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
  duration: number; // minutes
  timestamp: string;
  glucoseDelta: number;
  glucoseCurve: { time: number; value: number }[];
}

export const todayMeals: MealEntry[] = [
  {
    id: '1',
    name: 'Whole Grain Bread',
    brand: 'Artisan Bakery',
    quantity: 80,
    carbs: 36,
    protein: 7.2,
    fat: 1.6,
    calories: 188,
    sugars: 3.2,
    fiber: 4.8,
    sodium: 380,
    image: '🍞',
    timestamp: '07:32',
    insulinDose: 3,
    nutriscore: 'A',
  },
  {
    id: '2',
    name: 'Greek Yogurt',
    brand: 'Fage',
    quantity: 170,
    carbs: 6,
    protein: 17,
    fat: 0.7,
    calories: 100,
    sugars: 5.1,
    image: '🥛',
    timestamp: '07:35',
    nutriscore: 'A',
  },
  {
    id: '3',
    name: 'Pasta Bolognese',
    brand: 'Homemade',
    quantity: 320,
    carbs: 58,
    protein: 22,
    fat: 12,
    calories: 432,
    sugars: 8.4,
    fiber: 3.2,
    image: '🍝',
    timestamp: '12:45',
    insulinDose: 5,
  },
  {
    id: '4',
    name: 'Apple',
    quantity: 150,
    carbs: 21,
    protein: 0.5,
    fat: 0.3,
    calories: 78,
    sugars: 15.4,
    fiber: 3.6,
    image: '🍎',
    timestamp: '15:20',
  },
  {
    id: '5',
    name: 'Dark Chocolate',
    brand: 'Lindt 85%',
    quantity: 25,
    carbs: 7,
    protein: 2.5,
    fat: 11,
    calories: 137,
    sugars: 3.5,
    image: '🍫',
    timestamp: '16:00',
    nutriscore: 'D',
  },
];

export const searchResults: Omit<MealEntry, 'timestamp'>[] = [
  {
    id: 's1',
    name: 'Basmati Rice',
    brand: 'Tilda',
    quantity: 100,
    carbs: 78,
    protein: 7.5,
    fat: 0.6,
    calories: 349,
    sugars: 0.4,
    image: '🍚',
    nutriscore: 'A',
  },
  {
    id: 's2',
    name: 'Banana',
    quantity: 100,
    carbs: 23,
    protein: 1.1,
    fat: 0.3,
    calories: 89,
    sugars: 17,
    image: '🍌',
  },
  {
    id: 's3',
    name: 'Oat Milk',
    brand: 'Oatly',
    quantity: 100,
    carbs: 6.7,
    protein: 1,
    fat: 3,
    calories: 59,
    sugars: 4,
    image: '🥛',
    nutriscore: 'A',
  },
  {
    id: 's4',
    name: 'Sourdough Bread',
    brand: 'Local Bakery',
    quantity: 100,
    carbs: 51,
    protein: 8,
    fat: 1.2,
    calories: 249,
    sugars: 2.1,
    image: '🍞',
    nutriscore: 'B',
  },
  {
    id: 's5',
    name: 'Chickpeas (canned)',
    brand: 'Bonduelle',
    quantity: 100,
    carbs: 16,
    protein: 8.9,
    fat: 2.6,
    calories: 119,
    sugars: 1.1,
    image: '🥫',
    nutriscore: 'A',
  },
];

export const latestGlucose: GlucoseReading = {
  timestamp: '16:42',
  value: 124,
  trend: 'stable',
};

export const glucoseHistory: GlucoseReading[] = Array.from({ length: 288 }, (_, i) => {
  const hour = Math.floor(i / 12);
  const min = (i % 12) * 5;
  const base = 110 + 30 * Math.sin((hour - 6) * Math.PI / 12) + 15 * Math.sin((hour - 1) * Math.PI / 6);
  const noise = (Math.random() - 0.5) * 20;
  const value = Math.max(55, Math.min(280, Math.round(base + noise)));
  return {
    timestamp: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
    value,
    trend: 'stable' as const,
  };
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
  {
    id: 'sp1', type: 'Cardio', activity: 'Running', duration: 35,
    timestamp: '2026-03-10 07:00', glucoseDelta: -42,
    glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 140 - (i > 5 ? Math.min(i * 4, 42) : 0) + (Math.random() - 0.5) * 8 })),
  },
  {
    id: 'sp2', type: 'Strength', activity: 'Weight Training', duration: 50,
    timestamp: '2026-03-09 17:30', glucoseDelta: 12,
    glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 118 + (i > 5 ? Math.min(i * 1.5, 12) : 0) + (Math.random() - 0.5) * 6 })),
  },
  {
    id: 'sp3', type: 'Cardio', activity: 'Cycling', duration: 60,
    timestamp: '2026-03-08 09:00', glucoseDelta: -55,
    glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 155 - (i > 5 ? Math.min(i * 5, 55) : 0) + (Math.random() - 0.5) * 10 })),
  },
  {
    id: 'sp4', type: 'Other', activity: 'Yoga', duration: 45,
    timestamp: '2026-03-07 18:00', glucoseDelta: -8,
    glucoseCurve: Array.from({ length: 25 }, (_, i) => ({ time: (i - 5) * 10, value: 105 - (i > 5 ? Math.min(i * 0.8, 8) : 0) + (Math.random() - 0.5) * 5 })),
  },
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
    label: date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
    readings: hours,
    events: hours.filter(h => h.value < 70 || h.value > 180).map(h => ({
      hour: h.hour,
      value: h.value,
      type: h.value < 70 ? 'hypo' as const : 'hyper' as const,
    })),
  };
});

export const basalWindows = [
  {
    id: 'b1', period: 'Morning', start: '06:00', end: '09:30',
    drift: 'rising' as const, avgDrift: +18,
    curve: Array.from({ length: 42 }, (_, i) => ({ min: i * 5, value: 95 + i * 0.43 + (Math.random() - 0.5) * 6 })),
  },
  {
    id: 'b2', period: 'Afternoon', start: '14:00', end: '17:00',
    drift: 'stable' as const, avgDrift: +3,
    curve: Array.from({ length: 36 }, (_, i) => ({ min: i * 5, value: 112 + i * 0.08 + (Math.random() - 0.5) * 8 })),
  },
  {
    id: 'b3', period: 'Evening', start: '20:00', end: '23:00',
    drift: 'falling' as const, avgDrift: -12,
    curve: Array.from({ length: 36 }, (_, i) => ({ min: i * 5, value: 130 - i * 0.33 + (Math.random() - 0.5) * 7 })),
  },
  {
    id: 'b4', period: 'Night', start: '01:00', end: '05:30',
    drift: 'rising' as const, avgDrift: +22,
    curve: Array.from({ length: 54 }, (_, i) => ({ min: i * 5, value: 88 + i * 0.41 + (Math.random() - 0.5) * 5 })),
  },
];
