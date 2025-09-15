import { useMutation } from '@tanstack/react-query';
import { projectKeys } from './projectKeys';
import { projectsAPI } from '@/services/api';

export function useCriticalityCalculation(project: any, risks: any) {
  return {
    score: project.criticidade_score || 0,
    level: 'Verde',
    hasChanged: false
  };
}

export function useRealTimeCriticality(projectId: string) {
  return { isUpdating: false };
}

export function useAutoCriticalityUpdate(projectId: string) {
  const { mutate: triggerUpdate, isPending: isUpdating } = useMutation({
    mutationFn: () => projectsAPI.updateCriticality(projectId)
  });
  return { triggerUpdate, isUpdating };
}