import { getRecentSport, sportInsulinImpacts, usualCarbRatio } from '@/lib/mockData';
import { Activity } from 'lucide-react';

interface SportRatioAlertProps {
  carbsGrams: number;
}

const formatTimeAgo = (timestamp: string): string => {
  const ms = Date.now() - new Date(timestamp.replace(' ', 'T')).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem < 5) return `il y a ${hours}h`;
  return `il y a ${hours}h${String(rem).padStart(2, '0')}`;
};

const SportRatioAlert = ({ carbsGrams }: SportRatioAlertProps) => {
  const recentSport = getRecentSport();
  if (!recentSport) return null;

  const impact = sportInsulinImpacts.find(s => s.sportType === recentSport.activity);
  if (!impact) return null;

  // Check if sport is within the impact time window
  const hoursAgo = (Date.now() - new Date(recentSport.timestamp.replace(' ', 'T')).getTime()) / 3600000;
  if (hoursAgo > impact.hoursWindow) return null;

  const usualDose = Math.round((carbsGrams / usualCarbRatio) * 10) / 10;
  const adjustedDose = Math.round((carbsGrams / impact.adjustedRatio) * 10) / 10;
  const deltaDirection = impact.avgGlucoseDelta < 0 ? 'baisser' : 'monter';
  const absDelta = Math.abs(impact.avgGlucoseDelta);

  return (
    <div className="bg-accent-low/10 border border-accent-low/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-accent-low" />
        <p className="text-sm font-satoshi-bold text-accent-low">
          {recentSport.activity} · {formatTimeAgo(recentSport.timestamp)}
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-satoshi-medium">Ratio habituel</span>
          <span className="font-satoshi-medium text-muted-foreground">
            1u : {usualCarbRatio}g → <span className="font-satoshi-bold text-foreground">{usualDose}u</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent-low font-satoshi-medium">Ratio recommandé</span>
          <span className="font-satoshi-medium text-accent-low">
            1u : {impact.adjustedRatio}g → <span className="font-satoshi-bold">{adjustedDose}u</span>
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Les {impact.mealsAnalyzed} derniers repas après une {recentSport.activity.toLowerCase()} avec un ratio
        de 1u:{usualCarbRatio}g ont fait {deltaDirection} la glycémie de {absDelta} mg/dL en moyenne
        sur {impact.periodHours}h post-injection.
      </p>
    </div>
  );
};

export default SportRatioAlert;
