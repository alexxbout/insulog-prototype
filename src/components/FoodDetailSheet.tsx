import type { MealEntry } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FoodDetailSheetProps {
  food: MealEntry;
  onClose: () => void;
  onAdd: (entry: MealEntry) => void;
  mode?: 'add' | 'view' | 'edit';
}

const NutriscoreBadge = ({ score }: { score: string }) => {
  const colors: Record<string, string> = { A: 'bg-accent-good', B: 'bg-accent-good/80', C: 'bg-accent-low', D: 'bg-accent-low', E: 'bg-accent-high' };
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-satoshi-bold text-foreground ${colors[score] || 'bg-muted'}`}>
      {score}
    </span>
  );
};

const FoodDetailSheet = ({ food, onClose, onAdd, mode = 'add' }: FoodDetailSheetProps) => {
  const [quantity, setQuantity] = useState(food.quantity);
  const [insulinDose, setInsulinDose] = useState(food.insulinDose || 0);
  const [note, setNote] = useState(food.note || '');
  const [expanded, setExpanded] = useState(false);
  const [quantityUncertain, setQuantityUncertain] = useState(food.quantityUncertain || false);
  const scale = quantity / food.quantity;
  const scaled = (val: number) => Math.round(val * scale * 10) / 10;

  const handleAdd = () => {
    const entry: MealEntry = {
      ...food,
      quantity,
      carbs: scaled(food.carbs),
      protein: scaled(food.protein),
      fat: scaled(food.fat),
      calories: scaled(food.calories),
      sugars: scaled(food.sugars),
      fiber: food.fiber ? scaled(food.fiber) : undefined,
      sodium: food.sodium ? scaled(food.sodium) : undefined,
      insulinDose: insulinDose || undefined,
      note: note || undefined,
      quantityUncertain,
      carbsUncertain: food.carbsUncertain,
      isCustom: food.isCustom,
      timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    onAdd(entry);
    toast.success(mode === 'edit' ? `${food.name} mis à jour` : `${food.name} ajouté au repas`);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
      className="absolute inset-0 bg-background z-50 flex flex-col overflow-y-auto"
    >
      <div className="h-48 bg-muted flex items-center justify-center text-7xl relative">
        {food.image}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-satoshi-bold tracking-tight">{food.name}</h1>
              {food.isCustom && (
                <span className="px-2 py-0.5 rounded text-[11px] font-satoshi-bold bg-primary/10 text-primary">Perso</span>
              )}
            </div>
            {food.brand && <p className="text-sm text-muted-foreground">{food.brand}</p>}
          </div>
          {food.nutriscore && <NutriscoreBadge score={food.nutriscore} />}
        </div>

        {/* Quantity selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 justify-center p-3 bg-card rounded-xl border border-border">
            <button
              onClick={() => setQuantity(Math.max(5, quantity - 5))}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center transition-all active:scale-95"
            >
              <Minus size={18} />
            </button>
            <div className="text-center min-w-[80px]">
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-20 text-center text-2xl font-satoshi-bold tabular-nums bg-transparent outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground">grammes</p>
            </div>
            <button
              onClick={() => setQuantity(quantity + 5)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center transition-all active:scale-95"
            >
              <Plus size={18} />
            </button>
          </div>
          {/* Quantity uncertainty toggle */}
          <button
            type="button"
            onClick={() => setQuantityUncertain(!quantityUncertain)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-satoshi-medium transition-all ${
              quantityUncertain
                ? 'bg-accent-low/10 text-accent-low border border-accent-low/30'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <AlertTriangle size={14} />
            {quantityUncertain ? 'Quantité approximative (doute signalé)' : 'Je ne suis pas sûr de la quantité'}
          </button>
        </div>

        {/* Nutrition card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="text-center pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Glucides</p>
            <p className="text-3xl font-satoshi-black tabular-nums text-accent-good">
              {food.carbsUncertain && <span className="text-accent-low">≈</span>}{scaled(food.carbs)}<span className="text-lg ml-0.5">g</span>
            </p>
            {food.carbsUncertain && (
              <p className="text-xs text-accent-low flex items-center justify-center gap-1 mt-1">
                <AlertTriangle size={12} /> Valeur approximative
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">dont sucres : {scaled(food.sugars)}g</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Protéines</p>
              <p className="text-lg font-satoshi-bold tabular-nums">{scaled(food.protein)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Lipides</p>
              <p className="text-lg font-satoshi-bold tabular-nums">{scaled(food.fat)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Calories</p>
              <p className="text-lg font-satoshi-bold tabular-nums">{scaled(food.calories)}</p>
            </div>
          </div>
        </div>

        {/* Expandable more info */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-3 bg-card rounded-xl border border-border text-sm font-satoshi-medium"
        >
          Plus d'infos nutritionnelles
          <ChevronDown size={18} className={`text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        {expanded && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-2">
            {[
              ['Fibres', food.fiber],
              ['Sodium', food.sodium],
            ].filter(([, v]) => v != null).map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label as string}</span>
                <span className="font-satoshi-bold tabular-nums">{scaled(val as number)}{label === 'Sodium' ? 'mg' : 'g'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Insulin dose */}
        <div className="space-y-2">
          <label className="text-sm font-satoshi-medium text-muted-foreground">Dose d'insuline (unités)</label>
          <input
            type="number"
            value={insulinDose || ''}
            onChange={e => setInsulinDose(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full h-11 px-3 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all tabular-nums"
          />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-sm font-satoshi-medium text-muted-foreground">Note</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ajouter une note..."
            rows={2}
            className="w-full px-3 py-2 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none"
          />
        </div>

        {(mode === 'add' || mode === 'edit') && (
          <button
            onClick={handleAdd}
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-satoshi-bold text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          >
            {mode === 'edit' ? 'Mettre à jour' : 'Ajouter au repas'}
          </button>
        )}

        <div className="h-4" />
      </div>
    </motion.div>
  );
};

export default FoodDetailSheet;
