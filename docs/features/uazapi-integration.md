# Integração com uazapi

## Visão Geral

A integração com a API uazapi permite o envio de mensagens em massa e agendamento de campanhas para o WhatsApp. A uazapi é uma API que facilita a comunicação com o WhatsApp, permitindo o envio de mensagens, gerenciamento de contatos e outras funcionalidades.

## Configuração

Para utilizar a integração com a uazapi, é necessário configurar as seguintes variáveis de ambiente:

```env
NEXT_PUBLIC_UAZAPI_URL="https://api.uazapi.com"
UAZAPI_API_KEY="sua-api-key-aqui"
```

## Funcionalidades Implementadas

### 1. Envio de Mensagens em Massa

A funcionalidade de envio de mensagens em massa utiliza o endpoint `/sender/advanced/{instanceKey}` da API uazapi. Este endpoint permite o envio de múltiplas mensagens com configurações avançadas como:

- Delay mínimo e máximo entre mensagens
- Descrição da campanha
- Agendamento para envio futuro

#### Payload de Exemplo

```json
{
  "delayMin": 3,
  "delayMax": 6,
  "info": "Campanha de lançamento",
  "scheduled_for": 1698765432000,
  "messages": [
    {
      "number": "5511987654321",
      "message": "Olá João, temos uma promoção especial para você!"
    },
    {
      "number": "5511912345678",
      "message": "Olá Maria, temos uma promoção especial para você!"
    }
  ]
}
```

### 2. Agendamento de Campanhas

O agendamento de campanhas é feito através do campo `scheduled_for` no payload da API. Este campo pode receber:

- Um timestamp em milissegundos (date unix)
- Um número de minutos a partir do momento atual

Na nossa implementação, convertemos a data e hora selecionadas pelo usuário em um timestamp em milissegundos.

## Implementação

### Serviço de Integração

O arquivo `/src/lib/uazapi.ts` contém as funções necessárias para a integração com a API uazapi:

- `sendAdvanced`: Envia mensagens em massa com opções avançadas
- `dateTimeToTimestamp`: Converte uma data e hora para timestamp em milissegundos
- `formatPhone`: Formata um número de telefone para o formato esperado pela uazapi

### API Route

O arquivo `/src/app/api/campaigns/send/route.ts` implementa uma API route que recebe os dados do formulário de criação de campanhas e os envia para a API uazapi.

### Formulário de Criação de Campanhas

O formulário de criação de campanhas (`/src/app/campaigns/new/page.tsx`) permite ao usuário:

1. Digitar o conteúdo da mensagem
2. Adicionar variações da mensagem para evitar banimento
3. Selecionar a lista de contatos
4. Selecionar a instância do WhatsApp
5. Configurar a velocidade de envio
6. Agendar o envio para uma data e hora específicas

## Mecanismos de Mitigação de Risco

Para reduzir o risco de banimento do WhatsApp, a implementação inclui:

1. **Variações de Mensagem**: Permite criar múltiplas versões da mensagem que são enviadas aleatoriamente
2. **Controle de Velocidade**: Permite configurar a velocidade de envio (mensagens por minuto)
3. **Aleatorização de Intervalos**: Utiliza um intervalo mínimo e máximo entre mensagens

## Uso

1. Acesse a página de criação de campanhas
2. Preencha o formulário com as informações necessárias
3. Se desejar agendar a campanha, ative a opção "Agendar envio" e selecione a data e hora
4. Clique em "Iniciar Campanha" ou "Agendar Campanha" dependendo da sua escolha

## Referências

- [Documentação da uazapi](https://docs.uazapi.com/)
- [Endpoint de envio avançado](https://docs.uazapi.com/endpoint/post/sender~advanced)
