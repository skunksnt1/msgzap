# Gestão de Contatos

## Visão Geral

O módulo de Gestão de Contatos permite aos usuários gerenciar suas listas de contatos para envio de mensagens no WhatsApp. Este módulo oferece funcionalidades para criar, visualizar, editar e excluir listas de contatos, bem como importar contatos via arquivos CSV.

## Funcionalidades

### 1. Listas de Contatos

- **Criação de Listas**: Os usuários podem criar múltiplas listas de contatos para organizar seus destinatários (ex: clientes ativos, leads, aniversariantes).
- **Visualização de Listas**: Interface para visualizar todas as listas criadas com informações como nome, descrição e quantidade de contatos.
- **Edição e Exclusão**: Possibilidade de editar detalhes da lista ou excluir listas inteiras.

### 2. Gestão de Contatos

- **Visualização de Contatos**: Interface tabular para visualizar todos os contatos com informações como nome, telefone e lista associada.
- **Adição Manual**: Formulário para adicionar contatos individualmente.
- **Edição e Exclusão**: Funcionalidades para editar informações de contatos ou removê-los.

### 3. Importação de CSV

- **Upload de Arquivos**: Interface para fazer upload de arquivos CSV contendo listas de contatos.
- **Validação de Dados**: Verificação automática do formato do arquivo e validação dos números de telefone.
- **Mapeamento de Campos**: Possibilidade de mapear colunas do CSV para campos do sistema.
- **Feedback Visual**: Indicadores de progresso e resultado da importação.

## Arquitetura

### Componentes Principais

- **CSVImport**: Componente responsável pela importação de arquivos CSV.
- **ContactList**: Componente para exibir e gerenciar listas de contatos.
- **ContactTable**: Componente para exibir contatos em formato tabular.

### Fluxo de Dados

1. O usuário faz upload de um arquivo CSV ou adiciona contatos manualmente
2. Os dados são validados (formato do telefone, campos obrigatórios)
3. Os contatos são armazenados no banco de dados
4. As listas são atualizadas com a contagem de contatos

## Modelo de Dados

```typescript
// Tabela de listas de contatos
export const contactList = pgTable("contact_list", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  contactCount: integer("contactCount").default(0),
});

// Tabela de contatos
export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  name: text("name"),
  listId: text("listId")
    .notNull()
    .references(() => contactList.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  metadata: json("metadata"),
});
```

## Uso

### Importação de Contatos via CSV

1. Acesse a página "Contatos"
2. Clique na aba "Importar"
3. Arraste e solte o arquivo CSV ou clique para selecionar
4. Verifique se o arquivo contém pelo menos uma coluna "phone" ou "telefone"
5. Após o processamento, os contatos serão adicionados à lista selecionada

### Criação de Nova Lista

1. Acesse a página "Contatos"
2. Clique no botão "Nova Lista"
3. Preencha o nome e a descrição da lista
4. Clique em "Criar Lista"

## Considerações de Segurança

- Todos os contatos estão associados a um usuário específico, garantindo isolamento de dados
- Validação de formato de telefone para evitar dados inválidos
- Limitação no tamanho dos arquivos CSV para evitar sobrecarga do sistema

## Limitações Atuais

- Não há suporte para importação de outros formatos além de CSV
- Não há detecção automática de contatos duplicados
- Não há funcionalidade de mesclagem de listas

## Próximas Melhorias

- Adicionar suporte para importação de contatos do Google Contacts
- Implementar detecção e tratamento de duplicatas
- Adicionar funcionalidade de segmentação avançada de contatos
- Implementar funcionalidade de exportação de listas
