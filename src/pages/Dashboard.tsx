import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ProjectStatusChart } from "@/components/dashboard/ProjectStatusChart";
import { CriticalProjectsList } from "@/components/dashboard/CriticalProjectsList";
import { CriticalityIndicator } from "@/components/dashboard/CriticalityIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FolderKanban, 
  Users, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  Clock,
  Target
} from "lucide-react";
import { 
  formatCurrency, 
  formatPercentage
} from '@/utils';
import { PROJECT_STATUSES } from '@/types';

export default function Dashboard() {
  const { user, canAccessFinancialData } = useAuth();
  const { data: projects = [], isLoading, error, refetch } = useProjects();

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    if (!projects.length) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        criticalProjectsCount: 0,
        successRate: 0,
        totalBudget: 0,
        spentBudget: 0,
        availableBudget: 0,
        averageCriticality: 0,
        statusDistribution: [],
        criticalProjectsList: []
      };
    }

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Em Andamento').length;
    const criticalProjectsCount = projects.filter(p => p.criticidade_score > 66).length;
    const completedProjects = projects.filter(p => p.status === 'Concluído').length;
    const successRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    // Financial calculations (only if user has access)
    let totalBudget = 0;
    let spentBudget = 0;
    
    if (canAccessFinancialData()) {
      totalBudget = projects.reduce((sum, p) => sum + (p.orcamento_inicial || 0), 0);
      spentBudget = projects.reduce((sum, p) => sum + (p.custo_realizado || 0), 0);
    }

    const availableBudget = totalBudget - spentBudget;
    const averageCriticality = projects.reduce((sum, p) => sum + p.criticidade_score, 0) / totalProjects;

    // Status distribution for chart
    const statusCounts = Object.keys(PROJECT_STATUSES).reduce((acc, status) => {
      acc[status] = projects.filter(p => p.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: PROJECT_STATUSES[status as keyof typeof PROJECT_STATUSES].color
    }));

    const criticalProjectsList = projects
      .filter(p => p.criticidade_score > 66)
      .sort((a, b) => b.criticidade_score - a.criticidade_score)
      .slice(0, 5);

    return {
      totalProjects,
      activeProjects,
      criticalProjectsCount,
      successRate,
      totalBudget,
      spentBudget,
      availableBudget,
      averageCriticality,
      statusDistribution,
      criticalProjectsList
    };
  }, [projects, canAccessFinancialData]);

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard. 
            <button 
              onClick={() => refetch()} 
              className="ml-2 underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Executivo</h1>
          <p className="text-muted-foreground">
            Visão geral dos projetos corporativos • Atualizado em {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
        
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium">Bem-vindo, {user.nome}</p>
            <p className="text-xs text-muted-foreground">{user.departamento}</p>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))
        ) : (
          <>
            <MetricCard
              title="Total de Projetos"
              value={metrics.totalProjects}
              icon={FolderKanban}
              badge={{ text: "Ativos", variant: "default" }}
            />
            
            <MetricCard
              title="Em Andamento"
              value={metrics.activeProjects}
              icon={Clock}
              badge={{ 
                text: metrics.activeProjects > 0 ? "Ativo" : "Nenhum", 
                variant: metrics.activeProjects > 0 ? "success" : "secondary" 
              }}
            />
            
            <MetricCard
              title="Projetos Críticos"
              value={metrics.criticalProjectsCount}
              icon={AlertTriangle}
              badge={{ 
                text: metrics.criticalProjectsCount > 0 ? "Atenção" : "OK", 
                variant: metrics.criticalProjectsCount > 0 ? "destructive" : "success" 
              }}
            />
            
            <MetricCard
              title="Taxa de Sucesso"
              value={formatPercentage(metrics.successRate)}
              icon={Target}
              badge={{ 
                text: `Meta: 85%`, 
                variant: metrics.successRate >= 85 ? "success" : "warning" 
              }}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-64 w-full" />
            </Card>
          ) : (
            <ProjectStatusChart data={metrics.statusDistribution} />
          )}
          
          {/* Financial Overview - Only show if user has access */}
          {canAccessFinancialData() && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  Visão Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="text-center p-4 rounded-lg border">
                        <Skeleton className="h-8 w-24 mx-auto mb-2" />
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(metrics.totalBudget)}
                      </p>
                      <p className="text-sm text-muted-foreground">Orçamento Total</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg">
                      <p className="text-2xl font-bold text-warning">
                        {formatCurrency(metrics.spentBudget)}
                      </p>
                      <p className="text-sm text-muted-foreground">Executado</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(metrics.availableBudget)}
                      </p>
                      <p className="text-sm text-muted-foreground">Disponível</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Overall Health */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Saúde Geral dos Projetos</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {isLoading ? (
                <Skeleton className="h-32 w-32 rounded-full" />
              ) : (
                <CriticalityIndicator
                  project={{
                    id: 'overall',
                    criticidade_score: Math.round(metrics.averageCriticality)
                  } as any}
                  size="lg"
                  showDetails={false}
                />
              )}
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))
              ) : (
                <>
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
                </>
              )}
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              ) : (
                projects
                  .filter(p => p.data_fim_prevista && new Date(p.data_fim_prevista) > new Date())
                  .sort((a, b) => new Date(a.data_fim_prevista).getTime() - new Date(b.data_fim_prevista).getTime())
                  .slice(0, 3)
                  .map((project) => {
                    const daysUntilDeadline = Math.ceil(
                      (new Date(project.data_fim_prevista).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    const urgencyColor = daysUntilDeadline <= 7 ? 'destructive' : 
                                       daysUntilDeadline <= 14 ? 'warning' : 'primary';
                    
                    return (
                      <div key={project.id} className={`flex items-center justify-between p-2 bg-${urgencyColor}/10 rounded-lg`}>
                        <div>
                          <p className="text-sm font-medium">{project.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.gerente?.nome || 'Sem gerente'}
                          </p>
                        </div>
                        <span className={`text-xs font-medium text-${urgencyColor}`}>
                          {daysUntilDeadline} dias
                        </span>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Critical Projects Section */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </Card>
      ) : (
        <CriticalProjectsList projects={metrics.criticalProjectsList} />
      )}
    </div>
  );
}