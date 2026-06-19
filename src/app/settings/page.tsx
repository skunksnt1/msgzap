"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { SetupChecklist } from "@/components/setup-checklist";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User } from "lucide-react";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Informações da sua conta e sessão.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nome
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {user.name || "Não informado"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  E-mail
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {user.email}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Ver perfil
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico do sistema</CardTitle>
            <CardDescription>
              Verifique se o ambiente, banco de dados e integrações estão
              configurados corretamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetupChecklist />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
