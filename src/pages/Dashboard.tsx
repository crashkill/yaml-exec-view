import { Project } from '@/types';

// Update the useProjects hook usage
const { data: projects = [], isLoading, error, refetch } = useProjects();

// Then use projects directly as an array
const metrics = useMemo(() => {
  if (!projects.length) {
    return {
      // ... rest of the metrics
    };
  }
  // ... rest of the calculations
}, [projects, canAccessFinancialData]);