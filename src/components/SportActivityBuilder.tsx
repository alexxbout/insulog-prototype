import type { SportSession } from '@/lib/mockData';
import { getRecentRapidDoses } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Syringe } from 'lucide-react';
import { useState } from 'react';

const sportTypes = [
  { label: 'Course', type: 'Cardio' as const, emoji: '🏃' },
  { label: 'Vélo', type: 'Cardio' as const, emoji: '🚴' },
  { label: 'Natation', type: 'Cardio' as const, emoji: '🏊' },
  { label: 'Marche', type: 'Cardio' as const, emoji: '🚶' },
  { label: 'Musculation', type: 'Strength' as const, emoji: '🏋️' },
  { label: 'Yoga', type: 'Other' as const, emoji: '🧘' },
  { label: 'Sport collectif', type: 'Other' as const, emoji: '⚽' },
  { label: 'Autre', type: 'Other' as const, emoji: '🏅' },
];

const intensities = [
  { value: 'low', label: 'Faible', description: 'Récupération, marche lente' },
  { value: 'moderate', label: 'Modérée', description: 'Effort confortable, conversation possible' },
  { value: 'high', label: 'Intense', description: 'Effort soutenu, essoufflement' },
];

interface SportActivityBuilderProps {
  onClose: () => void;
  onSave: (session: SportSession) => void;
  selectedDate: string;
}

const SportActivityBuilder = ({ onClose, onSave, selectedDate }: SportActivityBuilderProps) => {
  const [selectedSport, setSelectedSport] = useState<typeof sportTypes[0] | null>(null);
  const [startTime, setStartTime] = useState('08:00');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<string | null>(null);

  const canSave = selectedSport && intensity;

  // Check for recent rapid insulin doses (last 3h)
  const recentDoses = getRecentRapidDoses(3);
  const hasRecentInsulin = recentDoses.length > 0;
  const totalRecentUnits = recentDoses.reduce((s, d) => s + d.dose, 0);

  const handleSave = () => {
    if (!canSave) return;

    const session: SportSession = {
      id: `sp-${Date.now()}`,
      type: selectedSport.type,
      activity: selectedSport.label,
      duration,
      timestamp: `${selectedDate} ${startTime}`,
      glucoseDelta: 0,
      glucoseCurve: [],
    };

    onSave(session);
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-border">
        <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-satoshi-bold">Nouvelle activité</h2>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="text-sm font-satoshi-bold text-primary disabled:opacity-30 transition-opacity"
        >
          Enregistrer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Sport type */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Type de sport</p>
          <div className="grid grid-cols-4 gap-2">
            {sportTypes.map(sport => (
              <button
                key={sport.label}
                onClick={() => setSelectedSport(sport)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${
                  selectedSport?.label === sport.label
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <span className="text-2xl">{sport.emoji}</span>
                <span className="text-[11px] font-satoshi-medium text-foreground leading-tight text-center">{sport.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start time */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Heure de début</p>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm font-satoshi-medium text-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Durée</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDuration(d => Math.max(5, d - 5))}
              className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center text-lg font-satoshi-bold hover:bg-muted/80 transition-colors"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-20 text-center text-2xl font-satoshi-black tabular-nums bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground font-satoshi-medium">minutes</p>
            </div>
            <button
              onClick={() => setDuration(d => d + 5)}
              className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center text-lg font-satoshi-bold hover:bg-muted/80 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Intensity */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Intensité</p>
          <div className="space-y-2">
            {intensities.map(i => (
              <button
                key={i.value}
                onClick={() => setIntensity(i.value)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  intensity === i.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <p className="text-sm font-satoshi-bold text-foreground">{i.label}</p>
                <p className="text-xs text-muted-foreground">{i.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent insulin warning */}
        {hasRecentInsulin && (
          <div className="rounded-xl p-4 space-y-1.5 border bg-accent-low/10 border-accent-low/30">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-accent-low" />
              <p className="text-sm font-satoshi-bold text-accent-low">Insuline rapide récente</p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-satoshi-bold text-foreground">{totalRecentUnits}u</span> d'insuline rapide
              {recentDoses.length === 1 ? ' a été injectée' : ' ont été injectées'} dans les 3 dernières heures.
              L'activité physique peut augmenter le risque d'hypoglycémie.
            </p>
            {recentDoses.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Syringe size={12} />
                <span>{d.dose}u à {d.timestamp.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom save button */}
      {canSave && (
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-satoshi-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Enregistrer l'activité
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SportActivityBuilder;
