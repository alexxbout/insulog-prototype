import { TrendingUp, AlertTriangle } from 'lucide-react';
import AiBadge from './AiBadge';
import MissingDataBanner from './MissingDataBanner';

interface ProblematicMeal {
  id: string;
  name: string;
  image: string;
  timestamp: string;
  carbs: number;
  glucosePeak: number;
  timeToReturn: number; // minutes to return in range
  issue: string;
}

const problematicMeals: ProblematicMeal[] = [
  { id: 'pm1', name: 'Pasta Bolognese', image: '🍝', timestamp: 'Lun 12:45', carbs: 58, glucosePeak: 245, timeToReturn: 180, issue: 'Pic glycémique > 240 mg/dL' },
  { id: 'pm2', name: 'White Rice', image: '🍚', timestamp: 'Mar 19:20', carbs: 72, glucosePeak: 220, timeToReturn: 150, issue: 'Retour en cible > 2h30' },
  { id: 'pm3', name: 'Orange Juice', image: '🧃', timestamp: 'Jeu 08:10', carbs: 26, glucosePeak: 198, timeToReturn: 90, issue: 'Montée rapide (+80 en 20 min)' },
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

      <div className="space-y-2">
        {problematicMeals.map(meal => (
          <div key={meal.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-accent-high/5 border border-accent-high/20">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
              {meal.image}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-satoshi-bold text-foreground truncate">{meal.name}</p>
                <span className="text-[10px] text-muted-foreground font-satoshi-medium">{meal.timestamp}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp size={12} className="text-accent-high" />
                <p className="text-[11px] text-accent-high font-satoshi-medium">{meal.issue}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-satoshi-bold tabular-nums text-accent-high">{meal.glucosePeak}</p>
              <p className="text-[10px] text-muted-foreground">mg/dL pic</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMealRecap;
