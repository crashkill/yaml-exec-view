import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/services/api';
import { UserFormData } from '@/types';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) => usersAPI.createUser(data),
    // ... rest of the code
  });
}