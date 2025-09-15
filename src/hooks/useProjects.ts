import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { Project, ProjectFormData } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

// Hooks
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectsAPI.getProjects(),
    select: (response) => response.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsAPI.getProject(id),
    select: (response) => response.data,
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectFormData) => projectsAPI.createProject(data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        toast.success('Projeto criado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao criar projeto');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar projeto');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsAPI.updateProject(id, data),
    onSuccess: (response, variables) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        toast.success('Projeto atualizado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao atualizar projeto');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar projeto');
    },
  });
}

export function useUpdateCriticality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsAPI.updateCriticality(projectId),
    onSuccess: (response, projectId) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });
}