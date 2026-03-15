import { TrendingUp } from 'lucide-react';
import AiBadge from './AiBadge';
import MissingDataBanner from './MissingDataBanner';

interface ProblematicMealEntry {
  name: string;
  image: string;
  quantity: number;
  carbs: number;
}

interface ProblematicMeal {
  id: string;
  label: string;
  timestamp: string;
  entries: ProblematicMealEntry[];
  totalCarbs: number;
  insulinDose: number;
  glucosePeak: number;
  timeToReturn: number;
  issue: string;
}

const problematicMeals: ProblematicMeal[] = [
  {
    id: 'pm1',
    label: 'Déjeuner',
    timestamp: 'Lun 12:45',
    entries: [
      { name: 'Pâtes bolognaise', image: '🍝', quantity: 320, carbs: 58 },
      { name: 'Pain', image: '🍞', quantity: 40, carbs: 18 },
      { name: 'Compote', image: '🍎', quantity: 100, carbs: 16 },
    ],
    totalCarbs: 92,
    insulinDose: 5,
    glucosePeak: 245,
    timeToReturn: 180,
    issue: 'Pic > 240 mg/dL — dose insuffisante pour 92g de glucides',
  },
  {
    id: 'pm2',
    label: 'Dîner',
    timestamp: 'Mar 19:20',
    entries: [
      { name: 'Riz blanc', image: '🍚', quantity: 250, carbs: 72 },
      { name: 'Poulet', image: '🍗', quantity: 150, carbs: 0 },
    ],
    totalCarbs: 72,
    insulinDose: 4,
    glucosePeak: 220,
    timeToReturn: 150,
    issue: 'Retour en cible > 2h30 — injection trop tardive ?',
  },
  {
    id: 'pm3',
    label: 'Petit-déjeuner',
    timestamp: 'Jeu 08:10',
    entries: [
      { name: 'Jus d\'orange', image: '🧃', quantity: 250, carbs: 26 },
      { name: 'Céréales', image: '🥣', quantity: 60, carbs: 40 },
      { name: 'Lait', image: '🥛', quantity: 200, carbs: 10 },
    ],
    totalCarbs: 76,
    insulinDose: 6,
    glucosePeak: 198,
    timeToReturn: 90,
    issue: 'Montée rapide (+80 en 20 min) — sucres rapides à jeun',
  },
];

interface WeeklyMealRecapProps {
  hasCgmData?: boolean;
}

const WeeklyMealRecap = ({ hasCgmData = true }: WeeklyMealRecapProps) => {
  if (!hasCgmData) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-satoshi-bold text-foreground">Repas problématiques</h3>
        <MissingDataBanner message="Synchronisez vos données CGM pour identifier les repas avec une mauvaise réponse glycémique." />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-satoshi-bold text-foreground">Repas à revoir cette semaine</h3>
        <AiBadge label="Analyse IA" />
      </div>

      <div className="space-y-3">
        {problematicMeals.map(meal => (
          <div key={meal.id} className="rounded-xl bg-accent-high/5 border border-accent-high/20 p-3 space-y-2">
            {/* Meal header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-satoshi-bold text-foreground">{meal.label}</p>
                <span className="text-[10px] text-muted-foreground font-satoshi-medium">{meal.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-satoshi-bold tabular-nums text-accent-high">{meal.glucosePeak} mg/dL</span>
              </div>
            </div>

            {/* Entries list */}
            <div className="flex flex-wrap gap-1.5">
              {meal.entries.map((entry, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
                  <span>{entry.image}</span>
                  <span>{entry.name}</span>
                  <span className="text-accent-good tabular-nums">{entry.carbs}g</span>
                </span>
              ))}
            </div>

            {/* Dose + issue */}
            <div className="flex items-start gap-1.5">
              <TrendingUp size={12} className="text-accent-high mt-0.5 shrink-0" />
              <p className="text-[11px] text-accent-high font-satoshi-medium leading-tight">
                {meal.insulinDose}u pour {meal.totalCarbs}g — {meal.issue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMealRecap;
