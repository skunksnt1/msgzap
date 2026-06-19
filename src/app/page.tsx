"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import {
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Shield,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Marketing no WhatsApp com{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                segurança e economia
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Plataforma completa para disparos em massa no WhatsApp com preço
              fixo em reais e proteção contra banimento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/login">
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link href="#planos">Ver Planos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desenvolvida especialmente para pequenos e médios empresários
              brasileiros que precisam de uma solução confiável e acessível
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Preço Fixo em Reais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Esqueça cobranças em dólar e taxas por mensagem. Nossos planos
                  têm preço fixo mensal em reais, permitindo planejamento
                  financeiro sem surpresas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Proteção contra Banimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Algoritmos inteligentes que variam mensagens e controlam a
                  velocidade de envio para minimizar o risco de bloqueio da sua
                  conta de WhatsApp.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Simplicidade Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interface intuitiva que permite importar contatos, criar
                  campanhas e acompanhar resultados em poucos cliques, sem
                  conhecimento técnico.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos Acessíveis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o seu negócio, todos com preço fixo
              mensal em reais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <Card className="border border-muted-foreground/20">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <div className="text-3xl font-bold">R$ 97/mês</div>
                <p className="text-sm text-muted-foreground">
                  Ideal para pequenos negócios
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>1 instância do WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Até 1.000 mensagens/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Importação de contatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Relatórios básicos</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/register">Começar Agora</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Plano Profissional */}
            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                Mais Popular
              </div>
              <CardHeader>
                <CardTitle>Profissional</CardTitle>
                <div className="text-3xl font-bold">R$ 197/mês</div>
                <p className="text-sm text-muted-foreground">
                  Para negócios em crescimento
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>2 instâncias do WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Até 5.000 mensagens/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Variações de mensagens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Agendamento avançado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/register">Escolher Plano</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Plano Empresarial */}
            <Card className="border border-muted-foreground/20">
              <CardHeader>
                <CardTitle>Empresarial</CardTitle>
                <div className="text-3xl font-bold">R$ 397/mês</div>
                <p className="text-sm text-muted-foreground">
                  Para operações maiores
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>5 instâncias do WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Até 15.000 mensagens/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Todas funcionalidades</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Suporte dedicado</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/register">Escolher Plano</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para impulsionar seu negócio?
            </h2>
            <p className="text-muted-foreground mb-8">
              Comece hoje mesmo a utilizar o WhatsApp como uma poderosa
              ferramenta de marketing, sem se preocupar com custos altos ou
              risco de banimento.
            </p>
            <Button asChild size="lg">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? "Acessar Dashboard" : "Criar Conta Grátis"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
