"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2, Smartphone } from "lucide-react";
import Image from "next/image";
import { connectInstanceClient } from "@/lib/uazapi-client";

interface InstanceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; phone: string }) => Promise<{
    qrcode?: string;
    instance?: {
      id: string;
      name: string;
      phone: string;
    };
    info?: string;
  }>;
}

export function InstanceFormModal({
  open,
  onOpenChange,
  onSubmit,
}: InstanceFormModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("55");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [instanceInfo, setInstanceInfo] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const [showConnectOption, setShowConnectOption] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!name.trim()) {
      setError("Nome da instância é obrigatório");
      return;
    }

    if (!phone.trim()) {
      setError("Número de telefone é obrigatório");
      return;
    }

    // Formato básico de telefone brasileiro: 55 + DDD + 8 ou 9 dígitos
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneRegex = /^55\d{10,11}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError(
        "Formato de telefone inválido. Use 55 + DDD + número (ex: 5511987654321)"
      );
      return;
    }

    // Verificar se o número não está muito longo
    if (cleanPhone.length > 13) {
      setError(
        "Número de telefone muito longo. Use 55 + DDD + número (ex: 5511987654321)"
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setQrCode(null);
    setShowQrCode(false);

    try {
      const result = await onSubmit({ name, phone });
      setSuccess(true);

      // Se tiver instância criada, salvar as informações
      if (result?.instance) {
        setInstanceInfo(result.instance);
        setShowConnectOption(true);
      }

      // Se tiver QR Code, mostra para o usuário
      if (result?.qrcode) {
        setQrCode(result.qrcode);
        setShowQrCode(true);
        setShowConnectOption(false);
        // Não fecha o modal automaticamente quando tem QR Code
      } else if (result?.info) {
        // Se tiver informações adicionais mas não tiver QR Code, mostrar opção para conectar
        setShowConnectOption(true);
      } else if (!result?.instance) {
        // Se não tiver instância nem QR Code, fechar modal após 1.5 segundos
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar instância");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setSuccess(false);
    setQrCode(null);
    setShowQrCode(false);
    setError(null);
    setInstanceInfo(null);
    setShowConnectOption(false);
    setIsConnecting(false);
    setPairingCode(null);
  };

  const handleConnectInstance = async () => {
    if (!instanceInfo) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const data = await connectInstanceClient(instanceInfo.id);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Se tiver QR Code ou código de pareamento, mostrar para o usuário
      if (data.qrcode) {
        setQrCode(data.qrcode);
        setShowQrCode(true);
        setShowConnectOption(false);
      } else if (data.pairingCode) {
        setPairingCode(data.pairingCode);
        setShowQrCode(false);
        setShowConnectOption(false);
      } else {
        setSuccess(true);
        setShowConnectOption(false);
        
        // Fechar modal após 1.5 segundos
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 1500);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao conectar instância"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números
    let value = e.target.value.replace(/\D/g, "");

    // Limitar o tamanho para evitar números muito longos
    if (value.length > 13) {
      value = value.substring(0, 13);
    }

    // Garantir que o número sempre comece com 55
    if (!value.startsWith("55")) {
      value = "55" + value.replace(/^55/, "");
    }

    setPhone(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Instância do WhatsApp</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para conectar uma nova instância do
              WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Instância</Label>
              <Input
                id="name"
                placeholder="Ex: Principal, Suporte, Marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting || success}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Número do WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: 5511987654321"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isSubmitting || success}
                autoComplete="tel"
                inputMode="tel"
              />
              <p className="text-xs text-muted-foreground">
                Formato: 55 + DDD + número (ex: 5511987654321, apenas números)
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 text-green-500 text-sm p-3 rounded-md flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Instância criada com sucesso!</span>
              </div>
            )}

            {showQrCode && qrCode && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="font-medium mb-2">Escaneie o QR Code</h3>
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Abra o WhatsApp no seu celular e escaneie o QR Code abaixo
                  para conectar sua instância
                </p>
                <div className="border p-2 rounded-md bg-white">
                  <Image
                    src={qrCode}
                    alt="QR Code para conexão do WhatsApp"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-amber-600">
                  <Smartphone className="h-4 w-4" />
                  <span>Escaneie com o aplicativo WhatsApp</span>
                </div>
              </div>
            )}

            {pairingCode && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="font-medium mb-2">Código de Pareamento</h3>
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Abra o WhatsApp no seu celular, vá em Configurações {">"}{" "}
                  Dispositivos vinculados e insira o código abaixo
                </p>
                <div className="border p-3 rounded-md bg-white text-center">
                  <p className="text-2xl font-mono tracking-wider">
                    {pairingCode}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-amber-600">
                  <Smartphone className="h-4 w-4" />
                  <span>Digite o código no aplicativo WhatsApp</span>
                </div>
              </div>
            )}

            {showConnectOption && instanceInfo && (
              <div className="mt-4 flex flex-col items-center">
                <h3 className="font-medium mb-2">
                  Instância Criada com Sucesso!
                </h3>
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Deseja conectar esta instância ao WhatsApp agora?
                </p>
                <Button
                  onClick={handleConnectInstance}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    "Conectar ao WhatsApp"
                  )}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            {showQrCode || pairingCode ? (
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
              >
                Fechar
              </Button>
            ) : showConnectOption ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    onOpenChange(false);
                  }}
                >
                  Fechar
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting || success}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Instância"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
