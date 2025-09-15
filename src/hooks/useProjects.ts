// React Query hooks for Projects

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { Project, ProjectFilters, ProjectFormData } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  criticality: (id: string) => [...projectKeys.all, 'criticality', id] as const,
};

// Hooks
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectsAPI.getProjects(filters),
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
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectFormData> }) =>
      projectsAPI.updateProject(id, data),
    onSuccess: (response, { id }) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
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

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsAPI.deleteProject(id),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        toast.success('Projeto excluído com sucesso');
      } else {
        toast.error(response.error || 'Erro ao excluir projeto');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir projeto');
    },
  });
}

export function useUpdateCriticality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsAPI.updateCriticality(projectId),
    onSuccess: (response, projectId) => {
      if (response.data !== undefined) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        queryClient.setQueryData(
          projectKeys.criticality(projectId),
          response.data
        );
      }
    },
  });
}