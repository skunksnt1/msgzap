# Campanhas de WhatsApp

## Visão Geral

O módulo de Campanhas permite aos usuários criar, agendar e monitorar campanhas de envio de mensagens em massa via WhatsApp. Este módulo é central para a plataforma, permitindo o envio de mensagens para listas de contatos com recursos avançados de personalização e segurança.

## Funcionalidades

### 1. Criação de Campanhas

- **Editor de Mensagens**: Interface para criar o conteúdo da mensagem com suporte a variáveis de personalização.
- **Variações de Mensagem**: Possibilidade de criar múltiplas variações da mesma mensagem para reduzir risco de banimento.
- **Seleção de Lista**: Integração com o módulo de Contatos para selecionar a lista de destinatários.
- **Seleção de Instância**: Escolha da instância do WhatsApp que será utilizada para envio.

### 2. Agendamento

- **Agendamento Flexível**: Possibilidade de enviar imediatamente ou agendar para data e hora específicas.
- **Controle de Velocidade**: Configuração da velocidade de envio (mensagens por minuto).
- **Visualização de Agenda**: Calendário para visualizar campanhas agendadas.

### 3. Monitoramento e Relatórios

- **Status em Tempo Real**: Acompanhamento do status de envio, entrega e leitura das mensagens.
- **Estatísticas Detalhadas**: Métricas de desempenho como taxa de entrega, taxa de leitura e taxa de resposta.
- **Visualização Gráfica**: Gráficos e indicadores visuais para facilitar a análise de resultados.
- **Exportação de Dados**: Possibilidade de exportar relatórios em formatos como CSV.

## Arquitetura

### Componentes Principais

- **CampaignForm**: Componente para criação e edição de campanhas.
- **CampaignList**: Componente para listar campanhas existentes.
- **CampaignStatusBadge**: Componente para exibir o status visual da campanha.
- **CampaignReports**: Componente para exibição de relatórios e métricas.

### Fluxo de Dados

1. O usuário cria uma campanha, seleciona a lista de contatos e a instância do WhatsApp
2. O sistema agenda a campanha ou inicia o envio imediatamente
3. As mensagens são enviadas respeitando a velocidade configurada e aplicando variações
4. O sistema monitora e registra o status de cada mensagem (enviada, entregue, lida)
5. Os relatórios são atualizados em tempo real com os dados de desempenho

## Modelo de Dados

```typescript
// Tabela de campanhas
export const campaign = pgTable("campaign", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  message: text("message").notNull(),
  status: campaignStatusEnum("status").default("draft"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instanceId: text("instanceId")
    .notNull()
    .references(() => whatsappInstance.id, { onDelete: "cascade" }),
  listId: text("listId")
    .notNull()
    .references(() => contactList.id, { onDelete: "cascade" }),
  scheduledFor: timestamp("scheduledFor"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  messageVariations: json("messageVariations").default([]),
  sendingSpeed: integer("sendingSpeed").default(10),
  completedAt: timestamp("completedAt"),
  totalContacts: integer("totalContacts").default(0),
  sentCount: integer("sentCount").default(0),
  deliveredCount: integer("deliveredCount").default(0),
  readCount: integer("readCount").default(0),
  failedCount: integer("failedCount").default(0),
});

// Tabela de mensagens
export const message = pgTable("message", {
  id: text("id").primaryKey(),
  campaignId: text("campaignId")
    .notNull()
    .references(() => campaign.id, { onDelete: "cascade" }),
  contactId: text("contactId")
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  status: messageStatusEnum("status").default("pending"),
  sentAt: timestamp("sentAt"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  failedAt: timestamp("failedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
```

## Uso

### Criação de Nova Campanha

1. Acesse a página "Campanhas"
2. Clique no botão "Nova Campanha"
3. Preencha o nome e a descrição da campanha
4. Escreva a mensagem principal e adicione variações se desejar
5. Selecione a lista de contatos e a instância do WhatsApp
6. Configure a velocidade de envio
7. Escolha entre enviar agora ou agendar para depois
8. Clique em "Iniciar Campanha" ou "Agendar Campanha"

### Monitoramento de Campanhas

1. Acesse a página "Campanhas"
2. Visualize o status e métricas básicas de cada campanha
3. Clique em uma campanha específica para ver detalhes
4. Acesse a aba "Relatórios" para visualização gráfica dos resultados

## Mecanismos de Segurança

Para reduzir o risco de banimento do WhatsApp, o sistema implementa diversos mecanismos:

1. **Variações de Mensagem**: Evita envio de mensagens idênticas em massa
2. **Controle de Velocidade**: Limita a quantidade de mensagens por minuto
3. **Aleatorização de Intervalos**: Varia o tempo entre mensagens para simular comportamento humano
4. **Detecção de Padrões Suspeitos**: Evita padrões de envio que podem ser detectados como spam
5. **Limitação de Novos Contatos**: Restringe o número de mensagens para contatos novos

## Limitações Atuais

- Suporte apenas para mensagens de texto (sem mídia)
- Não há funcionalidade de respostas automáticas
- Não há integração com CRMs externos
- Não há suporte para segmentação avançada de contatos

## Próximas Melhorias

- Adicionar suporte para envio de imagens, vídeos e documentos
- Implementar fluxos de mensagem baseados em respostas
- Desenvolver integração com CRMs populares
- Adicionar funcionalidade de testes A/B para mensagens
