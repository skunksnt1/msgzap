import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade - WhatsApp Disparador",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Última atualização: 19 de junho de 2026
      </p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Dados que coletamos
          </h2>
          <p>
            Coletamos os dados fornecidos no cadastro (nome e e-mail), os
            contatos que você importa e informações de uso da plataforma
            necessárias para a prestação do serviço.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Como usamos os dados
          </h2>
          <p>
            Utilizamos seus dados para operar a plataforma, processar campanhas,
            gerar relatórios e melhorar o serviço. Não vendemos seus dados a
            terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. LGPD
          </h2>
          <p>
            Tratamos os dados em conformidade com a Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018). Você pode solicitar acesso, correção ou
            exclusão dos seus dados a qualquer momento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Segurança
          </h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados
            contra acesso não autorizado, perda ou alteração.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Contato
          </h2>
          <p>
            Para dúvidas sobre esta política ou exercício de direitos, acesse a
            página de{" "}
            <Link href="/support" className="text-primary hover:underline">
              suporte
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
