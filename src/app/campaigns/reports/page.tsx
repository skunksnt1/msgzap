"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge";
import {
  BarChart3,
  ArrowLeft,
  Calendar,
  Download,
  PieChart,
  LineChart,
  MessageSquare,
  CheckCheck,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { campaignStatusEnum } from "@/lib/schema";

export default function CampaignReportsPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("last30");
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  // Dados simulados para demonstração
  const campaigns = [
    {
      id: "1",
      name: "Promoção de Fim de Semana",
      status: "completed" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 245,
      deliveredCount: 240,
      readCount: 180,
      completedAt: "2023-07-02",
    },
    {
      id: "2",
      name: "Lembrete de Consulta",
      status: "completed" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 78,
      deliveredCount: 78,
      readCount: 65,
      completedAt: "2023-06-30",
    },
    {
      id: "3",
      name: "Lançamento Novo Produto",
      status: "scheduled" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      scheduledFor: "2023-07-15",
    },
    {
      id: "5",
      name: "Aniversariantes do Mês",
      status: "in_progress" as (typeof campaignStatusEnum.enumValues)[number],
      sentCount: 45,
      deliveredCount: 42,
      readCount: 30,
      startedAt: "2023-07-08",
    },
  ];

  // Dados simulados para os gráficos
  const overviewStats = {
    totalSent: 368,
    totalDelivered: 360,
    totalRead: 275,
    deliveryRate: 97.8,
    readRate: 76.4,
    responseRate: 12.5,
  };

  const dailyStats = [
    { date: "01/07", sent: 120, delivered: 118, read: 95 },
    { date: "02/07", sent: 125, delivered: 122, read: 85 },
    { date: "03/07", sent: 0, delivered: 0, read: 0 },
    { date: "04/07", sent: 0, delivered: 0, read: 0 },
    { date: "05/07", sent: 78, delivered: 78, read: 65 },
    { date: "06/07", sent: 0, delivered: 0, read: 0 },
    { date: "07/07", sent: 0, delivered: 0, read: 0 },
    { date: "08/07", sent: 45, delivered: 42, read: 30 },
  ];

  // Filtrar campanhas baseado no período selecionado
  const getFilteredCampaigns = () => {
    if (selectedCampaign !== "all") {
      return campaigns.filter((campaign) => campaign.id === selectedCampaign);
    }
    return campaigns;
  };

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
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para acessar os relatórios
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
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Últimos 7 dias</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="last90">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Selecione a campanha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as campanhas</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1"></div>

            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Envios Diários
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Por Campanha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div className="text-2xl font-bold">
                    {overviewStats.totalSent}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enviadas no período selecionado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Taxa de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCheck className="h-5 w-5 text-green-500" />
                  <div className="text-2xl font-bold">
                    {overviewStats.deliveryRate}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overviewStats.totalDelivered} mensagens entregues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Taxa de Leitura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {overviewStats.readRate}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overviewStats.totalRead} mensagens lidas
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Desempenho Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
                        <div className="text-2xl font-bold">
                          {overviewStats.deliveryRate}%
                        </div>
                      </div>
                      <span className="mt-2 text-sm font-medium">
                        Entregues
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                        <div className="text-2xl font-bold">
                          {overviewStats.readRate}%
                        </div>
                      </div>
                      <span className="mt-2 text-sm font-medium">Lidas</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                        <div className="text-2xl font-bold">
                          {overviewStats.responseRate}%
                        </div>
                      </div>
                      <span className="mt-2 text-sm font-medium">
                        Respostas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Envios Diários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full">
                    <div className="mb-6 border-b pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Legenda:</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-xs">Enviadas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs">Entregues</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs">Lidas</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {dailyStats.map((day, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-2 items-center"
                        >
                          <div className="col-span-2 text-sm">{day.date}</div>
                          <div className="col-span-10 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{
                                    width: `${day.sent > 0 ? 100 : 0}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs w-12 text-right">
                                {day.sent}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-green-500 h-full rounded-full"
                                  style={{
                                    width: `${
                                      day.sent > 0
                                        ? (day.delivered / day.sent) * 100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs w-12 text-right">
                                {day.delivered}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full rounded-full"
                                  style={{
                                    width: `${
                                      day.sent > 0
                                        ? (day.read / day.sent) * 100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs w-12 text-right">
                                {day.read}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFilteredCampaigns().map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CampaignStatusBadge status={campaign.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Enviadas</span>
                        <span>{campaign.sentCount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Entregues</span>
                        <span>
                          {campaign.deliveredCount} (
                          {campaign.sentCount > 0
                            ? Math.round(
                                (campaign.deliveredCount / campaign.sentCount) *
                                  100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full"
                          style={{
                            width: `${
                              campaign.sentCount > 0
                                ? (campaign.deliveredCount /
                                    campaign.sentCount) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Lidas</span>
                        <span>
                          {campaign.readCount} (
                          {campaign.sentCount > 0
                            ? Math.round(
                                (campaign.readCount / campaign.sentCount) * 100
                              )
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${
                              campaign.sentCount > 0
                                ? (campaign.readCount / campaign.sentCount) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {campaign.status === "completed" && (
                        <span>Concluída em {campaign.completedAt}</span>
                      )}
                      {campaign.status === "scheduled" && (
                        <span>Agendada para {campaign.scheduledFor}</span>
                      )}
                      {campaign.status === "in_progress" && (
                        <span>Iniciada em {campaign.startedAt}</span>
                      )}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/campaigns/${campaign.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFilteredCampaigns().length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma campanha encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Não há campanhas para o período ou filtro selecionado
              </p>
              <Button asChild>
                <Link href="/campaigns/new">Criar Nova Campanha</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
