import { useState } from 'react';
import { X, Search, ScanBarcode, Camera, BookOpen, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchResults, defaultCustomFoods, type MealEntry, type CustomFood } from '@/lib/mockData';
import CustomFoodForm from './CustomFoodForm';

type Tab = 'search' | 'my-foods' | 'barcode' | 'photo';

interface FoodSearchModalProps {
  onClose: () => void;
  onSelect: (food: MealEntry) => void;
  customFoods: CustomFood[];
  onSaveCustomFood: (food: CustomFood) => void;
}

const FoodSearchModal = ({ onClose, onSelect, customFoods, onSaveCustomFood }: FoodSearchModalProps) => {
  const [tab, setTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const filtered = query
    ? searchResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.brand?.toLowerCase().includes(query.toLowerCase()))
    : searchResults;

  const filteredCustom = query
    ? customFoods.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : customFoods;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'search', label: 'Recherche', icon: <Search size={16} /> },
    { key: 'my-foods', label: 'Mes aliments', icon: <BookOpen size={16} /> },
    { key: 'barcode', label: 'Code-barres', icon: <ScanBarcode size={16} /> },
    { key: 'photo', label: 'Photo', icon: <Camera size={16} /> },
  ];

  const selectFood = (food: Omit<MealEntry, 'timestamp'>) => {
    onSelect({
      ...food,
      timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit', hour12: false }),
    } as MealEntry);
  };

  const selectCustomFood = (cf: CustomFood) => {
    selectFood({
      id: cf.id,
      name: cf.name,
      quantity: cf.quantity,
      carbs: cf.carbs,
      protein: cf.protein,
      fat: cf.fat,
      calories: cf.calories,
      sugars: cf.sugars,
      fiber: cf.fiber,
      sodium: cf.sodium,
      image: cf.image,
      nutriscore: cf.nutriscore,
      isCustom: true,
    });
  };

  if (showCustomForm) {
    return (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
        className="absolute inset-0 bg-background z-50 flex flex-col"
      >
        <CustomFoodForm
          onSave={(food) => { onSaveCustomFood(food); setShowCustomForm(false); }}
          onCancel={() => setShowCustomForm(false)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
      className="absolute inset-0 bg-background z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-lg font-satoshi-bold">Ajouter un aliment</h2>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-3 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-satoshi-medium transition-colors duration-150 shrink-0 ${
              tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {tab === 'search' && (
          <>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un aliment ou produit..."
                className="w-full h-11 pl-10 pr-3 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              {filtered.map(food => (
                <button
                  key={food.id}
                  onClick={() => selectFood(food)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-secondary active:bg-secondary text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                    {food.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-satoshi-bold text-foreground truncate">{food.name}</p>
                    {food.brand && <p className="text-xs text-muted-foreground">{food.brand}</p>}
                  </div>
                  <p className="text-sm font-satoshi-bold tabular-nums text-accent-good shrink-0">{food.carbs}g<span className="text-muted-foreground font-satoshi-regular">/100g</span></p>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'my-foods' && (
          <>
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-satoshi-bold">Créer un aliment</p>
                <p className="text-xs text-muted-foreground">Ajouter un aliment personnalisé</p>
              </div>
            </button>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher dans mes aliments..."
                className="w-full h-11 pl-10 pr-3 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all"
              />
            </div>
            {filteredCustom.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
                <p>Aucun aliment enregistré</p>
                <p className="text-xs mt-1">Créez votre premier aliment personnalisé</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCustom.map(food => (
                  <button
                    key={food.id}
                    onClick={() => selectCustomFood(food)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-secondary active:bg-secondary text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                      {food.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-satoshi-bold text-foreground truncate">{food.name}</p>
                      {food.description && <p className="text-xs text-muted-foreground truncate">{food.description}</p>}
                    </div>
                    <p className="text-sm font-satoshi-bold tabular-nums text-accent-good shrink-0">{food.carbs}g<span className="text-muted-foreground font-satoshi-regular">/100g</span></p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'barcode' && (
          <div className="flex flex-col items-center pt-8">
            <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-primary/40 rounded-lg" />
              <ScanBarcode size={48} className="text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground font-satoshi-medium mb-6">Pointez la caméra vers le code-barres</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="Ou entrez le code-barres manuellement..."
                className="w-full h-11 px-3 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all tabular-nums"
              />
            </div>
          </div>
        )}

        {tab === 'photo' && (
          <div className="flex flex-col items-center pt-8">
            <div className="w-full aspect-square border-2 border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center gap-3 mb-4 cursor-pointer hover:border-primary/40 transition-colors">
              <Camera size={48} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground font-satoshi-medium">Prenez une photo de votre repas pour l'analyse IA</p>
            </div>
            <div className="w-full p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-satoshi-medium">Analyse en cours...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodSearchModal;
