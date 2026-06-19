/**
 * Serviço para integração com a API da uazapi
 * Documentação: https://docs.uazapi.com/
 */

export interface UazapiSendMessage {
  number: string;
  message: string;
}

export interface UazapiAdvancedSenderRequest {
  delayMin?: number;
  delayMax?: number;
  info?: string;
  scheduled_for?: number;
  messages: UazapiSendMessage[];
}

export interface UazapiResponse {
  status: boolean;
  message: string;
  info?: any;
}

/**
 * Envia mensagens em massa com opções avançadas
 * @param instanceKey Chave da instância do WhatsApp
 * @param data Dados para envio em massa
 * @returns Resposta da API
 */
export async function sendAdvanced(
  instanceKey: string,
  data: UazapiAdvancedSenderRequest
): Promise<UazapiResponse> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_UAZAPI_URL || "https://api.uazapi.com";
    const response = await fetch(`${apiUrl}/sender/advanced/${instanceKey}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Cada instância autentica com o seu próprio token (instanceKey).
        // Usa o token global como fallback apenas se não houver chave.
        token: instanceKey || process.env.UAZAPI_API_KEY || "",
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar mensagens:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
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
