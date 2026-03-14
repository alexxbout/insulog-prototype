import { Check } from 'lucide-react';

export type DoseTiming = 'before' | '10min' | '20min' | '30min' | 'after';

interface DoseTimingSelectorProps {
  value: DoseTiming | null;
  onChange: (timing: DoseTiming) => void;
}

const timings: { key: DoseTiming; label: string; desc: string }[] = [
  { key: 'before', label: 'Avant', desc: 'Avant le repas' },
  { key: '10min', label: '10 min', desc: 'Après 10 min' },
  { key: '20min', label: '20 min', desc: 'Après 20 min' },
  { key: '30min', label: '30 min', desc: 'Après 30 min' },
  { key: 'after', label: 'Après', desc: 'Bien après' },
];

const DoseTimingSelector = ({ value, onChange }: DoseTimingSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-satoshi-medium text-muted-foreground">Moment de l'injection</label>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {timings.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`relative shrink-0 px-3 py-2 rounded-lg text-xs font-satoshi-medium transition-all duration-150 active:scale-[0.96] ${
              value === t.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoseTimingSelector;
