import { NextRequest, NextResponse } from "next/server";
import { checkAdminToken } from "@/lib/uazapi-token";

export async function GET(req: NextRequest) {
  try {
    const tokenStatus = await checkAdminToken();
    return NextResponse.json(tokenStatus, {
      status: tokenStatus.valid ? 200 : 400,
    });
  } catch (error) {
    console.error("Erro ao verificar token de administração:", error);
    return NextResponse.json(
      { valid: false, message: "Erro interno ao verificar token" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_UAZAPI_URL || "https://free.uazapi.com";
    
    // Tentar criar uma instância de teste
    const response = await fetch(`${apiUrl}/instance/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        admintoken: token,
      },
      body: JSON.stringify({
        name: "test-token-validation",
        systemName: "apilocal",
      }),
    });
    
    console.log(`Status da resposta: ${response.status}`);
    
    const responseText = await response.text();
    console.log(`Resposta da API: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { text: responseText };
    }
    
    return NextResponse.json({
      valid: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });
  } catch (error) {
    console.error("Erro ao testar token:", error);
    return NextResponse.json(
      { error: "Erro ao testar token" },
      { status: 500 }
    );
  }
}
