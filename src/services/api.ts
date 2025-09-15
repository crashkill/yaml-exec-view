import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { 
  Project, 
  Risk, 
  User, 
  PresentationToken,
  ProjectFormData,
  RiskFormData,
  UserFormData,
  ApiResponse
} from '@/types';
import { toast } from 'sonner';

// API Response Type
export type APIResponse<T> = {
  data: T | null;
  error?: string;
  message?: string;
};

// Projects API
class ProjectsAPI {
  async getProjects(): Promise<APIResponse<Project[]>> {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [] };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao buscar projetos' 
      };
    }
  }

  async getProject(id: string): Promise<APIResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao buscar projeto' 
      };
    }
  }

  async createProject(data: ProjectFormData): Promise<APIResponse<Project>> {
    try {
      const { data: project, error } = await supabase
        .from('projetos')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return { data: project };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao criar projeto' 
      };
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<APIResponse<Project>> {
    try {
      const { data: project, error } = await supabase
        .from('projetos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: project };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao atualizar projeto' 
      };
    }
  }

  async updateCriticality(projectId: string): Promise<APIResponse<Project>> {
    try {
      // This would be implemented with a Supabase function in a real scenario
      // For now, we'll just refetch the project
      return await this.getProject(projectId);
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao atualizar criticidade' 
      };
    }
  }
}

// Risks API
class RisksAPI {
  async getRisksByProject(projectId: string): Promise<APIResponse<Risk[]>> {
    try {
      const { data, error } = await supabase
        .from('riscos')
        .select('*')
        .eq('projeto_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [] };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao buscar riscos' 
      };
    }
  }

  async createRisk(data: RiskFormData & { projeto_id: string }): Promise<APIResponse<Risk>> {
    try {
      const { data: risk, error } = await supabase
        .from('riscos')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return { data: risk };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao criar risco' 
      };
    }
  }

  async updateRisk(id: string, data: Partial<RiskFormData>): Promise<APIResponse<Risk>> {
    try {
      const { data: risk, error } = await supabase
        .from('riscos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: risk };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao atualizar risco' 
      };
    }
  }
}

// Users API
class UsersAPI {
  async getUsers(): Promise<APIResponse<User[]>> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');

      if (error) throw error;
      return { data: data || [] };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao buscar usuários' 
      };
    }
  }

  async createUser(data: UserFormData): Promise<APIResponse<User>> {
    try {
      const { data: user, error } = await supabase
        .from('usuarios')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return { data: user };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao criar usuário' 
      };
    }
  }
}

// Presentation API
class PresentationAPI {
  async getByToken(token: string): Promise<APIResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('tokens_apresentacao')
        .select('*')
        .eq('token', token)
        .eq('ativo', true)
        .gt('expira_em', new Date().toISOString())
        .single();

      if (error) throw error;
      
      // Increment access count
      if (data) {
        await supabase
          .from('tokens_apresentacao')
          .update({ 
            acessos: data.acessos + 1,
            ultimo_acesso: new Date().toISOString()
          })
          .eq('id', data.id);
      }

      return { data };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao buscar apresentação' 
      };
    }
  }

  async generateToken(
    projectId: string, 
    profileVisualization?: string
  ): Promise<APIResponse<PresentationToken>> {
    try {
      const token = this.generateRandomToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const { data, error } = await supabase
        .from('tokens_apresentacao')
        .insert([{
          projeto_id: projectId,
          usuario_id: '', // This would be set to the current user in a real implementation
          token,
          perfil_visualizacao: profileVisualization || 'ME',
          expira_em: expiresAt.toISOString(),
          ativo: true,
          acessos: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.message || 'Erro ao gerar token de apresentação' 
      };
    }
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Exportar todas as APIs como objetos
export const projectsAPI = new ProjectsAPI();
export const risksAPI = new RisksAPI();
export const usersAPI = new UsersAPI();
export const presentationAPI = new PresentationAPI();