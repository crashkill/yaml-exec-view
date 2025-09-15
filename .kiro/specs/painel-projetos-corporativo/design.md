# Design Document

## Overview

O Painel de Projetos Corporativo é uma aplicação React moderna que integra gestão de projetos com apresentações executivas. A arquitetura utiliza Supabase como backend completo, React 18 com TypeScript no frontend, e shadcn/ui para componentes visuais. O sistema implementa um modelo de permissões baseado em perfis (RBAC) e oferece duas interfaces principais: gestão interna e apresentações dinâmicas.

## Architecture

### Frontend Architecture
- **Framework**: React 18 + Vite + TypeScript
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: TanStack Query para server state, React Context para client state
- **Routing**: React Router DOM v6
- **Charts**: Recharts para gráficos básicos, Canvas API para gauges customizados
- **Animations**: CSS transitions e Framer Motion para apresentações

### Backend Architecture
- **Database**: Supabase PostgreSQL com Row Level Security (RLS)
- **API**: Supabase Edge Functions para lógica de negócio
- **Authentication**: Supabase Auth com perfis customizados
- **Storage**: Supabase Storage para documentos e avatars
- **Real-time**: Supabase Realtime para atualizações em tempo real

### Security Model
- **Authentication**: JWT tokens via Supabase Auth
- **Authorization**: Role-based access control (RBAC) com 5 perfis
- **Data Security**: Row Level Security policies no PostgreSQL
- **Presentation Tokens**: Tokens temporários para compartilhamento seguro

## Components and Interfaces

### Core Components

#### 1. Authentication System
```typescript
interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'DIR' | 'GG' | 'GP' | 'ME';
  ativo: boolean;
  avatar_url?: string;
  departamento: string;
}

interface AuthContext {
  user: User | null;
  permissions: Permission[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (action: string, resource: string) => boolean;
}
```

#### 2. Project Management
```typescript
interface Project {
  id: string;
  nome: string;
  descricao: string;
  status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
  criticidade_score: number; // 0-100
  criticidade_label: 'Verde' | 'Amarelo' | 'Vermelho';
  data_inicio: Date;
  data_fim_prevista: Date;
  data_fim_real?: Date;
  progresso_percentual: number; // 0-100
  id_gerente: string;
  equipe: string[];
  orcamento_inicial?: number;
  orcamento_atual?: number;
  custo_realizado?: number;
  receita_prevista?: number;
  receita_realizada?: number;
  roi_previsto?: number;
  roi_atual?: number;
  marcos: Milestone[];
  documentos: Document[];
}

interface Risk {
  id: string;
  projeto_id: string;
  titulo: string;
  descricao: string;
  categoria: 'Técnico' | 'Financeiro' | 'Cronograma' | 'Recursos' | 'Externo';
  probabilidade: number; // 1-5
  impacto: number; // 1-5
  nivel_risco: number; // calculado
  status: 'Aberto' | 'Mitigado' | 'Encerrado';
  plano_mitigacao?: string;
  responsavel_id: string;
}
```

#### 3. Presentation System
```typescript
interface PresentationToken {
  id: string;
  projeto_id: string;
  usuario_id: string;
  token: string;
  perfil_visualizacao: UserProfile;
  expira_em: Date;
  ativo: boolean;
}

interface SlideConfig {
  type: 'capa' | 'visao_geral' | 'cronograma' | 'financeiro' | 'riscos' | 'equipe' | 'conclusao';
  visible: boolean;
  data: any;
}
```

### UI Components Architecture

#### 1. Layout Components
- `AppLayout`: Main application shell with sidebar and header
- `AppSidebar`: Navigation sidebar with role-based menu items
- `UserMenu`: User profile dropdown with permissions display
- `Header`: Top navigation with search and notifications

#### 2. Dashboard Components
- `MetricCard`: Reusable metric display with trends and badges
- `CriticalityGauge`: Custom canvas-based criticality indicator
- `ProjectStatusChart`: Bar chart for project status distribution
- `CriticalProjectsList`: List of high-risk projects with details

#### 3. Project Management Components
- `ProjectForm`: Multi-step wizard for project creation/editing
- `ProjectDetails`: Tabbed interface for project information
- `RiskMatrix`: Interactive scatter plot for risk visualization
- `TimelineGantt`: Gantt chart for project timeline

#### 4. Presentation Components
- `PresentationViewer`: Full-screen presentation container
- `SlideRenderer`: Dynamic slide content renderer
- `PresentationControls`: Navigation and control buttons
- `SlideTransitions`: Smooth transitions between slides

## Data Models

### Database Schema

#### Users Table
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  perfil perfil_enum NOT NULL,
  ativo BOOLEAN DEFAULT true,
  avatar_url TEXT,
  departamento VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Projects Table
```sql
CREATE TABLE projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  status status_enum NOT NULL,
  criticidade_score INTEGER DEFAULT 0 CHECK (criticidade_score >= 0 AND criticidade_score <= 100),
  criticidade_label criticidade_enum,
  data_inicio DATE,
  data_fim_prevista DATE,
  data_fim_real DATE,
  progresso_percentual INTEGER DEFAULT 0 CHECK (progresso_percentual >= 0 AND progresso_percentual <= 100),
  id_gerente UUID REFERENCES usuarios(id),
  equipe JSONB DEFAULT '[]',
  orcamento_inicial NUMERIC(15,2),
  orcamento_atual NUMERIC(15,2),
  custo_realizado NUMERIC(15,2),
  receita_prevista NUMERIC(15,2),
  receita_realizada NUMERIC(15,2),
  roi_previsto NUMERIC(5,2),
  roi_atual NUMERIC(5,2),
  marcos JSONB DEFAULT '[]',
  documentos JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Risks Table
```sql
CREATE TABLE riscos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria categoria_risco_enum NOT NULL,
  probabilidade INTEGER CHECK (probabilidade >= 1 AND probabilidade <= 5),
  impacto INTEGER CHECK (impacto >= 1 AND impacto <= 5),
  nivel_risco INTEGER GENERATED ALWAYS AS (probabilidade * impacto) STORED,
  status status_risco_enum DEFAULT 'Aberto',
  plano_mitigacao TEXT,
  responsavel_id UUID REFERENCES usuarios(id),
  data_identificacao DATE DEFAULT CURRENT_DATE,
  data_resolucao DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Usuários só podem ver dados conforme seu perfil
CREATE POLICY "usuarios_select_policy" ON usuarios
  FOR SELECT USING (
    CASE 
      WHEN auth.jwt() ->> 'perfil' = 'ADMIN' THEN true
      ELSE id = auth.uid()
    END
  );

-- Projetos filtrados por perfil e responsabilidade
CREATE POLICY "projetos_select_policy" ON projetos
  FOR SELECT USING (
    CASE 
      WHEN auth.jwt() ->> 'perfil' IN ('ADMIN', 'DIR', 'GG') THEN true
      WHEN auth.jwt() ->> 'perfil' = 'GP' THEN id_gerente = auth.uid()
      WHEN auth.jwt() ->> 'perfil' = 'ME' THEN auth.uid()::text = ANY(SELECT jsonb_array_elements_text(equipe))
      ELSE false
    END
  );
```

## Error Handling

### Frontend Error Handling
- **Network Errors**: Retry mechanism with exponential backoff
- **Authentication Errors**: Automatic redirect to login
- **Permission Errors**: User-friendly messages with suggested actions
- **Validation Errors**: Real-time form validation with clear feedback

### Backend Error Handling
- **Database Errors**: Structured error responses with error codes
- **Business Logic Errors**: Custom exceptions with context
- **Rate Limiting**: 429 responses with retry-after headers
- **Token Validation**: Detailed JWT validation errors

### Error Monitoring
- **Client-side**: Error boundary components with fallback UI
- **Server-side**: Structured logging with correlation IDs
- **User Feedback**: Toast notifications for user actions
- **Admin Alerts**: Critical error notifications for administrators

## Testing Strategy

### Unit Testing
- **Components**: React Testing Library for UI components
- **Hooks**: Custom hooks testing with renderHook
- **Utils**: Pure function testing with Jest
- **Coverage**: Minimum 80% code coverage

### Integration Testing
- **API Integration**: Mock Supabase client for API calls
- **User Flows**: End-to-end user journey testing
- **Permission Testing**: Role-based access control validation
- **Data Flow**: State management and data synchronization

### Performance Testing
- **Load Testing**: Concurrent user simulation
- **Rendering Performance**: React DevTools profiling
- **Bundle Size**: Webpack bundle analyzer
- **Database Performance**: Query execution time monitoring

### Security Testing
- **Authentication**: JWT token validation
- **Authorization**: Permission boundary testing
- **Input Validation**: SQL injection and XSS prevention
- **Data Leakage**: Profile-based data filtering validation

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Component Optimization**: React.memo for expensive components
- **State Management**: Optimized re-renders with proper dependencies
- **Asset Optimization**: Image compression and lazy loading

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: Redis caching for frequently accessed data
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Minimized N+1 queries

### Real-time Features
- **Selective Subscriptions**: Only subscribe to relevant data changes
- **Debounced Updates**: Prevent excessive re-renders
- **Optimistic Updates**: Immediate UI feedback with rollback capability
- **Connection Management**: Automatic reconnection with exponential backoff