import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Teams from "./pages/Teams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/projetos" element={<AppLayout><Projects /></AppLayout>} />
          <Route path="/equipes" element={<AppLayout><Teams /></AppLayout>} />
          <Route path="/relatorios" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Relatórios</h1></div></AppLayout>} />
          <Route path="/usuarios" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Usuários</h1></div></AppLayout>} />
          <Route path="/configuracoes" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1></div></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
