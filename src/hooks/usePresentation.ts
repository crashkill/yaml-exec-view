// React Query hooks for Presentations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presentationAPI } from '@/services/api';
import { PresentationToken } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const presentationKeys = {
  all: ['presentations'] as const,
  token: (token: string) => [...presentationKeys.all, 'token', token] as const,
};

// Hooks
export function usePresentationData(token: string) {
  return useQuery({
    queryKey: presentationKeys.token(token),
    queryFn: () => presentationAPI.getByToken(token),
    select: (response) => response.data,
    enabled: !!token,
    retry: false, // Don't retry on token errors
    staleTime: 0, // Always fresh for presentations
  });
}

export function useGeneratePresentationToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, profileVisualization }: { 
      projectId: string; 
      profileVisualization?: string 
    }) => presentationAPI.generateToken(projectId, profileVisualization),
    onSuccess: (response: { data?: any; error?: string }) => {
      if (response.data) {
        toast.success('Link de apresentação gerado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao gerar link de apresentação');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao gerar link de apresentação');
    },
  });
}