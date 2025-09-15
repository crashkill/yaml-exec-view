import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  Monitor,
  AlertTriangle,
  FileText,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfileConfig, getInitials } from '@/utils';
import { PERMISSIONS, APP_CONFIG } from '@/constants';

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, permission: null },
  { title: "Projetos", url: "/projetos", icon: FolderKanban, permission: PERMISSIONS.PROJECT_READ },
  { title: "Equipes", url: "/equipes", icon: Users, permission: null },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, permission: null },
];

const managementItems = [
  { title: "Usuários", url: "/usuarios", icon: Users, permission: PERMISSIONS.USER_READ_ALL },
  { title: "Configurações", url: "/configuracoes", icon: Settings, permission: null },
];

const toolsItems = [
  { title: "Apresentações", url: "/apresentacoes", icon: Monitor, permission: PERMISSIONS.PRESENTATION_ACCESS },
  { title: "Riscos", url: "/riscos", icon: AlertTriangle, permission: PERMISSIONS.RISK_READ },
  { title: "Documentos", url: "/documentos", icon: FileText, permission: null },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user) return null;

  const profileConfig = getUserProfileConfig(user.perfil);

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground";

  const filterItemsByPermission = (items: typeof mainItems) => {
    return items.filter(item => !item.permission || hasPermission(item.permission));
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: profileConfig.color }}
            >
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-sm text-foreground">{APP_CONFIG.name}</h2>
                <p className="text-xs text-muted-foreground">Gestão Corporativa</p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {open && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || undefined} alt={user.nome} />
                <AvatarFallback 
                  className="text-white text-xs font-medium"
                  style={{ backgroundColor: profileConfig.color }}
                >
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.nome}
                </p>
                <Badge 
                  className="text-xs text-white mt-1"
                  style={{ backgroundColor: profileConfig.color }}
                >
                  {profileConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterItemsByPermission(mainItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Analytics */}
        {filterItemsByPermission(toolsItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItemsByPermission(toolsItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Management (Admin only) */}
        {filterItemsByPermission(managementItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Gestão</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItemsByPermission(managementItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Help Section */}
        <div className="mt-auto p-4 border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/ajuda" className="hover:bg-accent hover:text-accent-foreground">
                  <HelpCircle className="h-4 w-4" />
                  {open && <span>Ajuda & Suporte</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}