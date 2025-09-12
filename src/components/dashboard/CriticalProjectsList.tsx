import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CriticalityGauge } from "./CriticalityGauge";
import { AlertTriangle, Calendar, User, ExternalLink } from "lucide-react";

const mockCriticalProjects = [
  {
    id: "1",
    name: "Sistema de Pagamentos",
    manager: "Ana Santos",
    dueDate: "2025-01-15",
    criticality: 85,
    status: "Em Andamento",
    issues: ["Atraso no cronograma", "Orçamento excedido"],
  },
  {
    id: "2", 
    name: "App Mobile v2.0",
    manager: "Carlos Lima",
    dueDate: "2025-02-28",
    criticality: 72,
    status: "Em Andamento",
    issues: ["Recursos insuficientes"],
  },
  {
    id: "3",
    name: "Migração Cloud",
    manager: "Rita Ferreira",
    dueDate: "2025-01-30",
    criticality: 68,
    status: "Pausado",
    issues: ["Dependências externas"],
  },
];

export function CriticalProjectsList() {
  const getStatusBadge = (status: string) => {
    const variants = {
      "Em Andamento": "bg-primary text-primary-foreground",
      "Pausado": "bg-destructive text-destructive-foreground",
      "Planejamento": "bg-warning text-warning-foreground",
      "Concluído": "bg-success text-success-foreground",
    };
    
    return variants[status as keyof typeof variants] || variants["Em Andamento"];
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Projetos Críticos
        </CardTitle>
        <Button variant="outline" size="sm">
          Ver Todos
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mockCriticalProjects.map((project) => (
          <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  <Badge className={getStatusBadge(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {project.manager}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Principais Riscos:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.issues.map((issue, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CriticalityGauge 
                  value={project.criticality} 
                  size="sm" 
                  showValue={true}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {mockCriticalProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum projeto crítico no momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}