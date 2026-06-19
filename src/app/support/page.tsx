import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, BookOpen, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Suporte - WhatsApp Disparador",
};

export default function SupportPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Suporte</h1>
      <p className="text-muted-foreground mb-8">
        Precisa de ajuda? Conte com a gente para resolver suas dúvidas.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
              E-mail
            </CardTitle>
            <CardDescription>
              Envie sua dúvida e responderemos o mais rápido possível.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a href="mailto:suporte@wppdisparador.com.br">
                suporte@wppdisparador.com.br
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Documentação
            </CardTitle>
            <CardDescription>
              Guias e tutoriais sobre as funcionalidades da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/settings">Ver diagnóstico do sistema</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Perguntas frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">
              Como conecto uma conta do WhatsApp?
            </p>
            <p>
              Vá em Instâncias, crie uma nova instância e escaneie o QR Code com
              o aplicativo do WhatsApp.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">
              Como evito que minha conta seja banida?
            </p>
            <p>
              Use os mecanismos de mitigação de risco em Instâncias: limite
              diário, intervalo entre mensagens e variações de texto.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">
              Como importo meus contatos?
            </p>
            <p>
              Em Contatos, use a opção Importar para enviar um arquivo CSV com as
              colunas nome e telefone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
