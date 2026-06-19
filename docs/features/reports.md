# Relatórios e Análises

## Visão Geral

O módulo de Relatórios e Análises fornece insights detalhados sobre o desempenho das campanhas de WhatsApp, permitindo aos usuários monitorar métricas-chave, analisar tendências e tomar decisões baseadas em dados. Este módulo é essencial para avaliar a eficácia das campanhas e otimizar estratégias de comunicação.

## Funcionalidades

### 1. Visão Geral de Desempenho

- **Métricas Principais**: Visualização de KPIs como total de mensagens enviadas, taxa de entrega e taxa de leitura.
- **Gráficos de Desempenho**: Representação visual das métricas principais para facilitar a compreensão.
- **Filtros por Período**: Possibilidade de analisar dados de diferentes períodos (últimos 7 dias, 30 dias, etc.).

### 2. Análise por Campanha

- **Métricas por Campanha**: Visualização detalhada do desempenho de cada campanha individual.
- **Comparação entre Campanhas**: Ferramentas para comparar o desempenho de diferentes campanhas.
- **Status de Envio**: Acompanhamento do progresso de campanhas em andamento.

### 3. Análise Temporal

- **Envios Diários**: Visualização da distribuição de envios ao longo do tempo.
- **Tendências**: Identificação de padrões e tendências nos dados de envio e engajamento.
- **Picos de Atividade**: Detecção de horários e dias com maior taxa de resposta.

### 4. Exportação de Dados

- **Exportação para CSV**: Possibilidade de exportar relatórios em formato CSV para análise externa.
- **Relatórios Agendados**: Configuração para receber relatórios periódicos por e-mail (funcionalidade futura).

## Componentes da Interface

### Painéis de Controle

- **Cartões de Métricas**: Exibição de números-chave como total de mensagens, taxa de entrega e taxa de leitura.
- **Gráficos de Rosca**: Visualização das proporções entre mensagens enviadas, entregues e lidas.
- **Gráficos de Linha**: Representação da evolução temporal das métricas.
- **Gráficos de Barra**: Comparação de desempenho entre diferentes campanhas.

### Filtros e Controles

- **Seletor de Período**: Opções para filtrar dados por diferentes períodos de tempo.
- **Seletor de Campanha**: Filtro para analisar campanhas específicas ou todas as campanhas.
- **Botão de Exportação**: Funcionalidade para exportar os dados visualizados.

## Métricas Disponíveis

### Métricas de Envio

- **Total de Mensagens Enviadas**: Número total de mensagens enviadas no período.
- **Taxa de Entrega**: Percentual de mensagens que foram entregues com sucesso.
- **Taxa de Falha**: Percentual de mensagens que falharam no envio.

### Métricas de Engajamento

- **Taxa de Leitura**: Percentual de mensagens que foram lidas pelos destinatários.
- **Taxa de Resposta**: Percentual de mensagens que receberam resposta (funcionalidade futura).
- **Tempo Médio até Leitura**: Tempo médio entre o envio e a leitura da mensagem (funcionalidade futura).

## Uso

### Acesso aos Relatórios

1. Acesse a página "Campanhas"
2. Clique no botão "Relatórios" no menu superior
3. Selecione o período desejado no seletor de período
4. Escolha uma campanha específica ou mantenha "Todas as campanhas" para uma visão geral

### Análise de Campanha Específica

1. Acesse a página "Campanhas"
2. Clique em uma campanha específica
3. Navegue até a aba "Relatórios" dentro da visualização da campanha
4. Explore as métricas detalhadas e gráficos específicos da campanha

### Exportação de Dados

1. Acesse a página de relatórios desejada
2. Configure os filtros para visualizar os dados que deseja exportar
3. Clique no botão "Exportar" no canto superior direito
4. Selecione o formato de exportação (CSV)
5. Salve o arquivo no seu computador

## Implementação Técnica

### Coleta de Dados

- **Eventos de Status**: Captura de eventos de status de mensagem (enviada, entregue, lida) da API uazapi.
- **Armazenamento**: Registro de timestamps para cada mudança de status no banco de dados.
- **Agregação**: Cálculo de métricas agregadas em tempo real ou em intervalos regulares.

### Visualização de Dados

- **Renderização Client-Side**: Gráficos e visualizações são renderizados no navegador do cliente.
- **Dados Agregados**: Uso de dados pré-agregados para melhor performance em grandes volumes.
- **Atualizações em Tempo Real**: Para campanhas em andamento, os dados são atualizados periodicamente.

## Limitações Atuais

- Não há análise avançada de segmentação de contatos
- Não há detecção automática de melhores horários para envio
- Não há integração com ferramentas externas de analytics
- Não há relatórios de ROI ou conversão

## Próximas Melhorias

- Implementar análise de sentimento para respostas recebidas
- Adicionar detecção automática de melhores horários para envio
- Desenvolver relatórios de conversão para campanhas com links
- Criar dashboard personalizado com métricas selecionáveis pelo usuário
- Implementar sistema de alertas para métricas abaixo do esperado
