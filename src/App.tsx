import AppShell from "@/components/AppShell";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BasalDetail from "@/pages/BasalDetail";
import CarbRatioDetail from "@/pages/CarbRatioDetail";
import ChatDashboard from "@/pages/ChatDashboard";
import InsightsDashboard from "@/pages/InsightsDashboard";
import MealDashboard from "@/pages/MealDashboard";
import MedicationDashboard from "@/pages/MedicationDashboard";
import NightlyDetail from "@/pages/NightlyDetail";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import SportDashboard from "@/pages/SportDashboard";
import SportDetail from "@/pages/SportDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<ChatDashboard />} />
            <Route path="/meals" element={<MealDashboard />} />
            <Route path="/medication" element={<MedicationDashboard />} />
            <Route path="/sport" element={<SportDashboard />} />
            <Route path="/insights" element={<InsightsDashboard />} />
            <Route path="/insights/carb-ratio" element={<CarbRatioDetail />} />
            <Route path="/insights/sport" element={<SportDetail />} />
            <Route path="/insights/nightly" element={<NightlyDetail />} />
            <Route path="/insights/basal" element={<BasalDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
