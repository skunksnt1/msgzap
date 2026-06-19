# Gestão de Instâncias do WhatsApp

## Visão Geral

O módulo de Gestão de Instâncias do WhatsApp permite aos usuários conectar, monitorar e gerenciar múltiplas contas do WhatsApp dentro da plataforma. Este módulo é fundamental para a operação do sistema, pois fornece a infraestrutura necessária para o envio de mensagens através do WhatsApp.

## Funcionalidades

### 1. Conexão de Instâncias

- **Autenticação via QR Code**: Interface para conectar novas instâncias do WhatsApp através de QR Code.
- **Monitoramento de Status**: Visualização do status de conexão de cada instância (conectado, desconectado, autenticado, etc.).
- **Reconexão Automática**: Mecanismo para reconectar instâncias em caso de desconexão.

### 2. Gerenciamento de Instâncias

- **Múltiplas Instâncias**: Suporte para conectar e gerenciar várias contas do WhatsApp simultaneamente.
- **Nomeação Personalizada**: Possibilidade de dar nomes personalizados para cada instância.
- **Estatísticas de Uso**: Visualização de métricas como número de mensagens enviadas por instância.

### 3. Configurações de Segurança

- **Limites de Envio**: Configuração de limites diários de mensagens por instância.
- **Intervalos Entre Mensagens**: Definição do tempo mínimo entre envios consecutivos.
- **Aleatorização de Intervalos**: Opção para variar aleatoriamente o tempo entre mensagens.
- **Detecção de Padrões Suspeitos**: Mecanismos para evitar comportamentos que possam levar ao banimento.

## Arquitetura

### Componentes Principais

- **InstanceStatusBadge**: Componente para exibir o status visual da instância.
- **QRCodeScanner**: Componente para autenticação via QR Code.
- **SecuritySettings**: Componente para configuração dos mecanismos de segurança.

### Integração com uazapi

O sistema utiliza a API da uazapi para comunicação com o WhatsApp. A integração inclui:

1. Autenticação via QR Code
2. Envio de mensagens
3. Monitoramento de status de entrega e leitura
4. Verificação de status da conexão

### Fluxo de Autenticação

1. O usuário solicita a conexão de uma nova instância
2. O sistema gera um QR Code através da API uazapi
3. O usuário escaneia o QR Code com o aplicativo WhatsApp
4. A conexão é estabelecida e o status é atualizado para "autenticado"
5. A instância está pronta para enviar mensagens

## Modelo de Dados

```typescript
// Enum para status da instância
export const instanceStatusEnum = pgEnum("instance_status", [
  "disconnected",
  "connecting",
  "connected",
  "authenticated",
  "error",
]);

// Tabela de instâncias do WhatsApp
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

## Mecanismos de Mitigação de Risco

Para reduzir o risco de banimento do WhatsApp, o sistema implementa diversos mecanismos de segurança:

### 1. Limites de Envio

- **Limite Diário**: Configuração do número máximo de mensagens que podem ser enviadas por dia.
- **Limite por Hora**: Distribuição inteligente dos envios ao longo do dia para evitar picos.

### 2. Controle de Velocidade

- **Intervalo Entre Mensagens**: Configuração do tempo mínimo entre mensagens consecutivas.
- **Aleatorização**: Variação aleatória do intervalo para simular comportamento humano.

### 3. Proteção Avançada

- **Variações de Mensagem**: Uso de pequenas variações nas mensagens para evitar detecção de spam.
- **Bloqueio por Reclamações**: Pausa automática dos envios após receber reclamações.
- **Limite de Novos Contatos**: Restrição do número de novos contatos que podem receber mensagens por dia.

## Uso

### Conexão de Nova Instância

1. Acesse a página "Instâncias"
2. Clique no botão "Nova Instância"
3. Digite um nome para a instância
4. Clique em "Conectar"
5. Escaneie o QR Code com o aplicativo WhatsApp
6. Aguarde a confirmação da conexão

### Configuração de Segurança

1. Acesse a página "Instâncias"
2. Clique na aba "Mitigação de Risco"
3. Configure os limites de envio e intervalos entre mensagens
4. Ative as opções de proteção avançada conforme necessário
5. Clique em "Salvar Configurações"

## Limitações Atuais

- Não há suporte para WhatsApp Business API oficial
- Não há proxy para rotação de IPs
- Não há detecção automática de banimento
- Não há backup automático das sessões

## Próximas Melhorias

- Implementar sistema de proxy para rotação de IPs
- Adicionar detecção automática de banimento
- Desenvolver sistema de backup e restauração de sessões
- Implementar opção para WhatsApp Business API oficial
