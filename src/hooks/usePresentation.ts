import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presentationAPI } from '@/services/api';

export function useGeneratePresentationToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, profileVisualization }: { 
      projectId: string, 
      profileVisualization?: string 
    }) => presentationAPI.generateToken(projectId, profileVisualization),
    // ... rest of the code
  });
}