import type { CustomFood, Meal, MealEntry } from '@/lib/mockData';
import { calculateIOB, getMealLabelStats, usualCarbRatio } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Pencil, Plus, Syringe, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DoseTimingSelector, { type DoseTiming } from './DoseTimingSelector';
import FoodDetailSheet from './FoodDetailSheet';
import FoodSearchModal from './FoodSearchModal';
import InjectionSiteSelector, { type BodySide, type BodyZone } from './InjectionSiteSelector';
import SportRatioAlert from './SportRatioAlert';

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
  const [showSearch, setShowSearch] = useState(true);
  const [selectedFood, setSelectedFood] = useState<MealEntry | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [doseTiming, setDoseTiming] = useState<DoseTiming | null>(null);
  const [injectionZone, setInjectionZone] = useState<BodyZone | null>(null);
  const [injectionSide, setInjectionSide] = useState<BodySide | null>(null);
  const [correctionDose, setCorrectionDose] = useState(0);
  const [reducedDoseForActivity, setReducedDoseForActivity] = useState(false);

  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0);
  const totalInsulin = entries.reduce((s, e) => s + (e.insulinDose || 0), 0);
  const grandTotalInsulin = totalInsulin + correctionDose;

  const handleAddEntry = (entry: MealEntry) => {
    setEntries(prev => [...prev, { ...entry, id: `e-${Date.now()}-${Math.random()}` }]);
    setSelectedFood(null);
  };

  const handleUpdateEntry = (entry: MealEntry) => {
    if (!editingEntryId) return;
    setEntries(prev => prev.map(e => e.id === editingEntryId ? { ...entry, id: editingEntryId } : e));
    setSelectedFood(null);
    setEditingEntryId(null);
  };

  const handleEditEntry = (entry: MealEntry) => {
    setEditingEntryId(entry.id);
    setSelectedFood(entry);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  // Dose warning logic
  const stats = mealLabel ? getMealLabelStats(mealLabel) : null;
  const expectedDose = totalCarbs > 0 ? Math.round(totalCarbs / usualCarbRatio * 10) / 10 : 0;
  const doseDirection = totalInsulin > expectedDose ? 'high' : 'low';
  const hasDoseWarning = entries.length > 0 && totalInsulin > 0 && expectedDose > 0 && Math.abs(totalInsulin - expectedDose) / expectedDose > 0.25 && !(reducedDoseForActivity && doseDirection === 'low');

  // IOB (Insulin on Board) calculation
  const iob = calculateIOB();
  const hasActiveInsulin = iob.totalIOB > 0.1;

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
      correctionDose: correctionDose || undefined,
      reducedDoseForActivity: reducedDoseForActivity || undefined,
      injectionZone: injectionZone || undefined,
      injectionSide: injectionSide || undefined,
      doseTiming: doseTiming || undefined,
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

      <div className="flex-1 overflow-y-auto px-4 space-y-5 pb-8">
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

        {/* ── Section 1: Aliments ─────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">Aliments</p>

          {entries.map(entry => {
            const missingDose = !entry.insulinDose && totalInsulin > 0;
            return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 bg-card rounded-xl border cursor-pointer active:bg-muted/50 transition-colors ${
                missingDose ? 'border-accent-high/50 bg-accent-high/5' : 'border-border'
              }`}
              onClick={() => handleEditEntry(entry)}
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                {entry.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-satoshi-bold text-foreground truncate">{entry.name}</p>
                  {entry.isCustom && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-satoshi-bold bg-primary/10 text-primary">Perso</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.quantity}g</span>
                  {entry.quantityUncertain && (
                    <span className="flex items-center gap-0.5 text-accent-low">
                      <AlertTriangle size={10} /> ≈
                    </span>
                  )}
                  {entry.insulinDose ? <span>· {entry.insulinDose}u</span> : null}
                  {missingDose && <span className="text-accent-high font-satoshi-bold">· sans insuline</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {entry.carbsUncertain && <AlertTriangle size={12} className="text-accent-low" />}
                <p className="text-sm font-satoshi-bold tabular-nums text-accent-good">{entry.carbsUncertain ? '≈' : ''}{entry.carbs}g</p>
              </div>
              <Pencil size={14} className="text-muted-foreground shrink-0" />
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveEntry(entry.id); }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            );
          })}

          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-satoshi-bold">Ajouter un aliment</span>
          </button>
        </div>

        {/* ── Section 2: Insuline & alertes ───────────────────── */}
        {entries.length > 0 && totalInsulin > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">Insuline</p>

            {/* IOB warning */}
            {hasActiveInsulin && (
              <div className="rounded-xl p-4 space-y-1 border bg-accent-low/10 border-accent-low/30">
                <div className="flex items-center gap-2">
                  <Syringe size={18} className="text-accent-low" />
                  <p className="text-sm font-satoshi-bold text-accent-low">Insuline encore active</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Il reste environ <span className="font-satoshi-bold text-foreground">{iob.totalIOB}u</span> d'insuline rapide active.
                  Tenez-en compte pour ajuster votre dose.
                </p>
                {iob.contributions.map((c, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    {c.dose}u injectées à {c.timestamp.split(' ')[1]} → {c.remaining}u restantes
                  </p>
                ))}
              </div>
            )}

            {/* Sport ratio alert */}
            <SportRatioAlert carbsGrams={totalCarbs} />

            {/* Dose warning */}
            {hasDoseWarning && (
              <div className={`rounded-xl p-4 space-y-2 border ${
                doseDirection === 'high'
                  ? 'bg-accent-high/10 border-accent-high/30'
                  : 'bg-accent-low/10 border-accent-low/30'
              }`}>
                <div className="flex items-center gap-2">
                  {doseDirection === 'high' ? (
                    <TrendingUp size={18} className="text-accent-high" />
                  ) : (
                    <TrendingDown size={18} className="text-accent-low" />
                  )}
                  <p className={`text-sm font-satoshi-bold ${
                    doseDirection === 'high' ? 'text-accent-high' : 'text-accent-low'
                  }`}>
                    Dose {doseDirection === 'high' ? 'élevée' : 'faible'} pour ce repas
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-satoshi-medium">Dose saisie</span>
                    <span className="font-satoshi-bold text-foreground">{totalInsulin}u</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-satoshi-medium">Dose habituelle (ratio 1u:{usualCarbRatio}g)</span>
                    <span className="font-satoshi-bold text-foreground">{expectedDose}u</span>
                  </div>
                </div>
                {stats && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sur vos {stats.count} derniers « {stats.label} », la dose moyenne était
                    de {stats.avgInsulin}u pour {stats.avgCarbs}g de glucides
                    (ratio 1u:{stats.avgRatio}g).
                  </p>
                )}
              </div>
            )}

            {/* Correction dose */}
            <div className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-satoshi-bold text-foreground">Dose de correction</p>
                <p className="text-[11px] text-muted-foreground">Optionnel</p>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => setCorrectionDose(Math.max(0, correctionDose - 0.5))}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold transition-all active:scale-95"
                >
                  −
                </button>
                <div className="text-center min-w-[60px]">
                  <input
                    type="number"
                    value={correctionDose || ''}
                    onChange={e => setCorrectionDose(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    step={0.5}
                    className="w-16 text-center text-xl font-satoshi-black tabular-nums bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">unités</p>
                </div>
                <button
                  onClick={() => setCorrectionDose(correctionDose + 0.5)}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold transition-all active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reduced dose flag */}
            <button
              type="button"
              onClick={() => setReducedDoseForActivity(v => !v)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                reducedDoseForActivity
                  ? 'bg-primary/10 border-primary/40'
                  : 'bg-card border-border'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                reducedDoseForActivity
                  ? 'bg-primary border-primary'
                  : 'border-border'
              }`}>
                {reducedDoseForActivity && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className={`text-sm font-satoshi-medium text-left ${
                reducedDoseForActivity ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Dose intentionnellement réduite (activité prévue)
              </p>
            </button>

            {/* Timing & injection site */}
            <DoseTimingSelector value={doseTiming} onChange={setDoseTiming} />
            <InjectionSiteSelector
              zone={injectionZone}
              side={injectionSide}
              onChangeZone={setInjectionZone}
              onChangeSide={setInjectionSide}
            />
          </div>
        )}

        {/* ── Section 3: Résumé nutritionnel ──────────────────── */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">Résumé</p>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-satoshi-medium">Glucides totaux</span>
                <span className="text-lg font-satoshi-black tabular-nums text-accent-good">{Math.round(totalCarbs)}g</span>
              </div>
              {totalInsulin > 0 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground font-satoshi-medium">Insuline repas</span>
                  <span className="text-sm font-satoshi-bold tabular-nums text-foreground">{totalInsulin}u</span>
                </div>
              )}
              {correctionDose > 0 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground font-satoshi-medium">Correction</span>
                  <span className="text-sm font-satoshi-bold tabular-nums text-foreground">+{correctionDose}u</span>
                </div>
              )}
              {grandTotalInsulin > 0 && correctionDose > 0 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-sm text-foreground font-satoshi-bold">Total injecté</span>
                  <span className="text-sm font-satoshi-black tabular-nums text-foreground">{grandTotalInsulin}u</span>
                </div>
              )}
            </div>
          </div>
        )}

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
          onClose={() => { setSelectedFood(null); setEditingEntryId(null); }}
          onAdd={editingEntryId ? handleUpdateEntry : handleAddEntry}
          mode={editingEntryId ? 'edit' : 'add'}
        />
      )}
    </motion.div>
  );
};

export default MealBuilder;
