"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InstanceStatusBadge } from "@/components/instances/instance-status-badge";
import { InstanceFormModal } from "@/components/instances/instance-form-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Phone,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  Settings,
  Shield,
  Clock,
  QrCode,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function InstancesPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("instances");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instances, setInstances] = useState<
    Array<{
      id: string;
      name: string;
      phone: string | null;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      lastConnection: Date | null;
      instanceKey: string | null;
      config: Record<string, any> | null;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar instâncias do banco de dados
  const loadInstances = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/instances");

      if (!response.ok) {
        throw new Error("Erro ao carregar instâncias");
      }

      const data = await response.json();
      setInstances(data.instances || []);
    } catch (error) {
      console.error("Erro ao carregar instâncias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar instâncias quando o componente monta
  useEffect(() => {
    if (session?.user) {
      loadInstances();
    }
  }, [session?.user]);

  // Função para criar uma nova instância
  const handleCreateInstance = async (data: {
    name: string;
    phone: string;
  }) => {
    try {
      const response = await fetch("/api/instances/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar instância");
      }

      const result = await response.json();

      // Recarregar a lista de instâncias após criar uma nova
      await loadInstances();

      // Retornar o QR Code, informações da instância e outras informações
      return {
        qrcode: result.qrcode,
        instance: result.instance,
        info: result.info,
      };
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      throw error;
    }
  };

  // Filtrar instâncias baseado na busca
  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instance.phone && instance.phone.includes(searchQuery)) ||
      instance.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Configurações de mitigação de risco
  const [dailyLimit, setDailyLimit] = useState(500);
  const [messageInterval, setMessageInterval] = useState(6);
  const [randomizeInterval, setRandomizeInterval] = useState(true);
  const [avoidSuspiciousPatterns, setAvoidSuspiciousPatterns] = useState(true);
  const [useVariations, setUseVariations] = useState(true);
  const [blockAfterComplaints, setBlockAfterComplaints] = useState(true);
  const [complaintsThreshold, setComplaintsThreshold] = useState(3);
  const [limitNewContacts, setLimitNewContacts] = useState(true);
  const [newContactsPerDay, setNewContactsPerDay] = useState(50);

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
            <Phone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para gerenciar suas instâncias do
              WhatsApp
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
          <h1 className="text-3xl font-bold">Instâncias do WhatsApp</h1>
          <p className="text-muted-foreground">
            Gerencie suas conexões com o WhatsApp e configure medidas de
            segurança
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("security")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Instância
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar instâncias..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="instances" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Instâncias
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Mitigação de Risco
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instances" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse text-muted-foreground">
                  Carregando instâncias...
                </div>
              </div>
            ) : filteredInstances.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma instância encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Nenhuma instância corresponde à sua busca."
                    : "Crie sua primeira instância do WhatsApp."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Instância
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInstances.map((instance) => (
                  <Card key={instance.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {instance.name}
                        </CardTitle>
                        <InstanceStatusBadge status={instance.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {instance.phone && (
                        <p className="text-sm mb-4">
                          <span className="text-muted-foreground">
                            Telefone:{" "}
                          </span>
                          {instance.phone}
                        </p>
                      )}

                      {instance.status === "authenticated" && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Última conexão:
                            </span>
                            <span>{instance.lastConnection}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Mensagens enviadas:
                            </span>
                            <span>{instance.messagesSent}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {instance.status === "disconnected" ? (
                          <Button asChild className="flex-1">
                            <Link href={`/instances/${instance.id}/connect`}>
                              <QrCode className="h-4 w-4 mr-2" />
                              Conectar
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild variant="outline" className="flex-1">
                            <Link href={`/instances/${instance.id}/refresh`}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reconectar
                            </Link>
                          </Button>
                        )}
                        <Button asChild variant="outline" size="icon">
                          <Link href={`/instances/${instance.id}/settings`}>
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Card para adicionar nova instância */}
                <Card className="border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="flex flex-col items-center justify-center h-full py-8">
                    <Phone className="h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Adicionar Instância</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Conecte um novo número do WhatsApp à plataforma
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Instância
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {filteredInstances.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma instância encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente outra busca ou crie uma nova instância
                </p>
                <Button asChild>
                  <Link href="/instances/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Instância
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-500">
                        Importante: Proteja suas contas
                      </p>
                      <p className="text-muted-foreground">
                        O WhatsApp pode banir números que enviam muitas
                        mensagens idênticas ou que apresentam padrões de
                        comportamento automatizado. Estas configurações ajudam a
                        minimizar esse risco.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="daily-limit">
                          Limite Diário de Mensagens
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {dailyLimit} msgs/dia
                        </span>
                      </div>
                      <Slider
                        id="daily-limit"
                        min={100}
                        max={1000}
                        step={50}
                        value={[dailyLimit]}
                        onValueChange={(value) => setDailyLimit(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recomendamos até 500 mensagens por dia por número
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message-interval">
                          Intervalo Entre Mensagens
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {messageInterval} segundos
                        </span>
                      </div>
                      <Slider
                        id="message-interval"
                        min={2}
                        max={20}
                        step={1}
                        value={[messageInterval]}
                        onValueChange={(value) => setMessageInterval(value[0])}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomize-interval"
                        checked={randomizeInterval}
                        onCheckedChange={setRandomizeInterval}
                      />
                      <Label
                        htmlFor="randomize-interval"
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Aleatorizar intervalo entre mensagens
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="avoid-patterns"
                        checked={avoidSuspiciousPatterns}
                        onCheckedChange={setAvoidSuspiciousPatterns}
                      />
                      <Label
                        htmlFor="avoid-patterns"
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Evitar padrões suspeitos de envio
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Proteção Avançada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-variations"
                      checked={useVariations}
                      onCheckedChange={setUseVariations}
                    />
                    <Label htmlFor="use-variations" className="flex-1">
                      <div className="font-medium">
                        Usar variações de mensagem
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cria pequenas variações nas mensagens para evitar
                        detecção de spam
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="block-complaints"
                      checked={blockAfterComplaints}
                      onCheckedChange={setBlockAfterComplaints}
                    />
                    <Label htmlFor="block-complaints" className="flex-1">
                      <div className="font-medium">
                        Bloquear após reclamações
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pausa automaticamente os envios após receber reclamações
                      </p>
                    </Label>
                  </div>

                  {blockAfterComplaints && (
                    <div className="space-y-2 pl-8">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="complaints-threshold">
                          Limite de Reclamações
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {complaintsThreshold} reclamações
                        </span>
                      </div>
                      <Slider
                        id="complaints-threshold"
                        min={1}
                        max={10}
                        step={1}
                        value={[complaintsThreshold]}
                        onValueChange={(value) =>
                          setComplaintsThreshold(value[0])
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="limit-new-contacts"
                      checked={limitNewContacts}
                      onCheckedChange={setLimitNewContacts}
                    />
                    <Label htmlFor="limit-new-contacts" className="flex-1">
                      <div className="font-medium">Limitar novos contatos</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Limita o número de novos contatos por dia para cada
                        instância
                      </p>
                    </Label>
                  </div>

                  {limitNewContacts && (
                    <div className="space-y-2 pl-8">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-contacts-per-day">
                          Novos Contatos por Dia
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {newContactsPerDay} contatos
                        </span>
                      </div>
                      <Slider
                        id="new-contacts-per-day"
                        min={10}
                        max={200}
                        step={10}
                        value={[newContactsPerDay]}
                        onValueChange={(value) =>
                          setNewContactsPerDay(value[0])
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Estas configurações se aplicam a todas as instâncias. Para
                      configurações específicas por instância, acesse as
                      configurações individuais.
                    </p>
                  </div>

                  <Button className="w-full">Salvar Configurações</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para criar nova instância */}
      <InstanceFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateInstance}
      />
    </div>
  );
}
