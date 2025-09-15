import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  UserProfile, 
  Project, 
  Risk, 
  CriticalityLevel,
  CRITICALITY_THRESHOLDS,
  USER_PROFILES
} from "@/types";
import { CRITICALITY_WEIGHTS, ROLE_PERMISSIONS } from "@/constants";

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values for display
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Format percentage values for display
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

/**
 * Format date values for display
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: string | Date): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return targetDate < today;
}

/**
 * Calculate project criticality score based on risks, schedule, and budget
 */
export function calculateCriticality(project: Project, risks: Risk[] = []): number {
  let score = 0;
  
  // Risk component (40%)
  if (risks.length > 0) {
    const avgRiskLevel = risks.reduce((sum, risk) => sum + risk.nivel_risco, 0) / risks.length;
    const riskScore = (avgRiskLevel / 25) * 100; // Normalize to 0-100 (max risk level is 25)
    score += riskScore * CRITICALITY_WEIGHTS.RISKS;
  }
  
  // Schedule component (30%)
  if (project.data_fim_prevista) {
    const today = new Date();
    const endDate = new Date(project.data_fim_prevista);
    const startDate = new Date(project.data_inicio);
    
    const totalDuration = daysBetween(startDate, endDate);
    const elapsed = daysBetween(startDate, today);
    const scheduleProgress = Math.min(elapsed / totalDuration, 1);
    
    // If we're behind schedule (actual progress < time progress)
    const progressGap = scheduleProgress - (project.progresso_percentual / 100);
    if (progressGap > 0) {
      const scheduleScore = Math.min(progressGap * 200, 100); // Scale gap to 0-100
      score += scheduleScore * CRITICALITY_WEIGHTS.SCHEDULE;
    }
  }
  
  // Budget component (30%)
  if (project.orcamento_inicial && project.custo_realizado) {
    const budgetUsage = project.custo_realizado / project.orcamento_inicial;
    const progressRatio = project.progresso_percentual / 100;
    
    // If we're over budget relative to progress
    if (budgetUsage > progressRatio) {
      const budgetOverrun = budgetUsage - progressRatio;
      const budgetScore = Math.min(budgetOverrun * 200, 100); // Scale overrun to 0-100
      score += budgetScore * CRITICALITY_WEIGHTS.BUDGET;
    }
  }
  
  return Math.min(Math.round(score), 100);
}

/**
 * Get criticality level based on score
 */
export function getCriticalityLevel(score: number): CriticalityLevel {
  if (score <= CRITICALITY_THRESHOLDS.LOW.max) return 'Verde';
  if (score <= CRITICALITY_THRESHOLDS.MEDIUM.max) return 'Amarelo';
  return 'Vermelho';
}

/**
 * Get criticality color based on score
 */
export function getCriticalityColor(score: number): string {
  if (score <= CRITICALITY_THRESHOLDS.LOW.max) return CRITICALITY_THRESHOLDS.LOW.color;
  if (score <= CRITICALITY_THRESHOLDS.MEDIUM.max) return CRITICALITY_THRESHOLDS.MEDIUM.color;
  return CRITICALITY_THRESHOLDS.HIGH.color;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userProfile: UserProfile, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userProfile] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user can access financial data
 */
export function canAccessFinancialData(userProfile: UserProfile): boolean {
  return ['ADMIN', 'DIR', 'GG'].includes(userProfile);
}

/**
 * Check if user can edit project
 */
export function canEditProject(userProfile: UserProfile, project: Project, userId: string): boolean {
  if (userProfile === 'ADMIN') return true;
  if (userProfile === 'GP' && project.id_gerente === userId) return true;
  return false;
}

/**
 * Filter project data based on user profile
 */
export function filterProjectData(project: Project, userProfile: UserProfile): Partial<Project> {
  const filtered = { ...project };
  
  // Remove financial data for unauthorized users
  if (!canAccessFinancialData(userProfile)) {
    delete filtered.orcamento_inicial;
    delete filtered.orcamento_atual;
    delete filtered.custo_realizado;
    delete filtered.receita_prevista;
    delete filtered.receita_realizada;
    delete filtered.roi_previsto;
    delete filtered.roi_atual;
  }
  
  return filtered;
}

/**
 * Get user profile configuration
 */
export function getUserProfileConfig(profile: UserProfile) {
  return USER_PROFILES[profile];
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate presentation token
 */
export function generatePresentationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiryDate: string | Date): boolean {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  return expiry < new Date();
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(receita: number, custo: number): number {
  if (custo === 0) return 0;
  return ((receita - custo) / custo) * 100;
}