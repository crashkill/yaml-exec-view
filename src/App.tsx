import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Teams from "./pages/Teams";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { PERMISSIONS } from "@/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projetos" 
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.PROJECT_READ}>
                  <AppLayout>
                    <Projects />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/equipes" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Teams />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Relatórios</h1>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.USER_READ_ALL}>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Usuários</h1>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Configurações</h1>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
