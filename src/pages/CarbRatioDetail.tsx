import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ScatterChart, Scatter, ResponsiveContainer, ZAxis } from 'recharts';
import { postMealGlucose, carbRatioScatter } from '@/lib/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md shadow-lg px-3 py-2 text-xs">
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-satoshi-medium tabular-nums">
          <span className="text-muted-foreground">{p.name}: </span>
          <span className="text-foreground">{Math.round(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const CarbRatioDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4 pb-8">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate('/insights')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-satoshi-bold tracking-tight">Carb Ratio Analysis</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Ratio', value: '1:12g' },
          { label: 'Meals Analyzed', value: '47' },
          { label: 'In Target', value: '72%' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-lg font-satoshi-bold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Post-meal glucose curve */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Post-Meal Glucose (3h)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={postMealGlucose}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={v => `${v}m`} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={[60, 200]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
            <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter plot */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Carbs vs Glucose Delta (+2h)</p>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="carbs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} name="Carbs (g)" />
            <YAxis dataKey="delta" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} name="Δ Glucose" />
            <ZAxis range={[40, 40]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={carbRatioScatter.filter(d => !d.sport)} fill="hsl(var(--primary))" name="No sport" />
            <Scatter data={carbRatioScatter.filter(d => d.sport)} fill="hsl(var(--accent-good))" name="Post-sport" />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" />No sport</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-accent-good" />Post-sport</span>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-medium text-muted-foreground leading-relaxed">
          Your ratio appears less effective within 4h after cardio activity. Consider adjusting your carb ratio from 1:12 to 1:15 for post-exercise meals.
        </p>
      </div>
    </div>
  );
};

export default CarbRatioDetail;
