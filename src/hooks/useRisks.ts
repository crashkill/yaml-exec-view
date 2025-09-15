// React Query hooks for Risks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { risksAPI } from '@/services/api';
import { Risk, RiskFormData } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const riskKeys = {
  all: ['risks'] as const,
  byProject: (projectId: string) => [...riskKeys.all, 'project', projectId] as const,
  detail: (id: string) => [...riskKeys.all, 'detail', id] as const,
};

// Hooks
export function useRisksByProject(projectId: string) {
  return useQuery({
    queryKey: riskKeys.byProject(projectId),
    queryFn: () => risksAPI.getRisksByProject(projectId),
    select: (response) => response.data || [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RiskFormData & { projeto_id: string }) => 
      risksAPI.createRisk(data),
    onSuccess: (response, variables) => {
      if (response.data) {
        queryClient.invalidateQueries({ 
          queryKey: riskKeys.byProject(variables.projeto_id) 
        });
        // Also invalidate project queries to update criticality
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Risco adicionado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao adicionar risco');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao adicionar risco');
    },
  });
}

export function useUpdateRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RiskFormData> }) =>
      risksAPI.updateRisk(id, data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({ 
          queryKey: riskKeys.byProject(response.data.projeto_id) 
        });
        // Also invalidate project queries to update criticality
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.success('Risco atualizado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao atualizar risco');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar risco');
    },
  });
}