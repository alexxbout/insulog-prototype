import InjectionSiteSelector, { type BodySide, type BodyZone } from '@/components/InjectionSiteSelector';
import { insulinLogs, type InsulinLog } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Plus, Syringe } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const zoneLabels: Record<string, string> = {
  thigh: 'Cuisse',
  arm: 'Bras',
  belly: 'Ventre',
  buttock: 'Fesse',
};

const sideLabels: Record<string, string> = {
  left: 'gauche',
  right: 'droite',
  center: 'centre',
};

// ── Long-acting insulin form (overlay) ─────────────────────────────

interface BasalInsulinFormProps {
  onClose: () => void;
  onSave: (log: InsulinLog) => void;
}

const BasalInsulinForm = ({ onClose, onSave }: BasalInsulinFormProps) => {
  const [dose, setDose] = useState(14);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [zone, setZone] = useState<BodyZone | null>(null);
  const [side, setSide] = useState<BodySide | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (dose <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    onSave({
      id: `il-${Date.now()}`,
      type: 'long',
      dose,
      timestamp: `${today} ${time}`,
      injectionZone: zone || undefined,
      injectionSide: side || undefined,
      note: note || undefined,
    });
    toast.success('Insuline lente enregistrée');
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-lg font-satoshi-bold flex-1">Insuline lente</h2>
        <button
          onClick={handleSave}
          disabled={dose <= 0}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-satoshi-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          Enregistrer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Dose */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Dose (unités)</p>
          <div className="flex items-center gap-3 justify-center p-3 bg-card rounded-xl border border-border">
            <button
              onClick={() => setDose(Math.max(0.5, dose - 0.5))}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-satoshi-bold transition-all active:scale-95"
            >
              −
            </button>
            <div className="text-center min-w-[80px]">
              <input
                type="number"
                value={dose}
                onChange={e => setDose(Math.max(0, parseFloat(e.target.value) || 0))}
                step={0.5}
                className="w-20 text-center text-3xl font-satoshi-black tabular-nums bg-transparent outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground">unités</p>
            </div>
            <button
              onClick={() => setDose(dose + 0.5)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-satoshi-bold transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Heure d'injection</p>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm font-satoshi-medium text-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Injection site */}
        <InjectionSiteSelector
          zone={zone}
          side={side}
          onChangeZone={setZone}
          onChangeSide={setSide}
        />

        {/* Note */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Note</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ajouter une note..."
            rows={2}
            className="w-full px-3 py-2 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none"
          />
        </div>

        {/* Bottom save button */}
        <button
          onClick={handleSave}
          disabled={dose <= 0}
          className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-satoshi-bold text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          Enregistrer l'injection
        </button>
      </div>
    </motion.div>
  );
};

// ── Main page ──────────────────────────────────────────────────────

// ── Correction rapid insulin form (overlay) ────────────────────────

interface CorrectionInsulinFormProps {
  onClose: () => void;
  onSave: (log: InsulinLog) => void;
}

const CorrectionInsulinForm = ({ onClose, onSave }: CorrectionInsulinFormProps) => {
  const [dose, setDose] = useState(1);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (dose <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    onSave({
      id: `il-${Date.now()}`,
      type: 'rapid',
      dose,
      timestamp: `${today} ${time}`,
      reason: 'correction',
      note: note || undefined,
    });
    toast.success('Correction enregistrée');
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.25, ease: [0.3, 0, 0.5, 1] }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-lg font-satoshi-bold flex-1">Correction rapide</h2>
        <button
          onClick={handleSave}
          disabled={dose <= 0}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-satoshi-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          Enregistrer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Dose */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Dose (unités)</p>
          <div className="flex items-center gap-3 justify-center p-3 bg-card rounded-xl border border-border">
            <button
              onClick={() => setDose(Math.max(0.5, dose - 0.5))}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-satoshi-bold transition-all active:scale-95"
            >
              −
            </button>
            <div className="text-center min-w-[80px]">
              <input
                type="number"
                value={dose}
                onChange={e => setDose(Math.max(0, parseFloat(e.target.value) || 0))}
                step={0.5}
                className="w-20 text-center text-3xl font-satoshi-black tabular-nums bg-transparent outline-none text-foreground"
              />
              <p className="text-xs text-muted-foreground">unités</p>
            </div>
            <button
              onClick={() => setDose(dose + 0.5)}
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-satoshi-bold transition-all active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Heure d'injection</p>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm font-satoshi-medium text-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Note */}
        <div>
          <p className="text-sm font-satoshi-bold text-foreground mb-3">Note</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ex: glycémie haute après collation..."
            rows={2}
            className="w-full px-3 py-2 bg-muted rounded-lg border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none"
          />
        </div>

        {/* Bottom save button */}
        <button
          onClick={handleSave}
          disabled={dose <= 0}
          className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-satoshi-bold text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          Enregistrer la correction
        </button>
      </div>
    </motion.div>
  );
};

// ── Main page ──────────────────────────────────────────────────────

const MedicationDashboard = () => {
  const [showBasalForm, setShowBasalForm] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [extraLogs, setExtraLogs] = useState<InsulinLog[]>([]);

  const allLogs = useMemo(() => {
    return [...insulinLogs, ...extraLogs]
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [extraLogs]);

  // Group by date
  const groupedLogs = useMemo(() => {
    const groups: Record<string, InsulinLog[]> = {};
    for (const log of allLogs) {
      const date = log.timestamp.split(' ')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [allLogs]);

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return "Aujourd'hui";
    if (dateStr === yesterday) return 'Hier';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Find last long-acting dose
  const lastBasal = allLogs.find(l => l.type === 'long');
  const lastBasalTime = lastBasal ? lastBasal.timestamp.split(' ')[1] : null;
  const lastBasalAgo = lastBasal
    ? (() => {
        const diff = Date.now() - new Date(lastBasal.timestamp.replace(' ', 'T')).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'il y a moins d\'1h';
        if (hours < 24) return `il y a ${hours}h`;
        return `il y a ${Math.floor(hours / 24)}j`;
      })()
    : null;

  const handleSaveBasal = (log: InsulinLog) => {
    setExtraLogs(prev => [...prev, log]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-satoshi-bold text-foreground">Médication</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Suivi de vos injections d'insuline</p>
      </div>

      {/* Summary card: last basal */}
      {lastBasal && (
        <div className="mx-4 mb-4 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Syringe size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-satoshi-bold text-foreground">Dernière lente : {lastBasal.dose}u</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{lastBasalTime} · {lastBasalAgo}</span>
                {lastBasal.injectionZone && (
                  <span>· {zoneLabels[lastBasal.injectionZone] || lastBasal.injectionZone} {lastBasal.injectionSide ? sideLabels[lastBasal.injectionSide] : ''}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {groupedLogs.map(([date, logs]) => (
          <div key={date}>
            <p className="text-xs font-satoshi-bold text-muted-foreground tracking-wide mb-2 capitalize">
              {formatDate(date)}
            </p>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                    log.type === 'long' ? 'bg-primary/10' : 'bg-accent-good/10'
                  }`}>
                    {log.type === 'long' ? '💉' : '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-satoshi-bold text-foreground">
                        {log.type === 'long' ? 'Insuline lente' : 'Insuline rapide'}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-satoshi-bold ${
                        log.type === 'long' ? 'bg-primary/10 text-primary' : 'bg-accent-good/10 text-accent-good'
                      }`}>
                        {log.dose}u
                      </span>
                      {log.reason === 'correction' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-satoshi-bold bg-accent-low/10 text-accent-low">Correction</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{log.timestamp.split(' ')[1]}</span>
                      {log.injectionZone && (
                        <span>· {zoneLabels[log.injectionZone] || log.injectionZone} {log.injectionSide ? sideLabels[log.injectionSide] : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add basal button */}
        <button
          onClick={() => setShowBasalForm(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-satoshi-medium">Enregistrer une dose d'insuline lente</span>
        </button>

        {/* Add correction button */}
        <button
          onClick={() => setShowCorrectionForm(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-accent-low/50 hover:text-foreground transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-satoshi-medium">Enregistrer une correction rapide</span>
        </button>
      </div>

      {showBasalForm && (
        <BasalInsulinForm
          onClose={() => setShowBasalForm(false)}
          onSave={handleSaveBasal}
        />
      )}
      {showCorrectionForm && (
        <CorrectionInsulinForm
          onClose={() => setShowCorrectionForm(false)}
          onSave={handleSaveBasal}
        />
      )}
    </div>
  );
};

export default MedicationDashboard;
