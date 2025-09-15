// Application Constants

export const APP_CONFIG = {
  name: 'Painel de Projetos Corporativo',
  version: '1.0.0',
  description: 'Plataforma dual: Gestão interna + Apresentações executivas dinâmicas'
};

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/usuarios',
  USERS_LIST: '/usuarios/listar',
  USERS_CREATE: '/usuarios/criar',
  
  // Projects
  PROJECTS: '/projetos',
  PROJECTS_LIST: '/projetos/listar',
  PROJECTS_CREATE: '/projetos/criar',
  PROJECT_DETAIL: (id: string) => `/projetos/${id}`,
  PROJECT_CRITICALITY: (id: string) => `/projetos/${id}/criticidade`,
  
  // Risks
  RISKS: '/riscos',
  RISKS_BY_PROJECT: (projectId: string) => `/projetos/${projectId}/riscos`,
  
  // Presentations
  PRESENTATION_TOKEN: '/apresentacao/gerar-token',
  PRESENTATION_DATA: (token: string) => `/apresentacao/${token}`,
  PRESENTATION_SLIDES: (token: string) => `/apresentacao/${token}/slides`,
  
  // Audit
  AUDIT_LOGS: '/auditoria',
  PROJECT_HISTORY: (projectId: string) => `/projetos/${projectId}/historico`
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PROJECTS: '/projetos',
  PROJECT_DETAIL: (id: string) => `/projetos/${id}`,
  PROJECT_CREATE: '/projetos/novo',
  PROJECT_EDIT: (id: string) => `/projetos/${id}/editar`,
  TEAMS: '/equipes',
  REPORTS: '/relatorios',
  USERS: '/usuarios',
  SETTINGS: '/configuracoes',
  PRESENTATION: (token: string) => `/apresentacao/${token}`,
  NOT_FOUND: '/404'
};

export const PERMISSIONS = {
  // Project Management
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_READ_ALL: 'project:read_all',
  PROJECT_READ_FINANCIAL: 'project:read_financial',
  
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_READ_ALL: 'user:read_all',
  
  // Risk Management
  RISK_CREATE: 'risk:create',
  RISK_READ: 'risk:read',
  RISK_UPDATE: 'risk:update',
  RISK_DELETE: 'risk:delete',
  
  // Presentation
  PRESENTATION_CREATE: 'presentation:create',
  PRESENTATION_ACCESS: 'presentation:access',
  PRESENTATION_EXPORT: 'presentation:export',
  
  // Audit
  AUDIT_READ: 'audit:read',
  AUDIT_READ_ALL: 'audit:read_all'
};

export const ROLE_PERMISSIONS = {
  ADMIN: [
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROJECT_DELETE,
    PERMISSIONS.PROJECT_READ_ALL,
    PERMISSIONS.PROJECT_READ_FINANCIAL,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_READ_ALL,
    PERMISSIONS.RISK_CREATE,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.RISK_UPDATE,
    PERMISSIONS.RISK_DELETE,
    PERMISSIONS.PRESENTATION_CREATE,
    PERMISSIONS.PRESENTATION_ACCESS,
    PERMISSIONS.PRESENTATION_EXPORT,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.AUDIT_READ_ALL
  ],
  DIR: [
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_READ_ALL,
    PERMISSIONS.PROJECT_READ_FINANCIAL,
    PERMISSIONS.USER_READ,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.PRESENTATION_ACCESS,
    PERMISSIONS.AUDIT_READ
  ],
  GG: [
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_READ_ALL,
    PERMISSIONS.PROJECT_READ_FINANCIAL,
    PERMISSIONS.USER_READ,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.PRESENTATION_ACCESS
  ],
  GP: [
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.RISK_CREATE,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.RISK_UPDATE,
    PERMISSIONS.RISK_DELETE,
    PERMISSIONS.PRESENTATION_CREATE,
    PERMISSIONS.PRESENTATION_ACCESS
  ],
  ME: [
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.USER_READ,
    PERMISSIONS.RISK_READ,
    PERMISSIONS.PRESENTATION_ACCESS
  ]
};

export const UI_CONFIG = {
  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  
  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
  },
  
  // Presentation
  PRESENTATION: {
    DEFAULT_SLIDE_DURATION: 30, // seconds
    AUTO_ADVANCE_DELAY: 5000, // milliseconds
    CONTROL_FADE_DELAY: 3000 // milliseconds
  },
  
  // Criticality gauge sizes
  GAUGE_SIZES: {
    sm: { size: 80, strokeWidth: 6, fontSize: 12 },
    md: { size: 120, strokeWidth: 8, fontSize: 14 },
    lg: { size: 200, strokeWidth: 12, fontSize: 18 }
  }
};

export const VALIDATION_RULES = {
  // User validation
  USER_NAME_MIN_LENGTH: 2,
  USER_NAME_MAX_LENGTH: 255,
  
  // Project validation
  PROJECT_NAME_MIN_LENGTH: 3,
  PROJECT_NAME_MAX_LENGTH: 255,
  PROJECT_DESCRIPTION_MAX_LENGTH: 2000,
  
  // Risk validation
  RISK_TITLE_MIN_LENGTH: 5,
  RISK_TITLE_MAX_LENGTH: 255,
  RISK_DESCRIPTION_MAX_LENGTH: 1000,
  RISK_PROBABILITY_MIN: 1,
  RISK_PROBABILITY_MAX: 5,
  RISK_IMPACT_MIN: 1,
  RISK_IMPACT_MAX: 5,
  
  // General
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8
};

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Email ou senha inválidos',
  SESSION_EXPIRED: 'Sua sessão expirou. Faça login novamente.',
  UNAUTHORIZED: 'Você não tem permissão para acessar este recurso',
  
  // Validation
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_TOO_SHORT: `A senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
  
  // Network
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  
  // Generic
  UNKNOWN_ERROR: 'Ocorreu um erro inesperado'
};

export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Projeto criado com sucesso',
  PROJECT_UPDATED: 'Projeto atualizado com sucesso',
  PROJECT_DELETED: 'Projeto excluído com sucesso',
  USER_CREATED: 'Usuário criado com sucesso',
  USER_UPDATED: 'Usuário atualizado com sucesso',
  RISK_CREATED: 'Risco adicionado com sucesso',
  RISK_UPDATED: 'Risco atualizado com sucesso',
  PRESENTATION_TOKEN_CREATED: 'Link de apresentação gerado com sucesso'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
};

export const CRITICALITY_WEIGHTS = {
  RISKS: 0.4,      // 40%
  SCHEDULE: 0.3,   // 30%
  BUDGET: 0.3      // 30%
};

export const TOKEN_EXPIRY = {
  PRESENTATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  AUTH_REFRESH: 15 * 60 * 1000       // 15 minutes in milliseconds
};