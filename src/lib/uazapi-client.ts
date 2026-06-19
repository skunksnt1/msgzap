"use client";

/**
 * Cliente para integração com a API da uazapi no lado do cliente
 * Documentação: https://docs.uazapi.com/
 */

/**
 * Interface para a resposta da conexão de instância
 */
export interface UazapiConnectResponse {
  connected?: boolean;
  pairingCode?: string;
  qrcode?: string;
  status?: string;
  error?: string;
  message?: string;
}

/**
 * Conecta uma instância ao WhatsApp (versão cliente)
 * @param instanceId ID da instância a ser conectada
 * @returns Resposta da API com QR Code ou código de pareamento
 */
export async function connectInstanceClient(instanceId: string): Promise<UazapiConnectResponse> {
  try {
    const response = await fetch("/api/instances/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instanceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro na API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao conectar instância:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      status: "error",
    };
  }
}

/**
 * Formata um número de telefone para o formato esperado pela uazapi
 * @param phone Número de telefone (com ou sem formatação)
 * @returns Número formatado (apenas dígitos com DDI)
 */
export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const digits = phone.replace(/\D/g, "");

  // Se não começar com 55 (Brasil), adiciona
  if (!digits.startsWith("55")) {
    return `55${digits}`;
  }

  return digits;
}

/**
 * Converte uma data e hora para timestamp em milissegundos
 * @param date Data no formato YYYY-MM-DD
 * @param time Hora no formato HH:MM
 * @returns Timestamp em milissegundos
 */
export function dateTimeToTimestamp(date: string, time: string): number {
  const dateTime = new Date(`${date}T${time}:00`);
  return dateTime.getTime();
}
