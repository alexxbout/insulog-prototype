export type DoseTiming = 'now' | '10min' | '20min';

interface DoseTimingSelectorProps {
  value: DoseTiming | null;
  onChange: (timing: DoseTiming) => void;
}

const timings: { key: DoseTiming; label: string }[] = [
  { key: 'now', label: 'Tout de suite' },
  { key: '10min', label: '10 min après' },
  { key: '20min', label: '20 min après' },
];

const DoseTimingSelector = ({ value, onChange }: DoseTimingSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-satoshi-medium text-muted-foreground">Quand injectez-vous ?</label>
      <div className="flex gap-2">
        {timings.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-satoshi-medium transition-all duration-150 active:scale-[0.96] ${
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
