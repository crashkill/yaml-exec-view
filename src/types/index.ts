// Core Types for Painel de Projetos Corporativo

export type UserProfile = 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';

export type ProjectStatus = 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';

export type CriticalityLevel = 'Verde' | 'Amarelo' | 'Vermelho';

export type RiskCategory = 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo';

export type RiskStatus = 'Aberto' | 'Mitigado' | 'Encerrado';

export type AuditAction = 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: UserProfile;
  ativo: boolean;
  avatar_url?: string;
  departamento: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  nome: string;
  data_prevista: string;
  data_realizada?: string;
  descricao?: string;
  concluido: boolean;
}

export interface ProjectDocument {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface Project {
  id: string;
  nome: string;
  descricao: string;
  status: ProjectStatus;
  criticidade_score: number; // 0-100
  criticidade_label: CriticalityLevel;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real?: string;
  progresso_percentual: number; // 0-100
  id_gerente: string;
  gerente?: User; // Populated via join
  equipe: string[];
  equipe_membros?: User[]; // Populated via join
  orcamento_inicial?: number;
  orcamento_atual?: number;
  custo_realizado?: number;
  receita_prevista?: number;
  receita_realizada?: number;
  roi_previsto?: number;
  roi_atual?: number;
  marcos: Milestone[];
  documentos: ProjectDocument[];
  created_at: string;
  updated_at: string;
}

export interface Risk {
  id: string;
  projeto_id: string;
  titulo: string;
  descricao: string;
  categoria: RiskCategory;
  probabilidade: number; // 1-5
  impacto: number; // 1-5
  nivel_risco: number; // calculado: probabilidade * impacto
  status: RiskStatus;
  plano_mitigacao?: string;
  responsavel_id: string;
  responsavel?: User; // Populated via join
  data_identificacao: string;
  data_resolucao?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  projeto_id: string;
  usuario_id: string;
  usuario?: User; // Populated via join
  acao: AuditAction;
  valores_anteriores?: Record<string, any>;
  valores_novos?: Record<string, any>;
  ip_origem?: string;
  user_agent?: string;
  timestamp: string;
}

export interface PresentationToken {
  id: string;
  projeto_id: string;
  usuario_id: string;
  token: string;
  perfil_visualizacao: UserProfile;
  expira_em: string;
  ativo: boolean;
  acessos: number;
  ultimo_acesso?: string;
  created_at: string;
}

export interface Permission {
  resource: string;
  action: string;
  allowed: boolean;
}

export interface UserPermissions {
  gestao: string[];
  apresentacao: string[];
}

// Presentation Types
export type SlideType = 'capa' | 'visao_geral' | 'cronograma' | 'financeiro' | 'riscos' | 'equipe' | 'conclusao';

export interface SlideConfig {
  type: SlideType;
  visible: boolean;
  data: any;
  order: number;
}

export interface PresentationConfig {
  projeto: Project;
  slides: SlideConfig[];
  perfil: UserProfile;
  auto_advance: boolean;
  slide_duration: number; // seconds
}

// Dashboard Types
export interface MetricData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success';
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface ProjectFormData {
  nome: string;
  descricao: string;
  status: ProjectStatus;
  data_inicio: string;
  data_fim_prevista: string;
  id_gerente: string;
  equipe: string[];
  orcamento_inicial?: number;
  marcos: Omit<Milestone, 'id'>[];
}

export interface RiskFormData {
  titulo: string;
  descricao: string;
  categoria: RiskCategory;
  probabilidade: number;
  impacto: number;
  plano_mitigacao?: string;
  responsavel_id: string;
}

export interface UserFormData {
  nome: string;
  email: string;
  perfil: UserProfile;
  departamento: string;
  ativo: boolean;
}

// Filter and Search Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  gerente?: string[];
  criticidade?: CriticalityLevel[];
  departamento?: string[];
  search?: string;
}

export interface RiskFilters {
  categoria?: RiskCategory[];
  status?: RiskStatus[];
  probabilidade?: number[];
  impacto?: number[];
  responsavel?: string[];
}

// Constants
export const USER_PROFILES: Record<UserProfile, { label: string; color: string; permissions: UserPermissions }> = {
  ADMIN: {
    label: 'Administrador',
    color: '#1976d2',
    permissions: {
      gestao: ['criar', 'editar', 'excluir', 'visualizar_tudo'],
      apresentacao: ['acesso_completo', 'financeiro_detalhado', 'exportar']
    }
  },
  DIR: {
    label: 'Diretor',
    color: '#7b1fa2',
    permissions: {
      gestao: ['visualizar_apenas'],
      apresentacao: ['financeiro_completo', 'kpis_executivos', 'riscos_criticos']
    }
  },
  GG: {
    label: 'Gerente Geral',
    color: '#388e3c',
    permissions: {
      gestao: ['visualizar_projetos', 'aprovar_orcamentos'],
      apresentacao: ['financeiro_resumido', 'metricas_gerais']
    }
  },
  GP: {
    label: 'Gerente de Projetos',
    color: '#f57c00',
    permissions: {
      gestao: ['criar_projetos', 'editar_proprios', 'gerenciar_riscos'],
      apresentacao: ['cronograma', 'entregaveis', 'riscos_operacionais']
    }
  },
  ME: {
    label: 'Membro da Equipe',
    color: '#455a64',
    permissions: {
      gestao: ['visualizar_tarefas_proprias'],
      apresentacao: ['status_entregas', 'cronograma_basico']
    }
  }
};

export const PROJECT_STATUSES: Record<ProjectStatus, { label: string; color: string }> = {
  'Planejamento': { label: 'Planejamento', color: '#f59e0b' },
  'Em Andamento': { label: 'Em Andamento', color: '#3b82f6' },
  'Pausado': { label: 'Pausado', color: '#ef4444' },
  'Concluído': { label: 'Concluído', color: '#22c55e' },
  'Cancelado': { label: 'Cancelado', color: '#6b7280' }
};

export const RISK_CATEGORIES: Record<RiskCategory, { label: string; color: string }> = {
  'Técnico': { label: 'Técnico', color: '#3b82f6' },
  'Financeiro': { label: 'Financeiro', color: '#22c55e' },
  'Cronograma': { label: 'Cronograma', color: '#f59e0b' },
  'Recursos': { label: 'Recursos', color: '#ef4444' },
  'Externo': { label: 'Externo', color: '#8b5cf6' }
};

export const CRITICALITY_THRESHOLDS = {
  LOW: { min: 0, max: 33, label: 'Baixa', color: '#22c55e' },
  MEDIUM: { min: 34, max: 66, label: 'Média', color: '#f59e0b' },
  HIGH: { min: 67, max: 100, label: 'Alta', color: '#ef4444' }
};