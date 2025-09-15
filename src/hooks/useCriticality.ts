// Hook for managing project criticality calculations and real-time updates

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUpdateCriticality } from './useProjects';
import { Project, Risk } from '@/types';
import { calculateCriticality, getCriticalityLevel } from '@/utils';
import { projectKeys } from './useProjects';

export function useCriticalityCalculation(project: Project, risks: Risk[]) {
  const criticalityScore = calculateCriticality(project, risks);
  const criticalityLevel = getCriticalityLevel(criticalityScore);
  
  return {
    score: criticalityScore,
    level: criticalityLevel,
    hasChanged: project.criticidade_score !== criticalityScore
  };
}

export function useRealTimeCriticality(projectId?: string) {
  const queryClient = useQueryClient();
  const updateCriticality = useUpdateCriticality();

  const handleProjectUpdate = useCallback((payload: any) => {
    if (payload.eventType === 'UPDATE' && payload.new) {
      // Invalidate project queries to trigger recalculation
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(payload.new.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    }
  }, [queryClient]);

  const handleRiskUpdate = useCallback((payload: any) => {
    if (payload.new?.projeto_id) {
      // Update criticality when risks change
      updateCriticality.mutate(payload.new.projeto_id);
    } else if (payload.old?.projeto_id) {
      // Handle risk deletion
      updateCriticality.mutate(payload.old.projeto_id);
    }
  }, [updateCriticality]);

  useEffect(() => {
    // Subscribe to project changes
    const projectSubscription = supabase
      .channel('project-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projetos',
          ...(projectId && { filter: `id=eq.${projectId}` })
        },
        handleProjectUpdate
      )
      .subscribe();

    // Subscribe to risk changes
    const riskSubscription = supabase
      .channel('risk-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'riscos',
          ...(projectId && { filter: `projeto_id=eq.${projectId}` })
        },
        handleRiskUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectSubscription);
      supabase.removeChannel(riskSubscription);
    };
  }, [projectId, handleProjectUpdate, handleRiskUpdate]);

  return {
    isUpdating: updateCriticality.isPending
  };
}

export function useAutoCriticalityUpdate(projectId: string, enabled = true) {
  const updateCriticality = useUpdateCriticality();

  const triggerUpdate = useCallback(() => {
    if (enabled && projectId) {
      updateCriticality.mutate(projectId);
    }
  }, [projectId, enabled, updateCriticality]);

  return {
    triggerUpdate,
    isUpdating: updateCriticality.isPending
  };
}