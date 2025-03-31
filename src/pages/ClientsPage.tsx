
import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Trash, RefreshCw, Loader2, Pencil } from "lucide-react";
import { Client } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientsPage = () => {
  const { clients, detailedSales, addClient, deleteClient, updateClient, isLoading, refreshData } = useStore();
  const { toast } = useToast();
  const [newClientName, setNewClientName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddClient = async () => {
    if (!newClientName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do cliente não pode estar vazio.",
      });
      return;
    }

    setIsAddingClient(true);
    
    try {
      await addClient(newClientName);
      setNewClientName("");
      toast({
        title: "Cliente adicionado",
        description: `${newClientName} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar cliente.",
      });
    } finally {
      setIsAddingClient(false);
    }
  };

  const confirmDelete = (id: number) => {
    // Verificar se cliente tem vendas ativas
    const clientHasActiveSales = detailedSales.some(
      sale => sale.clientId === id && sale.status === 'ativa'
    );
    
    if (clientHasActiveSales) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este cliente possui vendas ativas e não pode ser excluído.",
      });
      return;
    }
    
    setSelectedClientId(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedClientId) {
      setIsDeleting(true);
      
      try {
        await deleteClient(selectedClientId);
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao excluir cliente.",
        });
      } finally {
        setIsDeleting(false);
        setDialogOpen(false);
      }
    }
  };

  // Função para iniciar edição
  const startEdit = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditDialogOpen(true);
  };

  // Função para salvar a edição
  const handleUpdateClient = async () => {
    if (!editingClient) return;
    
    // Validar input
    if (!editName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do cliente não pode estar vazio.",
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      await updateClient(editingClient.id, editName);
      
      toast({
        title: "Cliente atualizado",
        description: "O cliente foi atualizado com sucesso.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar cliente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container py-6 animate-fade-in dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
        <Button 
          onClick={() => refreshData()} 
          className="flex gap-2 items-center bg-background border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6 border-t-4 border-blue-500 hover:shadow-lg transition-all">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-500" />
          Adicionar Novo Cliente
        </h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Nome do cliente"
              className="dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <Button onClick={handleAddClient} disabled={isAddingClient} className="bg-blue-500 hover:bg-blue-600">
            {isAddingClient ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar'
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-500" />
          Clientes Cadastrados
        </h2>
        <div className="text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full font-medium">
          {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Nenhum cliente cadastrado
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="overflow-hidden dark:bg-slate-800 dark:border-slate-700 border-t-4 border-blue-500 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <Button
                    variant="outline"
                    className="inline-flex items-center justify-center h-10 w-10 min-w-[2.5rem] gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                    onClick={() => startEdit(client)}
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    className="inline-flex items-center justify-center h-10 w-10 min-w-[2.5rem] gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                    onClick={() => confirmDelete(client.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de edição de cliente */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar Cliente</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Altere o nome do cliente e clique em salvar para atualizar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Nome do Cliente</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600" disabled={isUpdating}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateClient}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
