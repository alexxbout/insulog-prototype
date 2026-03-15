import SportActivityBuilder from '@/components/SportActivityBuilder';
import { sportSessions, type SportSession } from '@/lib/mockData';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const typeEmojis: Record<string, string> = {
  'Course': '🏃',
  'Musculation': '🏋️',
  'Yoga': '🧘',
  'Natation': '🏊',
  'Vélo': '🚴',
  'Sport collectif': '⚽',
  'Marche': '🚶',
  'Autre': '🏅',
};

const SportDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [extraSessions, setExtraSessions] = useState<SportSession[]>([]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const sessions = useMemo(() => {
    const all = [...sportSessions, ...extraSessions];
    return all.filter(s => s.timestamp.startsWith(selectedDate)).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [selectedDate, extraSessions]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    if (isToday) return "Aujourd'hui";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Hier';
    return d.toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const navigateDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    const today = new Date().toISOString().split('T')[0];
    const newDate = d.toISOString().split('T')[0];
    if (newDate > today) return;
    setSelectedDate(newDate);
  };

  const handleSave = (session: SportSession) => {
    setExtraSessions(prev => [...prev, session]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date navigator */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={() => navigateDay(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft size={20} className="text-muted-foreground" />
        </button>
        <p className="text-sm font-satoshi-bold text-foreground capitalize">{formatDate(selectedDate)}</p>
        <button
          onClick={() => navigateDay(1)}
          disabled={isToday}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 px-4 space-y-3 pb-24 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Aucune activité enregistrée</p>
            <p className="text-xs mt-1">Ajoutez une activité sportive ci-dessous</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                    {typeEmojis[session.activity] || typeEmojis['Autre']}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-satoshi-bold text-foreground">{session.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.duration} min · {session.type}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {session.timestamp.split(' ')[1]?.substring(0, 5)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add button */}
        <button
          onClick={() => setShowBuilder(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-satoshi-medium">Ajouter une activité</span>
        </button>
      </div>

      {showBuilder && (
        <SportActivityBuilder
          onClose={() => setShowBuilder(false)}
          onSave={handleSave}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default SportDashboard;
