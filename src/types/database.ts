// Database type definitions for Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          perfil: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          ativo: boolean
          avatar_url: string | null
          departamento: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          perfil: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          ativo?: boolean
          avatar_url?: string | null
          departamento: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          perfil?: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          ativo?: boolean
          avatar_url?: string | null
          departamento?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          id: string
          nome: string
          descricao: string
          status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado'
          criticidade_score: number
          criticidade_label: 'Verde' | 'Amarelo' | 'Vermelho'
          data_inicio: string
          data_fim_prevista: string
          data_fim_real: string | null
          progresso_percentual: number
          id_gerente: string
          equipe: string[]
          orcamento_inicial: number | null
          orcamento_atual: number | null
          custo_realizado: number | null
          receita_prevista: number | null
          receita_realizada: number | null
          roi_previsto: number | null
          roi_atual: number | null
          marcos: Json
          documentos: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao: string
          status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado'
          criticidade_score?: number
          criticidade_label?: 'Verde' | 'Amarelo' | 'Vermelho'
          data_inicio: string
          data_fim_prevista: string
          data_fim_real?: string | null
          progresso_percentual?: number
          id_gerente: string
          equipe?: string[]
          orcamento_inicial?: number | null
          orcamento_atual?: number | null
          custo_realizado?: number | null
          receita_prevista?: number | null
          receita_realizada?: number | null
          roi_previsto?: number | null
          roi_atual?: number | null
          marcos?: Json
          documentos?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          status?: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado'
          criticidade_score?: number
          criticidade_label?: 'Verde' | 'Amarelo' | 'Vermelho'
          data_inicio?: string
          data_fim_prevista?: string
          data_fim_real?: string | null
          progresso_percentual?: number
          id_gerente?: string
          equipe?: string[]
          orcamento_inicial?: number | null
          orcamento_atual?: number | null
          custo_realizado?: number | null
          receita_prevista?: number | null
          receita_realizada?: number | null
          roi_previsto?: number | null
          roi_atual?: number | null
          marcos?: Json
          documentos?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_id_gerente_fkey"
            columns: ["id_gerente"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
      riscos: {
        Row: {
          id: string
          projeto_id: string
          titulo: string
          descricao: string
          categoria: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo'
          probabilidade: number
          impacto: number
          nivel_risco: number
          status: 'Aberto' | 'Mitigado' | 'Encerrado'
          plano_mitigacao: string | null
          responsavel_id: string
          data_identificacao: string
          data_resolucao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          projeto_id: string
          titulo: string
          descricao: string
          categoria: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo'
          probabilidade: number
          impacto: number
          nivel_risco?: number
          status?: 'Aberto' | 'Mitigado' | 'Encerrado'
          plano_mitigacao?: string | null
          responsavel_id: string
          data_identificacao?: string
          data_resolucao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          projeto_id?: string
          titulo?: string
          descricao?: string
          categoria?: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo'
          probabilidade?: number
          impacto?: number
          nivel_risco?: number
          status?: 'Aberto' | 'Mitigado' | 'Encerrado'
          plano_mitigacao?: string | null
          responsavel_id?: string
          data_identificacao?: string
          data_resolucao?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "riscos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riscos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
      historico_projetos: {
        Row: {
          id: number
          projeto_id: string
          usuario_id: string
          acao: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO'
          valores_anteriores: Json | null
          valores_novos: Json | null
          ip_origem: string | null
          user_agent: string | null
          timestamp: string
        }
        Insert: {
          id?: number
          projeto_id: string
          usuario_id: string
          acao: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO'
          valores_anteriores?: Json | null
          valores_novos?: Json | null
          ip_origem?: string | null
          user_agent?: string | null
          timestamp?: string
        }
        Update: {
          id?: number
          projeto_id?: string
          usuario_id?: string
          acao?: 'CRIACAO' | 'ATUALIZACAO' | 'EXCLUSAO' | 'STATUS' | 'FINANCEIRO' | 'RISCO'
          valores_anteriores?: Json | null
          valores_novos?: Json | null
          ip_origem?: string | null
          user_agent?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_projetos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_projetos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
      tokens_apresentacao: {
        Row: {
          id: string
          projeto_id: string
          usuario_id: string
          token: string
          perfil_visualizacao: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          expira_em: string
          ativo: boolean
          acessos: number
          ultimo_acesso: string | null
          created_at: string
        }
        Insert: {
          id?: string
          projeto_id: string
          usuario_id: string
          token: string
          perfil_visualizacao: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          expira_em: string
          ativo?: boolean
          acessos?: number
          ultimo_acesso?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          projeto_id?: string
          usuario_id?: string
          token?: string
          perfil_visualizacao?: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME'
          expira_em?: string
          ativo?: boolean
          acessos?: number
          ultimo_acesso?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_apresentacao_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tokens_apresentacao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never