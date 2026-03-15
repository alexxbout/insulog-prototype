import { basalWindows } from '@/lib/mockData';
import { ArrowLeft, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const driftIcons = {
  rising: <TrendingUp size={16} className="text-accent-low" />,
  falling: <TrendingDown size={16} className="text-accent-good" />,
  stable: <Minus size={16} className="text-accent-good" />,
};

const driftColors = {
  rising: 'text-accent-low',
  falling: 'text-accent-good',
  stable: 'text-accent-good',
};

const BasalDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4 pb-8">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate('/insights')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-satoshi-bold tracking-tight">Analyse basale</h1>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Dérive glycémique moyenne par période</p>
        <div className="grid grid-cols-2 gap-3">
          {basalWindows.map(w => (
            <div key={w.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span className="text-xs font-satoshi-medium">{w.period}</span>
              <div className="flex items-center gap-1">
                {driftIcons[w.drift]}
                <span className={`text-xs font-satoshi-bold tabular-nums ${driftColors[w.drift]}`}>
                  {w.avgDrift > 0 ? '+' : ''}{w.avgDrift}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fasting windows */}
      {basalWindows.map(window => (
        <div key={window.id} className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-satoshi-bold">{window.period}</p>
              <p className="text-xs text-muted-foreground">{window.start} – {window.end}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {driftIcons[window.drift]}
              <span className={`text-sm font-satoshi-bold tabular-nums ${driftColors[window.drift]}`}>
                {window.avgDrift > 0 ? '+' : ''}{window.avgDrift} mg/dL
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={window.curve}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="min" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} tickFormatter={v => `${v}m`} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={['auto', 'auto']} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default BasalDetail;
