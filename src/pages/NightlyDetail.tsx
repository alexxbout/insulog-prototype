import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { nightlyData } from '@/lib/mockData';

const ranges = [
  { label: '7 nights', value: 7 },
  { label: '14 nights', value: 14 },
] as const;

const NightlyDetail = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState(7);

  const data = nightlyData.slice(0, range);

  // Average curve
  const avgCurve = Array.from({ length: 97 }, (_, i) => {
    const hour = i * 5 / 60;
    const values = data.map(d => d.readings[i]?.value).filter(Boolean);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { hour: Math.round(hour * 10) / 10, avg: Math.round(avg), min, max };
  });

  const allEvents = data.flatMap(d => d.events.map(e => ({ ...e, date: d.label })));

  return (
    <div className="p-4 space-y-4 pb-8">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate('/insights')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-satoshi-bold tracking-tight">Nocturnal Patterns</h1>
      </div>

      {/* Range selector */}
      <div className="flex gap-2">
        {ranges.map(r => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-satoshi-medium transition-colors ${
              range === r.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Glucose Heatmap (00h–08h)</p>
        <div className="space-y-1">
          {data.map(night => (
            <div key={night.date} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16 shrink-0 truncate">{night.label}</span>
              <div className="flex-1 flex gap-px">
                {Array.from({ length: 16 }, (_, i) => {
                  const reading = night.readings[i * 6]; // every 30min
                  const val = reading?.value || 100;
                  const color = val < 70 ? 'bg-accent-low' : val > 180 ? 'bg-accent-high' : val > 140 ? 'bg-accent-low/40' : 'bg-accent-good/40';
                  return <div key={i} className={`h-4 flex-1 rounded-sm ${color}`} title={`${val} mg/dL`} />;
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="w-16" />
            <div className="flex-1 flex justify-between text-[10px] text-muted-foreground">
              <span>00h</span><span>02h</span><span>04h</span><span>06h</span><span>08h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Average curve */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Average Nocturnal Glucose</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={avgCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} tickFormatter={v => `${Math.floor(v)}h`} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={[50, 220]} />
            <Area type="monotone" dataKey="max" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.08} />
            <Area type="monotone" dataKey="min" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
            <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Events */}
      {allEvents.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-satoshi-bold mb-3">Detected Events</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {allEvents.slice(0, 10).map((e, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${e.type === 'hypo' ? 'bg-accent-low' : 'bg-accent-high'}`} />
                  <span className="text-muted-foreground text-xs">{e.date}</span>
                </div>
                <span className={`font-satoshi-bold tabular-nums text-xs ${e.type === 'hypo' ? 'text-accent-low' : 'text-accent-high'}`}>
                  {e.value} mg/dL
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NightlyDetail;
