import AiBadge from '@/components/AiBadge';
import MissingDataBanner from '@/components/MissingDataBanner';
import TimeInRangeChart from '@/components/TimeInRangeChart';
import { latestGlucose } from '@/lib/mockData';
import { Activity, Minus, Moon, PauseCircle, PlayCircle, Scale, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const trendIcons: Record<string, React.ReactNode> = {
  rising: <TrendingUp size={18} />,
  rising_fast: <TrendingUp size={18} />,
  falling: <TrendingDown size={18} />,
  falling_fast: <TrendingDown size={18} />,
  stable: <Minus size={18} />,
};

const pauseDurations = [
  { value: '2h', label: '2 heures' },
  { value: '6h', label: '6 heures' },
  { value: '12h', label: '12 heures' },
  { value: '24h', label: '24 heures' },
  { value: '48h', label: '48 heures' },
  { value: '1w', label: '1 semaine' },
];

const cards = [
  { key: 'carb-ratio', title: 'Ratio glucidique', icon: Scale, subtitle: 'Efficacité insuline par repas', badge: '3 anomalies détectées', badgeColor: 'text-accent-low bg-accent-low/10', needsCgm: true, needsMeals: true },
  { key: 'sport', title: 'Impact sport', icon: Zap, subtitle: 'Glycémie pendant & après activité', badge: 'Bonne stabilité', badgeColor: 'text-accent-good bg-accent-good/10', needsCgm: true, needsSport: true },
  { key: 'nightly', title: 'Profils nocturnes', icon: Moon, subtitle: 'Tendances glycémiques nocturnes', badge: '2 hypos détectées', badgeColor: 'text-accent-high bg-accent-high/10', needsCgm: true },
  { key: 'basal', title: 'Analyse basale', icon: Activity, subtitle: 'Efficacité insuline basale', badge: 'Stable', badgeColor: 'text-accent-good bg-accent-good/10', needsCgm: true },
];

const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [analysisPaused, setAnalysisPaused] = useState(false);
  const [pauseDuration, setPauseDuration] = useState<string | null>(null);
  const [showPauseOptions, setShowPauseOptions] = useState(false);

  const hasCgmData = true;
  const hasSportData = true;
  const hasMealData = true;

  const handlePause = (duration: string) => {
    setPauseDuration(duration);
    setAnalysisPaused(true);
    setShowPauseOptions(false);
  };

  const handleResume = () => {
    setAnalysisPaused(false);
    setPauseDuration(null);
  };

  const glucoseColor = latestGlucose.value < 70 ? 'text-accent-low' : latestGlucose.value > 180 ? 'text-accent-high' : 'text-accent-good';

  const isCardAvailable = (card: typeof cards[0]) => {
    if (card.needsCgm && !hasCgmData) return false;
    if (card.needsSport && !hasSportData) return false;
    if (card.needsMeals && !hasMealData) return false;
    return true;
  };

  return (
    <div className="p-4 space-y-4 pb-8 overflow-y-auto">
      <h1 className="text-xl font-satoshi-bold tracking-tight pt-4">Analyses</h1>

      {/* Pause banner */}
      {analysisPaused && (
        <div className="bg-accent-low/10 border border-accent-low/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <PauseCircle size={18} className="text-accent-low shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-satoshi-bold text-foreground">Analyses en pause</p>
                <p className="text-xs text-muted-foreground">
                  Durée : {pauseDurations.find(p => p.value === pauseDuration)?.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Les repas et activités restent enregistrés mais ne sont pas inclus dans les analyses.
                </p>
              </div>
            </div>
            <button
              onClick={handleResume}
              className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
            >
              <PlayCircle size={20} className="text-accent-good" />
            </button>
          </div>
        </div>
      )}

      {/* CGM banner */}
      {hasCgmData ? (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground font-satoshi-medium">Dernière synchro · {latestGlucose.timestamp}</p>
            <span className={glucoseColor}>{trendIcons[latestGlucose.trend]}</span>
          </div>
          <p className={`text-4xl font-satoshi-black tabular-nums ${glucoseColor}`}>
            {latestGlucose.value}<span className="text-lg ml-1 text-muted-foreground font-satoshi-medium">mg/dL</span>
          </p>
        </div>
      ) : (
        <MissingDataBanner message="Aucune donnée CGM. Synchronisez votre Dexcom pour accéder aux analyses." />
      )}

      {/* Time in Range chart */}
      <TimeInRangeChart />

      {/* Pause / Resume analyses button */}
      {!analysisPaused && (
        <div>
          <button
            onClick={() => setShowPauseOptions(!showPauseOptions)}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-border text-sm font-satoshi-medium text-muted-foreground hover:border-accent-low/50 hover:text-accent-low transition-colors"
          >
            <PauseCircle size={16} />
            <span>Mettre les analyses en pause</span>
          </button>

          {showPauseOptions && (
            <div className="mt-2 bg-card rounded-xl border border-border p-3 space-y-1.5">
              <p className="text-xs text-muted-foreground font-satoshi-medium mb-2">Pendant combien de temps ?</p>
              <div className="grid grid-cols-3 gap-2">
                {pauseDurations.map(d => (
                  <button
                    key={d.value}
                    onClick={() => handlePause(d.value)}
                    className="px-2 py-2 rounded-lg text-xs font-satoshi-medium bg-muted text-muted-foreground hover:bg-accent-low/10 hover:text-accent-low transition-colors"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis grid */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map(card => {
          const available = isCardAvailable(card);
          return (
            <button
              key={card.key}
              onClick={() => available && navigate(`/insights/${card.key}`)}
              className={`bg-card rounded-xl border border-border p-4 text-left transition-all duration-200 ${
                available
                  ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]'
                  : 'opacity-50 cursor-not-allowed'
              } ${analysisPaused ? 'opacity-60' : ''}`}
              disabled={!available}
            >
              <card.icon size={22} className="text-primary mb-3" />
              <p className="text-sm font-satoshi-bold mb-0.5">{card.title}</p>
              <p className="text-xs text-muted-foreground mb-3 leading-tight">{card.subtitle}</p>
              {available ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11px] font-satoshi-medium px-2 py-1 rounded-md ${analysisPaused ? 'text-accent-low bg-accent-low/10' : card.badgeColor}`}>
                    {analysisPaused ? 'En pause' : card.badge}
                  </span>
                  {!analysisPaused && <AiBadge className="mt-0.5" />}
                </div>
              ) : (
                <span className="text-[11px] font-satoshi-medium px-2 py-1 rounded-md text-muted-foreground bg-muted">
                  Données manquantes
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsDashboard;
