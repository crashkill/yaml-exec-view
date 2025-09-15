// Enhanced criticality indicator with real-time updates and detailed breakdown

import { useState } from 'react';
import { CriticalityGauge } from './CriticalityGauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  RefreshCw,
  Info
} from 'lucide-react';
import { Project, Risk } from '@/types';
import { 
  useCriticalityCalculation, 
  useRealTimeCriticality,
  useAutoCriticalityUpdate 
} from '@/hooks/useCriticality';
import { 
  formatPercentage, 
  formatCurrency, 
  daysBetween,
  isOverdue 
} from '@/utils';
import { CRITICALITY_WEIGHTS } from '@/constants';

interface CriticalityIndicatorProps {
  project: Project;
  risks?: Risk[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  showRefresh?: boolean;
}

export function CriticalityIndicator({
  project,
  risks = [],
  size = 'md',
  showDetails = false,
  showRefresh = false
}: CriticalityIndicatorProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const { score, level, hasChanged } = useCriticalityCalculation(project, risks);
  const { isUpdating } = useRealTimeCriticality(project.id);
  const { triggerUpdate, isUpdating: isManualUpdating } = useAutoCriticalityUpdate(project.id);

  // Calculate component scores for breakdown
  const getRiskScore = () => {
    if (risks.length === 0) return 0;
    const avgRiskLevel = risks.reduce((sum, risk) => sum + risk.nivel_risco, 0) / risks.length;
    return Math.min((avgRiskLevel / 25) * 100, 100);
  };

  const getScheduleScore = () => {
    if (!project.data_fim_prevista) return 0;
    
    const today = new Date();
    const endDate = new Date(project.data_fim_prevista);
    const startDate = new Date(project.data_inicio);
    
    const totalDuration = daysBetween(startDate, endDate);
    const elapsed = daysBetween(startDate, today);
    const scheduleProgress = Math.min(elapsed / totalDuration, 1);
    
    const progressGap = scheduleProgress - (project.progresso_percentual / 100);
    return progressGap > 0 ? Math.min(progressGap * 200, 100) : 0;
  };

  const getBudgetScore = () => {
    if (!project.orcamento_inicial || !project.custo_realizado) return 0;
    
    const budgetUsage = project.custo_realizado / project.orcamento_inicial;
    const progressRatio = project.progresso_percentual / 100;
    
    if (budgetUsage > progressRatio) {
      const budgetOverrun = budgetUsage - progressRatio;
      return Math.min(budgetOverrun * 200, 100);
    }
    return 0;
  };

  const riskScore = getRiskScore();
  const scheduleScore = getScheduleScore();
  const budgetScore = getBudgetScore();

  const breakdown = [
    {
      label: 'Riscos',
      score: riskScore,
      weight: CRITICALITY_WEIGHTS.RISKS,
      contribution: riskScore * CRITICALITY_WEIGHTS.RISKS,
      icon: AlertTriangle,
      color: 'text-orange-600',
      details: `${risks.length} riscos identificados`
    },
    {
      label: 'Cronograma',
      score: scheduleScore,
      weight: CRITICALITY_WEIGHTS.SCHEDULE,
      contribution: scheduleScore * CRITICALITY_WEIGHTS.SCHEDULE,
      icon: Calendar,
      color: 'text-blue-600',
      details: isOverdue(project.data_fim_prevista) ? 'Projeto em atraso' : 'Cronograma em dia'
    },
    {
      label: 'Orçamento',
      score: budgetScore,
      weight: CRITICALITY_WEIGHTS.BUDGET,
      contribution: budgetScore * CRITICALITY_WEIGHTS.BUDGET,
      icon: DollarSign,
      color: 'text-green-600',
      details: project.custo_realizado && project.orcamento_inicial ? 
        `${formatPercentage((project.custo_realizado / project.orcamento_inicial) * 100)} utilizado` : 
        'Sem dados financeiros'
    }
  ];

  const CriticalityBreakdown = () => (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          Detalhamento da Criticidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(score)}%</div>
          <Badge 
            variant="outline" 
            className="mt-1"
            style={{ 
              borderColor: project.criticidade_score !== undefined ? 
                (hasChanged ? '#f59e0b' : '#22c55e') : '#6b7280',
              color: project.criticidade_score !== undefined ? 
                (hasChanged ? '#f59e0b' : '#22c55e') : '#6b7280'
            }}
          >
            {hasChanged ? 'Recálculo necessário' : 'Atualizado'}
          </Badge>
        </div>

        <div className="space-y-3">
          {breakdown.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">
                    ({formatPercentage(item.weight * 100)})
                  </span>
                </div>
                <span className="font-medium">
                  {Math.round(item.contribution)}
                </span>
              </div>
              <Progress 
                value={item.score} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {item.details}
              </p>
            </div>
          ))}
        </div>

        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => triggerUpdate()}
            disabled={isManualUpdating || isUpdating}
          >
            {(isManualUpdating || isUpdating) ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Recalcular
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (showDetails) {
    return (
      <Popover open={showBreakdown} onOpenChange={setShowBreakdown}>
        <PopoverTrigger asChild>
          <div className="cursor-pointer">
            <CriticalityGauge
              value={score}
              size={size}
              label="Criticidade"
              showValue={true}
              animated={true}
              onClick={() => setShowBreakdown(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent side="right" className="p-0">
          <CriticalityBreakdown />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <CriticalityGauge
      value={score}
      size={size}
      label="Criticidade"
      showValue={true}
      animated={true}
    />
  );
}