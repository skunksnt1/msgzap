import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { whatsappInstance } from "@/lib/schema";
import { connectInstance } from "@/lib/uazapi-server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { instanceId } = await req.json();

    // Validação básica
    if (!instanceId) {
      return NextResponse.json(
        { error: "ID da instância é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar instância no banco de dados
    const instance = await db.query.whatsappInstance.findFirst({
      where: (instance, { and, eq }) =>
        and(eq(instance.id, instanceId), eq(instance.userId, session.user.id)),
    });

    if (!instance) {
      return NextResponse.json(
        { error: "Instância não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se temos as informações necessárias para conectar
    if (
      !instance.config ||
      !instance.config.instanceName ||
      !instance.instanceKey
    ) {
      return NextResponse.json(
        { error: "Informações de configuração da instância incompletas" },
        { status: 400 }
      );
    }

    // Conectar instância ao WhatsApp
    const connectResponse = await connectInstance(
      instance.instanceKey,
      instance.phone // Passar o número de telefone para usar o código de pareamento
    );

    console.log("Resposta da conexão:", JSON.stringify(connectResponse));

    if (connectResponse.error) {
      return NextResponse.json(
        { error: connectResponse.error },
        { status: 500 }
      );
    }

    // Atualizar status da instância no banco de dados
    await db
      .update(whatsappInstance)
      .set({
        status: "connecting",
        updatedAt: new Date(),
      })
      .where(eq(whatsappInstance.id, instanceId));

    return NextResponse.json({
      success: true,
      message: "Instância em processo de conexão",
      qrcode: connectResponse.instance?.qrcode,
      pairingCode: connectResponse.instance?.paircode, // Corrigido: paircode em vez de pairingCode
      connected: connectResponse.connected,
      loggedIn: connectResponse.loggedIn,
      status: connectResponse.instance?.status,
    });
  } catch (error) {
    console.error("Erro ao conectar instância:", error);
    return NextResponse.json(
      { error: "Erro ao conectar instância" },
      { status: 500 }
    );
  }
}
