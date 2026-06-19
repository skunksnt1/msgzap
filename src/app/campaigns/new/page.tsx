"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  Shuffle,
  Smartphone,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function NewCampaignPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("message");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [useVariations, setUseVariations] = useState(true);
  const [variations, setVariations] = useState<string[]>([""]);
  const [sendingSpeed, setSendingSpeed] = useState(10);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Dados simulados para demonstração
  const contactLists = [
    { id: "1", name: "Clientes Ativos", count: 245 },
    { id: "2", name: "Leads Recentes", count: 78 },
    { id: "3", name: "Aniversariantes", count: 32 },
  ];

  const [instances, setInstances] = useState<
    Array<{
      id: string;
      name: string;
      phone: string | null;
      status: string;
    }>
  >([]);
  const [loadingInstances, setLoadingInstances] = useState(true);

  useEffect(() => {
    const loadInstances = async () => {
      try {
        const res = await fetch("/api/instances");
        if (res.ok) {
          const json = await res.json();
          setInstances(json.instances || []);
        }
      } catch (error) {
        console.error("Erro ao carregar instâncias:", error);
      } finally {
        setLoadingInstances(false);
      }
    };
    loadInstances();
  }, []);

  const connectedInstances = instances.filter(
    (instance) =>
      instance.status === "connected" || instance.status === "authenticated"
  );

  const toggleInstance = (id: string) => {
    setSelectedInstances((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addVariation = () => {
    setVariations([...variations, ""]);
  };

  const updateVariation = (index: number, value: string) => {
    const newVariations = [...variations];
    newVariations[index] = value;
    setVariations(newVariations);
  };

  const removeVariation = (index: number) => {
    if (variations.length > 1) {
      const newVariations = variations.filter((_, i) => i !== index);
      setVariations(newVariations);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [distribution, setDistribution] = useState<
    Array<{ instanceName: string; count: number; status: boolean }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInstances.length === 0) {
      setSubmitError("Selecione ao menos uma instância para o rodízio de envio");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulando lista de contatos para demonstração
      // Em produção, buscaríamos do banco de dados com base no selectedList
      const mockContactList = [
        { id: "1", name: "João Silva", phone: "5511987654321" },
        { id: "2", name: "Maria Oliveira", phone: "5511912345678" },
        { id: "3", name: "Pedro Santos", phone: "5511998765432" },
      ];

      const payload = {
        name: campaignName,
        description: campaignDescription,
        message,
        // Rodízio: enviar todas as instâncias selecionadas. O servidor
        // distribui as mensagens entre elas (round-robin).
        instanceIds: selectedInstances,
        contactList: mockContactList, // Em produção, usar a lista real de contatos
        useVariations,
        variations: useVariations
          ? variations.filter((v) => v.trim() !== "")
          : [],
        sendingSpeed,
        isScheduled,
        scheduledDate,
        scheduledTime,
      };

      // Enviar para a API
      const response = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar campanha");
      }

      setSubmitSuccess(true);
      setDistribution(data.distribution || []);

      // Redirecionar para a página de campanhas após 3 segundos
      setTimeout(() => {
        window.location.href = "/campaigns";
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar campanha:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para criar campanhas
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
        <h1 className="text-3xl font-bold">Nova Campanha</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Informações da Campanha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Promoção de Fim de Semana"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo desta campanha"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="message" onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="message">Mensagem</TabsTrigger>
                    <TabsTrigger value="variations">Variações</TabsTrigger>
                    <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                  </TabsList>

                  <TabsContent value="message">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Digite sua mensagem aqui..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        required
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>
                          Use {"{nome}"} para inserir o nome do contato na
                          mensagem
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="variations">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="use-variations"
                          checked={useVariations}
                          onCheckedChange={setUseVariations}
                        />
                        <Label htmlFor="use-variations">
                          Usar variações de mensagem (recomendado)
                        </Label>
                      </div>

                      {useVariations && (
                        <>
                          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium text-amber-500">
                                Por que usar variações?
                              </p>
                              <p className="text-muted-foreground">
                                Usar variações de mensagens reduz
                                significativamente o risco de banimento, pois
                                evita que o WhatsApp identifique envios em massa
                                idênticos.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {variations.map((variation, index) => (
                              <div key={index} className="flex gap-2">
                                <Textarea
                                  placeholder={`Variação ${index + 1}`}
                                  value={variation}
                                  onChange={(e) =>
                                    updateVariation(index, e.target.value)
                                  }
                                  rows={3}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariation(index)}
                                  disabled={variations.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addVariation}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Variação
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="bg-background rounded-lg p-4 max-w-sm mx-auto border shadow-sm">
                        <div className="text-sm font-medium mb-2 text-green-600">
                          WhatsApp Preview
                        </div>
                        <div className="bg-[#e2ffc7] p-3 rounded-lg text-black text-sm">
                          {message || "Sua mensagem aparecerá aqui..."}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-list">Lista de Contatos</Label>
                  <Select
                    value={selectedList}
                    onValueChange={setSelectedList}
                    required
                  >
                    <SelectTrigger id="contact-list">
                      <SelectValue placeholder="Selecione uma lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.count} contatos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Shuffle className="h-4 w-4" />
                      Instâncias (rodízio)
                    </Label>
                    {selectedInstances.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {selectedInstances.length} selecionada
                        {selectedInstances.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Selecione uma ou mais instâncias. As mensagens serão
                    distribuídas alternadamente entre elas para reduzir o risco
                    de banimento.
                  </p>

                  {loadingInstances ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando instâncias...
                    </div>
                  ) : connectedInstances.length === 0 ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-sm">
                      <p className="text-amber-600 font-medium">
                        Nenhuma instância conectada
                      </p>
                      <p className="text-muted-foreground">
                        Conecte uma instância em{" "}
                        <Link href="/instances" className="underline">
                          Instâncias
                        </Link>{" "}
                        para enviar campanhas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {connectedInstances.map((instance) => {
                        const checked = selectedInstances.includes(instance.id);
                        return (
                          <button
                            type="button"
                            key={instance.id}
                            onClick={() => toggleInstance(instance.id)}
                            className={`w-full flex items-center justify-between gap-3 rounded-md border p-3 text-left text-sm transition-colors ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-input hover:bg-accent"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Smartphone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {instance.name}
                                </div>
                                {instance.phone && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {instance.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                            {checked && (
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedInstances.length > 1 && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
                      <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        Rodízio ativo: o envio vai alternar entre as{" "}
                        {selectedInstances.length} instâncias selecionadas.
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sending-speed">Velocidade de Envio</Label>
                    <span className="text-sm text-muted-foreground">
                      {sendingSpeed} msgs/min
                    </span>
                  </div>
                  <Slider
                    id="sending-speed"
                    min={1}
                    max={30}
                    step={1}
                    value={[sendingSpeed]}
                    onValueChange={(value) => setSendingSpeed(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendamos até 10 msgs/min para reduzir o risco de
                    banimento
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="schedule"
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                    <Label
                      htmlFor="schedule"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Agendar envio
                    </Label>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          required={isScheduled}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Hora</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          required={isScheduled}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {submitError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 bg-green-500/10 rounded-md space-y-2">
                  <div className="flex items-start gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>
                      {isScheduled
                        ? "Campanha agendada com sucesso!"
                        : "Campanha iniciada com sucesso!"}
                    </span>
                  </div>
                  {distribution.length > 0 && (
                    <div className="text-sm text-muted-foreground pl-7 space-y-1">
                      <p className="font-medium text-foreground">
                        Rodízio aplicado:
                      </p>
                      {distribution.map((d) => (
                        <div
                          key={d.instanceName}
                          className="flex justify-between"
                        >
                          <span>{d.instanceName}</span>
                          <span>
                            {d.count} msg{d.count === 1 ? "" : "s"}{" "}
                            {d.status ? "✓" : "✗"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Link href="/campaigns">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      {isScheduled ? "Agendando..." : "Iniciando..."}
                    </>
                  ) : isScheduled ? (
                    "Agendar Campanha"
                  ) : (
                    "Iniciar Campanha"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
