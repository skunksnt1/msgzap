"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVImport } from "@/components/contacts/csv-import";
import { Plus, Search, FileDown, Trash2, Users, List } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("lists");
  const [searchQuery, setSearchQuery] = useState("");

  // Dados simulados para demonstração
  const contactLists = [
    {
      id: "1",
      name: "Clientes Ativos",
      description: "Lista principal de clientes ativos",
      contactCount: 245,
      createdAt: "2023-06-15",
    },
    {
      id: "2",
      name: "Leads Recentes",
      description: "Novos contatos do último mês",
      contactCount: 78,
      createdAt: "2023-06-28",
    },
    {
      id: "3",
      name: "Aniversariantes",
      description: "Clientes com aniversário neste mês",
      contactCount: 32,
      createdAt: "2023-07-01",
    },
  ];

  const contacts = [
    {
      id: "1",
      name: "João Silva",
      phone: "+5511987654321",
      listName: "Clientes Ativos",
      createdAt: "2023-06-15",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      phone: "+5511912345678",
      listName: "Clientes Ativos",
      createdAt: "2023-06-15",
    },
    {
      id: "3",
      name: "Pedro Santos",
      phone: "+5511998765432",
      listName: "Leads Recentes",
      createdAt: "2023-06-28",
    },
    {
      id: "4",
      name: "Ana Costa",
      phone: "+5511987651234",
      listName: "Aniversariantes",
      createdAt: "2023-07-01",
    },
  ];

  // Filtragem baseada na pesquisa
  const filteredLists = contactLists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.listName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImportSuccess = (data: any[]) => {
    console.log("Dados importados:", data);
    // Aqui implementaríamos a lógica para salvar os contatos no banco de dados
  };

  const handleImportError = (error: string) => {
    console.error("Erro na importação:", error);
    // Aqui implementaríamos a lógica para exibir o erro ao usuário
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para gerenciar seus contatos
            </p>
          </div>
          <Button asChild>
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie suas listas de contatos e importe novos números
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/contacts/import">
              <FileDown className="h-4 w-4 mr-2" />
              Importar
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Lista
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar contatos ou listas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="lists" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="lists" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Listas
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contatos
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Importar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lists" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLists.map((list) => (
                <Card key={list.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-start">
                      <span>{list.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {list.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span>{list.contactCount} contatos</span>
                      <span className="text-muted-foreground">
                        Criada em {list.createdAt}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link href={`/contacts/lists/${list.id}`}>
                          Ver Contatos
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLists.length === 0 && (
              <div className="text-center py-12">
                <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma lista encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Tente outra busca ou crie uma nova lista"
                    : "Crie sua primeira lista de contatos para começar"}
                </p>
                <Button asChild>
                  <Link href="/contacts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Lista
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 font-medium">Nome</th>
                        <th className="px-6 py-3 font-medium">Telefone</th>
                        <th className="px-6 py-3 font-medium">Lista</th>
                        <th className="px-6 py-3 font-medium">Data</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.listName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {contact.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum contato encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Tente outra busca ou importe novos contatos"
                    : "Importe seus contatos para começar"}
                </p>
                <Button asChild>
                  <Link href="/contacts/import">
                    <FileDown className="h-4 w-4 mr-2" />
                    Importar Contatos
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <CSVImport
              onImport={handleImportSuccess}
              onError={handleImportError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
