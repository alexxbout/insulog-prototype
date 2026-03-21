import { mockUserProfile } from '@/lib/mockData';
import { Send, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatDashboard = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const suggestions = [
    "Comment était ma glycémie cette nuit ?",
    "Quel repas a causé le plus gros pic cette semaine ?",
    "Mon ratio glucidique est-il stable ?",
    "Résumé de ma journée d'hier",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — sera implémenté plus tard
    setQuery('');
  };

  return (
    <div className="flex flex-col h-full px-4">
      {/* Top bar with avatar */}
      <div className="flex items-center justify-end pt-4 pb-2">
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center transition-all hover:bg-primary/20 active:scale-95"
          aria-label="Profil"
        >
          {mockUserProfile.firstName ? (
            <span className="text-sm font-satoshi-bold text-primary">
              {mockUserProfile.firstName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User size={16} className="text-primary" />
          )}
        </button>
      </div>

      {/* Greeting */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-satoshi-bold text-foreground mb-8">
          Bonjour Alexandre
        </h1>

        {/* Suggestion chips */}
        <div className="w-full max-w-sm space-y-2 mb-6">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setQuery(s)}
              className="w-full text-left text-sm text-muted-foreground bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/50 transition-colors font-satoshi-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="pb-6 pt-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Posez une question..."
            className="w-full h-12 bg-card border border-border rounded-2xl pl-4 pr-12 text-sm font-satoshi-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDashboard;
