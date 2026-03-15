import { sportSessions } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const filters = ['Tous', 'Cardio', 'Musculation', 'Autre'] as const;

const filterToType: Record<string, string> = {
  'Tous': 'All',
  'Cardio': 'Cardio',
  'Musculation': 'Strength',
  'Autre': 'Other',
};

const SportDetail = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('Tous');

  const filtered = filter === 'Tous' ? sportSessions : sportSessions.filter(s => s.type === filterToType[filter]);

  const typeLabels: Record<string, string> = { Cardio: 'Cardio', Strength: 'Musculation', Other: 'Autre' };

  const avgByType = ['Cardio', 'Strength', 'Other'].map(type => {
    const sessions = sportSessions.filter(s => s.type === type);
    const avg = sessions.length ? Math.round(sessions.reduce((s, ss) => s + ss.glucoseDelta, 0) / sessions.length) : 0;
    return { type, label: typeLabels[type], avg, count: sessions.length };
  });

  return (
    <div className="p-4 space-y-4 pb-8">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate('/insights')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-satoshi-bold tracking-tight">Sport & Glycémie</h1>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-satoshi-medium transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Session cards */}
      {filtered.map(session => (
        <div key={session.id} className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-satoshi-bold">{session.activity}</p>
              <p className="text-xs text-muted-foreground">{session.duration} min · {session.type}</p>
            </div>
            <span className={`text-sm font-satoshi-bold tabular-nums ${session.glucoseDelta < 0 ? 'text-accent-good' : 'text-accent-low'}`}>
              {session.glucoseDelta > 0 ? '+' : ''}{session.glucoseDelta} mg/dL
            </span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={session.glucoseCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} tickFormatter={v => `${v}m`} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={['auto', 'auto']} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Variation glycémique moyenne</p>
        <div className="space-y-2">
          {avgByType.map(a => (
            <div key={a.type} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{a.label} ({a.count} séances)</span>
              <span className={`font-satoshi-bold tabular-nums ${a.avg < 0 ? 'text-accent-good' : 'text-accent-low'}`}>
                {a.avg > 0 ? '+' : ''}{a.avg} mg/dL
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportDetail;
