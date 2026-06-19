import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { whatsappInstance } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Buscar todas as instâncias do usuário
    const instances = await db.query.whatsappInstance.findMany({
      where: (instance, { eq }) => eq(instance.userId, session.user.id),
      orderBy: (instance, { desc }) => [desc(instance.createdAt)],
    });

    return NextResponse.json({
      success: true,
      instances,
    });
  } catch (error) {
    console.error("Erro ao buscar instâncias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar instâncias" },
      { status: 500 }
    );
  }
}
