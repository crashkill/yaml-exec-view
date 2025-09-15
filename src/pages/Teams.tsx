import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Teams() {
  const teams = [
    { name: "Desenvolvimento", members: 12, lead: "Carlos Silva", projects: 8 },
    { name: "Design", members: 6, lead: "Ana Costa", projects: 4 },
    { name: "Marketing", members: 8, lead: "Rita Santos", projects: 6 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Equipes</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <Card key={team.name} className="shadow-card">
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{team.lead[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{team.lead}</p>
                    <p className="text-sm text-muted-foreground">Líder da Equipe</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Badge variant="secondary">{team.members} membros</Badge>
                  <Badge variant="outline">{team.projects} projetos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}