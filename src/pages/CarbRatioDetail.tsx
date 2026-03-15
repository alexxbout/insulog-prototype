import { carbRatioScatter, postMealGlucose } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';

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
        <h1 className="text-xl font-satoshi-bold tracking-tight">Ratio glucidique</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ratio moyen', value: '1:12g' },
          { label: 'Repas analysés', value: '47' },
          { label: 'Dans la cible', value: '72%' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-lg font-satoshi-bold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Post-meal glucose curve */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-bold mb-3">Glycémie post-repas (3h)</p>
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
        <p className="text-sm font-satoshi-bold mb-3">Glucides vs Delta glycémique (+2h)</p>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="carbs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} name="Carbs (g)" />
            <YAxis dataKey="delta" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} name="Δ Glucose" />
            <ZAxis range={[40, 40]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={carbRatioScatter.filter(d => !d.sport)} fill="hsl(var(--primary))" name="Sans sport" />
            <Scatter data={carbRatioScatter.filter(d => d.sport)} fill="hsl(var(--accent-good))" name="Après sport" />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" />Sans sport</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-accent-good" />Après sport</span>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-sm font-satoshi-medium text-muted-foreground leading-relaxed">
          Votre ratio semble moins efficace dans les 4h suivant une activité cardio. Envisagez d'ajuster votre ratio de 1:12 à 1:15 pour les repas post-exercice.
        </p>
      </div>
    </div>
  );
};

export default CarbRatioDetail;
