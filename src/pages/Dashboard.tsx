import { MetricCard } from "@/components/dashboard/MetricCard";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { CriticalProjectsList } from "@/components/dashboard/CriticalProjectsList";
import { CriticalityGauge } from "@/components/dashboard/CriticalityGauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Target
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Executivo</h1>
        <p className="text-muted-foreground">
          Visão geral dos projetos corporativos • Atualizado em {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Projetos"
          value="93"
          icon={FolderKanban}
          change={{ value: 12, type: "increase" }}
          badge={{ text: "Ativo", variant: "success" }}
        />
        
        <MetricCard
          title="Em Andamento"
          value="28"
          icon={Clock}
          change={{ value: 5, type: "increase" }}
          badge={{ text: "On Track", variant: "default" }}
        />
        
        <MetricCard
          title="Projetos Críticos"
          value="8"
          icon={AlertTriangle}
          change={{ value: 3, type: "decrease" }}
          badge={{ text: "Atenção", variant: "warning" }}
        />
        
        <MetricCard
          title="Taxa de Sucesso"
          value="87%"
          icon={Target}
          change={{ value: 4, type: "increase" }}
          badge={{ text: "Meta: 85%", variant: "success" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <ProjectStatusChart />
          
          {/* Financial Overview */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success" />
                Visão Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                  <p className="text-2xl font-bold text-success">R$ 2.4M</p>
                  <p className="text-sm text-muted-foreground">Orçamento Total</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg">
                  <p className="text-2xl font-bold text-warning">R$ 1.8M</p>
                  <p className="text-sm text-muted-foreground">Executado</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">R$ 600K</p>
                  <p className="text-sm text-muted-foreground">Disponível</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Overall Health */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Saúde Geral dos Projetos</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CriticalityGauge 
                value={73} 
                size="lg" 
                label="Score Corporativo"
                showValue={true}
              />
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Desempenho das Equipes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Desenvolvimento</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-success w-4/5"></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Design</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/5"></div>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Marketing</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-warning w-2/3"></div>
                  </div>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-destructive" />
                Próximos Prazos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Sistema de Pagamentos</p>
                  <p className="text-xs text-muted-foreground">Ana Santos</p>
                </div>
                <span className="text-xs font-medium text-destructive">2 dias</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">App Mobile v2.0</p>
                  <p className="text-xs text-muted-foreground">Carlos Lima</p>
                </div>
                <span className="text-xs font-medium text-warning">1 semana</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Migração Cloud</p>
                  <p className="text-xs text-muted-foreground">Rita Ferreira</p>
                </div>
                <span className="text-xs font-medium text-primary">2 semanas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Critical Projects Section */}
      <CriticalProjectsList />
    </div>
  );
}