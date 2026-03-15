import type { CustomFood } from '@/lib/mockData';
import { AlertTriangle, ArrowLeft, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface CustomFoodFormProps {
  onSave: (food: CustomFood) => void;
  onCancel: () => void;
}

const emojis = ['🍽️', '🥘', '🍲', '🥗', '🍰', '🥤', '🍪', '🥙', '🌮', '🍜', '🥞', '🧁'];

const CustomFoodForm = ({ onSave, onCancel }: CustomFoodFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('🍽️');
  const [quantity, setQuantity] = useState(100);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [calories, setCalories] = useState(0);
  const [sugars, setSugars] = useState(0);
  const [carbsUncertain, setCarbsUncertain] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: `cf-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      quantity,
      carbs,
      protein,
      fat,
      calories,
      sugars,
      image,
      carbsUncertain,
    });
  };

  const field = (label: string, value: number, onChange: (v: number) => void, unit: string) => (
    <div className="flex items-center justify-between">
      <label className="text-sm text-muted-foreground font-satoshi-medium">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-20 h-9 px-2 bg-muted rounded-lg text-right text-sm font-satoshi-bold tabular-nums text-foreground outline-none border-2 border-transparent focus:border-primary transition-all"
        />
        <span className="text-xs text-muted-foreground w-5">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-lg font-satoshi-bold">Nouvel aliment</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-8">
        {/* Emoji picker */}
        <div className="space-y-2">
          <label className="text-sm font-satoshi-medium text-muted-foreground">Icône</label>
          <div className="flex gap-2 flex-wrap">
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setImage(e)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  image === e ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-satoshi-medium text-muted-foreground">Nom *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Gâteau maison"
            className="w-full h-11 px-3 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-satoshi-medium text-muted-foreground">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ingrédients, recette..."
            rows={2}
            className="w-full px-3 py-2 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none"
          />
        </div>

        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-satoshi-bold">Valeurs nutritionnelles (pour 100g)</p>
          {field('Glucides', carbs, setCarbs, 'g')}
          {field('dont sucres', sugars, setSugars, 'g')}

          {/* Carbs uncertain toggle */}
          <button
            type="button"
            onClick={() => setCarbsUncertain(!carbsUncertain)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
              carbsUncertain
                ? 'bg-accent-low/10 border border-accent-low/30'
                : 'bg-muted border border-transparent'
            }`}
          >
            {carbsUncertain ? (
              <AlertTriangle size={16} className="text-accent-low shrink-0" />
            ) : (
              <HelpCircle size={16} className="text-muted-foreground shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-satoshi-bold ${carbsUncertain ? 'text-accent-low' : 'text-muted-foreground'}`}>
                Glucides approximatifs
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {carbsUncertain ? 'La valeur sera signalée comme une estimation' : 'Cocher si la teneur en glucides est incertaine'}
              </p>
            </div>
            <div className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${
              carbsUncertain ? 'bg-accent-low' : 'bg-muted-foreground/30'
            }`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                carbsUncertain ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </div>
          </button>

          {field('Protéines', protein, setProtein, 'g')}
          {field('Lipides', fat, setFat, 'g')}
          {field('Calories', calories, setCalories, '')}
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-satoshi-bold text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enregistrer l'aliment
        </button>
      </div>
    </div>
  );
};

export default CustomFoodForm;
