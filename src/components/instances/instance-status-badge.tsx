import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { instanceStatusEnum } from "@/lib/schema";

interface InstanceStatusBadgeProps {
  status: (typeof instanceStatusEnum.enumValues)[number];
}

export function InstanceStatusBadge({ status }: InstanceStatusBadgeProps) {
  const statusConfig = {
    disconnected: {
      label: "Desconectado",
      variant: "destructive" as const,
    },
    connecting: {
      label: "Conectando",
      variant: "outline" as const,
    },
    connected: {
      label: "Conectado",
      variant: "secondary" as const,
    },
    authenticated: {
      label: "Autenticado",
      variant: "default" as const,
    },
    error: {
      label: "Erro",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <Badge variant={config.variant} className={cn("capitalize")}>
      {config.label}
    </Badge>
  );
}
