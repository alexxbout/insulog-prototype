import MealBuilder from '@/components/MealBuilder';
import MissingDataBanner from '@/components/MissingDataBanner';
import WeeklyMealRecap from '@/components/WeeklyMealRecap';
import { defaultCustomFoods, getMealsForDate, type CustomFood, type Meal } from '@/lib/mockData';
import { AlertTriangle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const MealDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showMealBuilder, setShowMealBuilder] = useState(false);
  const [extraMeals, setExtraMeals] = useState<Meal[]>([]);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>(defaultCustomFoods);

  const hasCgmData = true;

  const meals = useMemo(() => {
    const base = getMealsForDate(selectedDate);
    const extra = extraMeals.filter(m => m.date === selectedDate);
    return [...base, ...extra].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [selectedDate, extraMeals]);

  const totalCarbs = meals.reduce((s, m) => s + m.totalCarbs, 0);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    if (isToday) return "Aujourd'hui";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Hier';
    return d.toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const navigateDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    const today = new Date().toISOString().split('T')[0];
    const newDate = d.toISOString().split('T')[0];
    if (newDate > today) return;
    setSelectedDate(newDate);
  };

  const handleSaveMeal = (meal: Meal) => {
    setExtraMeals(prev => [...prev, meal]);
  };

  const handleSaveCustomFood = (food: CustomFood) => {
    setCustomFoods(prev => [...prev, food]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date navigator */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <button onClick={() => navigateDay(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft size={20} className="text-muted-foreground" />
        </button>
        <p className="text-sm font-satoshi-bold text-foreground capitalize">{formatDate(selectedDate)}</p>
        <button
          onClick={() => navigateDay(1)}
          disabled={isToday}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Total carbs */}
      <div className="px-4 pb-4 text-center">
        <p className="text-sm text-muted-foreground font-satoshi-medium mb-1">Glucides</p>
        <p className="text-5xl font-satoshi-black tabular-nums tracking-tight text-foreground">
          {Math.round(totalCarbs)}<span className="text-2xl text-muted-foreground font-satoshi-medium ml-1">g</span>
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 px-4 space-y-3 pb-24 overflow-y-auto">
        {/* Weekly recap - only on today */}
        {isToday && <WeeklyMealRecap hasCgmData={hasCgmData} />}

        {!hasCgmData && isToday && (
          <MissingDataBanner message="Connectez votre capteur CGM pour débloquer l'analyse des repas." />
        )}

        {/* Meals grouped */}
        {meals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Aucun repas enregistré</p>
            <p className="text-xs mt-1">Ajoutez un repas ci-dessous</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map(meal => (
              <div key={meal.id} className="space-y-2">
                {/* Meal header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-satoshi-bold text-foreground">{meal.label}</h3>
                    <span className="text-xs text-muted-foreground">{meal.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-satoshi-bold tabular-nums text-accent-good">{Math.round(meal.totalCarbs)}g</span>
                    {meal.totalInsulin > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">{meal.totalInsulin}u</span>
                    )}
                  </div>
                </div>
                {/* Entries */}
                <div className="space-y-1.5">
                  {meal.entries.map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 p-2.5 bg-card rounded-xl border border-border text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                        {entry.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-satoshi-bold text-foreground truncate">{entry.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{entry.quantity}g</span>
                          {entry.quantityUncertain && (
                            <span className="flex items-center gap-0.5 text-accent-low">
                              <AlertTriangle size={10} /> ≈
                            </span>
                          )}
                          {entry.brand && <span>· {entry.brand}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-satoshi-bold tabular-nums text-accent-good">{Math.round(entry.carbs)}g</p>
                        {entry.insulinDose && (
                          <p className="text-[10px] text-muted-foreground tabular-nums">{entry.insulinDose}u</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add meal button */}
        <button
          onClick={() => setShowMealBuilder(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-satoshi-medium">Ajouter un repas</span>
        </button>
      </div>

      {showMealBuilder && (
        <MealBuilder
          onClose={() => setShowMealBuilder(false)}
          onSaveMeal={handleSaveMeal}
          customFoods={customFoods}
          onSaveCustomFood={handleSaveCustomFood}
        />
      )}
    </div>
  );
};

export default MealDashboard;
