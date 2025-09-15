import { projectsAPI } from '@/services/api'
import { APIResponse } from '@/services/api'

// Atualizar todas as chamadas para usar a tipagem
const createProject = useMutation({
  mutationFn: (data: ProjectFormData) => projectsAPI.createProject(data),
  onSuccess: (response: APIResponse<Project>) => {
    if (response.data) {
      // ... implementação
    }
    if (response.error) {
      toast.error(response.error)
    }
  }
})