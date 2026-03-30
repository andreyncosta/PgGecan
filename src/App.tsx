import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CockpitExecutivo from "./pages/CockpitExecutivo";
import RankingComparativos from "./pages/RankingComparativos";
import MapaEstrategico from "./pages/MapaEstrategico";
import Cockpit360 from "./pages/Cockpit360";
import AtendimentoProducao from "./pages/AtendimentoProducao";
import Territorial from "./pages/Territorial";
import EstruturaGovernanca from "./pages/EstruturaGovernanca";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CockpitExecutivo />} />
          <Route path="/ranking" element={<RankingComparativos />} />
          <Route path="/mapa" element={<MapaEstrategico />} />
          <Route path="/unidade/:id" element={<Cockpit360 />} />
          <Route path="/unidade/:id/atendimento" element={<AtendimentoProducao />} />
          <Route path="/unidade/:id/territorial" element={<Territorial />} />
          <Route path="/unidade/:id/estrutura" element={<EstruturaGovernanca />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
