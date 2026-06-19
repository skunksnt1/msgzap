# Gestão de Instâncias do WhatsApp

## Visão Geral

O módulo de Gestão de Instâncias permite aos usuários criar, configurar e gerenciar múltiplas instâncias do WhatsApp dentro da plataforma. Cada instância representa uma conexão com uma conta do WhatsApp, permitindo o envio de mensagens através dessa conta.

## Funcionalidades

### 1. Criação de Instâncias

A funcionalidade de criação de instâncias permite ao usuário:

- Adicionar uma nova instância do WhatsApp fornecendo um nome e número de telefone
- Visualizar um modal com formulário para entrada dos dados
- Receber feedback visual sobre o sucesso ou erro da operação

### 2. Conexão de Instâncias

Após a criação, o usuário pode:

- Conectar a instância através de um QR Code (a ser escaneado pelo aplicativo WhatsApp)
- Visualizar o status da conexão em tempo real
- Reconectar instâncias desconectadas quando necessário

### 3. Gerenciamento de Múltiplas Instâncias

A plataforma permite:

- Gerenciar várias instâncias simultaneamente
- Visualizar estatísticas de uso de cada instância
- Configurar parâmetros específicos para cada instância

## Implementação

### Componentes Principais

1. **InstanceFormModal**

   - Modal para criação de novas instâncias
   - Validação de dados de entrada
   - Feedback visual de sucesso/erro

2. **API Route para Criação de Instâncias**

   - Endpoint: `/api/instances/create`
   - Validação de dados
   - Criação de registros no banco de dados

3. **Página de Instâncias**
   - Listagem de instâncias existentes
   - Interface para criação de novas instâncias
   - Visualização de status e estatísticas

### Fluxo de Criação de Instância

1. Usuário clica no botão "Nova Instância"
2. Modal é exibido solicitando nome e número de telefone
3. Usuário preenche os dados e submete o formulário
4. Sistema valida os dados e cria a instância no banco de dados
5. Feedback visual é apresentado ao usuário
6. Modal é fechado e a lista de instâncias é atualizada

## Modelo de Dados

```typescript
export const whatsappInstance = pgTable("whatsapp_instance", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  status: instanceStatusEnum("status").default("disconnected"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instanceKey: text("instanceKey"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  lastConnection: timestamp("lastConnection"),
  config: json("config"),
});
```

## Integração com uazapi

Em um ambiente de produção, após a criação da instância no banco de dados, seria necessário integrar com a API da uazapi para iniciar a instância. Isso envolveria:

1. Chamada à API da uazapi para criar uma nova instância
2. Obtenção do QR Code para autenticação
3. Exibição do QR Code para o usuário
4. Monitoramento do status de conexão

## Considerações de Segurança

- Cada instância está associada a um usuário específico, garantindo isolamento de dados
- As chaves de instância são geradas aleatoriamente usando `nanoid` para maior segurança
- Validação de formato de telefone para evitar dados inválidos

## Limitações Atuais

- Não há integração real com a API da uazapi (apenas simulação)
- Não há exibição de QR Code para autenticação
- Não há monitoramento em tempo real do status da instância

## Próximas Melhorias

- Implementar integração completa com a API da uazapi
- Adicionar exibição de QR Code para autenticação
- Implementar monitoramento em tempo real do status da instância
- Adicionar funcionalidade de backup e restauração de sessões
