import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAdminToken } from "@/lib/uazapi-token";

export async function GET(req: NextRequest) {
  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const tokenStatus = await checkAdminToken();

    return NextResponse.json({
      valid: tokenStatus.valid,
      message: tokenStatus.message || "Token válido",
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return NextResponse.json(
      { error: "Erro ao verificar token" },
      { status: 500 }
    );
  }
}
