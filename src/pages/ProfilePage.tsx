import { mockUserProfile } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RAPID_INSULIN_TYPES = ['Novorapid', 'Humalog', 'Fiasp', 'Lyumjev', 'Apidra', 'Autre'];
const LONG_INSULIN_TYPES = ['Lantus', 'Toujeo', 'Levemir', 'Tresiba', 'Autre'];

const CONTEXT_TAGS = [
  { id: 'stress', label: 'Stress', emoji: '😤' },
  { id: 'illness', label: 'Maladie', emoji: '🤒' },
  { id: 'alcohol', label: 'Alcool', emoji: '🍷' },
  { id: 'cycle', label: 'Cycle menstruel', emoji: '🔄' },
  { id: 'sleep', label: 'Manque de sommeil', emoji: '😴' },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(mockUserProfile.firstName);
  const [weightKg, setWeightKg] = useState(mockUserProfile.weightKg);
  const [rapidInsulinType, setRapidInsulinType] = useState(mockUserProfile.rapidInsulinType);
  const [longInsulinType, setLongInsulinType] = useState(mockUserProfile.longInsulinType);
  const [diaHours, setDiaHours] = useState(mockUserProfile.diaHours);
  const [carbRatio, setCarbRatio] = useState(mockUserProfile.carbRatio);
  const [todayContext, setTodayContext] = useState<string[]>(mockUserProfile.todayContext);

  const toggleContext = (id: string) => {
    setTodayContext(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    mockUserProfile.firstName = firstName;
    mockUserProfile.weightKg = weightKg;
    mockUserProfile.rapidInsulinType = rapidInsulinType;
    mockUserProfile.longInsulinType = longInsulinType;
    mockUserProfile.diaHours = diaHours;
    mockUserProfile.carbRatio = carbRatio;
    mockUserProfile.todayContext = todayContext;
    toast.success('Profil enregistré');
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-lg font-satoshi-bold flex-1">Profil</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-satoshi-bold transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Enregistrer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-5 pb-8">

        {/* ── Section 1 : Informations de base ─────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">
            Informations de base
          </p>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            {/* Prénom */}
            <div className="space-y-1.5">
              <label className="text-xs font-satoshi-bold text-muted-foreground">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full h-10 bg-background border border-border rounded-lg px-3 text-sm font-satoshi-medium text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            {/* Poids */}
            <div className="space-y-1.5">
              <label className="text-xs font-satoshi-bold text-muted-foreground">Poids</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWeightKg(w => Math.max(20, w - 1))}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold active:scale-95 transition-all"
                >
                  −
                </button>
                <div className="flex-1 h-10 bg-background border border-border rounded-lg flex items-center justify-center gap-1.5">
                  <span className="text-xl font-satoshi-black tabular-nums text-foreground">{weightKg}</span>
                  <span className="text-sm text-muted-foreground font-satoshi-medium">kg</span>
                </div>
                <button
                  onClick={() => setWeightKg(w => Math.min(250, w + 1))}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Utilisé pour normaliser les doses et calculer le FSI théorique
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2 : Insuline ──────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">
            Insuline
          </p>
          <div className="bg-card rounded-xl border border-border p-4 space-y-5">
            {/* Type insuline rapide */}
            <div className="space-y-2">
              <label className="text-xs font-satoshi-bold text-muted-foreground">Insuline rapide</label>
              <div className="flex flex-wrap gap-2">
                {RAPID_INSULIN_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setRapidInsulinType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-satoshi-medium transition-all ${
                      rapidInsulinType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Type insuline lente */}
            <div className="space-y-2">
              <label className="text-xs font-satoshi-bold text-muted-foreground">Insuline lente</label>
              <div className="flex flex-wrap gap-2">
                {LONG_INSULIN_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setLongInsulinType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-satoshi-medium transition-all ${
                      longInsulinType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* DIA slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-satoshi-bold text-muted-foreground">
                  DIA — durée d'action
                </label>
                <span className="text-sm font-satoshi-black tabular-nums text-foreground">
                  {diaHours}h
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={6}
                step={0.5}
                value={diaHours}
                onChange={e => setDiaHours(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>3h (Fiasp)</span>
                <span>4h (standard)</span>
                <span>6h (lente)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Détermine la durée de calcul de l'insuline active (IOB)
              </p>
            </div>

            {/* Ratio glucides/insuline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-satoshi-bold text-muted-foreground">
                  Ratio glucides / insuline
                </label>
                <span className="text-sm font-satoshi-black tabular-nums text-foreground">
                  1u / {carbRatio}g
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCarbRatio(r => Math.max(5, r - 1))}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold active:scale-95 transition-all"
                >
                  −
                </button>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${((carbRatio - 5) / 20) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setCarbRatio(r => Math.min(25, r + 1))}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-satoshi-bold active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Point de départ avant calibrage ML — 1 unité pour {carbRatio}g de glucides
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 3 : Contexte du jour ─────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-satoshi-bold text-muted-foreground uppercase tracking-wide">
            Contexte du jour
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ces facteurs modifient la sensibilité à l'insuline. Activer ceux qui s'appliquent aujourd'hui — ils seront inclus dans les données d'entraînement ML pour expliquer les variations de réponse glycémique.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {CONTEXT_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleContext(tag.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-satoshi-medium transition-all border ${
                  todayContext.includes(tag.id)
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground'
                }`}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
