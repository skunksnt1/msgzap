Project Brief: Plataforma SaaS de Disparos no WhatsApp
Sumário Executivo
Conceito do Produto: Uma plataforma SaaS para empresas no Brasil utilizarem o WhatsApp para comunicação em massa, abrangendo campanhas comerciais, notificações, anúncios e o gerenciamento do relacionamento com clientes.

Problema Principal: O custo da API oficial do WhatsApp é proibitivo para pequenos e médios empresários no Brasil, pois a cobrança é em dólar e por conversa, tornando os custos operacionais muito altos e inviabilizando o canal para eles.

Mercado-Alvo: Franqueados, varejistas e prestadores de serviços.

Proposta de Valor: A plataforma oferecerá um modelo de preço fixo e acessível, com foco na simplicidade de uso e em um conjunto robusto de funcionalidades para campanhas. O principal diferencial são os múltiplos mecanismos de segurança integrados (como variações de mensagens e limites de envio) para minimizar o risco de banimento da conta do WhatsApp.

Declaração do Problema
Estado Atual e Pontos de Dor: Atualmente, pequenos e médios empresários no Brasil estão presos em um trilema para se comunicar em massa via WhatsApp. Eles recorrem ao uso manual do WhatsApp Web (lento e não escalável), contratam plataformas de baixo custo que levam ao banimento, ou arcam com os custos operacionais altíssimos da API oficial.

Impacto do Problema: O impacto direto para os negócios é a ineficiência, perda de oportunidades de venda, risco de perda de um ativo de marketing crucial (o número de WhatsApp), e a compressão de margens de lucro já apertadas.

Falha das Soluções Atuais: A API Oficial falha pelo alto custo e pela rigidez (regras de contato e aprovação de mensagens). As outras plataformas falham pela falta de segurança contra banimento e pelo suporte inexistente.

Urgência e Importância: A urgência é impulsionada pelo fato de que o WhatsApp é o principal canal de comunicação no Brasil, tornando-se uma necessidade competitiva para a sobrevivência e crescimento desses negócios.

Solução Proposta
Conceito e Abordagem: A solução é uma plataforma SaaS 100% self-service, com preço fixo mensal em Reais, que resolve os problemas de custo e complexidade através de uma experiência de usuário extremamente simples.

Diferenciais-Chave: Modelo de negócio previsível; Simplicidade extrema ("plug-and-play"); e Foco na mitigação de risco de banimento de forma transparente.

Fatores de Sucesso: A combinação de preço competitivo com alta qualidade de entrega, comunicação transparente com o cliente e gestão de custos eficiente.

Visão de Longo Prazo: Evoluir para uma ferramenta mais completa, incluindo integrações com CRMs, fluxos automatizados de reengajamento e, futuramente, expansão para outros canais de comunicação.

Usuários-Alvo
Segmento Primário: Franqueado de Varejo: (Ex: Grupo Boticário) Pressionado a fazer marketing ativo, mas com custos controlados. Seu fluxo de trabalho envolve a exportação manual de contatos do sistema do franqueador. Precisa de uma plataforma para gerenciar esses contatos e medir a eficácia das campanhas.

Segmentos Secundários: Varejistas e Prestadores de Serviços: Compartilham as mesmas dores e necessidades essenciais do franqueado, buscando uma maneira acessível e segura de se comunicar em massa com seus clientes.

Metas e Métricas de Sucesso
Objetivo de Negócio: Validar a plataforma em produção em até 6 meses, tendo pelo menos um cliente ativo que dispare mais de 5.000 mensagens/mês, sem sofrer banimento.

Métricas de Sucesso do Usuário: O usuário deve perceber usabilidade superior, eficiência operacional, resultados mensuráveis (melhor taxa de resposta) e tranquilidade quanto à segurança do seu número.

KPIs: Nº de clientes com > 5k msgs/mês, Tempo médio para 1º disparo, Taxa de sucesso de entrega, Taxa de retenção mensal, Nº de incidentes de banimento.

Escopo do MVP (Produto Mínimo Viável)
Funcionalidades Essenciais: Gestão de Contatos (.csv); Criação/Agendamento de Campanhas (só texto); Mecanismos de Mitigação de Risco; Relatório Básico de Entregas; Gestão de Múltiplas Instâncias.

Fora do Escopo para o MVP: Mensagens com mídia, sugestão de variações com IA, pausa de disparos, proxy, integrações com CRM.

Critérios de Sucesso do MVP: Em 3 meses, alcançar 10 clientes pagantes, com pelo menos 2 deles gerenciando mais de uma instância.

Visão Pós-MVP
Fase 2: Foco em automação e inteligência (integrações com CRM, fluxos de reengajamento).

Longo Prazo: Foco em expansão para múltiplos canais (Telegram, Instagram, etc.).

Considerações Técnicas
Plataforma: Aplicação Web responsiva.

Tecnologias: Next.js (Full-stack), Supabase (Auth/DB), uazapi (WhatsApp Service).

Arquitetura: Serverless e Monorepo.

Restrições e Suposições
Restrições: Baixo orçamento, prazo curto, um único desenvolvedor.

Suposições: A API da uazapi é estável e seus termos permitem este modelo de negócio; os limites do plano inicial da Supabase são suficientes para o MVP.

Riscos e Questões em Aberto
Riscos: Dependência da uazapi, mudanças de política do WhatsApp/Meta, aumento da concorrência (ex: API oficial baratear).

Questões em Aberto: Qual a estratégia de preço exata para garantir a lucratividade?
