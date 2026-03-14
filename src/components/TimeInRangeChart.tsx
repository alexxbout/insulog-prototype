import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import AiBadge from './AiBadge';

type Period = 3 | 7 | 14 | 30 | 90;

const periods: Period[] = [3, 7, 14, 30, 90];

// Mock TIR data per period
const tirData: Record<Period, { low: number; inRange: number; high: number }> = {
  3: { low: 8, inRange: 72, high: 20 },
  7: { low: 10, inRange: 68, high: 22 },
  14: { low: 9, inRange: 70, high: 21 },
  30: { low: 11, inRange: 65, high: 24 },
  90: { low: 12, inRange: 63, high: 25 },
};

const TimeInRangeChart = () => {
  const [period, setPeriod] = useState<Period>(7);
  const data = tirData[period];

  const chartData = [
    { name: 'Bas', value: data.low, color: 'hsl(var(--accent-low))' },
    { name: 'Cible', value: data.inRange, color: 'hsl(var(--accent-good))' },
    { name: 'Haut', value: data.high, color: 'hsl(var(--accent-high))' },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-satoshi-bold text-foreground">Temps dans la cible</h3>
        <AiBadge label="Données simulées" />
      </div>

      {/* Period selector */}
      <div className="flex gap-1">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-satoshi-medium transition-all duration-150 ${
              period === p
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {p}j
          </button>
        ))}
      </div>

      {/* Donut chart */}
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={48}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-satoshi-black tabular-nums text-accent-good">{data.inRange}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {chartData.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-muted-foreground font-satoshi-medium">{d.name}</span>
              </div>
              <span className="text-sm font-satoshi-bold tabular-nums text-foreground">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeInRangeChart;
