import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { whatsappInstance } from "@/lib/schema";
import { nanoid } from "nanoid";
import { createInstance } from "@/lib/uazapi-server";
import { checkAdminToken } from "@/lib/uazapi-token";

export async function POST(req: NextRequest) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { name, phone } = await req.json();

    // Validação básica
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    // Formatar telefone (remover caracteres não numéricos)
    const formattedPhone = phone.replace(/\D/g, "");

    // Verificar se já existe uma instância com o mesmo telefone para este usuário
    const existingInstance = await db.query.whatsappInstance.findFirst({
      where: (instance, { and, eq }) =>
        and(
          eq(instance.phone, formattedPhone),
          eq(instance.userId, session.user.id)
        ),
    });

    if (existingInstance) {
      return NextResponse.json(
        { error: "Já existe uma instância com este número de telefone" },
        { status: 400 }
      );
    }
    
    // Verificar se o token de administração está válido
    const tokenStatus = await checkAdminToken();
    if (!tokenStatus.valid) {
      return NextResponse.json(
        { error: tokenStatus.message || "Token de administração inválido" },
        { status: 400 }
      );
    }

    // Criar instância na uazapi
    const uazapiResponse = await createInstance({
      name: name,
      systemName: "apilocal",
      adminField01: session.user.id, // Armazenar o ID do usuário como metadado
      adminField02: formattedPhone, // Armazenar o telefone como metadado
    });

    console.log("Resposta da uazapi:", JSON.stringify(uazapiResponse));

    // Verificar se a resposta contém uma instância válida
    if (!uazapiResponse.instance || !uazapiResponse.instance.token) {
      return NextResponse.json(
        { error: uazapiResponse.error || "Erro ao criar instância na uazapi" },
        { status: 500 }
      );
    }

    // Salvar instância no banco de dados
    const newInstance = await db
      .insert(whatsappInstance)
      .values({
        id: nanoid(),
        name,
        phone: formattedPhone,
        status: uazapiResponse.instance.status || "disconnected",
        userId: session.user.id,
        instanceKey: uazapiResponse.instance.token, // Usar o token gerado pela uazapi
        createdAt: new Date(),
        updatedAt: new Date(),
        config: {
          instanceName: uazapiResponse.instance.name || name,
          token: uazapiResponse.instance.token,
          instanceId: uazapiResponse.instance.id,
        },
      })
      .returning();

    // Verificar se há QR Code na resposta
    const qrcode = uazapiResponse.instance.qrcode || null;

    return NextResponse.json({
      success: true,
      instance: newInstance[0],
      message: uazapiResponse.response || "Instância criada com sucesso",
      qrcode: qrcode,
      info: uazapiResponse.info || null,
    });
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    return NextResponse.json(
      { error: "Erro ao criar instância" },
      { status: 500 }
    );
  }
}
