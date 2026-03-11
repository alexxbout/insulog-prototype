import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import MealDashboard from "@/pages/MealDashboard";
import InsightsDashboard from "@/pages/InsightsDashboard";
import CarbRatioDetail from "@/pages/CarbRatioDetail";
import SportDetail from "@/pages/SportDetail";
import NightlyDetail from "@/pages/NightlyDetail";
import BasalDetail from "@/pages/BasalDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<MealDashboard />} />
            <Route path="/insights" element={<InsightsDashboard />} />
            <Route path="/insights/carb-ratio" element={<CarbRatioDetail />} />
            <Route path="/insights/sport" element={<SportDetail />} />
            <Route path="/insights/nightly" element={<NightlyDetail />} />
            <Route path="/insights/basal" element={<BasalDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
