import { Utensils, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMeals = location.pathname === '/' || location.pathname.startsWith('/meals');
  const isInsights = location.pathname.startsWith('/insights');

  return (
    <div className="flex flex-col h-[100dvh] max-w-[430px] mx-auto bg-background relative overflow-hidden">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <nav className="h-20 border-t border-border bg-card flex items-start pt-2 px-8 justify-around pb-safe shrink-0">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors duration-150 ${
            isMeals ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Utensils size={24} />
          <span className="text-xs font-satoshi-medium">Meals</span>
        </button>
        <button
          onClick={() => navigate('/insights')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors duration-150 ${
            isInsights ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-xs font-satoshi-medium">Insights</span>
        </button>
      </nav>
    </div>
  );
};

export default AppShell;
