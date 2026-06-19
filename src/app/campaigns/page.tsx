"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge";
import { Plus, Search, Calendar, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import { campaignStatusEnum } from "@/lib/schema";

export default function CampaignsPage() {
  const { data: session, isPending } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Dados simulados para demonstração
  const campaigns = [
    {
      id: "1",
      name: "Promoção de Fim de Semana",
      description: "Desconto especial para clientes fiéis",
      status: "completed" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 245,
      deliveredCount: 240,
      readCount: 180,
      createdAt: "2023-07-01",
      completedAt: "2023-07-02",
    },
    {
      id: "2",
      name: "Lembrete de Consulta",
      description: "Lembrete para consultas agendadas",
      status: "completed" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 78,
      deliveredCount: 78,
      readCount: 65,
      createdAt: "2023-06-29",
      completedAt: "2023-06-30",
    },
    {
      id: "3",
      name: "Lançamento Novo Produto",
      description: "Anúncio do novo produto para clientes VIP",
      status: "scheduled" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      createdAt: "2023-07-05",
      scheduledFor: "2023-07-15",
    },
    {
      id: "4",
      name: "Pesquisa de Satisfação",
      description: "Feedback dos clientes sobre atendimento",
      status: "draft" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      createdAt: "2023-07-07",
    },
    {
      id: "5",
      name: "Aniversariantes do Mês",
      description: "Mensagem de parabéns para aniversariantes",
      status: "in_progress" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 45,
      deliveredCount: 42,
      readCount: 30,
      createdAt: "2023-07-08",
    },
  ];

  // Filtragem baseada na pesquisa
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para gerenciar suas campanhas
            </p>
          </div>
          <Button asChild>
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas de mensagens e acompanhe resultados
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/campaigns/reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar campanhas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CampaignStatusBadge status={campaign.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.description}
                </p>

                {campaign.status === "draft" && (
                  <div className="text-sm mb-4">
                    <span className="text-muted-foreground">Criada em: </span>
                    {campaign.createdAt}
                  </div>
                )}

                {campaign.status === "scheduled" && (
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Agendada para: {campaign.scheduledFor}</span>
                  </div>
                )}

                {(campaign.status === "completed" ||
                  campaign.status === "in_progress") && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Enviadas:</span>
                      <span className="font-medium">{campaign.sentCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Entregues:</span>
                      <span className="font-medium">
                        {campaign.deliveredCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Lidas:</span>
                      <span className="font-medium">{campaign.readCount}</span>
                    </div>
                    {campaign.status === "completed" && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Concluída em {campaign.completedAt}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/campaigns/${campaign.id}`}>Detalhes</Link>
                  </Button>
                  {campaign.status === "draft" && (
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/campaigns/${campaign.id}/edit`}>
                        Editar
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma campanha encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Tente outra busca ou crie uma nova campanha"
                : "Crie sua primeira campanha para começar"}
            </p>
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
