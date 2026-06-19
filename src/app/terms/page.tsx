import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso - WhatsApp Disparador",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Última atualização: 19 de junho de 2026
      </p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            1. Aceitação dos termos
          </h2>
          <p>
            Ao acessar e utilizar a plataforma WhatsApp Disparador, você concorda
            com estes Termos de Uso. Caso não concorde, não utilize o serviço.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            2. Uso do serviço
          </h2>
          <p>
            Você se compromete a utilizar a plataforma de acordo com a legislação
            vigente, incluindo a Lei Geral de Proteção de Dados (LGPD), e com as
            políticas do WhatsApp. É de sua responsabilidade obter o consentimento
            dos destinatários antes de enviar mensagens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            3. Conduta proibida
          </h2>
          <p>
            É vedado o uso da plataforma para envio de spam, conteúdo ilegal,
            fraudulento, ofensivo ou que viole direitos de terceiros. O
            descumprimento poderá resultar na suspensão da conta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            4. Limitação de responsabilidade
          </h2>
          <p>
            A plataforma oferece mecanismos de mitigação de risco, mas não garante
            que contas de WhatsApp não sejam banidas. O uso é de inteira
            responsabilidade do usuário.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            5. Alterações
          </h2>
          <p>
            Estes termos podem ser atualizados periodicamente. Recomendamos a
            revisão regular desta página.
          </p>
        </section>
      </div>
    </div>
  );
}
