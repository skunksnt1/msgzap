"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Lock,
  MessageSquare,
  Users,
  Phone,
  Calendar,
  BarChart3,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

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
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para acessar o dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {session.user.name}. Confira o desempenho das suas
            campanhas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/campaigns">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Relatórios
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Mensagens"
          value="1,234"
          icon={MessageSquare}
          description="Enviadas este mês"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Contatos Ativos"
          value="856"
          icon={Users}
          description="Em todas as listas"
        />
        <StatsCard
          title="Instâncias Conectadas"
          value="2/3"
          icon={Phone}
          description="Dispositivos ativos"
        />
        <StatsCard
          title="Campanhas Agendadas"
          value="5"
          icon={Calendar}
          description="Para os próximos 7 dias"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campanhas Recentes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Campanhas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Promoção de Fim de Semana</h3>
                    <p className="text-sm text-muted-foreground">
                      Enviada há 2 dias • 98% entregue
                    </p>
                  </div>
                  <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                    Concluída
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="font-medium">245</span> mensagens •{" "}
                  <span className="font-medium">240</span> entregues •{" "}
                  <span className="font-medium">180</span> lidas
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Lembrete de Consulta</h3>
                    <p className="text-sm text-muted-foreground">
                      Enviada há 3 dias • 100% entregue
                    </p>
                  </div>
                  <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                    Concluída
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="font-medium">78</span> mensagens •{" "}
                  <span className="font-medium">78</span> entregues •{" "}
                  <span className="font-medium">65</span> lidas
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Lançamento Novo Produto</h3>
                    <p className="text-sm text-muted-foreground">
                      Agendada para 15/07/2023
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded-full">
                    Agendada
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="font-medium">320</span> contatos selecionados
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/campaigns">Ver Todas as Campanhas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instâncias do WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Instâncias do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Principal</h3>
                  <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                    Conectado
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  +55 11 98765-4321
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Suporte</h3>
                  <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                    Conectado
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  +55 11 91234-5678
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Marketing</h3>
                  <div className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
                    Desconectado
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Não configurado
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/instances">Gerenciar Instâncias</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
