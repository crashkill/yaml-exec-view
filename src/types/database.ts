// Database type definitions for Supabase

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          perfil: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          ativo: boolean;
          avatar_url: string | null;
          departamento: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          perfil: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          ativo?: boolean;
          avatar_url?: string | null;
          departamento: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          perfil?: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          ativo?: boolean;
          avatar_url?: string | null;
          departamento?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projetos: {
        Row: {
          id: string;
          nome: string;
          descricao: string;
          status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
          criticidade_score: number;
          criticidade_label: 'Verde' | 'Amarelo' | 'Vermelho';
          data_inicio: string;
          data_fim_prevista: string;
          data_fim_real: string | null;
          progresso_percentual: number;
          id_gerente: string;
          equipe: string[];
          orcamento_inicial: number | null;
          orcamento_atual: number | null;
          custo_realizado: number | null;
          receita_prevista: number | null;
          receita_realizada: number | null;
          roi_previsto: number | null;
          roi_atual: number | null;
          marcos: any[];
          documentos: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao: string;
          status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
          criticidade_score?: number;
          criticidade_label?: 'Verde' | 'Amarelo' | 'Vermelho';
          data_inicio: string;
          data_fim_prevista: string;
          data_fim_real?: string | null;
          progresso_percentual?: number;
          id_gerente: string;
          equipe?: string[];
          orcamento_inicial?: number | null;
          orcamento_atual?: number | null;
          custo_realizado?: number | null;
          receita_prevista?: number | null;
          receita_realizada?: number | null;
          roi_previsto?: number | null;
          roi_atual?: number | null;
          marcos?: any[];
          documentos?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string;
          status?: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
          criticidade_score?: number;
          criticidade_label?: 'Verde' | 'Amarelo' | 'Vermelho';
          data_inicio?: string;
          data_fim_prevista?: string;
          data_fim_real?: string | null;
          progresso_percentual?: number;
          id_gerente?: string;
          equipe?: string[];
          orcamento_inicial?: number | null;
          orcamento_atual?: number | null;
          custo_realizado?: number | null;
          receita_prevista?: number | null;
          receita_realizada?: number | null;
          roi_previsto?: number | null;
          roi_atual?: number | null;
          marcos?: any[];
          documentos?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
      riscos: {
        Row: {
          id: string;
          projeto_id: string;
          titulo: string;
          descricao: string;
          categoria: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo';
          probabilidade: number;
          impacto: number;
          nivel_risco: number;
          status: 'Aberto' | 'Mitigado' | 'Encerrado';
          plano_mitigacao: string | null;
          responsavel_id: string;
          data_identificacao: string;
          data_resolucao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          projeto_id: string;
          titulo: string;
          descricao: string;
          categoria: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo';
          probabilidade: number;
          impacto: number;
          nivel_risco?: number;
          status?: 'Aberto' | 'Mitigado' | 'Encerrado';
          plano_mitigacao?: string | null;
          responsavel_id: string;
          data_identificacao?: string;
          data_resolucao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          projeto_id?: string;
          titulo?: string;
          descricao?: string;
          categoria?: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo';
          probabilidade?: number;
          impacto?: number;
          nivel_risco?: number;
          status?: 'Aberto' | 'Mitigado' | 'Encerrado';
          plano_mitigacao?: string | null;
          responsavel_id?: string;
          data_identificacao?: string;
          data_resolucao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      historico_projetos: {
        Row: {
          id: number;
          projeto_id: string;
          usuario_id: string;
          acao: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO';
          valores_anteriores: any | null;
          valores_novos: any | null;
          ip_origem: string | null;
          user_agent: string | null;
          timestamp: string;
        };
        Insert: {
          id?: number;
          projeto_id: string;
          usuario_id: string;
          acao: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO';
          valores_anteriores?: any | null;
          valores_novos?: any | null;
          ip_origem?: string | null;
          user_agent?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: number;
          projeto_id?: string;
          usuario_id?: string;
          acao?: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO';
          valores_anteriores?: any | null;
          valores_novos?: any | null;
          ip_origem?: string | null;
          user_agent?: string | null;
          timestamp?: string;
        };
      };
      tokens_apresentacao: {
        Row: {
          id: string;
          projeto_id: string;
          usuario_id: string;
          token: string;
          perfil_visualizacao: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          expira_em: string;
          ativo: boolean;
          acessos: number;
          ultimo_acesso: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          projeto_id: string;
          usuario_id: string;
          token: string;
          perfil_visualizacao: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          expira_em: string;
          ativo?: boolean;
          acessos?: number;
          ultimo_acesso?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          projeto_id?: string;
          usuario_id?: string;
          token?: string;
          perfil_visualizacao?: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
          expira_em?: string;
          ativo?: boolean;
          acessos?: number;
          ultimo_acesso?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}