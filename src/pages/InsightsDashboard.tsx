import { useState } from 'react';
import { Scale, Zap, Moon, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { latestGlucose } from '@/lib/mockData';
import AiBadge from '@/components/AiBadge';
import MissingDataBanner from '@/components/MissingDataBanner';
import TimeInRangeChart from '@/components/TimeInRangeChart';

const trendIcons: Record<string, React.ReactNode> = {
  rising: <TrendingUp size={18} />,
  rising_fast: <TrendingUp size={18} />,
  falling: <TrendingDown size={18} />,
  falling_fast: <TrendingDown size={18} />,
  stable: <Minus size={18} />,
};

const cards = [
  { key: 'carb-ratio', title: 'Ratio glucidique', icon: Scale, subtitle: 'Efficacité insuline par repas', badge: '3 anomalies détectées', badgeColor: 'text-accent-low bg-accent-low/10', needsCgm: true, needsMeals: true },
  { key: 'sport', title: 'Impact sport', icon: Zap, subtitle: 'Glycémie pendant & après activité', badge: 'Bonne stabilité', badgeColor: 'text-accent-good bg-accent-good/10', needsCgm: true, needsSport: true },
  { key: 'nightly', title: 'Profils nocturnes', icon: Moon, subtitle: 'Tendances glycémiques nocturnes', badge: '2 hypos détectées', badgeColor: 'text-accent-high bg-accent-high/10', needsCgm: true },
  { key: 'basal', title: 'Analyse basale', icon: Activity, subtitle: 'Efficacité insuline basale', badge: 'Stable', badgeColor: 'text-accent-good bg-accent-good/10', needsCgm: true },
];

const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const hasCgmData = true;
  const hasSportData = true;
  const hasMealData = true;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
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

      {/* Sync button */}
      <button
        onClick={handleSync}
        disabled={syncing}
        className={`w-full h-12 rounded-lg font-satoshi-bold text-sm transition-all duration-150 ${
          syncing
            ? 'bg-secondary text-muted-foreground animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-secondary via-muted to-secondary'
            : 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]'
        }`}
      >
        {syncing ? 'Synchronisation...' : 'Synchroniser Dexcom'}
      </button>

      {/* Time in Range chart */}
      <TimeInRangeChart />

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
              }`}
              disabled={!available}
            >
              <card.icon size={22} className="text-primary mb-3" />
              <p className="text-sm font-satoshi-bold mb-0.5">{card.title}</p>
              <p className="text-xs text-muted-foreground mb-3 leading-tight">{card.subtitle}</p>
              {available ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11px] font-satoshi-medium px-2 py-1 rounded-md ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  <AiBadge className="mt-0.5" />
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
