import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MealEntry, Meal, CustomFood } from '@/lib/mockData';
import FoodSearchModal from './FoodSearchModal';
import FoodDetailSheet from './FoodDetailSheet';
import { toast } from 'sonner';

interface MealBuilderProps {
  onClose: () => void;
  onSaveMeal: (meal: Meal) => void;
  customFoods: CustomFood[];
  onSaveCustomFood: (food: CustomFood) => void;
}

const mealLabels = ['Petit-déjeuner', 'Déjeuner', 'Collation', 'Dîner', 'Autre'];

const MealBuilder = ({ onClose, onSaveMeal, customFoods, onSaveCustomFood }: MealBuilderProps) => {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [mealLabel, setMealLabel] = useState('');
  const [showSearch, setShowSearch] = useState(true); // start with search open
  const [selectedFood, setSelectedFood] = useState<MealEntry | null>(null);

  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0);
  const totalInsulin = entries.reduce((s, e) => s + (e.insulinDose || 0), 0);

  const handleAddEntry = (entry: MealEntry) => {
    setEntries(prev => [...prev, { ...entry, id: `e-${Date.now()}-${Math.random()}` }]);
    setSelectedFood(null);
    // Don't close search - allow adding more
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (entries.length === 0) return;
    const meal: Meal = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit', hour12: false }),
      label: mealLabel || 'Repas',
      entries,
      totalCarbs,
      totalInsulin,
    };
    onSaveMeal(meal);
    toast.success('Repas enregistré');
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
      className="absolute inset-0 bg-background z-40 flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-lg font-satoshi-bold flex-1">Nouveau repas</h2>
        {entries.length > 0 && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-satoshi-bold transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Enregistrer
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-8">
        {/* Meal label */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {mealLabels.map(l => (
            <button
              key={l}
              onClick={() => setMealLabel(l)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-satoshi-medium transition-all ${
                mealLabel === l
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Added entries */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-satoshi-bold text-foreground">
                Aliments ajoutés ({entries.length})
              </h3>
              <p className="text-sm font-satoshi-bold tabular-nums text-accent-good">{Math.round(totalCarbs)}g glucides</p>
            </div>
            {entries.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                  {entry.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-satoshi-bold text-foreground truncate">{entry.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{entry.quantity}g</span>
                    {entry.quantityUncertain && (
                      <span className="flex items-center gap-0.5 text-accent-low">
                        <AlertTriangle size={10} /> ≈
                      </span>
                    )}
                    {entry.insulinDose ? <span>· {entry.insulinDose}u insuline</span> : null}
                  </div>
                </div>
                <p className="text-sm font-satoshi-bold tabular-nums text-accent-good shrink-0">{entry.carbs}g</p>
                <button
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {totalInsulin > 0 && (
              <div className="text-xs text-muted-foreground text-right">
                Total insuline : <span className="font-satoshi-bold text-foreground">{totalInsulin}u</span>
              </div>
            )}
          </div>
        )}

        {/* Add more button */}
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-satoshi-bold">Ajouter un aliment</span>
        </button>

        {/* Save button at bottom */}
        {entries.length > 0 && (
          <button
            onClick={handleSave}
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-satoshi-bold text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          >
            Enregistrer le repas ({entries.length} aliment{entries.length > 1 ? 's' : ''})
          </button>
        )}
      </div>

      {/* Submodals */}
      {showSearch && (
        <FoodSearchModal
          onClose={() => setShowSearch(false)}
          onSelect={(food) => { setSelectedFood(food); setShowSearch(false); }}
          customFoods={customFoods}
          onSaveCustomFood={onSaveCustomFood}
        />
      )}
      {selectedFood && (
        <FoodDetailSheet
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAdd={handleAddEntry}
        />
      )}
    </motion.div>
  );
};

export default MealBuilder;
