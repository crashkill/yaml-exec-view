import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CriticalityIndicator } from "./CriticalityIndicator";
import { AlertTriangle, Calendar, User, Eye } from "lucide-react";
import { Project } from '@/types';
import { formatDate, isOverdue } from '@/utils';
import { PROJECT_STATUSES } from '@/types';
import { ROUTES } from '@/constants';

interface CriticalProjectsListProps {
  projects: Project[];
}

export function CriticalProjectsList({ projects }: CriticalProjectsListProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const config = PROJECT_STATUSES[status as keyof typeof PROJECT_STATUSES];
    return {
      className: `text-white`,
      style: { backgroundColor: config?.color || '#6b7280' }
    };
  };

  const getProjectRisks = (project: Project) => {
    const risks = [];
    
    if (project.data_fim_prevista && isOverdue(project.data_fim_prevista)) {
      risks.push('Prazo vencido');
    }
    
    if (project.orcamento_inicial && project.custo_realizado) {
      const budgetUsage = (project.custo_realizado / project.orcamento_inicial) * 100;
      if (budgetUsage > 90) {
        risks.push('Orçamento crítico');
      }
    }
    
    if (project.progresso_percentual < 50 && project.status === 'Em Andamento') {
      risks.push('Progresso baixo');
    }
    
    return risks.length > 0 ? risks : ['Alta criticidade'];
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Projetos Críticos
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(ROUTES.PROJECTS + '?filter=critical')}
        >
          Ver Todos
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum projeto crítico no momento</p>
            <p className="text-sm mt-2">Todos os projetos estão dentro dos parâmetros normais</p>
          </div>
        ) : (
          projects.map((project) => {
            const statusBadge = getStatusBadge(project.status);
            const risks = getProjectRisks(project);
            
            return (
              <div 
                key={project.id} 
                className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors cursor-pointer"
                onClick={() => navigate(ROUTES.PROJECT_DETAIL(project.id))}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                        {project.nome}
                      </h4>
                      <Badge 
                        className={statusBadge.className}
                        style={statusBadge.style}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {project.gerente?.nome || 'Sem gerente'}
                      </div>
                      {project.data_fim_prevista && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className={isOverdue(project.data_fim_prevista) ? 'text-destructive font-medium' : ''}>
                            {formatDate(project.data_fim_prevista)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Principais Riscos:</p>
                      <div className="flex flex-wrap gap-1">
                        {risks.map((risk, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CriticalityIndicator
                      project={project}
                      size="sm"
                      showDetails={false}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.PROJECT_DETAIL(project.id));
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}