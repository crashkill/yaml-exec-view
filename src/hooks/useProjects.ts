import { useQuery } from '@tanstack/react-query';
import { projectKeys } from './projectKeys';
import { projectsAPI } from '@/services/api';

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectsAPI.getProjects()
  });
}