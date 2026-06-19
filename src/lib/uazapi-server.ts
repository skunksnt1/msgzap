/**
 * Serviço para integração com a API da uazapi no lado do servidor
 * Documentação: https://docs.uazapi.com/endpoint/post/instance~init
 */

export interface UazapiInstanceCreateRequest {
  name: string;
  systemName?: string;
  adminField01?: string;
  adminField02?: string;
}

export interface UazapiInstanceCreateResponse {
  connected?: boolean;
  info?: string;
  instance?: {
    id: string;
    token: string;
    status: string;
    paircode?: string;
    qrcode?: string;
    name: string;
    profileName?: string;
    profilePicUrl?: string;
    isBusiness?: boolean;
    plataform?: string;
    systemName?: string;
    owner?: string;
    lastDisconnect?: string;
    lastDisconnectReason?: string;
    adminField01?: string;
    adminField02?: string;
    created?: string;
    updated?: string;
  };
  loggedIn?: boolean;
  name?: string;
  response?: string;
  token?: string;
  status?: boolean; // Para compatibilidade com código existente
  error?: string;
  message?: string;
}

export interface UazapiConnectResponse {
  connected?: boolean;
  loggedIn?: boolean;
  jid?: string | null;
  instance?: {
    id: string;
    token: string;
    status: string;
    paircode?: string; // Código de pareamento da UAZAPI
    qrcode?: string;
    name: string;
    profileName?: string;
    profilePicUrl?: string;
    isBusiness?: boolean;
    plataform?: string;
    systemName?: string;
    owner?: string;
    lastDisconnect?: string;
    lastDisconnectReason?: string;
    adminField01?: string;
    openai_apikey?: string;
    chatbot_enabled?: boolean;
    chatbot_ignoreGroups?: boolean;
    chatbot_stopConversation?: string;
    chatbot_stopMinutes?: number;
    created?: string;
    updated?: string;
    delayMin?: number;
    delayMax?: number;
  };
  error?: string;
  message?: string;
}

/**
 * Cria uma nova instância do WhatsApp na uazapi
 * @param data Dados para criação da instância
 * @returns Resposta da API com os dados da instância criada
 */
export async function createInstance(
  data: UazapiInstanceCreateRequest
): Promise<UazapiInstanceCreateResponse> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_UAZAPI_URL || "https://free.uazapi.com";
    const adminToken = process.env.UAZAPI_ADMINTOKEN;

    if (!adminToken) {
      throw new Error("UAZAPI_ADMINTOKEN não configurado");
    }

    console.log(`Admin token length: ${adminToken.length}`);

    console.log(`Criando instância na uazapi: ${apiUrl}/instance/init`);
    console.log(
      `Dados: ${JSON.stringify({
        name: data.name,
        systemName: data.systemName || "apilocal",
        adminField01: data.adminField01 ? "***" : undefined,
        adminField02: data.adminField02 ? "***" : undefined,
      })}`
    );

    const response = await fetch(`${apiUrl}/instance/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        admintoken: adminToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `Erro na API: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        console.log(`Erro da API uazapi:`, errorData);

        if (response.status === 401) {
          errorMessage =
            "Token de administração inválido ou expirado. Verifique o UAZAPI_ADMINTOKEN no arquivo .env";
        } else {
          errorMessage = errorData.error || errorMessage;
        }

        throw new Error(errorMessage);
      } catch (jsonError) {
        // Se não conseguir fazer parse do JSON de erro
        if (response.status === 401) {
          throw new Error(
            "Token de administração inválido ou expirado. Verifique o UAZAPI_ADMINTOKEN no arquivo .env"
          );
        }
        throw new Error(errorMessage);
      }
    }

    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        throw new Error("Resposta vazia da API");
      }
      return JSON.parse(responseText);
    } catch {
      console.error("Erro ao fazer parse da resposta JSON");
      throw new Error("Resposta inválida da API: formato JSON inválido");
    }
  } catch (error) {
    console.error("Erro ao criar instância na uazapi:", error);
    return {
      status: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Conecta uma instância ao WhatsApp
 * @param token Token da instância (identifica a instância)
 * @param phone Número de telefone (opcional - se não fornecido, gera QR code)
 * @returns Resposta da API com QR Code ou código de pareamento
 */
export async function connectInstance(
  token: string,
  phone?: string
): Promise<UazapiConnectResponse> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_UAZAPI_URL || "https://free.uazapi.com";

    console.log(`Conectando instância ao WhatsApp via token`);

    const payload = phone ? { phone } : {};

    const response = await fetch(`${apiUrl}/instance/connect`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Erro na API: ${response.status} ${response.statusText}`
        );
      } catch {
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      }
    }

    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        throw new Error("Resposta vazia da API");
      }
      return JSON.parse(responseText);
    } catch {
      console.error("Erro ao fazer parse da resposta JSON");
      throw new Error("Resposta inválida da API: formato JSON inválido");
    }
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
 * Verifica o status de uma instância
 * @param instanceName Nome da instância
 * @param token Token da instância
 * @returns Status da instância
 */
export async function checkInstanceStatus(
  instanceName: string,
  token: string
): Promise<string> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_UAZAPI_URL || "https://free.uazapi.com";

    const response = await fetch(
      `${apiUrl}/instance/connectionState/${instanceName}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          token: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao verificar status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.state || "disconnected";
  } catch (error) {
    console.error("Erro ao verificar status da instância:", error);
    return "disconnected";
  }
}
