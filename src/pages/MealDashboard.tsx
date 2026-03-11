import { useState } from 'react';
import { Plus } from 'lucide-react';
import { todayMeals, type MealEntry } from '@/lib/mockData';
import FoodSearchModal from '@/components/FoodSearchModal';
import FoodDetailSheet from '@/components/FoodDetailSheet';

const MealDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFood, setSelectedFood] = useState<MealEntry | null>(null);

  const totalCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 text-center">
        <p className="text-sm text-muted-foreground font-satoshi-medium mb-1">Today's Carbs</p>
        <p className="text-6xl font-satoshi-black tabular-nums tracking-tight text-foreground">
          {totalCarbs}<span className="text-2xl text-muted-foreground font-satoshi-medium ml-1">g</span>
        </p>
      </div>

      {/* Meal list */}
      <div className="flex-1 px-4 space-y-2 pb-24">
        {todayMeals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => setSelectedFood(meal)}
            className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
              {meal.image}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-satoshi-bold text-foreground truncate">{meal.name}</p>
              <p className="text-xs text-muted-foreground font-satoshi-regular">{meal.quantity}g{meal.brand ? ` · ${meal.brand}` : ''}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-satoshi-bold tabular-nums text-accent-good">{meal.carbs}g</p>
              <p className="text-xs text-muted-foreground tabular-nums">{meal.timestamp}</p>
            </div>
          </button>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSearch(true)}
        className="absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_4px_12px_rgba(27,79,216,0.3),0_0_0_1px_rgba(255,255,255,0.1)] transition-all duration-150 hover:brightness-110 active:scale-[0.95]"
      >
        <Plus size={28} />
      </button>

      {showSearch && <FoodSearchModal onClose={() => setShowSearch(false)} onSelect={(food) => { setSelectedFood(food); setShowSearch(false); }} />}
      {selectedFood && <FoodDetailSheet food={selectedFood} onClose={() => setSelectedFood(null)} />}
    </div>
  );
};

export default MealDashboard;
