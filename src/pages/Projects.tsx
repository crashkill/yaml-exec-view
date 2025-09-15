import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CriticalityGauge } from "@/components/dashboard/CriticalityGauge";
import { Plus, Filter, Search } from "lucide-react";

export default function Projects() {
  const mockProjects = [
    { id: 1, name: "Sistema de Pagamentos", manager: "Ana Santos", status: "Em Andamento", criticality: 85 },
    { id: 2, name: "App Mobile v2.0", manager: "Carlos Lima", status: "Em Andamento", criticality: 72 },
    { id: 3, name: "Portal do Cliente", manager: "Rita Ferreira", status: "Concluído", criticality: 25 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Projetos</h1>
        <Button className="bg-gradient-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-4">
        {mockProjects.map(project => (
          <Card key={project.id} className="shadow-card hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-muted-foreground">Gerente: {project.manager}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{project.status}</Badge>
                  <CriticalityGauge value={project.criticality} size="sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}