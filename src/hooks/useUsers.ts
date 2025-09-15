// React Query hooks for Users

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/services/api';
import { User, UserFormData } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// Hooks
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersAPI.getUsers(),
    select: (response) => response.data || [],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => usersAPI.createUser(data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        toast.success('Usuário criado com sucesso');
      } else {
        toast.error(response.error || 'Erro ao criar usuário');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar usuário');
    },
  });
}