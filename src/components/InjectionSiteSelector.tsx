import { useState } from 'react';
import { Check } from 'lucide-react';

export type BodyZone = 'thigh' | 'arm' | 'belly' | 'buttock';
export type BodySide = 'left' | 'center' | 'right';

interface InjectionSiteSelectorProps {
  zone: BodyZone | null;
  side: BodySide | null;
  onChangeZone: (zone: BodyZone) => void;
  onChangeSide: (side: BodySide) => void;
}

const zones: { key: BodyZone; label: string; emoji: string }[] = [
  { key: 'belly', label: 'Ventre', emoji: '🫄' },
  { key: 'thigh', label: 'Cuisse', emoji: '🦵' },
  { key: 'arm', label: 'Bras', emoji: '💪' },
  { key: 'buttock', label: 'Fesse', emoji: '🍑' },
];

const sides: { key: BodySide; label: string }[] = [
  { key: 'left', label: 'Gauche' },
  { key: 'center', label: 'Centre' },
  { key: 'right', label: 'Droite' },
];

const InjectionSiteSelector = ({ zone, side, onChangeZone, onChangeSide }: InjectionSiteSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-satoshi-medium text-muted-foreground">Site d'injection</label>
      
      {/* Zone grid */}
      <div className="grid grid-cols-4 gap-2">
        {zones.map(z => (
          <button
            key={z.key}
            type="button"
            onClick={() => onChangeZone(z.key)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150 active:scale-[0.96] ${
              zone === z.key
                ? 'border-primary bg-primary/10 shadow-sm shadow-primary/10'
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <span className="text-2xl">{z.emoji}</span>
            <span className="text-[11px] font-satoshi-medium text-foreground">{z.label}</span>
            {zone === z.key && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check size={12} className="text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Side selector */}
      {zone && (
        <div className="flex gap-2">
          {sides.map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => onChangeSide(s.key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-satoshi-medium transition-all duration-150 ${
                side === s.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InjectionSiteSelector;
