import { BarChart3, Dumbbell, MessageCircle, Pill, Utensils } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isChat = location.pathname === '/';
  const isMeals = location.pathname === '/meals' || location.pathname.startsWith('/meals/');
  const isMedication = location.pathname === '/medication' || location.pathname.startsWith('/medication/');
  const isSport = location.pathname === '/sport' || location.pathname.startsWith('/sport/');
  const isInsights = location.pathname.startsWith('/insights');

  const tabs = [
    { key: 'chat', label: 'Chat', icon: MessageCircle, path: '/', active: isChat },
    { key: 'meals', label: 'Repas', icon: Utensils, path: '/meals', active: isMeals },
    { key: 'medication', label: 'Médication', icon: Pill, path: '/medication', active: isMedication },
    { key: 'sport', label: 'Sport', icon: Dumbbell, path: '/sport', active: isSport },
    { key: 'insights', label: 'Analyses', icon: BarChart3, path: '/insights', active: isInsights },
  ];

  return (
    <div className="flex flex-col h-[100dvh] max-w-[430px] mx-auto bg-background relative overflow-hidden">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <nav className="h-20 border-t border-border bg-card flex items-start pt-2 px-4 justify-around pb-safe shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors duration-150 ${
              tab.active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <tab.icon size={22} />
            <span className="text-[10px] font-satoshi-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AppShell;
