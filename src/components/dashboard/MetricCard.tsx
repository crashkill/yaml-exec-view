import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "warning" | "success";
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  badge,
  className 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case "increase":
        return <TrendingUp className="h-3 w-3 text-success" />;
      case "decrease":
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground";
    
    switch (change.type) {
      case "increase":
        return "text-success";
      case "decrease":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getBadgeVariant = () => {
    switch (badge?.variant) {
      case "warning":
        return "bg-warning text-warning-foreground";
      case "success":
        return "bg-success text-success-foreground";
      case "destructive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className={`shadow-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge className={`text-xs ${getBadgeVariant()}`}>
              {badge.text}
            </Badge>
          )}
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          
          {change && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">
                {Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}