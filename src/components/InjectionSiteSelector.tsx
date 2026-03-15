import { getLastInjections } from '@/lib/mockData';
import { AlertTriangle, Check } from 'lucide-react';

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

const zoneLabels: Record<string, string> = { belly: 'Ventre', thigh: 'Cuisse', arm: 'Bras', buttock: 'Fesse' };
const sideLabels: Record<string, string> = { left: 'gauche', center: 'centre', right: 'droite' };

const InjectionSiteSelector = ({ zone, side, onChangeZone, onChangeSide }: InjectionSiteSelectorProps) => {
  const lastInjections = getLastInjections();
  const lastRapid = lastInjections.find(i => i.type === 'rapid');
  const lastLong = lastInjections.find(i => i.type === 'long');

  const sameAsLastRapid = zone && side && lastRapid && zone === lastRapid.zone && side === lastRapid.side;
  const sameAsLastLong = zone && side && lastLong && zone === lastLong.zone && side === lastLong.side;

  return (
    <div className="space-y-3">
      <label className="text-sm font-satoshi-medium text-muted-foreground">Site d'injection</label>

      {/* Last injection reminder */}
      {lastRapid && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <span className="text-xs text-muted-foreground">
            Dernière rapide : <span className="font-satoshi-bold text-foreground">{zoneLabels[lastRapid.zone] || lastRapid.zone} {sideLabels[lastRapid.side] || lastRapid.side}</span>
          </span>
          {lastLong && lastLong.zone !== lastRapid.zone && (
            <span className="text-xs text-muted-foreground ml-auto">
              Lente : <span className="font-satoshi-bold text-foreground">{zoneLabels[lastLong.zone] || lastLong.zone} {sideLabels[lastLong.side] || lastLong.side}</span>
            </span>
          )}
        </div>
      )}
      
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

      {/* Same zone warning */}
      {(sameAsLastRapid || sameAsLastLong) && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-accent-low/10 border border-accent-low/30 rounded-lg">
          <AlertTriangle size={14} className="text-accent-low shrink-0" />
          <p className="text-xs font-satoshi-medium text-accent-low">
            {sameAsLastRapid
              ? 'Même zone que la dernière injection rapide — pensez à alterner'
              : 'Même zone que la dernière injection lente — pensez à alterner'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InjectionSiteSelector;
