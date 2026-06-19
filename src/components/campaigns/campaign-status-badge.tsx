import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { campaignStatusEnum } from "@/lib/schema";

interface CampaignStatusBadgeProps {
  status: (typeof campaignStatusEnum.enumValues)[number];
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Rascunho",
      variant: "outline" as const,
    },
    scheduled: {
      label: "Agendada",
      variant: "secondary" as const,
    },
    in_progress: {
      label: "Em Progresso",
      variant: "default" as const,
    },
    completed: {
      label: "Concluída",
      variant: "success" as const,
    },
    paused: {
      label: "Pausada",
      variant: "warning" as const,
    },
    cancelled: {
      label: "Cancelada",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant} className={cn("capitalize")}>
      {config.label}
    </Badge>
  );
}
