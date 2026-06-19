import { NextRequest, NextResponse } from "next/server";
import { sendAdvanced, dateTimeToTimestamp, formatPhone } from "@/lib/uazapi";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type ContactInput = { name?: string; phone: string };

export async function POST(req: NextRequest) {
  // Verificar autenticação
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      name,
      message,
      instanceIds,
      contactList,
      sendingSpeed,
      isScheduled,
      scheduledDate,
      scheduledTime,
      useVariations,
      variations,
    }: {
      name?: string;
      message?: string;
      instanceIds?: string[];
      contactList?: ContactInput[];
      sendingSpeed?: number;
      isScheduled?: boolean;
      scheduledDate?: string;
      scheduledTime?: string;
      useVariations?: boolean;
      variations?: string[];
    } = data;

    // Validar dados obrigatórios
    if (!message || !contactList || contactList.length === 0) {
      return NextResponse.json(
        { error: "Mensagem e lista de contatos são obrigatórias" },
        { status: 400 }
      );
    }

    if (!Array.isArray(instanceIds) || instanceIds.length === 0) {
      return NextResponse.json(
        { error: "Selecione ao menos uma instância para o rodízio" },
        { status: 400 }
      );
    }

    // Buscar as instâncias selecionadas que pertencem ao usuário
    const instances = await db.query.whatsappInstance.findMany({
      where: (instance, { and, eq, inArray }) =>
        and(
          eq(instance.userId, session.user.id),
          inArray(instance.id, instanceIds)
        ),
    });

    // Apenas instâncias com chave e conectadas/autenticadas podem enviar
    const usableInstances = instances.filter(
      (i) =>
        i.instanceKey &&
        (i.status === "connected" || i.status === "authenticated")
    );

    if (usableInstances.length === 0) {
      return NextResponse.json(
        {
          error:
            "Nenhuma instância válida selecionada. Verifique se as instâncias estão conectadas.",
        },
        { status: 400 }
      );
    }

    // Calcular delay com base na velocidade de envio (mensagens por minuto)
    const speed = sendingSpeed && sendingSpeed > 0 ? sendingSpeed : 10;
    const baseDelay = Math.floor(60 / speed);
    const delayMin = Math.max(2, baseDelay - 1);
    const delayMax = baseDelay + 1;

    // Preparar mensagens (com variações opcionais por contato)
    const pickMessage = () =>
      useVariations && variations && variations.length > 0
        ? variations[Math.floor(Math.random() * variations.length)] || message
        : message;

    const messages = contactList.map((contact) => ({
      number: formatPhone(contact.phone),
      message: pickMessage(),
    }));

    // RODÍZIO: distribuir as mensagens entre as instâncias em round-robin
    const buckets: { number: string; message: string }[][] = usableInstances.map(
      () => []
    );
    messages.forEach((msg, index) => {
      buckets[index % usableInstances.length].push(msg);
    });

    // Configurar agendamento
    let scheduled_for: number | undefined = undefined;
    if (isScheduled && scheduledDate && scheduledTime) {
      scheduled_for = dateTimeToTimestamp(scheduledDate, scheduledTime);
    }

    // Enviar a fatia de cada instância
    const results = await Promise.all(
      usableInstances.map(async (instance, idx) => {
        const bucket = buckets[idx];
        if (bucket.length === 0) {
          return {
            instanceId: instance.id,
            instanceName: instance.name,
            count: 0,
            status: true,
            message: "Sem mensagens nesta fatia",
          };
        }

        const response = await sendAdvanced(instance.instanceKey as string, {
          delayMin,
          delayMax,
          info: name,
          scheduled_for,
          messages: bucket,
        });

        return {
          instanceId: instance.id,
          instanceName: instance.name,
          count: bucket.length,
          status: response.status,
          message: response.message,
          info: response.info,
        };
      })
    );

    const anySuccess = results.some((r) => r.status && r.count > 0);
    const allSuccess = results.every((r) => r.status);

    return NextResponse.json(
      {
        success: anySuccess,
        message: allSuccess
          ? "Campanha distribuída com sucesso entre as instâncias"
          : "Campanha enviada parcialmente — verifique o detalhamento",
        totalMessages: messages.length,
        instancesUsed: usableInstances.length,
        distribution: results,
      },
      { status: anySuccess ? 200 : 500 }
    );
  } catch (error) {
    console.error("Erro ao processar campanha:", error);
    return NextResponse.json(
      { error: "Erro ao processar campanha" },
      { status: 500 }
    );
  }
}
