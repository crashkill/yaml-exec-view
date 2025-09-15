import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { 
  Project, 
  Risk, 
  User, 
  PresentationToken,
  ProjectFormData,
  RiskFormData,
  UserFormData,
  ApiResponse
} from '@/types'

// Tipos utilitários
type Insert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']
type Update<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

// Implementação das APIs...

// Exportar todas as APIs como objetos
export const projectsAPI = new ProjectsAPI()
export const risksAPI = new RisksAPI()
export const usersAPI = new UsersAPI()
export const presentationAPI = new PresentationAPI()

// Definir tipo de resposta padrão
export type APIResponse<T> = {
  data: T | null
  error?: string
  message?: string
}