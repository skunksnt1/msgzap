# WhatsApp Disparador - Plataforma SaaS de Marketing

Uma plataforma completa para empresas brasileiras utilizarem o WhatsApp para comunicação em massa, com foco em segurança contra banimento e preço acessível em reais.

## Visão Geral

WhatsApp Disparador é uma solução SaaS 100% self-service que permite a pequenos e médios empresários brasileiros utilizarem o WhatsApp como canal de marketing e comunicação em massa, sem os custos proibitivos da API oficial e com mecanismos avançados para evitar banimento.

### Principais Funcionalidades

- **Gestão de Contatos**: Importação via CSV, organização em listas e gerenciamento centralizado
- **Campanhas de Mensagens**: Criação, agendamento e monitoramento de campanhas
- **Múltiplas Instâncias**: Conexão e gerenciamento de várias contas do WhatsApp
- **Mecanismos Anti-Banimento**: Variações de mensagens, controle de velocidade e outras proteções
- **Relatórios Detalhados**: Métricas de envio, entrega e leitura com visualizações gráficas

## Tecnologias

- **Frontend**: Next.js 15 com App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Better Auth com Google OAuth
- **Integração WhatsApp**: uazapi

## Requisitos

- Node.js 18+ (recomendado 20+)
- PostgreSQL 14+
- Conta Google para autenticação OAuth
- Chave de API da OpenAI (opcional, para recursos de IA)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/tiagoyoko/wpp-disparador.git
   cd wpp-disparador
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Configure as variáveis de ambiente:

   ```bash
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Execute as migrações do banco de dados:

   ```bash
   npm run db:migrate
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
/src
  /app                  # Rotas e páginas da aplicação
    /api                # API Routes do Next.js
    /campaigns          # Páginas de campanhas
    /contacts           # Páginas de contatos
    /dashboard          # Dashboard principal
    /instances          # Páginas de instâncias do WhatsApp
  /components           # Componentes React reutilizáveis
    /campaigns          # Componentes específicos de campanhas
    /contacts           # Componentes específicos de contatos
    /dashboard          # Componentes específicos do dashboard
    /instances          # Componentes específicos de instâncias
    /ui                 # Componentes de UI básicos (shadcn/ui)
  /lib                  # Utilitários e configurações
    schema.ts           # Schema do banco de dados (Drizzle ORM)
    db.ts               # Configuração do banco de dados
    auth.ts             # Configuração de autenticação
/docs                   # Documentação
  /features             # Documentação de funcionalidades
/drizzle                # Migrações do banco de dados
```

## Documentação

Para mais detalhes sobre as funcionalidades, consulte a documentação específica:

- [Gestão de Contatos](/docs/features/contacts-management.md)
- [Campanhas](/docs/features/campaigns.md)
- [Instâncias do WhatsApp](/docs/features/whatsapp-instances.md)
- [Relatórios](/docs/features/reports.md)

## Contribuição

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para dúvidas ou suporte, entre em contato através de [tiagoyoko@users.noreply.github.com](mailto:tiagoyoko@users.noreply.github.com).

## Status do Projeto

🚧 **Em Desenvolvimento Ativo** - MVP em fase de implementação

### Próximas Funcionalidades
- [ ] Sistema de templates de mensagens
- [ ] Integração com CRMs populares
- [ ] API pública para integrações
- [ ] Dashboard avançado com métricas
- [ ] Sistema de webhooks

### Roadmap
- **Q1 2025**: MVP completo com funcionalidades básicas
- **Q2 2025**: Recursos avançados e integrações
- **Q3 2025**: Expansão para outros canais de comunicação
