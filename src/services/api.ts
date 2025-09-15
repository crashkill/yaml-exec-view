// API Service Layer for Painel de Projetos Corporativo

import { supabase } from '@/lib/supabase';
import { 
  Project, 
  Risk, 
  User, 
  PresentationToken,
  AuditLog,
  ProjectFilters,
  RiskFilters,
  ProjectFormData,
  RiskFormData,
  UserFormData,
  PaginatedResponse,
  ApiResponse
} from '@/types';
import { 
  calculateCriticality, 
  getCriticalityLevel, 
  filterProjectData,
  generatePresentationToken 
} from '@/utils';
import { TOKEN_EXPIRY } from '@/constants';
import { Database } from '@/types/database'; // Importar tipos de banco de dados

// Base API class with common functionality
class BaseAPI {
  protected processSupabaseResponse<T>(
    supabaseResponse: { data: T | null; error: any }
  ): ApiResponse<T> {
    const { data, error } = supabaseResponse;
    
    if (error) {
      console.error('API Error:', error);
      return {
        data: null as T,
        error: error.message || 'Erro desconhecido'
      };
    }
    
    return {
      data: data as T,
      message: 'Sucesso'
    };
  }

  protected async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  protected async getUserProfile(userId?: string): Promise<User | null> {
    const user = userId ? { id: userId } : await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data as User;
  }
}

// Projects API
export class ProjectsAPI extends BaseAPI {
  async getProjects(filters?: ProjectFilters): Promise<ApiResponse<Project[]>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: [], error: 'Usuário não autenticado' };
    }

    let query = supabase
      .from('projetos')
      .select(`
        *,
        gerente:usuarios!projetos_id_gerente_fkey(id, nome, email, perfil, departamento),
        equipe_membros:usuarios(id, nome, email, perfil, departamento)
      `);

    // Apply role-based filtering
    if (userProfile.perfil === 'GP') {
      query = query.eq('id_gerente', userProfile.id);
    } else if (userProfile.perfil === 'ME') {
      query = query.contains('equipe', [userProfile.id]);
    }

    const { data, error } = await query; // Await the query here
    const response = this.processSupabaseResponse<Project[]>({ data, error });
    
    if (response.data) {
      // Filter financial data based on user profile
      response.data = response.data.map(project => 
        filterProjectData(project, userProfile.perfil) as Project
      );
    }

    return response;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: null as any, error: 'Usuário não autenticado' };
    }

    let query = supabase
      .from('projetos')
      .select(`
        *,
        gerente:usuarios!projetos_id_gerente_fkey(id, nome, email, perfil, departamento),
        equipe_membros:usuarios(id, nome, email, perfil, departamento)
      `)
      .eq('id', id);

    // Apply role-based filtering
    if (userProfile.perfil === 'GP') {
      query = query.eq('id_gerente', userProfile.id);
    } else if (userProfile.perfil === 'ME') {
      query = query.contains('equipe', [userProfile.id]);
    }

    const { data, error } = await query.single(); // Await the query here
    const response = this.processSupabaseResponse<Project>({ data, error });
    
    if (response.data) {
      // Filter financial data based on user profile
      response.data = filterProjectData(response.data, userProfile.perfil) as Project;
    }

    return response;
  }

  async createProject(projectData: ProjectFormData): Promise<ApiResponse<Project>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: null as any, error: 'Usuário não autenticado' };
    }

    // Check permissions
    if (!['ADMIN', 'GP'].includes(userProfile.perfil)) {
      return { data: null as any, error: 'Sem permissão para criar projetos' };
    }

    const newProject = {
      ...projectData,
      criticidade_score: 0,
      criticidade_label: 'Verde' as const,
      progresso_percentual: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('projetos')
      .insert([newProject as Database['public']['Tables']['projetos']['Insert']]) // Wrapped in array
      .select()
      .single();
    
    const response = this.processSupabaseResponse<Project>({ data, error });

    // Log audit trail
    if (response.data) {
      await this.logAuditAction(response.data.id, 'CRIACAO', null, newProject);
    }

    return response;
  }

  async updateProject(id: string, updates: Partial<ProjectFormData>): Promise<ApiResponse<Project>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: null as any, error: 'Usuário não autenticado' };
    }

    // Get current project for permission check and audit
    const currentProject = await this.getProject(id);
    if (!currentProject.data) {
      return { data: null as any, error: 'Projeto não encontrado' };
    }

    // Check permissions
    const canEdit = userProfile.perfil === 'ADMIN' || 
                   (userProfile.perfil === 'GP' && currentProject.data.id_gerente === userProfile.id);
    
    if (!canEdit) {
      return { data: null as any, error: 'Sem permissão para editar este projeto' };
    }

    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('projetos')
      .update(updatedData) // Removed explicit cast
      .eq('id', id)
      .select()
      .single();

    const response = this.processSupabaseResponse<Project>({ data, error });

    // Log audit trail
    if (response.data) {
      await this.logAuditAction(id, 'ATUALIZACAO', currentProject.data, updatedData);
    }

    return response;
  }

  async deleteProject(id: string): Promise<ApiResponse<boolean>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: false, error: 'Usuário não autenticado' };
    }

    // Check permissions - only ADMIN can delete
    if (userProfile.perfil !== 'ADMIN') {
      return { data: false, error: 'Sem permissão para excluir projetos' };
    }

    // Get project for audit
    const project = await this.getProject(id);
    
    const { data, error } = await supabase.from('projetos').delete().eq('id', id);
    const response = this.processSupabaseResponse<void>({ data, error }); // Expecting no data back for delete

    // Log audit trail
    if (!response.error && project.data) { // Check for no error instead of data
      await this.logAuditAction(id, 'EXCLUSAO', project.data, null);
    }

    return { data: true, message: 'Projeto excluído com sucesso' };
  }

  async updateCriticality(projectId: string): Promise<ApiResponse<number>> {
    // Get project and risks
    const [projectResponse, risksResponse] = await Promise.all([
      this.getProject(projectId),
      new RisksAPI().getRisksByProject(projectId)
    ]);

    if (!projectResponse.data) {
      return { data: 0, error: 'Projeto não encontrado' };
    }

    const risks = risksResponse.data || [];
    const criticalityScore = calculateCriticality(projectResponse.data, risks);
    const criticalityLabel = getCriticalityLevel(criticalityScore);

    const { data, error } = await supabase
      .from('projetos')
      .update({ 
          criticidade_score: criticalityScore,
          criticidade_label: criticalityLabel,
          updated_at: new Date().toISOString()
      }) // Removed explicit cast
      .eq('id', projectId)
      .select('criticidade_score')
      .single();
    
    const response = this.processSupabaseResponse<{ criticidade_score: number }>({ data, error });

    return response.data ? 
      { data: response.data.criticidade_score, message: 'Criticidade atualizada' } :
      { data: 0, error: 'Erro ao atualizar criticidade' };
  }

  private async logAuditAction(
    projectId: string, 
    action: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO', 
    oldValues: any, 
    newValues: any
  ) {
    const user = await this.getCurrentUser();
    if (!user) return;

    await supabase.from('historico_projetos').insert([{ // Wrapped in array
      projeto_id: projectId,
      usuario_id: user.id,
      acao: action,
      valores_anteriores: oldValues,
      valores_novos: newValues,
      timestamp: new Date().toISOString()
    } as Database['public']['Tables']['historico_projetos']['Insert']]);
  }
}

// Risks API
export class RisksAPI extends BaseAPI {
  async getRisksByProject(projectId: string): Promise<ApiResponse<Risk[]>> {
    const { data, error } = await supabase
      .from('riscos')
      .select(`
        *,
        responsavel:usuarios!riscos_responsavel_id_fkey(id, nome, email, perfil, departamento)
      `)
      .eq('projeto_id', projectId)
      .order('nivel_risco', { ascending: false });

    const response = this.processSupabaseResponse<Risk[]>({ data, error });
    return response;
  }

  async createRisk(riskData: RiskFormData & { projeto_id: string }): Promise<ApiResponse<Risk>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: null as any, error: 'Usuário não autenticado' };
    }

    const newRisk = {
      ...riskData,
      nivel_risco: riskData.probabilidade * riskData.impacto,
      status: 'Aberto' as const,
      data_identificacao: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('riscos')
      .insert([newRisk as Database['public']['Tables']['riscos']['Insert']]) // Wrapped in array
      .select()
      .single();
    
    const response = this.processSupabaseResponse<Risk>({ data, error });

    // Update project criticality
    if (response.data) {
      await new ProjectsAPI().updateCriticality(response.data.projeto_id);
    }

    return response;
  }

  async updateRisk(id: string, updates: Partial<RiskFormData>): Promise<ApiResponse<Risk>> {
    const updatedData = {
      ...updates,
      nivel_risco: updates.probabilidade && updates.impacto ? 
        updates.probabilidade * updates.impacto : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('riscos')
      .update(updatedData) // Removed explicit cast
      .eq('id', id)
      .select()
      .single();
    
    const response = this.processSupabaseResponse<Risk>({ data, error });

    // Update project criticality
    if (response.data) {
      await new ProjectsAPI().updateCriticality(response.data.projeto_id);
    }

    return response;
  }
}

// Users API
export class UsersAPI extends BaseAPI {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile || userProfile.perfil !== 'ADMIN') {
      return { data: [], error: 'Sem permissão para listar usuários' };
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome');
    
    return this.processSupabaseResponse<User[]>({ data, error });
  }

  async createUser(userData: UserFormData): Promise<ApiResponse<User>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile || userProfile.perfil !== 'ADMIN') {
      return { data: null as any, error: 'Sem permissão para criar usuários' };
    }

    const newUser = {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('usuarios')
      .insert([newUser as Database['public']['Tables']['usuarios']['Insert']]) // Wrapped in array
      .select()
      .single();
    
    return this.processSupabaseResponse<User>({ data, error });
  }
}

// Presentation API
export class PresentationAPI extends BaseAPI {
  async generateToken(projectId: string, profileVisualization?: string): Promise<ApiResponse<PresentationToken>> {
    const userProfile = await this.getUserProfile();
    if (!userProfile) {
      return { data: null as any, error: 'Usuário não autenticado' };
    }

    const token = generatePresentationToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY.PRESENTATION).toISOString();

    const tokenData = {
      projeto_id: projectId,
      usuario_id: userProfile.id,
      token,
      perfil_visualizacao: profileVisualization || userProfile.perfil,
      expira_em: expiresAt,
      ativo: true,
      acessos: 0,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tokens_apresentacao')
      .insert([tokenData as Database['public']['Tables']['tokens_apresentacao']['Insert']]) // Wrapped in array
      .select()
      .single();
    
    return this.processSupabaseResponse<PresentationToken>({ data, error });
  }

  async getByToken(token: string): Promise<ApiResponse<{ project: Project; tokenData: PresentationToken }>> {
    // Get token data
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens_apresentacao')
      .select('*')
      .eq('token', token)
      .eq('ativo', true)
      .single();
    
    const tokenResponse = this.processSupabaseResponse<PresentationToken>({ data: tokenData, error: tokenError });

    if (!tokenResponse.data) {
      return { data: null as any, error: 'Token inválido ou expirado' };
    }

    // Check if token is expired
    if (new Date(tokenResponse.data.expira_em) < new Date()) {
      return { data: null as any, error: 'Token expirado' };
    }

    // Get project data
    const { data: projectData, error: projectError } = await supabase
      .from('projetos')
      .select(`
          *,
          gerente:usuarios!projetos_id_gerente_fkey(id, nome, email, perfil, departamento)
      `)
      .eq('id', tokenResponse.data.projeto_id)
      .single();
    
    const projectResponse = this.processSupabaseResponse<Project>({ data: projectData, error: projectError });

    if (!projectResponse.data) {
      return { data: null as any, error: 'Projeto não encontrado' };
    }

    // Filter data based on token profile
    const filteredProject = filterProjectData(
      projectResponse.data, 
      tokenResponse.data.perfil_visualizacao
    ) as Project;

    // Update access count
    await supabase
      .from('tokens_apresentacao')
      .update({ 
        acessos: tokenResponse.data.acessos + 1,
        ultimo_acesso: new Date().toISOString()
      }) // Removed explicit cast
      .eq('id', tokenResponse.data.id);

    return {
      data: {
        project: filteredProject,
        tokenData: tokenResponse.data
      },
      message: 'Dados carregados com sucesso'
    };
  }
}

// Export API instances
export const projectsAPI = new ProjectsAPI();
export const risksAPI = new RisksAPI();
export const usersAPI = new UsersAPI();
export const presentationAPI = new PresentationAPI();