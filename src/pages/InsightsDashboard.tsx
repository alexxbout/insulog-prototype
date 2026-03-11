import { useState } from 'react';
import { Scale, Zap, Moon, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { latestGlucose } from '@/lib/mockData';

const trendIcons: Record<string, React.ReactNode> = {
  rising: <TrendingUp size={18} />,
  rising_fast: <TrendingUp size={18} />,
  falling: <TrendingDown size={18} />,
  falling_fast: <TrendingDown size={18} />,
  stable: <Minus size={18} />,
};

const cards = [
  { key: 'carb-ratio', title: 'Carb Ratio', icon: Scale, subtitle: 'Insulin efficiency per meal', badge: '3 anomalies detected', badgeColor: 'text-accent-low bg-accent-low/10' },
  { key: 'sport', title: 'Sport Impact', icon: Zap, subtitle: 'Glucose during & after activity', badge: 'Good stability', badgeColor: 'text-accent-good bg-accent-good/10' },
  { key: 'nightly', title: 'Nightly Patterns', icon: Moon, subtitle: 'Nocturnal glucose trends', badge: '2 low events', badgeColor: 'text-accent-high bg-accent-high/10' },
  { key: 'basal', title: 'Basal Analysis', icon: Activity, subtitle: 'Background insulin effectiveness', badge: 'Stable', badgeColor: 'text-accent-good bg-accent-good/10' },
];

const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const glucoseColor = latestGlucose.value < 70 ? 'text-accent-low' : latestGlucose.value > 180 ? 'text-accent-high' : 'text-accent-good';

  return (
    <div className="p-4 space-y-4 pb-8">
      <h1 className="text-xl font-satoshi-bold tracking-tight pt-4">Insights</h1>

      {/* CGM banner */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground font-satoshi-medium">Last CGM sync · {latestGlucose.timestamp}</p>
          <span className={glucoseColor}>{trendIcons[latestGlucose.trend]}</span>
        </div>
        <p className={`text-4xl font-satoshi-black tabular-nums ${glucoseColor}`}>
          {latestGlucose.value}<span className="text-lg ml-1 text-muted-foreground font-satoshi-medium">mg/dL</span>
        </p>
      </div>

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
        {syncing ? 'Syncing...' : 'Sync Dexcom data'}
      </button>

      {/* Analysis grid */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map(card => (
          <button
            key={card.key}
            onClick={() => navigate(`/insights/${card.key}`)}
            className="bg-card rounded-xl border border-border p-4 text-left transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
          >
            <card.icon size={22} className="text-primary mb-3" />
            <p className="text-sm font-satoshi-bold mb-0.5">{card.title}</p>
            <p className="text-xs text-muted-foreground mb-3 leading-tight">{card.subtitle}</p>
            <span className={`text-[11px] font-satoshi-medium px-2 py-1 rounded-md ${card.badgeColor}`}>
              {card.badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InsightsDashboard;
